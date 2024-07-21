"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { useId } from "@/lib/hooks/useId";
import { useAppsStore } from "@/lib/providers/store-provider";
import { Tables } from "@/lib/supabase/supabase.types";
import { Button } from "../ui/button";

import {
  updateFile as updateFileAction,
  deleteFile as deleteFileAction,
  restoreFiles,
  restoreFilesFromTrash,
} from "@/lib/server-actions/file-actions";
import {
  updateFolder as updateFolderAction,
  deleteFolder as deleteFolderAction,
} from "@/lib/server-actions/folder-actions";

import "quill/dist/quill.snow.css";

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
  const router = useRouter();
  const { workspaceId, folderId } = useId();
  const {
    appWorkspaces,
    updateFile,
    deleteFile,
    deleteFolder,
    restoreFolderFromTrash,
  } = useAppsStore((store) => store);

  const [quill, setQuill] = useState<any>(null);

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

  const restoreFileHandler = async () => {
    if (dirType === "file") {
      if (!workspaceId || !folderId) return;
      updateFile(workspaceId, folderId, actualDirId, {
        in_trash: "",
      });
      await updateFileAction(
        {
          in_trash: "",
        },
        actualDirId
      );

      toast.success("File restored successfully");
    }

    if (dirType === "folder") {
      if (!folderId || !workspaceId) return;

      restoreFolderFromTrash(workspaceId, folderId, actualDirId);
      await updateFolderAction(
        {
          in_trash: "",
        },
        folderId as string
      );
      await restoreFilesFromTrash(folderId);

      toast.success("Folder and its files restored successfully");
    }
  };

  const deleteFileHandler = async () => {
    if (dirType === "file") {
      if (!workspaceId || !folderId) return;

      deleteFile(workspaceId, folderId, actualDirId);
      await deleteFileAction(actualDirId);

      toast.success("File deleted successfully");
      router.replace(`/dashboard/${workspaceId}/`);
    }

    if (dirType === "folder") {
      if (!folderId || !workspaceId) return;

      deleteFolder(workspaceId, folderId);
      await deleteFolderAction(folderId);

      toast.success("Folder  and its files deleted successfully");
      router.replace(`/dashboard/${workspaceId}/`);
    }
  };

  return (
    <>
      <div className="relative">
        {details.in_trash && (
          <article className="py-2 z-40 bg-[#EB5757] flex md:flex-row flex-col justify-center items-center gap-4 flex-wrap">
            <div className="flex flex-col md:flex-row gap-2 justify-center items-center">
              <span className="text-white">
                This {dirType} has been deleted
              </span>
              <Button
                size="sm"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-[#EB5757]"
                onClick={restoreFileHandler}
              >
                Restore
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-[#EB5757]"
                onClick={deleteFileHandler}
              >
                Delete Forever
              </Button>
            </div>
          </article>
        )}
      </div>
      <div className="flex justify-center items-center flex-col mt-2 relative">
        <div id="container" ref={wrapperRef} className="max-w-[800px]"></div>
      </div>
    </>
  );
};
