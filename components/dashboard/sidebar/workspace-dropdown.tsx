"use client";

import { useState } from "react";

import { Tables } from "@/lib/supabase/supabase.types";
import { SelectedWorkspace } from "./selected-workspace";
import { CustomDialogTrigger } from "@/components/global/custom-dialog-trigger";
import { WorkspaceCreator } from "@/components/global/workspace-creator";
import { SquarePlus } from "lucide-react";

interface WorkspaceDropdownProps {
  privateWorkspaces: Tables<"workspaces">[] | null;
  collaboratingWorkspaces: Tables<"workspaces">[] | null;
  sharedWorkspaces: Tables<"workspaces">[] | null;
  defaultValue: Tables<"workspaces"> | undefined;
}

export const WorkspaceDropdown = ({
  privateWorkspaces,
  collaboratingWorkspaces,
  sharedWorkspaces,
  defaultValue,
}: WorkspaceDropdownProps) => {
  const [selectedOption, setSelectedOption] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (workspace: Tables<"workspaces">) => {
    setSelectedOption(workspace);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left w-full">
      <div onClick={() => setIsOpen(!isOpen)}>
        {selectedOption ? (
          <SelectedWorkspace workspace={selectedOption} />
        ) : (
          "Select Workspace"
        )}
      </div>

      {isOpen && (
        <div className="origin-top-right absolute w-full rounded-md shadow-md z-50 h-[220px] bg-black/10 backdrop-blur-lg group overflow-y-auto  border-[1px] border-muted">
          <div className="rounded-md flex flex-col">
            <div className="!p-2">
              {!!privateWorkspaces?.length && (
                <>
                  <p className="text-muted-foreground">Private</p>
                  <hr></hr>
                  {privateWorkspaces.map((option) => (
                    <SelectedWorkspace
                      key={option.id}
                      workspace={option}
                      onClick={handleSelect}
                    />
                  ))}
                </>
              )}
              {!!sharedWorkspaces?.length && (
                <>
                  <p className="text-muted-foreground">Shared</p>
                  <hr />
                  {sharedWorkspaces.map((option) => (
                    <SelectedWorkspace
                      key={option.id}
                      workspace={option}
                      onClick={handleSelect}
                    />
                  ))}
                </>
              )}
              {!!collaboratingWorkspaces?.length && (
                <>
                  <p className="text-muted-foreground">Collaborating</p>
                  <hr />
                  {collaboratingWorkspaces.map((option) => (
                    <SelectedWorkspace
                      key={option.id}
                      workspace={option}
                      onClick={handleSelect}
                    />
                  ))}
                </>
              )}
              <hr />
            </div>

            <CustomDialogTrigger
              title="Create A Workspace"
              content={<WorkspaceCreator />}
              description="Workspaces give you the power to collaborate with others. You can change your workspace privacy settings after creating the workspace too."
            >
              <div className="flex rounded transition-all hover:bg-muted justify-center items-center gap-2 p-2 mx-2 mb-2">
                <SquarePlus className="w-6 h-6" />
                <p className="text-lg">Create Workspace</p>
              </div>
            </CustomDialogTrigger>
          </div>
        </div>
      )}
    </div>
  );
};
