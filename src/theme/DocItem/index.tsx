import React, { ComponentProps } from "react";
import type DocItemType from "@theme/DocItem";
import DocItem from "@theme-original/DocItem";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { FeedbackWidget, FeedbackWidgetText } from "@govtechsg/tradetrust-ui-components";
import { gaEvent } from "@govtechsg/tradetrust-utils/dist/esm/analytics";

type Props = ComponentProps<typeof DocItemType>;

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

export default function DocItemWrapper(props: Props): JSX.Element {
  return (
    <>
      <FeedbackWidget>
        <BrowserOnly fallback={<div>Loading...</div>}>{() => <FeedbackWidgetTextWrapper />}</BrowserOnly>
      </FeedbackWidget>
      <DocItem {...props} />
    </>
  );
}
