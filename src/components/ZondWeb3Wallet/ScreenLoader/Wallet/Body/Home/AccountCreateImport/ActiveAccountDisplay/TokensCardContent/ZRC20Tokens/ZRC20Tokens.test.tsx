import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/UI/Tooltip";
import { ZRC_20_ITEMS_DISPLAY_LIMIT } from "@/constants/zrc20Token";
import ZRC20Tokens from "./ZRC20Tokens";

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
  "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Body/Home/AccountCreateImport/ActiveAccountDisplay/TokensCardContent/ZRC20Tokens/ZRC20Token/ZRC20Token",
  () => () => <div>Mocked ZRC 20 token</div>,
);

describe("ZRC20Tokens", () => {
  afterEach(cleanup);

  const renderComponent = (
    mockedStoreValues = mockedStore({
      zondStore: {
        getZrc20TokenDetails: async (contractAddress: string) => {
          const tokenContracts = {
            "0x28c4113a9d3a2e836f28c23ed8e3c1e7c243f566": {
              token: {
                balance: 12,
                decimals: BigInt(18),
                name: "COIN1",
                symbol: "CO1",
                totalSupply: 100000,
                image: "",
              },
              error: "",
            },
            "0x978918b7b544ad491d0b294cc6ac4d7bb0ef7112": {
              token: {
                balance: 56,
                decimals: BigInt(18),
                name: "COIN2",
                symbol: "CO2",
                totalSupply: 100000,
                image: "",
              },
              error: "",
            },
            "0x0db3981cb93db985e4e3a62ff695f7a1b242dd7c": {
              token: {
                balance: 96,
                decimals: BigInt(18),
                name: "COIN3",
                symbol: "CO3",
                totalSupply: 100,
                image: "",
              },
              error: "",
            },
          };
          return (
            tokenContracts[contractAddress as keyof typeof tokenContracts] ?? {}
          );
        },
      },
    }),
    mockedProps: ComponentProps<typeof ZRC20Tokens> = {},
  ) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <TooltipProvider>
            <ZRC20Tokens {...mockedProps} />
          </TooltipProvider>
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should display all the tokens if shouldDisplayAllTokens is true ", async () => {
    renderComponent(undefined, { shouldDisplayAllTokens: true });

    await waitFor(() => {
      expect(screen.getAllByText("Mocked ZRC 20 token")).toHaveLength(3);
    });
  });

  it("should display only allowed number of tokens if shouldDisplayAllTokens is false ", async () => {
    renderComponent(undefined, { shouldDisplayAllTokens: false });

    await waitFor(() => {
      expect(screen.getAllByText("Mocked ZRC 20 token")).toHaveLength(
        ZRC_20_ITEMS_DISPLAY_LIMIT,
      );
    });
  });
});
