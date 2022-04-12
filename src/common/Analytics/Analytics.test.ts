import { validateGaEvent, gaEvent } from "./Analytics";

const consoleSpy = jest.spyOn(console, "error");
const mockGaEvent = {
  action: "TEST_ACTION",
  category: "TEST_CATEGORY",
  label: "TEST_LABEL",
  value: 2,
};

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("validateGaEvent", () => {
  it("throws if category is missing", () => {
    // @ts-expect-error we expect this error to be thrown
    validateGaEvent({
      action: "feedback_yes",
    });
    expect(consoleSpy).toBeCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith("Category is required");
  });

  it("throws if action is missing", () => {
    // @ts-expect-error we expect this error to be thrown
    validateGaEvent({
      category: "feedback",
    });
    expect(consoleSpy).toBeCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith("Action is required");
  });

  it("throws if value is not number", () => {
    // @ts-expect-error we expect this error to be thrown
    validateGaEvent({ category: "feedback", action: "feedback_yes", value: "STRING" });
    expect(consoleSpy).toBeCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith("Value must be a number");
  });

  it("passes for minimum values", () => {
    validateGaEvent({
      category: "feedback",
      action: "feedback_yes",
      label: undefined,
      value: undefined,
    });
    expect(true).toBe(true);
  });

  it("passes for all values", () => {
    validateGaEvent({
      category: "feedback",
      action: "feedback_yes",
      label: "location pathname",
      value: 2,
    });
    expect(true).toBe(true);
  });
});

describe("gaEvent", () => {
  beforeEach(() => {
    window.gtag = jest.fn();
  });

  afterEach(() => {
    window.gtag = undefined;
  });

  it("does not fail if gtag is not present", () => {
    gaEvent(mockGaEvent as any);
    expect(true).toBe(true);
  });

  it("sends and log gtag event if window.gtag is present", () => {
    // @ts-expect-error the mock does not match the signature
    gaEvent(mockGaEvent);
    expect(window.gtag).toBeCalledTimes(1);
    expect(window.gtag).toHaveBeenCalledWith("event", "TEST_ACTION", {
      event_category: "TEST_CATEGORY",
      event_label: "TEST_LABEL",
      value: 2,
    });
  });

  it("throws if there is a validation error", () => {
    const mockGaEventError = { ...mockGaEvent, value: "STRING" };
    // @ts-expect-error the mock does not match the signature
    gaEvent(mockGaEventError);
    expect(consoleSpy).toBeCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith("Value must be a number");
  });
});
