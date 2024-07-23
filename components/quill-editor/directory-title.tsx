import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";

import { Tables } from "@/lib/supabase/supabase.types";
import { useAppsStore } from "@/lib/providers/store-provider";
import { useId } from "@/lib/hooks/useId";
import { updateFolder as updateFolderAction } from "@/lib/server-actions/folder-actions";
import { updateFile as updateFileAction } from "@/lib/server-actions/file-actions";

interface DirectoryTitleProps {
  details: Tables<"workspaces"> | Tables<"folders"> | Tables<"files">;
  dirType: "workspace" | "folder" | "file";
}

export const DirectoryTitle = ({ details, dirType }: DirectoryTitleProps) => {
  const inputRef = useRef<ElementRef<"input">>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(details.title);

  const { fileId, folderId, workspaceId } = useId();
  const { updateFile, updateFolder } = useAppsStore((store) => store);

  const enableInput = () => {
    if (dirType === "workspace") return;

    setIsEditing(true);
    setTimeout(() => {
      setTitle(details.title);
      inputRef.current?.focus();
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const folderTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!workspaceId || !folderId) return;

    updateFolder(workspaceId, folderId, {
      title: e.target.value || "Untitled Folder",
    });
    const { error } = await updateFolderAction(
      { title: e.target.value || "Untitled Folder" },
      folderId
    );

    if (error) {
      toast.error(
        "An error occurred while updating the folder name. Please try again."
      );
    }
  };

  const fileTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!workspaceId || !folderId || !fileId) return;

    updateFile(workspaceId, folderId, fileId, {
      title: e.target.value || "Untitled File",
    });
    const { error } = await updateFileAction(
      { title: e.target.value || "Untitled File" },
      fileId
    );

    if (error) {
      toast.error(
        "An error occurred while updating the file name. Please try again."
      );
    }
  };

  const onKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      disableInput();
    }
  };
  return (
    <>
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={details.title}
          onBlur={disableInput}
          onKeyDown={onKeydown}
          className="text-muted-foreground text-3xl font-bold h-9 bg-transparent border-transparent focus:border-primary-foreground focus:outline-none"
          readOnly={!isEditing}
          onChange={
            (dirType === "folder" && folderTitleChange) || fileTitleChange
          }
        />
      ) : (
        <span
          onClick={enableInput}
          className="text-muted-foreground text-3xl font-bold h-9"
        >
          {details.title}
        </span>
      )}
      <span className="text-muted-foreground text-sm">
        {dirType.toUpperCase()}
      </span>
    </>
  );
};
