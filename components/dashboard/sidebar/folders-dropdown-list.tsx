"use client";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";

import { useAppsStore } from "@/lib/providers/store-provider";
import { Tables } from "@/lib/supabase/supabase.types";
import { TooltipComponent } from "@/components/global/tooltip-component";
import { getUser } from "@/lib/server-actions/auth-actions";
import {
  createFolder,
  getUserSubscriptionStatus,
} from "@/lib/server-actions/dashboard-actions";

interface FoldersDropdownListProps {
  workspaceFolders: Tables<"folders">[];
  workspaceId: string;
}
export const FoldersDropdownList = ({
  workspaceFolders,
  workspaceId,
}: FoldersDropdownListProps) => {
  //WIP Set real time updates
  const { appWorkspaces, setFolders, addFolder } = useAppsStore(
    (store) => store
  );

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

  const addFolderHandler = async () => {
    const {
      data: { user },
    } = await getUser();

    const { data: subscription, error: subscriptionError } =
      await getUserSubscriptionStatus(user?.id || "");

    // if (folderState.length > 0 && !subscription) {
    // }

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

    const { data, error } = await createFolder(newFolder);

    if (error) {
      console.log("error creating folder", error);
      toast.error(
        "An error occurred while creating the folder. Please try again."
      );
    } else {
      toast.success("New Folder has been created successfully.");

      window.location.reload();
    }
  };

  return (
    <div className="flex sticky z-20 top-0 bg-background w-full h-10 group/title justify-between items-center pr-4 text-Neutrals/neutrals-8">
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
  );
};
