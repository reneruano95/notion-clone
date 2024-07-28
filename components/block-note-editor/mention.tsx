import { createReactInlineContentSpec } from "@blocknote/react";
import { useOthers } from "@liveblocks/react/suspense";

// The Mention inline content.
export const Mention = createReactInlineContentSpec(
  {
    type: "mention",
    propSchema: {
      user: {
        default: "Unknown",
      },
    },
    content: "none",
  },
  {
    render: (props) => {
      const others = useOthers().map((other) => other.info);

      return (
        <span
          style={{
            backgroundColor: others.find(
              (other) => other.name === props.inlineContent.props.user
            )?.color,
          }}
        >
          @{props.inlineContent.props.user}
        </span>
      );
    },
  }
);
