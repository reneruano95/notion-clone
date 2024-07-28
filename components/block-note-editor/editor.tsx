"use client";

import { useMemo, useTransition } from "react";

import { useId } from "@/lib/hooks/useId";
import { useAppsStore } from "@/lib/providers/store-provider";
import { Tables } from "@/lib/supabase/supabase.types";
import { EditorWrapper } from "./editor-wrapper";
import { CollaborativeEditor } from "./block-note-editor";

interface EditorProps {
  dirDetails: Tables<"workspaces"> | Tables<"folders"> | Tables<"files">;
  dirType: "workspace" | "folder" | "file";
  actualDirId: string;
  users?: CollaborativeUser[];
  currentUserType?: UserType;
  roomId: string;
}

export const Editor = ({
  dirDetails,
  dirType,
  actualDirId,
  currentUserType,
  roomId,
  users,
}: EditorProps) => {
  const { workspaceId, folderId } = useId();
  const { appWorkspaces } = useAppsStore((store) => store);

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

  return (
    <>
      <EditorWrapper
        actualDirId={actualDirId}
        details={details}
        dirType={dirType}
        saving={saving}
      >
        <div className="flex justify-center items-center flex-col mt-2 relative">
          <div className="max-w-[800px] w-full">
            <CollaborativeEditor
              roomId={roomId}
              currentType={currentUserType!}
            />
          </div>
        </div>
      </EditorWrapper>
    </>
  );
};
