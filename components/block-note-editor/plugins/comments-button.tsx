import { useCallback, useState } from "react";
import { MessagesSquare } from "lucide-react";
import {
  useBlockNoteEditor,
  useComponentsContext,
  useEditorContentOrSelectionChange,
} from "@blocknote/react";
import { v4 as uuidv4 } from "uuid";

import "@blocknote/mantine/style.css";

export const CommentsButton = () => {
  const editor = useBlockNoteEditor();
  const Components = useComponentsContext()!;

  const handleClick = useCallback(async () => {
    editor._tiptapEditor
      .chain()
      .focus()
      .setCommentHighlight({
        highlightId: uuidv4(),
        state: "composing",
      })
      .run();
  }, [editor]);

  return (
    <Components.FormattingToolbar.Button
      mainTooltip={"Comments"}
      onClick={() => {
        handleClick();
      }}
      label="Comments"
      secondaryTooltip="Add a comment"
      icon={<MessagesSquare size={18} />}
      isDisabled={editor._tiptapEditor.isActive("commentHighlight")}
    />
  );
};
