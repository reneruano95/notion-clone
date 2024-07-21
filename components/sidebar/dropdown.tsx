"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PlusIcon, Trash } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { useId } from "@/lib/hooks/useId";
import { useAppsStore } from "@/lib/providers/store-provider";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { EmojiPicker } from "@/components/global/emoji-picker";
import { updateFolder as updateFolderAction } from "@/lib/server-actions/folder-actions";
import {
  moveFilesToTrash,
  updateFile as updateFileAction,
} from "@/lib/server-actions/file-actions";
import { TooltipComponent } from "@/components/global/tooltip-component";
import { Tables } from "@/lib/supabase/supabase.types";
import { createFile } from "@/lib/server-actions/file-actions";
import { getUser } from "@/lib/server-actions/auth-actions";

interface DropdownProps {
  title: string;
  id: string;
  listType: "folder" | "file";
  emoji: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const Dropdown = ({
  title,
  id,
  listType,
  emoji,
  children,
  disabled,
  ...props
}: DropdownProps) => {
  const router = useRouter();

  const { folderId, workspaceId } = useId();
  const { appWorkspaces, updateFolder, addFile, updateFile } = useAppsStore(
    (store) => store
  );
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
          accordionId.split("folder")[1]
        }`
      );
    }
  };

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, [setIsEditing]);

  const handleBlur = useCallback(async () => {
    if (!isEditing) return;
    setIsEditing(false);

    const fId = id.split("folder");

    if (fId?.length === 1) {
      if (!folderTitle) return;

      const { error } = await updateFolderAction(
        { title: folderTitle },
        fId[0]
      );

      toast.success("Folder name updated successfully");

      if (error) {
        return toast.error(
          "An error occurred while updating the folder name. Please try again."
        );
      }
    }

    if (fId?.length === 2) {
      if (!fileTitle) return;

      const { error } = await updateFileAction({ title: fileTitle }, fId[1]);

      toast.success("File name updated successfully");

      if (error) {
        return toast.error(
          "An error occurred while updating the file name. Please try again."
        );
      }
    }
  }, [
    folderTitle,
    fileTitle,
    id,
    isEditing,
    updateFolderAction,
    updateFileAction,
  ]);

  const onChangeEmoji = async (selectedEmoji: string) => {
    if (!workspaceId || !listType) return;

    if (listType === "folder") {
      updateFolder(workspaceId, id, {
        emoji: selectedEmoji,
      });

      const { error } = await updateFolderAction(
        {
          emoji: selectedEmoji,
        },
        id
      );

      if (error) {
        toast.error(
          "An error occurred while updating the emoji for this folder. Please try again."
        );
      } else {
        toast.success("Emoji updated successfully");
      }
    }
  };

  const folderTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!workspaceId) return;

    const fId = id.split("folder");

    if (fId?.length === 1) {
      updateFolder(workspaceId, fId[0], {
        title: e.target.value,
      });
    }
  };

  const fileTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!workspaceId) return;

    const fId = id.split("folder");

    if (fId?.length === 2) {
      updateFile(workspaceId, folderId as string, fId[1], {
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

  const hoverStyles = useMemo(
    () =>
      cn(
        "h-full hidden rounded-sm absolute right-0 items-center justify-center gap-1",
        {
          "group-hover/file:flex": listType === "file",
          "group-hover/folder:flex": listType === "folder",
        }
      ),
    [isFolder]
  );

  const moveToTrash = useCallback(async () => {
    const {
      data: { user },
    } = await getUser();

    if (!user || !workspaceId) return;

    const pathId = id.split("folder"); // 0 = folder id, 1 = file id

    if (listType === "folder") {
      updateFolder(workspaceId, pathId[0], {
        in_trash: `Deleted by ${user?.email}`,
      });

      const { error: folderError } = await updateFolderAction(
        {
          in_trash: `Deleted by ${user?.email}`,
        },
        pathId[0]
      );

      const { error: moveFilesToTrashError } = await moveFilesToTrash(
        pathId[0]
      );

      if (folderError || moveFilesToTrashError) {
        toast.error(
          "An error occurred while moving the folder to trash. Please try again."
        );
      } else {
        toast.success("Folder and its files moved to trash successfully");
      }

      router.refresh();
    }

    if (listType === "file") {
      updateFile(workspaceId, pathId[0], pathId[1], {
        in_trash: `Deleted by ${user?.email}`,
      });

      const { error: fileError } = await updateFileAction(
        {
          in_trash: `Deleted by ${user?.email}`,
        },
        pathId[1]
      );

      if (fileError) {
        toast.error(
          "An error occurred while moving the file to trash. Please try again."
        );
      } else {
        toast.success("File moved to trash successfully");
      }

      router.refresh();
    }
  }, [workspaceId, listType, id, router]);

  const addNewFile = useCallback(async () => {
    if (!workspaceId) return;
    const newFile: Tables<"files"> = {
      id: uuidv4(),
      data: "",
      created_at: new Date().toISOString(),
      in_trash: "",
      title: "Unnamed File",
      emoji: "📄",
      banner_url: "",
      workspace_id: workspaceId,
      folder_id: id,
    };
    addFile(workspaceId, id, newFile);
    const { error } = await createFile(newFile);

    if (error) {
      return toast.error(
        "An error occurred while creating a new file. Please try again."
      );
    } else {
      return toast.success("File created successfully");
    }
  }, [workspaceId, id]);

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
          <div className="flex gap-2 items-center justify-center overflow-hidden">
            <div className="relative">
              <EmojiPicker getValue={onChangeEmoji}>{emoji}</EmojiPicker>
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
              onDoubleClick={handleDoubleClick}
              onBlur={handleBlur}
              onChange={
                listType === "folder" ? folderTitleChange : fileTitleChange
              }
            />

            <div className={hoverStyles}>
              <TooltipComponent message="Delete Folder">
                <Trash
                  onClick={moveToTrash}
                  size={15}
                  className="hover:dark:text-white dark:text-Neutrals/neutrals-7 transition-colors"
                />
              </TooltipComponent>

              {listType === "folder" && !isEditing && (
                <TooltipComponent message="Add File">
                  <PlusIcon
                    onClick={addNewFile}
                    size={15}
                    className="hover:dark:text-white dark:text-Neutrals/neutrals-7 transition-colors"
                  />
                </TooltipComponent>
              )}
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-0">
        {appWorkspaces
          .find((workspace) => workspace.id === workspaceId)
          ?.folders.find((folder) => folder.id === id)
          ?.files.filter((file) => !file.in_trash)
          .map((file) => {
            const customFileId = `${id}folder${file.id}`;
            return (
              <Dropdown
                key={file.id}
                title={file.title}
                listType="file"
                id={customFileId}
                emoji={file.emoji}
              />
            );
          })}
      </AccordionContent>
    </AccordionItem>
  );
};
