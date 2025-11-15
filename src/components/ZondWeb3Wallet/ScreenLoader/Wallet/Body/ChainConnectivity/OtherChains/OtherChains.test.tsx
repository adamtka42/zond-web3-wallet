import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import OtherChains from "./OtherChains";

jest.mock("@/utilities/storageUtil", () => {
  const originalModule = jest.requireActual<
    typeof import("@/utilities/storageUtil")
  >("@/utilities/storageUtil");
  return {
    ...originalModule,
    getAllBlockChains: jest.fn(async () => [
      {
        defaultRpcUrl: "http://testDefaultRpcUrl",
        defaultBlockExplorerUrl: "http://testDefaultExplorerUrl",
        defaultIconUrl: "http://testDefaultIconUrl",
        isTestnet: false,
        defaultWsRpcUrl: "http://testDefaultRpcUrl",
        isCustomChain: true,
      },
    ]),
  };
});
jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/ChainConnectivity/OtherChains/OtherChainItem/OtherChainItem",
  () => () => <div>Mocked Other Chain Item</div>,
);

describe("OtherChains", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <OtherChains />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the other chains component", async () => {
    renderComponent();

    expect(screen.getByText("Other chains")).toBeInTheDocument();
    await waitFor(async () => {
      expect(screen.getByText("Mocked Other Chain Item")).toBeInTheDocument();
    });
  });
});
