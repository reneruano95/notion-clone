"use client";

import { useEffect, useState } from "react";

import { useAppsStore } from "@/lib/providers/store-provider";
import { Tables } from "@/lib/supabase/supabase.types";
import { TooltipComponent } from "@/components/global/tooltip-component";
import { PlusIcon } from "lucide-react";

interface FoldersDropdownListProps {
  workspaceFolders: Tables<"folders">[];
  workspaceId: string;
}
export const FoldersDropdownList = ({
  workspaceFolders,
  workspaceId,
}: FoldersDropdownListProps) => {
  //WIP Set real time updates
  const { folders, setFolders } = useAppsStore((store) => store);
  const [folderState, setFolderState] = useState(workspaceFolders);

  useEffect(() => {
    if (workspaceFolders.length > 0) {
      setFolders(workspaceFolders, workspaceId);
    }
  }, [workspaceFolders, workspaceId]);

  useEffect(() => {
    setFolderState(folders);
  }, [folders]);

  const addFolderHandler = async () => {
    console.log("add folder handler");
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
