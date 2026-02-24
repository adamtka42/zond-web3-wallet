import { LOCK_MANAGER_MESSAGES } from "@/scripts/lockManager/lockManager";
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

  themePreference: ThemePreference = "system";
  autoLockMinutes = 15;
  currency = "USD";
  language = "en";

  constructor() {
    makeAutoObservable(this, {
      isDarkMode: observable,
      theme: observable,
      themePreference: observable,
      autoLockMinutes: observable,
      currency: observable,
      language: observable,
      setThemePreference: action.bound,
      setAutoLockMinutes: action.bound,
      setCurrency: action.bound,
      setLanguage: action.bound,
    });

    this.isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    this.theme = this.isDarkMode ? THEME.DARK : THEME.LIGHT;
    document?.documentElement?.classList?.add(this.theme);

    // Detect the window type based on pixel size, with some pixel tolerance
    const htmlElement = document?.documentElement;
    if (htmlElement) {
      const actualWidth = htmlElement.clientWidth;
      const actualHeight = htmlElement.clientHeight;
      const expectedWidth = 368;
      // In popup mode, the extension content is rendered inside an iframe by the browser.
      // The height of the iframe will be around 25px.
      const expectedHeight = 25;
      const tolerance = 24;
      this.isPopupWindow =
        Math.abs(actualWidth - expectedWidth) <= tolerance &&
        Math.abs(actualHeight - expectedHeight) <= tolerance;
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
    await this.#persistSettings();
  }
}

export default SettingsStore;
