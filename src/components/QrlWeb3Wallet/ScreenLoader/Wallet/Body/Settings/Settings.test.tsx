import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Settings from "./Settings";

describe("Settings", () => {
  afterEach(cleanup);

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>,
    );

  it("should render the Settings heading", () => {
    renderComponent();

    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("should render all menu items", () => {
    renderComponent();

    expect(screen.getByText("Appearance")).toBeInTheDocument();
    expect(screen.getByText("Security")).toBeInTheDocument();
    expect(screen.getByText("Preferences")).toBeInTheDocument();
    expect(screen.getByText("Data")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
  });
});
