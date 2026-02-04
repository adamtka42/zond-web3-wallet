import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/UI/Tooltip";
import ZondSendTransactionForContent from "./ZondSendTransactionForContent";
import { SEND_TRANSACTION_TYPES } from "../ZondSendTransaction";

jest.mock("@/functions/getHexSeedFromMnemonic", () => ({
  getHexSeedFromMnemonic: jest.fn(() => "0xhexseed"),
}));

describe("ZondSendTransactionForContent", () => {
  afterEach(cleanup);

  let capturedPermissionCallback: ((hasApproved: boolean) => Promise<void>) | null = null;

  const renderComponent = (
    mockedStoreValues = mockedStore(),
    mockedProps: ComponentProps<typeof ZondSendTransactionForContent> = {
      transactionType: SEND_TRANSACTION_TYPES.UNKNOWN,
    },
  ) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <TooltipProvider>
            <ZondSendTransactionForContent {...mockedProps} />
          </TooltipProvider>
        </MemoryRouter>
      </StoreProvider>,
    );

  const zndTransferRequest = {
    from: "Z20D20b8026B8F02540246f58120ddAAf35AECD9B",
    to: "Z20EE9760786AD48aB90E326c5cd78c6269Ba10AB",
    value: "0x30",
    gas: "0x1cb55",
    type: "0x2",
  };

  const contractDeploymentRequest = {
    data: "0x608060405234",
    from: "Z20D20b8026B8F02540246f58120ddAAf35AECD9B",
    gas: "0x1cbb3",
    type: "0x2",
    value: "0x0",
  };

  const contractInteractionRequest = {
    from: "Z20D20b8026B8F02540246f58120ddAAf35AECD9B",
    to: "0x20EE9760786AD48aB90E326c5cd78c6269Ba10AB",
    data: "0x608060405234",
    value: "0x0",
    gas: "0x1cbb3",
    type: "0x2",
  };

  const createStoreWithCallback = (overrides: Record<string, any> = {}) => {
    capturedPermissionCallback = null;
    return mockedStore({
      zondStore: {
        zondConnection: { isConnected: true },
        zondInstance: {
          getGasPrice: async () => BigInt(1000),
          getTransactionCount: async () => 0,
          getChainId: async () => 1,
          accounts: {
            signTransaction: async () => ({
              rawTransaction: "0xsignedraw",
            }),
          },
          sendSignedTransaction: jest.fn<any>().mockResolvedValue({
            transactionHash: "0xtxhash",
          }),
        } as any,
        getGasFeeData: async () => ({
          baseFeePerGas: BigInt(100),
          maxFeePerGas: BigInt(200),
          maxPriorityFeePerGas: "100",
        }),
        ...overrides.zondStore,
      },
      dAppRequestStore: {
        dAppRequestData: {
          params: [overrides.requestParams || zndTransferRequest],
        },
        setOnPermissionCallBack: (cb: any) => {
          capturedPermissionCallback = cb;
        },
        addToResponseData: overrides.addToResponseData || jest.fn(),
        ...overrides.dAppRequestStore,
      },
      lockStore: {
        getMnemonicPhrases: async () => "test mnemonic phrases",
        ...overrides.lockStore,
      },
      ledgerStore: {
        isLedgerAccount: () => false,
        signAndSerializeTransaction: async () => "0xledgersigned",
        ...overrides.ledgerStore,
      } as any,
    });
  };

  it("should render the zond send transaction component for contract deployment", async () => {
    const requestForContractDeployment = {
      data: "0x6080604052348015600e575f5ffd5b506101298061001c5f395ff3fe6080604052348015600e575f5ffd5b50600436106030575f3560e01c8063271f88b4146034578063d321fe2914604c575b5f5ffd5b604a60048036038101906046919060a9565b6066565b005b6052606f565b604051605d919060dc565b60405180910390f35b805f8190555050565b5f5f54905090565b5f5ffd5b5f819050919050565b608b81607b565b81146094575f5ffd5b50565b5f8135905060a3816084565b92915050565b5f6020828403121560bb5760ba6077565b5b5f60c6848285016097565b91505092915050565b60d681607b565b82525050565b5f60208201905060ed5f83018460cf565b9291505056fea26469706673582212203f5c1f328bda9fceed794ae68885d6664554bf4d7dbb1df839cc372d276837ab64736f6c634300081b0033",
      from: "Z20D20b8026B8F02540246f58120ddAAf35AECD9B",
      gas: "0x1cbb3",
      type: "0x2",
      value: "0x0",
    };
    renderComponent(
      mockedStore({
        dAppRequestStore: {
          dAppRequestData: {
            params: [requestForContractDeployment],
          },
        },
      }),
      { transactionType: SEND_TRANSACTION_TYPES.CONTRACT_DEPLOYMENT },
    );

    const detailsTab = screen.getByRole("tab", { name: "Details" });
    const dataTab = screen.getByRole("tab", { name: "Data" });
    expect(detailsTab).toBeInTheDocument();
    expect(dataTab).toBeInTheDocument();
    expect(screen.getByText("From Address")).toBeInTheDocument();
    expect(
      screen.getByText("Z 20D20 b8026 B8F02 54024 6f581 20ddA Af35A ECD9B"),
    ).toBeInTheDocument();
    expect(screen.getByText("Gas Limit")).toBeInTheDocument();
    expect(screen.getByText("117683")).toBeInTheDocument();
    await userEvent.click(dataTab);
    expect(
      screen.getByText(
        "0x6080604052348015600e575f5ffd5b506101298061001c5f395ff3fe6080604052348015600e575f5ffd5b50600436106030575f3560e01c8063271f88b4146034578063d321fe2914604c575b5f5ffd5b604a60048036038101906046919060a9565b6066565b005b6052606f565b604051605d919060dc565b60405180910390f35b805f8190555050565b5f5f54905090565b5f5ffd5b5f819050919050565b608b81607b565b81146094575f5ffd5b50565b5f8135905060a3816084565b92915050565b5f6020828403121560bb5760ba6077565b5b5f60c6848285016097565b91505092915050565b60d681607b565b82525050565b5f60208201905060ed5f83018460cf565b9291505056fea26469706673582212203f5c1f328bda9fceed794ae68885d6664554bf4d7dbb1df839cc372d276837ab64736f6c634300081b0033",
      ),
    ).toBeInTheDocument();
  });

  it("should render the zond send transaction component for contract interaction", async () => {
    const requestForContractInteraction = {
      from: "Z20D20b8026B8F02540246f58120ddAAf35AECD9B",
      to: "0x20EE9760786AD48aB90E326c5cd78c6269Ba10AB",
      data: "0x6080604052348015600e575f5ffd5b506101298061001c5f395ff3fe6080604052348015600e575f5ffd5b50600436106030575f3560e01c8063271f88b4146034578063d321fe2914604c575b5f5ffd5b604a60048036038101906046919060a9565b6066565b005b6052606f565b604051605d919060dc565b60405180910390f35b805f8190555050565b5f5f54905090565b5f5ffd5b5f819050919050565b608b81607b565b81146094575f5ffd5b50565b5f8135905060a3816084565b92915050565b5f6020828403121560bb5760ba6077565b5b5f60c6848285016097565b91505092915050565b60d681607b565b82525050565b5f60208201905060ed5f83018460cf565b9291505056fea26469706673582212203f5c1f328bda9fceed794ae68885d6664554bf4d7dbb1df839cc372d276837ab64736f6c634300081b0033",
      value: "0x0",
      gas: "0x1cbb3",
      type: "0x2",
    };
    renderComponent(
      mockedStore({
        dAppRequestStore: {
          dAppRequestData: {
            params: [requestForContractInteraction],
          },
        },
      }),
      { transactionType: SEND_TRANSACTION_TYPES.CONTRACT_INTERACTION },
    );

    const detailsTab = screen.getByRole("tab", { name: "Details" });
    const dataTab = screen.getByRole("tab", { name: "Data" });
    expect(detailsTab).toBeInTheDocument();
    expect(dataTab).toBeInTheDocument();
    expect(screen.getByText("From Address")).toBeInTheDocument();
    expect(
      screen.getByText("Z 20D20 b8026 B8F02 54024 6f581 20ddA Af35A ECD9B"),
    ).toBeInTheDocument();
    expect(screen.getByText("Gas Limit")).toBeInTheDocument();
    expect(screen.getByText("117683")).toBeInTheDocument();
    await userEvent.click(dataTab);
    expect(
      screen.getByText(
        "0x6080604052348015600e575f5ffd5b506101298061001c5f395ff3fe6080604052348015600e575f5ffd5b50600436106030575f3560e01c8063271f88b4146034578063d321fe2914604c575b5f5ffd5b604a60048036038101906046919060a9565b6066565b005b6052606f565b604051605d919060dc565b60405180910390f35b805f8190555050565b5f5f54905090565b5f5ffd5b5f819050919050565b608b81607b565b81146094575f5ffd5b50565b5f8135905060a3816084565b92915050565b5f6020828403121560bb5760ba6077565b5b5f60c6848285016097565b91505092915050565b60d681607b565b82525050565b5f60208201905060ed5f83018460cf565b9291505056fea26469706673582212203f5c1f328bda9fceed794ae68885d6664554bf4d7dbb1df839cc372d276837ab64736f6c634300081b0033",
      ),
    ).toBeInTheDocument();
  });

  it("should render the zond send transaction component for ZND transfer", async () => {
    const requestForZndTransfer = {
      from: "Z20D20b8026B8F02540246f58120ddAAf35AECD9B",
      to: "Z20EE9760786AD48aB90E326c5cd78c6269Ba10AB",
      value: "0x30",
      gas: "0x1cb55",
      type: "0x2",
    };
    renderComponent(
      mockedStore({
        dAppRequestStore: {
          dAppRequestData: {
            params: [requestForZndTransfer],
          },
        },
      }),
      { transactionType: SEND_TRANSACTION_TYPES.ZND_TRANSFER },
    );

    const detailsTab = screen.getByRole("tab", { name: "Details" });
    const dataTab = screen.queryByRole("tab", { name: "Data" });
    expect(detailsTab).toBeInTheDocument();
    expect(dataTab).not.toBeInTheDocument();
    expect(screen.getByText("From Address")).toBeInTheDocument();
    expect(
      screen.getByText("Z 20D20 b8026 B8F02 54024 6f581 20ddA Af35A ECD9B"),
    ).toBeInTheDocument();
    expect(screen.getByText("To Address")).toBeInTheDocument();
    expect(
      screen.getByText("Z 20EE9 76078 6AD48 aB90E 326c5 cd78c 6269B a10AB"),
    ).toBeInTheDocument();
    expect(screen.getByText("Value")).toBeInTheDocument();
    expect(screen.getByText("0.000000000000000048 ZND")).toBeInTheDocument();
    expect(screen.getByText("Gas Limit")).toBeInTheDocument();
    expect(screen.getByText("117589")).toBeInTheDocument();
  });

  describe("sendZndTransfer", () => {
    it("should send ZND transfer via regular account (mnemonic)", async () => {
      const mockSendSignedTransaction = jest.fn<any>().mockResolvedValue({
        transactionHash: "0xtxhash",
      });
      const mockAddToResponseData = jest.fn();

      renderComponent(
        createStoreWithCallback({
          zondStore: {
            zondInstance: {
              getGasPrice: async () => BigInt(1000),
              getTransactionCount: async () => 0,
              getChainId: async () => 1,
              accounts: {
                signTransaction: async () => ({
                  rawTransaction: "0xsignedraw",
                }),
              },
              sendSignedTransaction: mockSendSignedTransaction,
            } as any,
          },
          addToResponseData: mockAddToResponseData,
        }),
        { transactionType: SEND_TRANSACTION_TYPES.ZND_TRANSFER },
      );

      expect(capturedPermissionCallback).not.toBeNull();
      await act(async () => {
        await capturedPermissionCallback!(true);
      });

      expect(mockSendSignedTransaction).toHaveBeenCalledWith("0xsignedraw");
      expect(mockAddToResponseData).toHaveBeenCalledWith({
        transactionHash: "0xtxhash",
      });
    });

    it("should send ZND transfer via Ledger account", async () => {
      const mockSendSignedTransaction = jest.fn<any>().mockResolvedValue({
        transactionHash: "0xledgertxhash",
      });
      const mockAddToResponseData = jest.fn();
      const mockSignAndSerialize = jest.fn<any>().mockResolvedValue("0xledgersigned");

      renderComponent(
        createStoreWithCallback({
          zondStore: {
            zondInstance: {
              getGasPrice: async () => BigInt(1000),
              getTransactionCount: async () => 0,
              getChainId: async () => 1,
              sendSignedTransaction: mockSendSignedTransaction,
            } as any,
          },
          addToResponseData: mockAddToResponseData,
          ledgerStore: {
            isLedgerAccount: () => true,
            signAndSerializeTransaction: mockSignAndSerialize,
          },
        }),
        { transactionType: SEND_TRANSACTION_TYPES.ZND_TRANSFER },
      );

      await act(async () => {
        await capturedPermissionCallback!(true);
      });

      expect(mockSignAndSerialize).toHaveBeenCalled();
      expect(mockSendSignedTransaction).toHaveBeenCalledWith("0xledgersigned");
      expect(mockAddToResponseData).toHaveBeenCalledWith({
        transactionHash: "0xledgertxhash",
      });
    });

    it("should send ZND transfer with legacy gas pricing (non-0x2)", async () => {
      const mockSendSignedTransaction = jest.fn<any>().mockResolvedValue({
        transactionHash: "0xtxhash",
      });
      const legacyRequest = { ...zndTransferRequest, type: "0x0" };

      renderComponent(
        createStoreWithCallback({
          requestParams: legacyRequest,
          zondStore: {
            zondInstance: {
              getGasPrice: async () => BigInt(1000),
              getTransactionCount: async () => 0,
              accounts: {
                signTransaction: async () => ({
                  rawTransaction: "0xsignedlegacy",
                }),
              },
              sendSignedTransaction: mockSendSignedTransaction,
            } as any,
          },
        }),
        { transactionType: SEND_TRANSACTION_TYPES.ZND_TRANSFER },
      );

      await act(async () => {
        await capturedPermissionCallback!(true);
      });

      expect(mockSendSignedTransaction).toHaveBeenCalledWith("0xsignedlegacy");
    });

    it("should handle error when from is missing", async () => {
      const mockAddToResponseData = jest.fn();
      const missingFromRequest = { ...zndTransferRequest, from: "" };

      renderComponent(
        createStoreWithCallback({
          requestParams: missingFromRequest,
          addToResponseData: mockAddToResponseData,
        }),
        { transactionType: SEND_TRANSACTION_TYPES.ZND_TRANSFER },
      );

      await act(async () => {
        await capturedPermissionCallback!(true);
      });

      expect(mockAddToResponseData).toHaveBeenCalledWith({
        error: expect.objectContaining({
          message: expect.stringContaining("from"),
        }),
      });
    });

    it("should handle error when Ledger signing fails", async () => {
      const mockAddToResponseData = jest.fn();

      renderComponent(
        createStoreWithCallback({
          addToResponseData: mockAddToResponseData,
          ledgerStore: {
            isLedgerAccount: () => true,
            signAndSerializeTransaction: async () => {
              throw new Error("User rejected on device");
            },
          },
          zondStore: {
            zondInstance: {
              getGasPrice: async () => BigInt(1000),
              getTransactionCount: async () => 0,
              getChainId: async () => 1,
            } as any,
          },
        }),
        { transactionType: SEND_TRANSACTION_TYPES.ZND_TRANSFER },
      );

      await act(async () => {
        await capturedPermissionCallback!(true);
      });

      expect(mockAddToResponseData).toHaveBeenCalledWith({
        error: expect.objectContaining({
          message: "User rejected on device",
        }),
      });
    });
  });

  describe("deployContractOrInteract", () => {
    it("should deploy contract via regular account (mnemonic)", async () => {
      const mockSendSignedTransaction = jest.fn<any>().mockResolvedValue({
        transactionHash: "0xdeploytxhash",
      });
      const mockAddToResponseData = jest.fn();

      renderComponent(
        createStoreWithCallback({
          requestParams: contractDeploymentRequest,
          zondStore: {
            zondInstance: {
              getGasPrice: async () => BigInt(1000),
              getTransactionCount: async () => 0,
              getChainId: async () => 1,
              accounts: {
                signTransaction: async () => ({
                  rawTransaction: "0xsigneddeploy",
                }),
              },
              sendSignedTransaction: mockSendSignedTransaction,
            } as any,
          },
          addToResponseData: mockAddToResponseData,
        }),
        { transactionType: SEND_TRANSACTION_TYPES.CONTRACT_DEPLOYMENT },
      );

      await act(async () => {
        await capturedPermissionCallback!(true);
      });

      expect(mockSendSignedTransaction).toHaveBeenCalledWith("0xsigneddeploy");
      expect(mockAddToResponseData).toHaveBeenCalledWith({
        transactionHash: "0xdeploytxhash",
      });
    });

    it("should deploy contract via Ledger account", async () => {
      const mockSendSignedTransaction = jest.fn<any>().mockResolvedValue({
        transactionHash: "0xledgerdeployhash",
      });
      const mockAddToResponseData = jest.fn();
      const mockSignAndSerialize = jest.fn<any>().mockResolvedValue("0xledgerdeploy");

      renderComponent(
        createStoreWithCallback({
          requestParams: contractDeploymentRequest,
          zondStore: {
            zondInstance: {
              getGasPrice: async () => BigInt(1000),
              getTransactionCount: async () => 0,
              getChainId: async () => 1,
              sendSignedTransaction: mockSendSignedTransaction,
            } as any,
          },
          addToResponseData: mockAddToResponseData,
          ledgerStore: {
            isLedgerAccount: () => true,
            signAndSerializeTransaction: mockSignAndSerialize,
          },
        }),
        { transactionType: SEND_TRANSACTION_TYPES.CONTRACT_DEPLOYMENT },
      );

      await act(async () => {
        await capturedPermissionCallback!(true);
      });

      expect(mockSignAndSerialize).toHaveBeenCalled();
      expect(mockSendSignedTransaction).toHaveBeenCalledWith("0xledgerdeploy");
      expect(mockAddToResponseData).toHaveBeenCalledWith({
        transactionHash: "0xledgerdeployhash",
      });
    });

    it("should interact with contract via Ledger account (with to address)", async () => {
      const mockSendSignedTransaction = jest.fn<any>().mockResolvedValue({
        transactionHash: "0xledgerinteracthash",
      });
      const mockAddToResponseData = jest.fn();
      const mockSignAndSerialize = jest.fn<any>().mockResolvedValue("0xledgerinteract");

      renderComponent(
        createStoreWithCallback({
          requestParams: contractInteractionRequest,
          zondStore: {
            zondInstance: {
              getGasPrice: async () => BigInt(1000),
              getTransactionCount: async () => 0,
              getChainId: async () => 1,
              sendSignedTransaction: mockSendSignedTransaction,
            } as any,
          },
          addToResponseData: mockAddToResponseData,
          ledgerStore: {
            isLedgerAccount: () => true,
            signAndSerializeTransaction: mockSignAndSerialize,
          },
        }),
        { transactionType: SEND_TRANSACTION_TYPES.CONTRACT_INTERACTION },
      );

      await act(async () => {
        await capturedPermissionCallback!(true);
      });

      // Verify txData includes 'to' for contract interaction
      const txDataArg = mockSignAndSerialize.mock.calls[0][1] as Record<string, any>;
      expect(txDataArg.to).toBe(contractInteractionRequest.to);
      expect(mockSendSignedTransaction).toHaveBeenCalledWith("0xledgerinteract");
    });

    it("should use legacy gasPrice for non-0x2 contract deployment via Ledger", async () => {
      const mockSendSignedTransaction = jest.fn<any>().mockResolvedValue({
        transactionHash: "0xhash",
      });
      const mockSignAndSerialize = jest.fn<any>().mockResolvedValue("0xsigned");
      const legacyDeployRequest = { ...contractDeploymentRequest, type: "0x0" };

      renderComponent(
        createStoreWithCallback({
          requestParams: legacyDeployRequest,
          zondStore: {
            zondInstance: {
              getGasPrice: async () => BigInt(1000),
              getTransactionCount: async () => 0,
              getChainId: async () => 1,
              sendSignedTransaction: mockSendSignedTransaction,
            } as any,
          },
          ledgerStore: {
            isLedgerAccount: () => true,
            signAndSerializeTransaction: mockSignAndSerialize,
          },
        }),
        { transactionType: SEND_TRANSACTION_TYPES.CONTRACT_DEPLOYMENT },
      );

      await act(async () => {
        await capturedPermissionCallback!(true);
      });

      // Verify txData uses gasPrice instead of maxFeePerGas
      const txDataArg = mockSignAndSerialize.mock.calls[0][1] as Record<string, any>;
      expect(txDataArg.gasPrice).toBeDefined();
      expect(txDataArg.maxFeePerGas).toBeUndefined();
    });

    it("should handle error when signing returns no rawTransaction", async () => {
      const mockAddToResponseData = jest.fn();

      renderComponent(
        createStoreWithCallback({
          requestParams: contractDeploymentRequest,
          zondStore: {
            zondInstance: {
              getGasPrice: async () => BigInt(1000),
              getTransactionCount: async () => 0,
              accounts: {
                signTransaction: async () => ({
                  rawTransaction: undefined,
                }),
              },
            } as any,
          },
          addToResponseData: mockAddToResponseData,
        }),
        { transactionType: SEND_TRANSACTION_TYPES.CONTRACT_DEPLOYMENT },
      );

      await act(async () => {
        await capturedPermissionCallback!(true);
      });

      expect(mockAddToResponseData).toHaveBeenCalledWith({
        error: expect.objectContaining({
          message: "Transaction could not be signed",
        }),
      });
    });
  });

  describe("onPermissionCallBack", () => {
    it("should not execute transaction when hasApproved is false", async () => {
      const mockSendSignedTransaction = jest.fn<any>();

      renderComponent(
        createStoreWithCallback({
          zondStore: {
            zondInstance: {
              getGasPrice: async () => BigInt(1000),
              getTransactionCount: async () => 0,
              sendSignedTransaction: mockSendSignedTransaction,
            } as any,
          },
        }),
        { transactionType: SEND_TRANSACTION_TYPES.ZND_TRANSFER },
      );

      await act(async () => {
        await capturedPermissionCallback!(false);
      });

      expect(mockSendSignedTransaction).not.toHaveBeenCalled();
    });
  });

  describe("copyData", () => {
    it("should copy data to clipboard when copy button is clicked", async () => {
      const mockWriteText = jest.fn<any>();
      Object.assign(navigator, {
        clipboard: { writeText: mockWriteText },
      });

      renderComponent(
        mockedStore({
          dAppRequestStore: {
            dAppRequestData: {
              params: [contractInteractionRequest],
            },
          },
        }),
        { transactionType: SEND_TRANSACTION_TYPES.CONTRACT_INTERACTION },
      );

      const dataTab = screen.getByRole("tab", { name: "Data" });
      await userEvent.click(dataTab);

      const copyButton = screen.getByRole("button");
      await userEvent.click(copyButton);

      expect(mockWriteText).toHaveBeenCalledWith(contractInteractionRequest.data);
    });
  });
});
