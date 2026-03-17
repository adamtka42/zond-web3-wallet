import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { describe, expect, it, jest } from "@jest/globals";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import QrlWeb3Wallet from "./QrlWeb3Wallet";

jest.mock("@/utilities/storageUtil", () => {
  const originalModule = jest.requireActual<
    typeof import("@/utilities/storageUtil")
  >("@/utilities/storageUtil");
  return {
    ...originalModule,
    getDAppRequestData: jest.fn(async () => ({
      method: "qrl_requestAccounts",
      requestData: {
        senderData: {
          tabId: 1,
          title: "Mocked Page Title",
          url: "http://localhost/",
          favIconUrl: "http://localhost/mocked-fav-icon.svg",
        },
      },
    })),
  };
});
jest.mock("@/components/QrlWeb3Wallet/RouteMonitor/RouteMonitor", () => () => (
  <div>Mocked Route Monitor</div>
));
jest.mock("@/components/QrlWeb3Wallet/ScreenLoader/ScreenLoader", () => () => (
  <div>Mocked Screen Loader</div>
));

describe("QrlWeb3Wallet", () => {
  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <QrlWeb3Wallet />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the route monitor, the header component and the body component", async () => {
    renderComponent();

    await act(async () => {
      expect(screen.getByText("Mocked Route Monitor")).toBeInTheDocument();
      expect(screen.getByText("Mocked Screen Loader")).toBeInTheDocument();
    });
  });
});
