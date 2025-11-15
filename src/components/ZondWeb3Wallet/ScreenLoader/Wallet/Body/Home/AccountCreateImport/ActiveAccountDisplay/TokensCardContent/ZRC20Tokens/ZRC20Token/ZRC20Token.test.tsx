import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/UI/Tooltip";
import ZRC20Token from "./ZRC20Token";

jest.mock("@/utilities/storageUtil", () => {
  const originalModule = jest.requireActual<
    typeof import("@/utilities/storageUtil")
  >("@/utilities/storageUtil");
  return {
    ...originalModule,
    getTokenContractsList: jest.fn(async () => [
      {
        address: "Z28c4113a9d3a2e836f28c23ed8e3c1e7c243f566",
        image: "testImage1",
      },
      {
        address: "Z978918b7b544ad491d0b294cc6ac4d7bb0ef7112",
        image: "testImage2",
      },
      {
        address: "Z0db3981cb93db985e4e3a62ff695f7a1b242dd7c",
        image: "testImage3",
      },
    ]),
  };
});
jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/Home/AccountCreateImport/ActiveAccountDisplay/TokensCardContent/TokenListItemLoading/TokenListItemLoading",
  () => () => <div>Mocked Token List Item Loading</div>,
);
jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/Home/AccountCreateImport/ActiveAccountDisplay/TokensCardContent/TokenListItem/TokenListItem",
  () => () => <div>Mocked Token List Item</div>,
);

describe("ZRC20Token", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <TooltipProvider>
            <ZRC20Token
              contractAddress="Z0db3981cb93db985e4e3a62ff695f7a1b242dd7c"
              tokenImage=""
            />
          </TooltipProvider>
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the zrc 20 token component", async () => {
    renderComponent(
      mockedStore({
        zondStore: {
          getZrc20TokenDetails: async (contractAddress: string) => {
            contractAddress;
            return {
              token: {
                balance: 65,
                decimals: BigInt(18),
                name: "POWERCOIN",
                symbol: "POW",
                totalSupply: 100000,
                image: "",
              },
              error: "",
            };
          },
        },
      }),
    );

    await waitFor(() => {
      expect(screen.getByText("Mocked Token List Item")).toBeInTheDocument();
    });
  });
});
