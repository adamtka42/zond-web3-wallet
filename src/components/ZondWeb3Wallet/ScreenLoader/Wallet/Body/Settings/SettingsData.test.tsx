import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SettingsData from "./SettingsData";

vi.mock("webextension-polyfill", () => ({
  __esModule: true,
  default: {
    storage: {
      local: {
        get: vi.fn(() => Promise.resolve({})),
        set: vi.fn(() => Promise.resolve()),
      },
      session: {
        get: vi.fn(() => Promise.resolve({})),
        set: vi.fn(() => Promise.resolve()),
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
