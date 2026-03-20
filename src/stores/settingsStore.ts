import i18n from "@/i18n";
import { LOCK_MANAGER_MESSAGES } from "@/scripts/lockManager/lockManager";
import type { GasTier } from "@/types/gasFee";
import StorageUtil from "@/utilities/storageUtil";
import { action, makeAutoObservable, observable, runInAction } from "mobx";
import browser from "webextension-polyfill";

const THEME = Object.freeze({
  DARK: "dark",
  LIGHT: "light",
});

type ThemePreference = "system" | "light" | "dark";

class SettingsStore {
  isDarkMode: boolean;
  theme: string;
  isPopupWindow = true;
  isSidePanel = false;

  themePreference: ThemePreference = "system";
  autoLockMinutes = 15;
  currency = "USD";
  language = "en";
  defaultGasTier: GasTier = "market";
  showBalanceAndPrice = true;
  sidePanelPreferred = false;
  notificationsEnabled = true;
  phishingDetectionEnabled = true;

  constructor() {
    makeAutoObservable(this, {
      isDarkMode: observable,
      theme: observable,
      isSidePanel: observable,
      themePreference: observable,
      autoLockMinutes: observable,
      currency: observable,
      language: observable,
      defaultGasTier: observable,
      showBalanceAndPrice: observable,
      sidePanelPreferred: observable,
      notificationsEnabled: observable,
      phishingDetectionEnabled: observable,
      setThemePreference: action.bound,
      setAutoLockMinutes: action.bound,
      setCurrency: action.bound,
      setLanguage: action.bound,
      setDefaultGasTier: action.bound,
      setShowBalanceAndPrice: action.bound,
      setSidePanelPreferred: action.bound,
      setNotificationsEnabled: action.bound,
      setPhishingDetectionEnabled: action.bound,
    });

    this.isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    this.theme = this.isDarkMode ? THEME.DARK : THEME.LIGHT;
    document?.documentElement?.classList?.add(this.theme);

    // Detect side panel via URL query parameter or cached localStorage flag.
    const urlParams = new URLSearchParams(window.location.search);
    const hasSidePanelParam = urlParams.has("sidepanel");
    const sidePanelCached =
      localStorage.getItem("sidePanelPreferred") === "true";

    // Detect popup vs tab/sidepanel via viewport dimensions.
    // Popup: narrow width (~368px) AND very short height (~25px iframe).
    // Tab: wide viewport (> 600px).
    // Side panel: narrow-to-medium viewport (≤ 600px), tall, with preference cached.
    const htmlElement = document?.documentElement;
    let isNarrow = false;
    let isShort = false;
    let isWide = false;
    if (htmlElement) {
      const actualWidth = htmlElement.clientWidth;
      const actualHeight = htmlElement.clientHeight;
      isNarrow = Math.abs(actualWidth - 368) <= 24;
      isShort = Math.abs(actualHeight - 25) <= 24;
      isWide = actualWidth > 600;
    }

    this.isPopupWindow = isNarrow && isShort;
    // Side panel: URL param, or not-popup + not-wide + sidePanelPreferred cached.
    this.isSidePanel =
      hasSidePanelParam ||
      (!this.isPopupWindow && !isWide && sidePanelCached);
    if (this.isSidePanel) {
      this.isPopupWindow = false;
    }

    this.#loadSettings();
  }

