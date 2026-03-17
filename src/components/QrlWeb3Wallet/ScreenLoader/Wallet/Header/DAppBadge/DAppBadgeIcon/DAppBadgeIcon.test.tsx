import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it } from "@jest/globals";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DAppBadgeIcon from "./DAppBadgeIcon";

describe("DAppBadgeIcon", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <DAppBadgeIcon />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the dapp badge icon", () => {
    renderComponent(
      mockedStore({
        dAppRequestStore: {
          hasDAppConnected: true,
          currentTabData: {
            title: "Test Title",
            favIconUrl: "http://testIconUrl",
          },
        },
      }),
    );

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "http://testIconUrl");
    expect(img).toHaveAttribute("alt", "Test Title");
    expect(screen.queryByTestId("loader-icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("wifi-off-icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("link-icon")).not.toBeInTheDocument();
  });

  it("should render the not unlink icon if favIconUrl is not available", () => {
    renderComponent(
      mockedStore({
        dAppRequestStore: {
          hasDAppConnected: true,
          currentTabData: {
            title: "Test Title",
            favIconUrl: undefined,
          },
        },
      }),
    );

    expect(screen.getByTestId("unlink-icon")).toBeInTheDocument();
  });
});
