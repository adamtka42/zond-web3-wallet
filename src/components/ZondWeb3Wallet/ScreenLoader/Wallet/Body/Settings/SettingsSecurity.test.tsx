import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, beforeAll, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import SettingsSecurity from "./SettingsSecurity";

beforeAll(() => {
  Element.prototype.hasPointerCapture = jest.fn(() => false);
  Element.prototype.setPointerCapture = jest.fn();
  Element.prototype.releasePointerCapture = jest.fn();
  Element.prototype.scrollIntoView = jest.fn();
});

describe("SettingsSecurity", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <SettingsSecurity />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the Security heading", () => {
    renderComponent();

    expect(screen.getByText("Security")).toBeInTheDocument();
  });

  it("should render the auto-lock select trigger", () => {
    renderComponent();

    expect(
      screen.getByRole("combobox", { name: "Auto-lock timeout" }),
    ).toBeInTheDocument();
  });

  it("should call setAutoLockMinutes when selecting an option", async () => {
    const setAutoLockMinutes = jest.fn<any>(() => Promise.resolve());
    renderComponent(mockedStore({ settingsStore: { setAutoLockMinutes } }));

    await userEvent.click(
      screen.getByRole("combobox", { name: "Auto-lock timeout" }),
    );
    await userEvent.click(screen.getByRole("option", { name: "5 minutes" }));

    expect(setAutoLockMinutes).toHaveBeenCalledWith(5);
  });

  it("should call setAutoLockMinutes with 0 for Never", async () => {
    const setAutoLockMinutes = jest.fn<any>(() => Promise.resolve());
    renderComponent(mockedStore({ settingsStore: { setAutoLockMinutes } }));

    await userEvent.click(
      screen.getByRole("combobox", { name: "Auto-lock timeout" }),
    );
    await userEvent.click(screen.getByRole("option", { name: "Never" }));

    expect(setAutoLockMinutes).toHaveBeenCalledWith(0);
  });
});
