import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DAppRequestWebsite from "./DAppRequestWebsite";

vi.mock(
  "@/components/QrlWeb3Wallet/ScreenLoader/DAppRequest/DAppRequestContentSelection/PermissionRequiredContent/DAppRequestWebsite/DAppRequestFeature/DAppRequestFeature",
  () => ({ default: () => <div>Mocked DApp Request Feature</div> }),
);

describe("DAppRequestWebsite", () => {
  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <DAppRequestWebsite />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the dapp request website component", () => {
    renderComponent();

    expect(screen.getByText("http://localhost")).toBeInTheDocument();
    expect(screen.getByText("Mocked Page Title")).toBeInTheDocument();
    expect(screen.getByText("Mocked DApp Request Feature")).toBeInTheDocument();
  });
});
