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
      setThemePreference: action.bound,
      setAutoLockMinutes: action.bound,
      setCurrency: action.bound,
      setLanguage: action.bound,
      setDefaultGasTier: action.bound,
      setShowBalanceAndPrice: action.bound,
      setSidePanelPreferred: action.bound,
    });

    this.isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    this.theme = this.isDarkMode ? THEME.DARK : THEME.LIGHT;
    document?.documentElement?.classList?.add(this.theme);

    // Detect side panel via URL query parameter (set in manifest's side_panel.default_path).
    const urlParams = new URLSearchParams(window.location.search);
    this.isSidePanel = urlParams.has("sidepanel");

    // Detect popup vs tab via viewport dimensions.
    // Popup: narrow width (~368px), very short height (~25px iframe).
    // Tab: wide width (> 500px) or tall without sidepanel param.
    if (!this.isSidePanel) {
      const htmlElement = document?.documentElement;
      if (htmlElement) {
        const actualWidth = htmlElement.clientWidth;
        const actualHeight = htmlElement.clientHeight;
        const expectedWidth = 368;
        const expectedHeight = 25;
        const tolerance = 24;
        const isNarrow =
          Math.abs(actualWidth - expectedWidth) <= tolerance;
        const isShort =
          Math.abs(actualHeight - expectedHeight) <= tolerance;
        this.isPopupWindow = isNarrow && isShort;
      }
    } else {
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
      if (settings.sidePanelPreferred !== undefined) {
        this.sidePanelPreferred = settings.sidePanelPreferred;
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

  async setSidePanelPreferred(preferred: boolean) {
    this.sidePanelPreferred = preferred;
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
