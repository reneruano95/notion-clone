"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import useId from "@/lib/hooks/useId";
import { useAppsStore } from "@/lib/providers/store-provider";
import { AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { EmojiPicker } from "@/components/global/emoji-picker";
import { updateFolder as updateFolderHandler } from "@/lib/server-actions/dashboard-actions";
import { toast } from "sonner";

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

  //WIP
  const folderTitle = useMemo(() => {}, []);

  const fileTitle = useMemo(() => {}, []);

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
            />
          </div>
        </div>
      </AccordionTrigger>
    </AccordionItem>
  );
};
