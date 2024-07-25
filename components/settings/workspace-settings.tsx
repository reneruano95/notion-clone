"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Briefcase, Lock, Plus, Share } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Alert, AlertDescription } from "../ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  deleteWorkspace as deleteWorkspaceAction,
  updateWorkspace as updateWorkspaceAction,
} from "@/lib/server-actions/workspaces-actions";
import { ImageUpload } from "../global/image-upload";
import { CollaboratorsSearch } from "../global/collaborators-search";

import { useId } from "@/lib/hooks/useId";
import { useAppsStore } from "@/lib/providers/store-provider";
import { Tables } from "@/lib/supabase/supabase.types";
import {
  addCollaborators,
  getCollaborators,
  removeCollaborators,
} from "@/lib/server-actions/collaborators-actions";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";

export const SettingsForm = () => {
  const router = useRouter();
  const { workspaceId } = useId();
  const { appWorkspaces, updateWorkspace, deleteWorkspace } = useAppsStore(
    (store) => store
  );

  const { user } = useSupabaseUser();

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
    if (showingWorkspace) {
      // console.log(showingWorkspace);
      setWorkspaceDetails(showingWorkspace);
    }
  }, [workspaceId, appWorkspaces]);

  useEffect(() => {
    if (!workspaceId) return;

    const fetchCollaborators = async () => {
      const { data, error } = await getCollaborators(workspaceId);
      if (data && data.length > 0) {
        setPermissions("shared");
        setCollaborators(data);
      }
    };

    fetchCollaborators();
  }, [workspaceId]);

  const addCollaborator = async (collaborator: Tables<"users">) => {
    if (!workspaceId) return;

    await addCollaborators(workspaceId, [collaborator]);
    setCollaborators([...collaborators, collaborator]);

    router.refresh();
  };

  const removeCollaborator = async (collaborator: Tables<"users">) => {
    if (!workspaceId) return;

    if (collaborators.length === 1) {
      setPermissions("private");
    }

    await removeCollaborators(workspaceId, [collaborator]);
    setCollaborators(collaborators.filter((c) => c.id !== collaborator.id));

    router.refresh();
  };

  const workspaceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!workspaceId || !e.target.value) return;

    updateWorkspace({ title: e.target.value }, workspaceId);

    if (titleTimerRef.current) {
      clearTimeout(titleTimerRef.current);
    }

    titleTimerRef.current = setTimeout(() => {
      updateWorkspaceAction({ title: e.target.value }, workspaceId);
    }, 500);

    router.refresh();
  };

  const onClickAlertConfirm = async () => {
    if (!workspaceId) return;

    if (collaborators.length > 0) {
      await removeCollaborators(workspaceId, collaborators);
      setCollaborators([]);
    }

    setPermissions("private");
    setOpenAlertMessage(false);

    updateWorkspace({ is_private: true }, workspaceId);
    await updateWorkspaceAction({ is_private: true }, workspaceId);

    router.refresh();
  };

  const onPermissionsChange = async (val: string) => {
    if (!workspaceId) return;

    if (val === "private") {
      if (collaborators.length > 0) {
        setOpenAlertMessage(true);
      }
    } else {
      setPermissions(val);
      updateWorkspace({ is_private: val === "private" }, workspaceId);
      await updateWorkspaceAction(
        { is_private: val === "private" },
        workspaceId
      );
    }

    router.refresh();
  };

  const handleDeleteWorkspace = async () => {
    if (!workspaceId) return;
    deleteWorkspace(workspaceId);
    const { error } = await deleteWorkspaceAction(workspaceId);

    if (error) {
      toast.error(
        "Something went wrong while deleting workspace. Please try again"
      );
      return;
    } else {
      toast.success("Workspace deleted successfully");
    }

    router.push("/dashboard");
  };
  return (
    <>
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
        <ImageUpload
          bucketName="workspaces-logos"
          value={workspaceDetails?.logo}
          onChange={(url) => {
            startTransition(async () => {
              updateWorkspace({ logo: url }, workspaceId as string);
              await updateWorkspaceAction({ logo: url }, workspaceId as string);
            });
          }}
        />

        <>
          <Label
            htmlFor="permissions"
            className="text-sm text-muted-foreground"
          >
            Permissions
          </Label>
          <Select
            onValueChange={(val) => onPermissionsChange(val)}
            value={permissions}
          >
            <SelectTrigger className="w-full h-26">
              <SelectValue />
            </SelectTrigger>

            <SelectContent className="w-min">
              <SelectGroup>
                <SelectItem value="private">
                  <div className="p-2 flex gap-4 justify-center items-center">
                    <Lock />
                    <article className="text-left flex flex-col">
                      <span>Private</span>
                      <span>
                        Your workspace is private to you. You can choose to
                        share it later.
                      </span>
                    </article>
                  </div>
                </SelectItem>

                <SelectItem value="shared">
                  <div className="p-2 flex gap-4 justify-center items-center">
                    <Share></Share>
                    <article className="text-left flex flex-col">
                      <span>Shared</span>
                      <span>You can invite collaborators.</span>
                    </article>
                  </div>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </>

        {permissions === "shared" && (
          <div>
            <CollaboratorsSearch
              existingCollaborators={collaborators}
              getCollaborators={(user) => addCollaborator(user)}
            >
              <Button
                type="button"
                variant={"secondary"}
                className="w-full text-sm flex justify-center items-center gap-2"
              >
                <Plus />
                Add Collaborators
              </Button>
            </CollaboratorsSearch>
            <div className="mt-4">
              <span className="text-sm text-muted-foreground">
                Collaborators ({collaborators.length})
              </span>
              <ScrollArea className=" h-[120px] overflow-y-auto w-full rounded-md border border-muted-foreground/20">
                {collaborators.length ? (
                  collaborators.map((user) => (
                    <div
                      key={user.id}
                      className="flex justify-between items-center gap-2 p-4"
                    >
                      <div className="flex gap-4 items-center">
                        <Avatar>
                          <AvatarImage src={user?.avatar_url || ""} />
                          <AvatarFallback>{user?.email?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="text-sm gap-2 overflow-hidden overflow-ellipsis w-[180px] text-muted-foreground">
                          {user.email}
                        </div>
                      </div>

                      <Button
                        variant={"secondary"}
                        onClick={() => removeCollaborator(user)}
                        className="text-sm"
                      >
                        Remove
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="absolute right-0 left-0 top-0 bottom-0 flex justify-center items-center">
                    <p className="text-sm text-muted-foreground">
                      No collaborators added
                    </p>
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        )}

        <Alert variant={"destructive"}>
          <AlertDescription>
            Warning! deleting you workspace will permanently delete all data
            related to this workspace.
          </AlertDescription>
          <Button
            type="submit"
            size="sm"
            variant="destructive"
            className="mt-4 text-s bg-destructive/40 hover:bg-destructive/60 border-2 border-destructive text-white/70 rounded py-2 px-4 w-full"
            onClick={handleDeleteWorkspace}
          >
            Delete Workspace
          </Button>
        </Alert>
      </div>

      <AlertDialog open={openAlertMessage}>
        <AlertDialogContent aria-describedby="alert-description">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDescription>
              Changing a Shared workspace to a Private workspace will remove all
              collaborators permanently.
            </AlertDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenAlertMessage(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={onClickAlertConfirm}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
