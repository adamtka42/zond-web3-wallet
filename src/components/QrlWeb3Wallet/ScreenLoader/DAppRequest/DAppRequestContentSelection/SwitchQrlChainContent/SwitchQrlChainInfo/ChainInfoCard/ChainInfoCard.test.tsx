import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";
import ChainInfoCard from "./ChainInfoCard";

describe("ChainInfoCard", () => {
  const renderComponent = (
    mockedStoreValues = mockedStore(),
    mockedProps: ComponentProps<typeof ChainInfoCard> = {
      title: "Test title",
      description: "Test description",
      chain: {
        chainId: "0x5",
        chainName: "Test chain name",
        rpcUrls: [],
        blockExplorerUrls: [],
        iconUrls: [],
        nativeCurrency: {
          name: "Test native currency",
          symbol: "TST",
          decimals: 18,
        },
        defaultRpcUrl: "http://testDefaultRpcUrl",
        defaultBlockExplorerUrl: "http://testDefaultExplorerUrl",
        defaultIconUrl: "http://testDefaultIconUrl",
        isTestnet: false,
        defaultWsRpcUrl: "http://testDefaultRpcUrl",
        isCustomChain: true,
      },
    },
  ) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <ChainInfoCard {...mockedProps} />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the chain info card component", () => {
    renderComponent();

    expect(screen.getByText("Test title")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
    expect(screen.getByText("Test chain name")).toBeInTheDocument();
    expect(screen.getByText("Chain ID 5")).toBeInTheDocument();
    expect(screen.getByText("http://testDefaultRpcUrl")).toBeInTheDocument();
  });
});
