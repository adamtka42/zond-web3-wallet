import App from "@/App";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";

describe("App", () => {
  it("should render the application", () => {
    render(<App />);

    expect(document.body).toBeInTheDocument();
  });
});
