import React from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { FeedbackWidget, FeedbackWidgetText } from "@govtechsg/tradetrust-ui-components";
import { gaEvent } from "@govtechsg/tradetrust-utils/dist/esm/analytics";

export const Feedback: React.FunctionComponent = () => {
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
    <FeedbackWidget>
      <BrowserOnly fallback={<div>Loading...</div>}>
        {() => (
          <FeedbackWidgetText
            positiveFeedbackUrl={`https://github.com/TradeTrust/documentation/discussions/new?category=ideas&body=Page%20mentioned:%20${pathname}`}
            positiveFeedbackHandle={positiveFeedbackHandle}
            negativeFeedbackUrl={`https://github.com/TradeTrust/documentation/discussions/new?category=improvements&body=Page%20to%20be%20improved:%20${pathname}`}
            negativeFeedbackHandle={negativeFeedbackHandle}
          />
        )}
      </BrowserOnly>
    </FeedbackWidget>
  );
};
