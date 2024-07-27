"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";

import { useId } from "@/lib/hooks/useId";
import { Accordion } from "@/components/ui/accordion";
import { Dropdown } from "./dropdown";
import { TooltipComponent } from "@/components/global/tooltip-component";
import { Tables } from "@/lib/supabase/supabase.types";
import { useAppsStore } from "@/lib/providers/store-provider";
import { getUser } from "@/lib/server-actions/auth-actions";
import { getUserSubscriptionStatus } from "@/lib/server-actions/user-actions";
import { createFolder } from "@/lib/server-actions/folder-actions";
import { createRoom } from "@/lib/server-actions/liveblock-actions";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";

interface FoldersDropdownListProps {
  workspaceFolders: Tables<"folders">[];
  workspaceId: string;
}
export const FoldersDropdownList = ({
  workspaceFolders,
  workspaceId,
}: FoldersDropdownListProps) => {
  const router = useRouter();

  const { folderId } = useId();
  const { user } = useSupabaseUser();
  const { appWorkspaces, setFolders, addFolder } = useAppsStore(
    (store) => store
  );
  //WIP Set real time updates
  const [folderState, setFolderState] = useState(workspaceFolders);

  useEffect(() => {
    if (workspaceFolders.length > 0) {
      setFolders(
        workspaceId,
        workspaceFolders.map((folder) => ({
          ...folder,
          files:
            appWorkspaces
              .find((workspace) => workspace.id === workspaceId)
              ?.folders.find((f) => f.id === folder.id)?.files || [],
        }))
      );
    }
  }, [workspaceFolders, workspaceId]);

  useEffect(() => {
    setFolderState(
      appWorkspaces.find((workspace) => workspace.id === workspaceId)
        ?.folders || []
    );
  }, [appWorkspaces, workspaceId]);

  const addFolderHandler = useCallback(async () => {
    // const { data: subscription, error: subscriptionError } =
    //   await getUserSubscriptionStatus(user?.id || "");

    // if (folderState.length > 0 && !subscription) {
    // }
    if (user?.id) {
      const newFolder: Tables<"folders"> = {
        data: "",
        id: uuidv4(),
        workspace_id: workspaceId,
        created_at: new Date().toISOString(),
        banner_url: "",
        emoji: "📁",
        in_trash: "",
        title: "New Folder",
      };

      addFolder(workspaceId, { ...newFolder, files: [] });

      const { error } = await createFolder(newFolder);
      await createRoom({
        userId: user.id,
        email: user.email!,
        roomId: newFolder.id,
        roomType: "folder",
      });

      if (error) {
        toast.error(
          "An error occurred while creating the folder. Please try again."
        );
      } else {
        toast.success("A new folder has been created successfully.");
      }
      router.refresh();
    }
  }, [workspaceId, user?.id, router]);

  return (
    <>
      <div className="flex sticky z-20 pe-3 top-0 bg-background w-full h-10 group/title justify-between items-center text-Neutrals/neutrals-8">
        <span className="text-Neutrals/neutrals-8 font-bold text-xs">
          FOLDERS
        </span>
        <TooltipComponent message="Create Folder">
          <PlusIcon
            onClick={addFolderHandler}
            size={16}
            className="cursor-pointer group-hover/title:inline-block hidden hover:dark:text-white"
          />
        </TooltipComponent>
      </div>

      <Accordion
        type="multiple"
        defaultValue={[folderId || ""]}
        className="pb-20 pe-3"
      >
        {folderState
          .filter((folder) => !folder.in_trash)
          .map((folder) => (
            <Dropdown
              key={folder.id}
              title={folder.title}
              listType="folder"
              id={folder.id}
              emoji={folder.emoji}
            />
          ))}
      </Accordion>
    </>
  );
};
