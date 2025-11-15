import { makeAutoObservable, observable } from "mobx";

const THEME = Object.freeze({
  DARK: "dark",
  LIGHT: "light",
});

class SettingsStore {
  isDarkMode: boolean;
  theme: string;
  isPopupWindow = true;

  constructor() {
    makeAutoObservable(this, { isDarkMode: observable, theme: observable });
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
  }
}

export default SettingsStore;
