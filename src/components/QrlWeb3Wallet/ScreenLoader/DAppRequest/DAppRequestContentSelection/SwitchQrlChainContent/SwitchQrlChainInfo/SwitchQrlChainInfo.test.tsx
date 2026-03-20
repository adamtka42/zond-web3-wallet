import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SwitchQrlChainInfo from "./SwitchQrlChainInfo";

vi.mock("@/utilities/storageUtil", async () => {
  const originalModule = await vi.importActual<
    typeof import("@/utilities/storageUtil")
  >("@/utilities/storageUtil");
  return {
    ...originalModule,
    default: {
      ...originalModule.default,
      getActiveBlockChain: vi.fn(async () => ({ chainId: "0x33" })),
      getAllBlockChains: vi.fn(async () => [
        {
          chainId: "0x33",
        },
        {
          chainId: "0x11",
        },
      ]),
    },
  };
});
vi.mock(
  "@/components/QrlWeb3Wallet/ScreenLoader/DAppRequest/DAppRequestContentSelection/SwitchQrlChainContent/SwitchQrlChainInfo/ChainInfoCard/ChainInfoCard",
  () => ({ default: () => <div>Mocked Chain Info Card</div> }),
);

describe("SwitchQrlChainInfo", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <SwitchQrlChainInfo />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the switch qrl chain content component", async () => {
    renderComponent(
      mockedStore({
        dAppRequestStore: {
          dAppRequestData: { params: [{ chainId: "0x11" }] },
        },
      }),
    );

    await waitFor(() => {
      expect(screen.getAllByText("Mocked Chain Info Card")).toHaveLength(2);
      expect(screen.getByTestId("arrow-down-icon")).toBeInTheDocument();
    });
  });
});
