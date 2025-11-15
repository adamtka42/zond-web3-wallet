import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LockPassword from "./LockPassword";

jest.mock("webextension-polyfill", () => {
  const originalModule = jest.requireActual<
    typeof import("webextension-polyfill")
  >("webextension-polyfill");
  return {
    ...originalModule,
    tabs: {
      ...originalModule.tabs,
      create: jest.fn(),
    },
    runtime: {
      ...originalModule.runtime,
      getURL: jest.fn().mockReturnValue("chrome-extension://id/index.html"),
    },
  };
});
jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Lock/LockPassword/Onboarding/Onboarding",
  () => () => <div>Mocked Onboarding</div>,
);
jest.mock(
  "@/components/ZondWeb3Wallet/ScreenLoader/Lock/LockPassword/LockPasswordCheck/LockPasswordCheck",
  () => () => <div>Mocked Lock Password Check</div>,
);

describe("LockPassword", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <LockPassword />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the onboarding screen if the password has not been set", async () => {
    renderComponent(
      mockedStore({
        lockStore: { hasPasswordSet: false, isLocked: true },
        settingsStore: { isPopupWindow: false },
      }),
    );

    await waitFor(() => {
      expect(screen.getByText("Mocked Onboarding")).toBeInTheDocument();
      expect(
        screen.queryByText("Mocked Lock Password Check"),
      ).not.toBeInTheDocument();
    });
  });

  it("should render the lock password check screen if the password was set", async () => {
    renderComponent(
      mockedStore({
        lockStore: { hasPasswordSet: true, isLocked: true },
        settingsStore: { isPopupWindow: false },
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByText("Mocked Lock Password Check"),
      ).toBeInTheDocument();
      expect(screen.queryByText("Mocked Onboarding")).not.toBeInTheDocument();
    });
  });
});
