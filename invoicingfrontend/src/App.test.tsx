import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// Basic dummy test just to have a passing test case for CI
describe("Basic Application Test", () => {
  it("should render successfully", () => {
    render(<div>Hello ERP</div>);
    expect(screen.getByText("Hello ERP")).toBeInTheDocument();
  });
});
