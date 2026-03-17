import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it } from "@jest/globals";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NFTTransfer from "./NFTTransfer";

const defaultState = {
  contractAddress: "Q20B714091cF2a62DADda2847803e3f1B9D2D3779",
  tokenId: "7",
  collectionName: "TestNFT",
  imageUrl: "https://example.com/nft.png",
  nftName: "Cool Token #7",
};

describe("NFTTransfer", () => {
  afterEach(cleanup);

  const renderComponent = (
    state = defaultState,
    mockedStoreValues = mockedStore(),
  ) =>
    render(
      <StoreProvider value={mockedStoreValues}>
        <MemoryRouter
          initialEntries={[{ pathname: "/nft-transfer", state }]}
        >
          <NFTTransfer />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render the send NFT heading", () => {
    renderComponent();
    expect(screen.getByRole("heading", { name: "Send NFT" })).toBeInTheDocument();
  });

  it("should display NFT name and token ID", () => {
    renderComponent();
    expect(screen.getByText("Cool Token #7")).toBeInTheDocument();
    expect(screen.getByText("Token #7")).toBeInTheDocument();
  });

  it("should render receiver address input", () => {
    renderComponent();
    const input = screen.getByRole("textbox", { name: "receiverAddress" });
    expect(input).toBeInTheDocument();
  });

  it("should render cancel and send buttons", () => {
    renderComponent();
    expect(
      screen.getByRole("button", { name: /cancel/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Send NFT").length).toBeGreaterThanOrEqual(1);
  });

  it("should render address book button", () => {
    renderComponent();
    expect(
      screen.getByRole("button", { name: /address book/i }),
    ).toBeInTheDocument();
  });

  it("should render NFT image when provided", () => {
    renderComponent();
    const img = screen.getByAltText("Cool Token #7");
    expect(img).toHaveAttribute("src", "https://example.com/nft.png");
  });

  it("should show fallback when no image URL", () => {
    renderComponent({
      ...defaultState,
      imageUrl: "",
      nftName: "",
    });
    expect(screen.getByText("TestNFT #7")).toBeInTheDocument();
  });

  it("should have a back button", () => {
    renderComponent();
    expect(screen.getByTestId("backButtonTestId")).toBeInTheDocument();
  });

  it("should have send button disabled when form is empty", () => {
    renderComponent();
    const sendButtons = screen.getAllByRole("button");
    const sendButton = sendButtons.find(
      (btn) => btn.textContent?.includes("Send NFT") && btn.getAttribute("type") !== "button",
    );
    expect(sendButton).toBeDisabled();
  });
});
