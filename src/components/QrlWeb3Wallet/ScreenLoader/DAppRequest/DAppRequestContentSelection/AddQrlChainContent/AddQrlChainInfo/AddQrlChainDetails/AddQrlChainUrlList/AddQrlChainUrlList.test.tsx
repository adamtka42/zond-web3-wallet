import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";
import AddQrlChainUrlList from "./AddQrlChainUrlList";

describe("AddQrlChainUrlList", () => {
  afterEach(cleanup);

  const renderComponent = (
    mockedStoreValues = mockedStore(),
    mockedProps: ComponentProps<typeof AddQrlChainUrlList> = {
      title: "Test title",
      urlList: ["https://testUrl1", "https://testUrl2"],
    },
  ) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <AddQrlChainUrlList {...mockedProps} />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the add qrl chain url list component", () => {
    renderComponent();

    expect(screen.getByText("Test title")).toBeInTheDocument();
    expect(screen.getByText("1. https://testUrl1")).toBeInTheDocument();
    expect(screen.getByText("2. https://testUrl2")).toBeInTheDocument();
  });

  it("should not render anything if the url list is empty", () => {
    renderComponent(undefined, { title: "", urlList: [] });

    expect(screen.queryByText("Test title")).not.toBeInTheDocument();
  });
});
