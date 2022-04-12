import React, { FunctionComponent, useState, useEffect, useCallback } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { FeedbackText } from "./FeedbackText";

type ScrollDirection = "up" | "down";

export const Feedback: FunctionComponent = () => {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>("down");
  const isScrollDown = scrollDirection === "down";
  let scrollTopLast = 0;

  const onScroll = useCallback(() => {
    const scrollTopCurr = document.body.scrollTop || document.documentElement.scrollTop;
    setScrollDirection(scrollTopCurr > scrollTopLast ? "down" : "up");
    scrollTopLast = scrollTopCurr <= 0 ? 0 : scrollTopCurr;
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      className={`transition-all delay-150 duration-200 ease-out fixed text-center text-white rounded-xl p-6 bg-blue z-50 left-4 lg:left-auto lg:right-24 ${
        isScrollDown ? "scale-90 opacity-0" : ""
      }`}
      style={{ bottom: "1.3rem", maxWidth: "220px" }}
      data-testid="feedback"
    >
      <div className="mb-2">
        <svg
          className="mx-auto"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.6956 18.6957H10.0869C5.21737 18.6957 1.30432 14.6957 1.30432 9.91305C1.30432 5.13044 5.13041 1.30435 9.91302 1.30435H10.0869C14.8695 1.30435 18.6956 5.13044 18.6956 9.91305V18.6957Z"
            stroke="white"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.91296 6.17386H13.9999"
            stroke="white"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.91296 9.73904H13.9999"
            stroke="white"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.91296 13.3913H9.08729"
            stroke="white"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h3 className="text-lg">Feedback</h3>
      </div>
      <BrowserOnly fallback={<div>Loading...</div>}>{() => <FeedbackText />}</BrowserOnly>
    </div>
  );
};
