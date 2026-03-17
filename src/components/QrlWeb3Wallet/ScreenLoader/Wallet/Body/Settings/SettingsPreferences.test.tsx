import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, beforeAll, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import SettingsPreferences from "./SettingsPreferences";

beforeAll(() => {
  Element.prototype.hasPointerCapture = jest.fn(() => false);
  Element.prototype.setPointerCapture = jest.fn();
  Element.prototype.releasePointerCapture = jest.fn();
  Element.prototype.scrollIntoView = jest.fn();
});

describe("SettingsPreferences", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <SettingsPreferences />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the Preferences heading", () => {
    renderComponent();

    expect(screen.getByText("Preferences")).toBeInTheDocument();
  });

  it("should render the currency select trigger", () => {
    renderComponent();

    expect(
      screen.getByRole("combobox", { name: "Display currency" }),
    ).toBeInTheDocument();
  });

  it("should render the language select trigger", () => {
    renderComponent();

    expect(
      screen.getByRole("combobox", { name: "Language" }),
    ).toBeInTheDocument();
  });

  it("should call setCurrency when selecting a currency", async () => {
    const setCurrency = jest.fn<any>(() => Promise.resolve());
    renderComponent(mockedStore({ settingsStore: { setCurrency } }));

    await userEvent.click(
      screen.getByRole("combobox", { name: "Display currency" }),
    );
    await userEvent.click(screen.getByRole("option", { name: "EUR" }));

    expect(setCurrency).toHaveBeenCalledWith("EUR");
  });

  it("should render the default gas fee select trigger", () => {
    renderComponent();

    expect(
      screen.getByRole("combobox", { name: "Default gas fee" }),
    ).toBeInTheDocument();
  });

  it("should call setDefaultGasTier when selecting a gas tier", async () => {
    const setDefaultGasTier = jest.fn<any>(() => Promise.resolve());
    renderComponent(
      mockedStore({ settingsStore: { setDefaultGasTier } }),
    );

    await userEvent.click(
      screen.getByRole("combobox", { name: "Default gas fee" }),
    );
    await userEvent.click(screen.getByRole("option", { name: "Aggressive" }));

    expect(setDefaultGasTier).toHaveBeenCalledWith("aggressive");
  });
});
