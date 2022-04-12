import React, { FunctionComponent, useState, useEffect } from "react";
import { gaEvent } from "../../common/Analytics";

type Feedback = "yes" | "no";

export const FeedbackText: FunctionComponent = () => {
  const [feedback, setFeedback] = useState<Feedback>(null);
  const pathname = location.pathname;

  useEffect(() => {
    if (feedback === "yes") {
      gaEvent({
        action: "feedback_yes",
        category: "feedback",
        label: pathname,
      });
    }

    if (feedback === "no") {
      gaEvent({
        action: "feedback_no",
        category: "feedback",
        label: pathname,
      });
    }
  }, [feedback]);

  switch (true) {
    case feedback === "yes":
      return (
        <>
          <p>Thank you for your feedback. Do leave us a feedback on Github to help us do even better.</p>
          <div className="mt-4">
            <a
              className="btn bg-white text-blue hover:bg-white hover:text-black mx-2"
              href={`https://github.com/TradeTrust/documentation/discussions/new?category=ideas&body=Page%20mentioned:%20${pathname}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Github
            </a>
          </div>
        </>
      );
    case feedback === "no":
      return (
        <>
          <p>We are sorry to hear that. Do leave us a feedback on Github to help us do better.</p>
          <div className="mt-4">
            <a
              className="btn bg-white text-blue hover:bg-white hover:text-black mx-2"
              href={`https://github.com/TradeTrust/documentation/discussions/new?category=improvements&body=Page%20to%20be%20improved:%20${pathname}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Github
            </a>
          </div>
        </>
      );
    default:
      return (
        <>
          <p>Is this page helpful?</p>
          <div className="mt-4">
            <button
              className="btn bg-white text-blue hover:bg-white hover:text-black mx-2"
              onClick={() => {
                setFeedback("yes");
              }}
            >
              Yes
            </button>
            <button
              className="btn bg-white text-blue hover:bg-white hover:text-black mx-2"
              onClick={() => {
                setFeedback("no");
              }}
            >
              No
            </button>
          </div>
        </>
      );
  }
};
