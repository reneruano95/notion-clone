import { useState } from "react";
import {
  useBlockNoteEditor,
  useComponentsContext,
  useEditorContentOrSelectionChange,
} from "@blocknote/react";

import "@blocknote/mantine/style.css";

export const CommentsButton = () => {
  const editor = useBlockNoteEditor();
  const Components = useComponentsContext()!;

  const [isSelected, setIsSelected] = useState<boolean>(
    editor.getActiveStyles().textColor === "blue" &&
      editor.getActiveStyles().backgroundColor === "blue"
  );

  useEditorContentOrSelectionChange(() => {
    setIsSelected(
      editor.getActiveStyles().textColor === "blue" &&
        editor.getActiveStyles().backgroundColor === "blue"
    );
  }, editor);

  return (
    <Components.FormattingToolbar.Button
      mainTooltip={"Blue Text & Background"}
      onClick={() => {
        editor.toggleStyles({
          textColor: "blue",
          backgroundColor: "blue",
        });
      }}
      isSelected={isSelected}
    >
      Comments
    </Components.FormattingToolbar.Button>
  );
};
