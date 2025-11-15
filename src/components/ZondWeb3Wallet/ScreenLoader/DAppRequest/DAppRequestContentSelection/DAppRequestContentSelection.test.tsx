import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DAppRequestContentSelection from "./DAppRequestContentSelection";
import { RESTRICTED_METHODS } from "@/scripts/constants/requestConstants";

jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/DAppRequest/DAppRequestContentSelection/AddZondChainContent/AddZondChainContent",
  () => () => <div>Mocked Add Zond Chain Content</div>,
);
jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/DAppRequest/DAppRequestContentSelection/PermissionRequiredContent/PermissionRequiredContent",
  () => () => <div>Mocked Permission Required Content</div>,
);

describe("DAppRequestContentSelection", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <DAppRequestContentSelection />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should display the add zond chain content if the method is wallet_addZondChain", () => {
    renderComponent(
      mockedStore({
        dAppRequestStore: {
          dAppRequestData: { method: RESTRICTED_METHODS.WALLET_ADD_ZOND_CHAIN },
        },
      }),
    );

    expect(
      screen.getByText("Mocked Add Zond Chain Content"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Mocked Permission Required Content"),
    ).not.toBeInTheDocument();
  });

  it("should display the permission required content if the method is personal_sign", () => {
    renderComponent(
      mockedStore({
        dAppRequestStore: {
          dAppRequestData: { method: RESTRICTED_METHODS.PERSONAL_SIGN },
        },
      }),
    );

    expect(
      screen.queryByText("Mocked Add Zond Chain Content"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("Mocked Permission Required Content"),
    ).toBeInTheDocument();
  });

  it("should display the permission required content if the method is zond_requestAccounts", () => {
    renderComponent(
      mockedStore({
        dAppRequestStore: {
          dAppRequestData: { method: RESTRICTED_METHODS.ZOND_REQUEST_ACCOUNTS },
        },
      }),
    );

    expect(
      screen.queryByText("Mocked Add Zond Chain Content"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("Mocked Permission Required Content"),
    ).toBeInTheDocument();
  });

  it("should display the permission required content if the method is zond_sendTransaction", () => {
    renderComponent(
      mockedStore({
        dAppRequestStore: {
          dAppRequestData: { method: RESTRICTED_METHODS.ZOND_SEND_TRANSACTION },
        },
      }),
    );

    expect(
      screen.queryByText("Mocked Add Zond Chain Content"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("Mocked Permission Required Content"),
    ).toBeInTheDocument();
  });

  it("should display the permission required content if the method is zond_signTypedData_v4", () => {
    renderComponent(
      mockedStore({
        dAppRequestStore: {
          dAppRequestData: {
            method: RESTRICTED_METHODS.ZOND_SIGN_TYPED_DATA_V4,
          },
        },
      }),
    );

    expect(
      screen.queryByText("Mocked Add Zond Chain Content"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("Mocked Permission Required Content"),
    ).toBeInTheDocument();
  });

  it("should return null if the method is unknown", () => {
    renderComponent(
      mockedStore({
        dAppRequestStore: {
          dAppRequestData: {
            method: "unknown_method",
          },
        },
      }),
    );

    expect(
      screen.queryByText("Mocked Add Zond Chain Content"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Mocked Permission Required Content"),
    ).not.toBeInTheDocument();
  });
});
