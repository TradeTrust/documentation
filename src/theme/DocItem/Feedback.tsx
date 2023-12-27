import React from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { FeedbackWidget, FeedbackWidgetText } from "@tradetrust-tt/tradetrust-ui-components";
import { gaEvent } from "@tradetrust-tt/tradetrust-utils";

const FeedbackWidgetTextWrapper: React.FunctionComponent = () => {
  const pathname = location.pathname;

  const positiveFeedbackHandle = () => {
    gaEvent({
      action: "feedback_yes",
      category: "feedback",
      label: pathname,
    });
  };

  const negativeFeedbackHandle = () => {
    gaEvent({
      action: "feedback_no",
      category: "feedback",
      label: pathname,
    });
  };

  return (
    <FeedbackWidgetText
      positiveFeedbackUrl={`https://github.com/TradeTrust/documentation/discussions/new?category=ideas&body=Page%20mentioned:%20${pathname}`}
      positiveFeedbackHandle={positiveFeedbackHandle}
      negativeFeedbackUrl={`https://github.com/TradeTrust/documentation/discussions/new?category=improvements&body=Page%20to%20be%20improved:%20${pathname}`}
      negativeFeedbackHandle={negativeFeedbackHandle}
    />
  );
};

export const Feedback: React.FunctionComponent = () => {
  return (
    <FeedbackWidget>
      <BrowserOnly fallback={<div>Loading...</div>}>{() => <FeedbackWidgetTextWrapper />}</BrowserOnly>
    </FeedbackWidget>
  );
};
