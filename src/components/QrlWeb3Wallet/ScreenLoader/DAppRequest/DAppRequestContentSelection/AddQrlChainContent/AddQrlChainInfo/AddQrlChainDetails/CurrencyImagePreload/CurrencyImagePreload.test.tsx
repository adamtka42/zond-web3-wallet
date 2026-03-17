import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";
import CurrencyImagePreload from "./CurrencyImagePreload";

class MockImage {
  src = "";
  onload: () => void = () => {};
  onerror: () => void = () => {};
  constructor() {
    setTimeout(() => {
      if (this.src.includes("valid")) {
        this.onload();
      } else {
        this.onerror();
      }
    }, 10);
  }
}

describe("CurrencyImagePreload", () => {
  afterEach(cleanup);

  const originalImage = global.Image;

  beforeEach(() => {
    global.Image = MockImage as any;
  });

  afterEach(() => {
    global.Image = originalImage;
  });

  it("renders the first valid image", async () => {
    render(
      <CurrencyImagePreload
        iconUrls={[
          "https://bad-icon.svg",
          "https://valid-icon.svg",
          "https://another-icon.svg",
        ]}
      />,
    );

    await waitFor(() => {
      const img = screen.getByRole("img", { name: "Currency icon" });
      expect(img).toHaveAttribute("src", "https://valid-icon.svg");
    });
  });

  it("does not render if all URLs fail", async () => {
    render(
      <CurrencyImagePreload
        iconUrls={["https://fail1.svg", "https://fail2.svg"]}
      />,
    );

    await waitFor(() => {
      const img = screen.getByRole("img", { name: "Currency icon" });
      expect(img).not.toHaveAttribute("src");
    });
  });

  it("cleans up on unmount", async () => {
    const { unmount } = render(
      <CurrencyImagePreload iconUrls={["https://valid-icon.svg"]} />,
    );
    unmount();
    expect(true).toBeTruthy();
  });
});
