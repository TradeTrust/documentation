import React, { ComponentProps } from "react";
import type DocItemType from "@theme/DocItem";
import DocItem from "@theme-original/DocItem";
import { FeedbackWidget, FeedbackWidgetText } from "@govtechsg/tradetrust-ui-components";
import { gaEvent } from "@govtechsg/tradetrust-utils";

type Props = ComponentProps<typeof DocItemType>;

export default function DocItemWrapper(props: Props): JSX.Element {
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

  // <BrowserOnly fallback={<div>Loading...</div>}>{() => <FeedbackWidgetText />}</BrowserOnly>

  return (
    <>
      <FeedbackWidget>
        <FeedbackWidgetText
          positiveFeedbackUrl={`https://github.com/TradeTrust/documentation/discussions/new?category=ideas&body=Page%20mentioned:%20${pathname}`}
          positiveFeedbackHandle={positiveFeedbackHandle}
          negativeFeedbackUrl={`https://github.com/TradeTrust/documentation/discussions/new?category=improvements&body=Page%20to%20be%20improved:%20${pathname}`}
          negativeFeedbackHandle={negativeFeedbackHandle}
        />
      </FeedbackWidget>
      <DocItem {...props} />
    </>
  );
}
