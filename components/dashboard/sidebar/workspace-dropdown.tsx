"use client";

import { useState } from "react";
import { Tables } from "@/lib/supabase/supabase.types";
import { SelectedWorkspace } from "./selected-workspace";

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
    <div className="relative inline-block text-left">
      <span onClick={() => setIsOpen(!isOpen)}>
        {selectedOption ? (
          <SelectedWorkspace workspace={selectedOption} />
        ) : (
          "Select Workspace"
        )}
      </span>
      {isOpen && (
        <div className="origin-top-right absolute w-full rounded-md shadow-md z-50 h-[190px] bg-black/10 backdrop-blur-lg group overflow-scroll border-[1px] border-muted"></div>
      )}
    </div>
  );
};
