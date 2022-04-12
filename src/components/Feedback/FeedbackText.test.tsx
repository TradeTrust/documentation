import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FeedbackText } from "./FeedbackText";

describe("FeedbackText", () => {
  const windowLocation = window.location;

  beforeEach(() => {
    window.gtag = jest.fn();
    delete window.location;
    window.location = { ...windowLocation, pathname: "/path/to/page" };
  });

  afterEach(() => {
    window.gtag = undefined;
    window.location = windowLocation;
  });

  it("should show default feedback text", () => {
    render(<FeedbackText />);

    expect(screen.getByText("Is this page helpful?")).toBeInTheDocument();
  });

  it("should show 'yes' feedback text with 'ideas' github url", () => {
    render(<FeedbackText />);
    fireEvent.click(screen.getByText("Yes"));

    expect(
      screen.getByText("Thank you for your feedback. Do leave us a feedback on Github to help us do even better.")
    ).toBeInTheDocument();
    expect(screen.getByText("Github")).toHaveAttribute(
      "href",
      "https://github.com/TradeTrust/documentation/discussions/new?category=ideas&body=Page%20mentioned:%20/path/to/page"
    );
  });

  it("should show 'no' feedback text with 'improvements' github url", () => {
    render(<FeedbackText />);
    fireEvent.click(screen.getByText("No"));

    expect(
      screen.getByText("We are sorry to hear that. Do leave us a feedback on Github to help us do better.")
    ).toBeInTheDocument();
    expect(screen.getByText("Github")).toHaveAttribute(
      "href",
      "https://github.com/TradeTrust/documentation/discussions/new?category=improvements&body=Page%20to%20be%20improved:%20/path/to/page"
    );
  });
});
