import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SettingsData from "./SettingsData";

jest.mock("webextension-polyfill", () => ({
  __esModule: true,
  default: {
    storage: {
      local: {
        get: jest.fn(() => Promise.resolve({})),
        set: jest.fn(() => Promise.resolve()),
      },
      session: {
        get: jest.fn(() => Promise.resolve({})),
        set: jest.fn(() => Promise.resolve()),
      },
    },
  },
}));

describe("SettingsData", () => {
  afterEach(cleanup);

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <SettingsData />
      </MemoryRouter>,
    );

  it("should render the Data heading", () => {
    renderComponent();

    expect(screen.getByText("Data")).toBeInTheDocument();
  });

  it("should render the Export Backup button", () => {
    renderComponent();

    expect(
      screen.getByRole("button", { name: /Export Backup/i }),
    ).toBeInTheDocument();
  });

  it("should render the description text", () => {
    renderComponent();

    expect(
      screen.getByText(/Export encrypted keystores/),
    ).toBeInTheDocument();
  });
});