  async #loadSettings() {
    const settings = await StorageUtil.getSettings();
    runInAction(() => {
      if (settings.themePreference) {
        this.themePreference = settings.themePreference;
        this.#applyTheme(settings.themePreference);
      }
      if (settings.autoLockMinutes !== undefined) {
        this.autoLockMinutes = settings.autoLockMinutes;
      }
      if (settings.currency) {
        this.currency = settings.currency;
      }
      if (settings.language) {
        this.language = settings.language;
        i18n.changeLanguage(settings.language);
      }
      if (settings.defaultGasTier) {
        this.defaultGasTier = settings.defaultGasTier;
      }
      if (settings.showBalanceAndPrice !== undefined) {
        this.showBalanceAndPrice = settings.showBalanceAndPrice;
      }
      if (settings.notificationsEnabled !== undefined) {
        this.notificationsEnabled = settings.notificationsEnabled;
      }
      if (settings.phishingDetectionEnabled !== undefined) {
        this.phishingDetectionEnabled = settings.phishingDetectionEnabled;
      }
      if (settings.sidePanelPreferred !== undefined) {
        this.sidePanelPreferred = settings.sidePanelPreferred;
        // Keep localStorage cache in sync with chrome.storage.
        localStorage.setItem(
          "sidePanelPreferred",
          String(settings.sidePanelPreferred),
        );
      }
      // Async fallback: if side panel wasn't detected synchronously but
      // the preference is enabled and we're not in a popup, switch now.
      if (!this.isSidePanel && this.sidePanelPreferred && !this.isPopupWindow) {
        this.isSidePanel = true;
      }
    });
  }

  #applyTheme(pref: ThemePreference) {
    const root = document?.documentElement;
    if (!root) return;

    root.classList.remove(THEME.DARK, THEME.LIGHT);

    let resolved: string;
    if (pref === "system") {
      resolved = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? THEME.DARK
        : THEME.LIGHT;
    } else {
      resolved = pref;
    }

    root.classList.add(resolved);
    this.theme = resolved;
    this.isDarkMode = resolved === THEME.DARK;
  }

  async #persistSettings() {
    await StorageUtil.setSettings({
      themePreference: this.themePreference,
      autoLockMinutes: this.autoLockMinutes,
      currency: this.currency,
      language: this.language,
      defaultGasTier: this.defaultGasTier,
      showBalanceAndPrice: this.showBalanceAndPrice,
      sidePanelPreferred: this.sidePanelPreferred,
      notificationsEnabled: this.notificationsEnabled,
      phishingDetectionEnabled: this.phishingDetectionEnabled,
    });
  }

  async setThemePreference(pref: ThemePreference) {
    this.themePreference = pref;
    this.#applyTheme(pref);
    await this.#persistSettings();
  }

  async setAutoLockMinutes(minutes: number) {
    this.autoLockMinutes = minutes;
    await this.#persistSettings();
    browser.runtime
      .sendMessage({ name: LOCK_MANAGER_MESSAGES.UPDATE_AUTO_LOCK })
      .catch(() => {});
  }

  async setCurrency(currency: string) {
    this.currency = currency;
    await this.#persistSettings();
  }

  async setLanguage(language: string) {
    this.language = language;
    i18n.changeLanguage(language);
    await this.#persistSettings();
  }

  async setDefaultGasTier(tier: GasTier) {
    this.defaultGasTier = tier;
    await this.#persistSettings();
  }

  async setShowBalanceAndPrice(enabled: boolean) {
    this.showBalanceAndPrice = enabled;
    await this.#persistSettings();
  }

  async setNotificationsEnabled(enabled: boolean) {
    this.notificationsEnabled = enabled;
    await this.#persistSettings();
  }

  async setPhishingDetectionEnabled(enabled: boolean) {
    this.phishingDetectionEnabled = enabled;
    await this.#persistSettings();
  }

  async setSidePanelPreferred(preferred: boolean) {
    this.sidePanelPreferred = preferred;
    localStorage.setItem("sidePanelPreferred", String(preferred));
    await this.#persistSettings();
    if (
      typeof chrome !== "undefined" &&
      typeof chrome?.sidePanel?.setPanelBehavior === "function"
    ) {
      try {
        await chrome.sidePanel.setPanelBehavior({
          openPanelOnActionClick: preferred,
        });
      } catch {
        // sidePanel API may not be available in all browsers.
      }
    }
  }
}

export default SettingsStore;
