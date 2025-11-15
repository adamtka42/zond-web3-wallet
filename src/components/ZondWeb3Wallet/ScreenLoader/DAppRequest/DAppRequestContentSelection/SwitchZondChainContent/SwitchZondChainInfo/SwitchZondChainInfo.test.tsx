import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SwitchZondChainInfo from "./SwitchZondChainInfo";

jest.mock("@/utilities/storageUtil", () => {
  const originalModule = jest.requireActual<
    typeof import("@/utilities/storageUtil")
  >("@/utilities/storageUtil");
  return {
    ...originalModule,
    getActiveBlockChain: jest.fn(async () => ({ chainId: "0x33" })),
    getAllBlockChains: jest.fn(async () => [
      {
        chainId: "0x33",
      },
      {
        chainId: "0x11",
      },
    ]),
  };
});
jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/DAppRequest/DAppRequestContentSelection/SwitchZondChainContent/SwitchZondChainInfo/ChainInfoCard/ChainInfoCard",
  () => () => <div>Mocked Chain Info Card</div>,
);

describe("SwitchZondChainInfo", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <SwitchZondChainInfo />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the switch zond chain content component", async () => {
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
