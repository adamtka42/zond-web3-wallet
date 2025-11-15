import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it } from "@jest/globals";
import { cleanup, render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";
import ActiveBrowserTabIcon from "./ActiveBrowserTabIcon";

describe("ActiveBrowserTabIcon", () => {
  afterEach(cleanup);

  const renderComponent = (
    mockedStoreValues = mockedStore(),
    mockedProps: ComponentProps<typeof ActiveBrowserTabIcon> = {
      favIconUrl: "http://testIconUrl",
      altText: "Browser tab icon",
    },
  ) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <ActiveBrowserTabIcon {...mockedProps} />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the active browser tab icon component when icon url is provided", () => {
    renderComponent(mockedStore({}));

    const img = screen.getByRole("img", { name: "Browser tab icon" });
    expect(img).toHaveAttribute("src", "http://testIconUrl");
  });

  it("should render the active browser tab icon component when icon url is not provided", () => {
    renderComponent(mockedStore({}), {});

    expect(screen.getByTestId("earth-icon")).toBeInTheDocument();
  });
});
