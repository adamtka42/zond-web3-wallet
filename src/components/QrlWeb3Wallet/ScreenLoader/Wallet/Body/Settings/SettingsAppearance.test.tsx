import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, beforeAll, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import SettingsAppearance from "./SettingsAppearance";

jest.setTimeout(15000);

beforeAll(() => {
  Element.prototype.hasPointerCapture = jest.fn(() => false);
  Element.prototype.setPointerCapture = jest.fn();
  Element.prototype.releasePointerCapture = jest.fn();
  Element.prototype.scrollIntoView = jest.fn();
});

describe("SettingsAppearance", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <SettingsAppearance />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the Appearance heading", () => {
    renderComponent();

    expect(screen.getByText("Appearance")).toBeInTheDocument();
  });

  it("should render the theme select trigger", () => {
    renderComponent();

    expect(screen.getByRole("combobox", { name: "Theme" })).toBeInTheDocument();
  });

  it("should call setThemePreference when selecting Light", async () => {
    const setThemePreference = jest.fn<any>(() => Promise.resolve());
    renderComponent(
      mockedStore({
        settingsStore: { themePreference: "system", setThemePreference },
      }),
    );

    await userEvent.click(screen.getByRole("combobox", { name: "Theme" }));
    await userEvent.click(screen.getByRole("option", { name: "Light" }));

    expect(setThemePreference).toHaveBeenCalledWith("light");
  });

  it("should call setThemePreference when selecting Dark", async () => {
    const setThemePreference = jest.fn<any>(() => Promise.resolve());
    renderComponent(
      mockedStore({
        settingsStore: { themePreference: "system", setThemePreference },
      }),
    );

    await userEvent.click(screen.getByRole("combobox", { name: "Theme" }));
    await userEvent.click(screen.getByRole("option", { name: "Dark" }));

    expect(setThemePreference).toHaveBeenCalledWith("dark");
  });
});
