import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ZondWeb3Wallet from "./ZondWeb3Wallet";

vi.mock("@/utilities/storageUtil", async () => {
  const originalModule = await vi.importActual<
    typeof import("@/utilities/storageUtil")
  >("@/utilities/storageUtil");
  return {
    ...originalModule,
    getDAppRequestData: vi.fn(async () => ({
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
vi.mock("@/components/ZondWeb3Wallet/RouteMonitor/RouteMonitor", () => ({
  default: () => <div>Mocked Route Monitor</div>,
}));
vi.mock("@/components/ZondWeb3Wallet/ScreenLoader/ScreenLoader", () => ({
  default: () => <div>Mocked Screen Loader</div>,
}));

describe("ZondWeb3Wallet", () => {
  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <ZondWeb3Wallet />
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
