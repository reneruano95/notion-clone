"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import useId from "@/lib/hooks/useId";
import { useAppsStore } from "@/lib/providers/store-provider";
import { AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { EmojiPicker } from "@/components/global/emoji-picker";
import { updateFolder as updateFolderHandler } from "@/lib/server-actions/dashboard-actions";

interface DropdownProps {
  title: string;
  id: string;
  listType: "folder" | "file";
  iconId: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const Dropdown = ({
  title,
  id,
  listType,
  iconId,
  children,
  disabled,
  ...props
}: DropdownProps) => {
  const router = useRouter();

  const { folderId, workspaceId } = useId();
  const { appWorkspaces, updateFolder } = useAppsStore((store) => store);
  const [isEditing, setIsEditing] = useState(false);

  const folderTitle: string | undefined = useMemo(() => {
    if (listType === "folder") {
      const stateTitle = appWorkspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.find((folder) => folder.id === id)?.title;

      if (title === stateTitle || !stateTitle) return title;
      return stateTitle;
    }
  }, [appWorkspaces, listType, id, workspaceId, title]);

  const fileTitle: string | undefined = useMemo(() => {
    if (listType === "file") {
      const fileAndFolderId = id.split("folder");
      const stateTitle = appWorkspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.find((folder) => folder.id === fileAndFolderId[0])
        ?.files.find((file) => file.id === fileAndFolderId[1])?.title;
      if (title === stateTitle || !stateTitle) return title;
      return stateTitle;
    }
  }, [appWorkspaces, listType, id, workspaceId, title]);

  const navigatePage = (accordionId: string, type: string) => {
    if (type === "folder") {
      return router.push(`/dashboard/${workspaceId}/${accordionId}`);
    }

    if (type === "file") {
      return router.push(
        `/dashboard/${workspaceId}/${folderId}/${
          accordionId.split("folder/")[1]
        }`
      );
    }
  };

  const onChangeEMoji = async (selectedEmoji: string) => {
    if (!workspaceId) return;

    if (listType === "folder") {
      return updateFolder(workspaceId, id, {
        emoji: selectedEmoji,
      });
    }

    const { error } = await updateFolderHandler(
      {
        emoji: selectedEmoji,
      },
      id
    );

    if (error) {
      return toast.error(
        "An error occurred while updating the emoji for this folder. Please try again."
      );
    } else {
      return toast.success("Emoji updated successfully");
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = async () => {
    if (!isEditing) return;
    setIsEditing(false);

    const fId = id.split("folder");
    if (fId?.length === 1) {
      if (!folderTitle) return;

      await updateFolderHandler({ title }, fId[0]);
    }

    if (fId?.length === 2) {
      if (!fileTitle) return;

      // WIP UPDATE THE FILE
    }
  };

  const folderTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!workspaceId) return;

    const fId = id.split("folder");

    if (fId?.length === 1) {
      return updateFolder(workspaceId, fId[0], {
        title: e.target.value,
      });
    }
  };

  const fileTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!workspaceId) return;

    const fId = id.split("folder");

    if (fId?.length === 2) {
      return updateFolder(workspaceId, fId[0], {
        title: e.target.value,
      });
    }
  };

  const isFolder = listType === "folder";
  const groupIdentifies = useMemo(
    () =>
      cn(
        "dark:text-white whitespace-nowrap flex justify-between items-center w-full relative",
        {
          "group/folder": isFolder,
          "group/file": !isFolder,
        }
      ),
    [isFolder]
  );
  const listStyles = useMemo(
    () =>
      cn("relative", {
        "border-none text-md": isFolder,
        "border-none ml-6 text-[16px] py-1": !isFolder,
      }),
    [isFolder]
  );

  return (
    <AccordionItem
      value={id}
      className={listStyles}
      onClick={(e) => {
        e.stopPropagation();
        navigatePage(id, listType);
      }}
    >
      <AccordionTrigger
        id={listType}
        className="flex gap-4 items-center justify-center overflow-hidden"
        disabled={listType === "file"}
      >
        <div className={groupIdentifies}>
          <div className="flex gap-4 items-center justify-center overflow-hidden">
            <div className="relative">
              <EmojiPicker getValue={onChangeEMoji}>{iconId}</EmojiPicker>
            </div>
            <input
              type="text"
              value={listType === "folder" ? folderTitle : fileTitle}
              className={cn(
                "outline-none overflow-hidden w-[140px] text-Neutrals/neutrals-7",
                {
                  "bg-muted cursor-text": isEditing,
                  "bg-transparent cursor-pointer": !isEditing,
                }
              )}
              readOnly={!isEditing}
              onClick={handleDoubleClick}
              onBlur={handleBlur}
              onChange={
                listType === "folder" ? folderTitleChange : fileTitleChange
              }
            />
          </div>
        </div>
      </AccordionTrigger>
    </AccordionItem>
  );
};
