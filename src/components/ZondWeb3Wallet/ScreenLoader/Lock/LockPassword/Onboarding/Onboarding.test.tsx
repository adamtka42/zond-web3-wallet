import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Onboarding from "./Onboarding";

vi.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Lock/LockPassword/Onboarding/Welcome/Welcome",
  () => ({ default: () => <div>Mocked Welcome</div> }),
);
vi.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Lock/LockPassword/Onboarding/LockPasswordSetup/LockPasswordSetup",
  () => ({ default: () => <div>Mocked Lock Password Setup</div> }),
);

describe("Onboarding", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <Onboarding />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the welcome screen as the first step", async () => {
    renderComponent(
      mockedStore({
        lockStore: { encryptAccount: async () => {} },
        zondStore: {
          setActiveAccount: async (_accountAddress: string) => {},
        },
      }),
    );

    expect(screen.getByText("Mocked Welcome")).toBeInTheDocument();
  });
});
