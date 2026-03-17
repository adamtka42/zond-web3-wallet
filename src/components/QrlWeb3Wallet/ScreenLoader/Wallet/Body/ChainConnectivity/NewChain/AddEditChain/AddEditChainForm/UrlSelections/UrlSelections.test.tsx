import { mockedStore } from "@/__mocks__/mockedStore";
import { TooltipProvider } from "@/components/UI/Tooltip";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import UrlSelections from "./UrlSelections";

vi.mock(
  "@/components/QrlWeb3Wallet/ScreenLoader/Wallet/Body/ChainConnectivity/NewChain/AddEditChain/AddEditChainForm/UrlSelections/AddUrlItem/AddUrlItem",
  () => ({ default: () => <div>Mocked Add Url Item</div> }),
);

describe("UrlSelections", () => {
  const mockedPropsData = {
    title: "Test title",
    urls: ["http://testUrl1"],
    setUrls: () => {},
    defaultUrl: "http://testUrl1",
    setDefaultUrl: () => {},
    canBeEmpty: true,
  };

  afterEach(cleanup);

  const renderComponent = (
    mockedStoreValues = mockedStore(),
    mockedProps: ComponentProps<typeof UrlSelections> = mockedPropsData,
  ) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter>
          <TooltipProvider>
            <UrlSelections {...mockedProps} />
          </TooltipProvider>
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the url selections component", () => {
    renderComponent();

    expect(screen.getByText("Test title")).toBeInTheDocument();
    expect(screen.getByText("Mocked Add Url Item")).toBeInTheDocument();
    expect(screen.getByText("http://testUrl1")).toBeInTheDocument();
    const setDefaultButton = screen.getByRole("button", {
      name: "Default URL",
    });
    expect(setDefaultButton).toBeInTheDocument();
    expect(setDefaultButton).toBeEnabled();
    const deleteUrlButton = screen.getByRole("button", {
      name: "Delete URL",
    });
    expect(deleteUrlButton).toBeInTheDocument();
    expect(deleteUrlButton).toBeEnabled();
  });

  it("should call setDefaultUrl on clicking the default url button", async () => {
    const mockedSetDefaultUrl = vi.fn(() => {});
    renderComponent(mockedStore(), {
      ...mockedPropsData,
      setDefaultUrl: mockedSetDefaultUrl,
    });

    const setDefaultButton = screen.getByRole("button", {
      name: "Default URL",
    });
    expect(setDefaultButton).toBeEnabled();
    await userEvent.click(setDefaultButton);
    expect(mockedSetDefaultUrl).toHaveBeenCalledTimes(1);
    expect(mockedSetDefaultUrl).toHaveBeenCalledWith("http://testUrl1");
  });

  it("should call setUrls with updated list on clicking the delete url button", async () => {
    const mockedSetUrls = vi.fn(() => {});
    renderComponent(mockedStore(), {
      ...mockedPropsData,
      urls: ["http://testUrl1", "http://testUrl2", "http://testUrl3"],
      setUrls: mockedSetUrls,
    });

    const deleteUrlButton = screen.getAllByRole("button", {
      name: "Delete URL",
    })[0];
    expect(deleteUrlButton).toBeEnabled();
    await userEvent.click(deleteUrlButton);
    expect(mockedSetUrls).toHaveBeenCalledTimes(1);
    const expectedUpdatedUrlList = ["http://testUrl2", "http://testUrl3"];
    expect(mockedSetUrls).toHaveBeenCalledWith(expectedUpdatedUrlList);
  });
});
