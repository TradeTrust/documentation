import React, { ComponentProps } from "react";
import type DocItemType from "@theme/DocItem";
import DocItem from "@theme-original/DocItem";
import { Feedback } from "./../../components/Feedback";

type Props = ComponentProps<typeof DocItemType>;

export default function DocItemWrapper(props: Props): JSX.Element {
  return (
    <>
      <Feedback />
      <DocItem {...props} />
    </>
  );
}
