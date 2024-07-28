import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  BlockNoteEditor,
  BlockNoteSchema,
  defaultInlineContentSpecs,
  filterSuggestionItems,
} from "@blocknote/core";
import {
  DefaultReactSuggestionItem,
  SuggestionMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { useOthers, useRoom, useSelf } from "@liveblocks/react/suspense";
import { BlockNoteView } from "@blocknote/mantine";

import "@blocknote/mantine/style.css";
import "@blocknote/core/style.css";
import { CommentsButton } from "./comments-button";
import { Mention } from "./mention";

interface CollaborativeEditorProps {
  roomId: string;
  currentType: UserType;
}
type EditorProps = {
  doc: Y.Doc;
  provider: any;
  currentType: UserType;
};

const schema = BlockNoteSchema.create({
  inlineContentSpecs: {
    // Adds all default inline content.
    ...defaultInlineContentSpecs,
    // Adds the mention tag.
    mention: Mention,
  },
});

const getMentionMenuItems = (
  editor: typeof schema.BlockNoteEditor,
  others: CollaborativeUser[]
): DefaultReactSuggestionItem[] => {
  return others.map((other) => ({
    group: "Mentions",
    title: other.name,
    onItemClick: () => {
      editor.insertInlineContent([
        {
          type: "mention",
          props: {
            user: other.name,
          },
        },
        " ", // add a space after the mention
      ]);
    },
  }));
};

export const CollaborativeEditor = ({
  roomId,
  currentType,
}: CollaborativeEditorProps) => {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<any>();

  // Set up Liveblocks Yjs provider
  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);
    setDoc(yDoc);
    setProvider(yProvider);

    return () => {
      yDoc?.destroy();
      yProvider?.destroy();
    };
  }, [room]);

  if (!doc || !provider) {
    return null;
  }

  return <BlockNote doc={doc} provider={provider} currentType={currentType} />;
};

const BlockNote = ({ doc, provider, currentType }: EditorProps) => {
  const { theme } = useTheme();

  // Get user info from Liveblocks authentication endpoint
  const userInfo = useSelf((me) => me.info);
  const others = useOthers().map((other) => other.info);

  const editor = useCreateBlockNote({
    schema,
    collaboration: {
      provider,

      // Where to store BlockNote data in the Y.Doc:
      fragment: doc.getXmlFragment("document-store"),

      // Information for this user:
      user: {
        name: userInfo?.name,
        color: userInfo?.color,
      },
    },
  });

  return (
    <BlockNoteView
      editor={editor}
      theme={theme === "dark" ? "dark" : "light"}
      // formattingToolbar={false}
      editable={currentType === "editor"}
    >
      {/* Adds a mentions menu which opens with the "@" key */}
      <SuggestionMenuController
        triggerCharacter={"@"}
        getItems={async (query) =>
          // Gets the mentions menu items
          filterSuggestionItems(getMentionMenuItems(editor, others), query)
        }
      />
    </BlockNoteView>
  );
};
