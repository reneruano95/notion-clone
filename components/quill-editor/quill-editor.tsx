"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";

import { useId } from "@/lib/hooks/useId";
import { useAppsStore } from "@/lib/providers/store-provider";
import { Tables } from "@/lib/supabase/supabase.types";
import { EditorWrapper } from "./editor-wrapper";

interface QuillEditorProps {
  dirDetails: Tables<"workspaces"> | Tables<"folders"> | Tables<"files">;
  dirType: "workspace" | "folder" | "file";
  actualDirId: string;
}

const TOOLBAR_OPTIONS = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],
  ["link", "image", "video", "formula"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"], // remove formatting button
];

export const QuillEditor = ({
  dirDetails,
  dirType,
  actualDirId,
}: QuillEditorProps) => {
  const { workspaceId, folderId } = useId();
  const { appWorkspaces } = useAppsStore((store) => store);

  const [quill, setQuill] = useState<any>(null);

  const [saving, startTransition] = useTransition();

  const details = useMemo(() => {
    let selectedDirDetails;

    if (dirType === "workspace") {
      selectedDirDetails = appWorkspaces.find(
        (workspace) => workspace.id === workspaceId
      );
    }

    if (dirType === "folder") {
      selectedDirDetails = appWorkspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.find((folder) => folder.id === folderId);
    }

    if (dirType === "file") {
      selectedDirDetails = appWorkspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.find((folder) => folder.id === folderId)
        ?.files.find((file) => file.id === actualDirId);
    }

    if (selectedDirDetails) return selectedDirDetails;

    return {
      title: dirDetails.title,
      emoji: dirDetails.emoji,
      created_at: dirDetails.created_at,
      data: dirDetails.data,
      in_trash: dirDetails.in_trash,
      banner_url: dirDetails.banner_url,
    } as Tables<"workspaces"> | Tables<"folders"> | Tables<"files">;
  }, [appWorkspaces, workspaceId, folderId, actualDirId, dirType]);

  const wrapperRef = useCallback(async (wrapper: any) => {
    if (typeof window !== "undefined") {
      if (wrapper === null) return;

      wrapper.innerHTML = "";
      const editor = document.createElement("div");

      wrapper.append(editor);
      const Quill = (await import("quill")).default;

      //WIP cursors
      const q = new Quill(editor, {
        theme: "snow",
        modules: {
          toolbar: TOOLBAR_OPTIONS,
          // TODO: Add cursors
        },
      });

      setQuill(q);
    }
  }, []);

  return (
    <>
      <EditorWrapper
        actualDirId={actualDirId}
        details={details}
        dirType={dirType}
        saving={saving}
      >
        <div className="flex justify-center items-center flex-col mt-2 relative">
          <div id="container" ref={wrapperRef} className="max-w-[800px]"></div>
        </div>
      </EditorWrapper>
    </>
  );
};
