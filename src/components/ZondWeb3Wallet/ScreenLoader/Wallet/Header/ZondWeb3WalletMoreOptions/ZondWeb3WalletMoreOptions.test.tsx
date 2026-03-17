import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ZondWeb3WalletMoreOptions from "./ZondWeb3WalletMoreOptions";
import userEvent from "@testing-library/user-event";
import browser from "webextension-polyfill";

vi.setConfig({ testTimeout: 15000 });

vi.mock("webextension-polyfill", async () => {
  const originalModule: any = await vi.importActual("webextension-polyfill");
  return {
    ...originalModule,
    default: {
      ...originalModule.default,
      tabs: {
        ...originalModule.default?.tabs,
        create: vi.fn(),
      },
      runtime: {
        ...originalModule.default?.runtime,
        getURL: vi.fn().mockReturnValue("chrome-extension://id/index.html"),
      },
    },
  };
});

describe("ZondWeb3WalletMoreOptions", () => {
  afterEach(cleanup);

  const renderComponent = (mockedStoreValues = mockedStore()) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <ZondWeb3WalletMoreOptions />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the zond web3 wallet more options component", async () => {
    renderComponent(
      mockedStore({
        lockStore: { lock: async () => {} },
        settingsStore: { isPopupWindow: true },
      }),
    );

    const moreButton = screen.getByTestId("ellipsis-icon");
    await userEvent.click(moreButton);
    const openInTabButton = screen.getByRole("button", { name: "Open in tab" });
    expect(openInTabButton).toBeInTheDocument();
    expect(openInTabButton).toBeEnabled();
    const lockWalletButton = screen.getByRole("button", {
      name: "Lock Wallet",
    });
    expect(lockWalletButton).toBeInTheDocument();
    expect(lockWalletButton).toBeEnabled();
  });

  it("should hide the open in tab button if the extension is already in tab", async () => {
    renderComponent(
      mockedStore({
        lockStore: { lock: async () => {} },
        settingsStore: { isPopupWindow: false },
      }),
    );

    const moreButton = screen.getByTestId("ellipsis-icon");
    await userEvent.click(moreButton);
    const openInTabButton = screen.queryByRole("button", {
      name: "Open in tab",
    });
    expect(openInTabButton).not.toBeInTheDocument();
    const lockWalletButton = screen.getByRole("button", {
      name: "Lock Wallet",
    });
    expect(lockWalletButton).toBeInTheDocument();
    expect(lockWalletButton).toBeEnabled();
  });

  it("should call the tabs.create function on clicking the open in tab button", async () => {
    renderComponent(
      mockedStore({
        lockStore: { lock: async () => {} },
        settingsStore: { isPopupWindow: true },
      }),
    );

    const moreButton = screen.getByTestId("ellipsis-icon");
    await userEvent.click(moreButton);
    const openInTabButton = screen.getByRole("button", {
      name: "Open in tab",
    });
    expect(openInTabButton).toBeInTheDocument();
    expect(openInTabButton).toBeEnabled();
    await userEvent.click(openInTabButton);
    expect(browser.tabs.create).toHaveBeenCalledTimes(1);
  });

  it("should render the Contacts menu item", async () => {
    renderComponent(
      mockedStore({
        lockStore: { lock: async () => {} },
        settingsStore: { isPopupWindow: true },
      }),
    );

    const moreButton = screen.getByTestId("ellipsis-icon");
    await userEvent.click(moreButton);
    const contactsButton = screen.getByRole("button", { name: "Contacts" });
    expect(contactsButton).toBeInTheDocument();
    expect(contactsButton).toBeEnabled();
  });

  it("should call the lock function on clicking the lock button", async () => {
    const mockedLock = vi.fn(async () => {});
    renderComponent(
      mockedStore({
        lockStore: { lock: mockedLock },
        settingsStore: { isPopupWindow: true },
      }),
    );

    const moreButton = screen.getByTestId("ellipsis-icon");
    await userEvent.click(moreButton);
    const lockWalletButton = screen.getByRole("button", {
      name: "Lock Wallet",
    });
    expect(lockWalletButton).toBeInTheDocument();
    expect(lockWalletButton).toBeEnabled();
    await userEvent.click(lockWalletButton);
    expect(mockedLock).toHaveBeenCalledTimes(1);
  });
});
