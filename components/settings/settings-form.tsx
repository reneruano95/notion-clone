"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Briefcase } from "lucide-react";

import { useId } from "@/lib/hooks/useId";
import { useAppsStore } from "@/lib/providers/store-provider";
import { Tables } from "@/lib/supabase/supabase.types";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { updateWorkspace as updateWorkspaceAction } from "@/lib/server-actions/workspaces-actions";

export const SettingsForm = () => {
  const router = useRouter();

  const { folderId, workspaceId } = useId();
  const { appWorkspaces, updateWorkspace, addFile, updateFile } = useAppsStore(
    (store) => store
  );

  const [permissions, setPermissions] = useState("private");
  const [collaborators, setCollaborators] = useState<Tables<"users">[] | []>(
    []
  );
  const [openAlertMessage, setOpenAlertMessage] = useState(false);
  const [workspaceDetails, setWorkspaceDetails] =
    useState<Partial<Tables<"workspaces">>>();
  const titleTimerRef = useRef<NodeJS.Timeout>();
  const [isPending, startTransition] = useTransition();
  //WIP PAYMENT SETTINGS

  useEffect(() => {
    const showingWorkspace = appWorkspaces.find(
      (workspace) => workspace.id === workspaceId
    );
    if (showingWorkspace) setWorkspaceDetails(showingWorkspace);
  }, [workspaceId, appWorkspaces]);

  const workspaceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!workspaceId || !e.target.value) return;

    updateWorkspace({ title: e.target.value }, workspaceId);

    if (titleTimerRef.current) {
      clearTimeout(titleTimerRef.current);
    }

    titleTimerRef.current = setTimeout(() => {
      updateWorkspaceAction({ title: e.target.value }, workspaceId);
    }, 1000);
  };

  return (
    <div className="flex gap-4 flex-col">
      <p className="flex items-center gap-2 mt-6">
        <Briefcase size={20} />
        <span>Workspace Settings</span>
      </p>
      <Separator />
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="workspaceName"
          className="text-sm text-muted-foreground"
        >
          Name
        </Label>
        <Input
          name="workspaceName"
          value={workspaceDetails ? workspaceDetails.title : ""}
          placeholder="Workspace Name"
          onChange={workspaceNameChange}
        />
      </div>
    </div>
  );
};
