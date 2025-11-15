import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import WatchAssetContent from "./WatchAssetContent";

jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Wallet/Header/ChainBadge/ChainBadge",
  () => () => <div>Mocked Chain Badge</div>,
);
jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/DAppRequest/DAppRequestContentSelection/WatchAssetContent/WatchAssetInfo/WatchAssetInfo",
  () => () => <div>Mocked Watch Asset Info</div>,
);
jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/DAppRequest/DAppRequestContentSelection/WatchAssetContent/WatchAssetVerification/WatchAssetVerification",
  () => () => <div>Mocked Watch Asset Verification</div>,
);

describe("WatchAssetContent", () => {
  afterEach(cleanup);

  const renderComponent = (
    mockedStoreValues = mockedStore({
      dAppRequestStore: { dAppRequestData: { params: [{ options: {} }] } },
      zondStore: {
        activeAccount: {
          accountAddress: "Z20B714091cF2a62DADda2847803e3f1B9D2D3779",
        },
      },
    }),
  ) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <WatchAssetContent />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the watch asset content", () => {
    renderComponent();

    expect(screen.getByText("Mocked Chain Badge")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Here is a request to add an ZRC20 token to the wallet.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Mocked Watch Asset Info")).toBeInTheDocument();
    expect(
      screen.getByText("Mocked Watch Asset Verification"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Do you want to add this token?"),
    ).toBeInTheDocument();
    const noButton = screen.getByRole("button", { name: "No" });
    expect(noButton).toBeInTheDocument();
    expect(noButton).toBeEnabled();
    const yesButton = screen.getByRole("button", { name: "Yes" });
    expect(yesButton).toBeInTheDocument();
    expect(yesButton).toBeEnabled();
  });
});
