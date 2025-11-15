import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Onboarding from "./Onboarding";

jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Lock/LockPassword/Onboarding/Welcome/Welcome",
  () => () => <div>Mocked Welcome</div>,
);
jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Lock/LockPassword/Onboarding/LockPasswordSetup/LockPasswordSetup",
  () => () => <div>Mocked Lock Password Setup</div>,
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
          setActiveAccount: async (accountAddress: string) => {
            accountAddress;
          },
        },
      }),
    );

    expect(screen.getByText("Mocked Welcome")).toBeInTheDocument();
  });
});
