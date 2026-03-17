import { mockedStore } from "@/__mocks__/mockedStore";
import { StoreProvider } from "@/stores/store";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NFTCollections from "./NFTCollections";

const mockGetNFTCollectionsList = jest.fn<any>().mockResolvedValue([]);

jest.mock("@/utilities/storageUtil", () => ({
  __esModule: true,
  default: {
    getNFTCollectionsList: (...args: any[]) =>
      mockGetNFTCollectionsList(...args),
  },
}));

jest.mock("./NFTCollectionItem/NFTCollectionItem", () => {
  const MockItem = ({ contractAddress }: { contractAddress: string }) => (
    <div data-testid={`collection-${contractAddress}`}>{contractAddress}</div>
  );
  MockItem.displayName = "MockNFTCollectionItem";
  return { __esModule: true, default: MockItem };
});

describe("NFTCollections", () => {
  afterEach(() => {
    cleanup();
    mockGetNFTCollectionsList.mockReset();
  });

  const renderComponent = (overrides = {}) =>
    render(
      <StoreProvider value={mockedStore(overrides)}>
        <MemoryRouter>
          <NFTCollections />
        </MemoryRouter>
      </StoreProvider>,
    );

  it("should render nothing when no collections stored", async () => {
    mockGetNFTCollectionsList.mockResolvedValue([]);
    const { container } = renderComponent();

    await waitFor(() => {
      expect(
        container.querySelectorAll("[data-testid^='collection-']"),
      ).toHaveLength(0);
    });
  });

  it("should render collection items", async () => {
    mockGetNFTCollectionsList.mockResolvedValue([
      {
        address: "0xABC",
        name: "Col1",
        symbol: "C1",
        standard: "ZRC721",
        image: "",
      },
      {
        address: "0xDEF",
        name: "Col2",
        symbol: "C2",
        standard: "ZRC721",
        image: "",
      },
    ]);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("collection-0xABC")).toBeInTheDocument();
      expect(screen.getByTestId("collection-0xDEF")).toBeInTheDocument();
    });
  });

  it("should respect the display limit of 4", async () => {
    const collections = Array.from({ length: 6 }, (_, i) => ({
      address: `0x${i}`,
      name: `Col${i}`,
      symbol: `C${i}`,
      standard: "ZRC721" as const,
      image: "",
    }));
    mockGetNFTCollectionsList.mockResolvedValue(collections);

    const { container } = renderComponent();

    await waitFor(() => {
      expect(
        container.querySelectorAll("[data-testid^='collection-']"),
      ).toHaveLength(4);
    });
  });
});
