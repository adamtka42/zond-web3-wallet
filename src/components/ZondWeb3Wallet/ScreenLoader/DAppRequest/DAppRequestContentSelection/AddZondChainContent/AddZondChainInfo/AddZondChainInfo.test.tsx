import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AddZondChainInfo from "./AddZondChainInfo";

vi.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/DAppRequest/DAppRequestContentSelection/AddZondChainContent/AddZondChainInfo/AddZondChainDetails/AddZondChainDetails",
  () => ({ default: () => <div>Mocked Add Zond Chain Details</div> }),
);
vi.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/DAppRequest/DAppRequestContentSelection/AddZondChainContent/AddZondChainInfo/AddZondChainAlert/AddZondChainAlert",
  () => ({ default: () => <div>Mocked Add Zond Chain Alert</div> }),
);

describe("AddZondChainInfo", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <AddZondChainInfo />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the add zond chain content component", () => {
    renderComponent();

    expect(
      screen.getByText("Mocked Add Zond Chain Details"),
    ).toBeInTheDocument();
    expect(screen.getByText("Mocked Add Zond Chain Alert")).toBeInTheDocument();
  });
});
