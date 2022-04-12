import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Feedback } from "./Feedback";

describe("Feedback", () => {
  it("should have correct feedback title", () => {
    render(<Feedback />);
    expect(screen.getByText("Feedback")).toBeInTheDocument();
  });

  it("should not show feedback by default", () => {
    render(<Feedback />);
    expect(screen.getByTestId("feedback")).toHaveClass("opacity-0");
  });

  it("should only show feedback when scrolled up", () => {
    render(<Feedback />);

    act(() => {
      fireEvent.scroll(window, { target: { scrollY: 100 } });
      expect(screen.getByTestId("feedback")).toHaveClass("opacity-0");
    });

    act(() => {
      fireEvent.scroll(window, { target: { scrollY: 99 } });
      expect(screen.getByTestId("feedback")).not.toHaveClass("opacity-0");
    });
  });
});
