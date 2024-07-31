import { createReactStyleSpec } from "@blocknote/react";

export const CommentHighlight = createReactStyleSpec(
  {
    type: "commentHighlight",
    propSchema: "string",
  },
  {
    render: ({ contentRef, value }) => (
      <mark data-highlight-id={value} ref={contentRef} />
    ),
  }
);
