import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Plus, Share } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Tables } from "@/lib/supabase/supabase.types";
import { CollaboratorsSearch } from "./collaborators-search";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { addCollaborators } from "@/lib/server-actions/collaborators-actions";
import { createWorkspace } from "@/lib/server-actions/workspaces-actions";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { useAppsStore } from "@/lib/providers/store-provider";
import { createRoom } from "@/lib/server-actions/liveblock-actions";

export const WorkspaceCreator = () => {
  const router = useRouter();
  const { user } = useSupabaseUser();
  const { addWorkspace } = useAppsStore((store) => store);

  const [permissions, setPermissions] = useState("private");
  const [collaborators, setCollaborators] = useState<Tables<"users">[]>([]);

  const [title, setTitle] = useState("");
  const [isPending, startTransition] = useTransition();

  const addCollaborator = useCallback(
    (user: Tables<"users">) => {
      setCollaborators([...collaborators, user]);
    },
    [collaborators]
  );

  const removeCollaborator = useCallback(
    (user: Tables<"users">) => {
      setCollaborators(collaborators.filter((u) => u.id !== user.id));
    },
    [collaborators]
  );

  const createItem = useCallback(async () => {
    startTransition(async () => {
      const workspaceId = uuidv4();

      if (user?.id) {
        const newWorkspace: Tables<"workspaces"> = {
          id: workspaceId,
          data: "",
          created_at: new Date().toISOString(),
          emoji: "🖥️",
          in_trash: "",
          banner_url: "",
          title,
          workspace_owner_id: user?.id,
          is_private: permissions === "private",
          logo: "",
        };

        toast.success(`Successfully created ${permissions} workspace`);

        await createRoom({
          userId: user.id,
          email: user.email!,
          roomId: workspaceId,
        });
        await createWorkspace(newWorkspace);
        addWorkspace({
          ...newWorkspace,
          folders: [],
        });

        if (permissions === "shared") {
          await addCollaborators(workspaceId, collaborators);
        }

        router.push(`/dashboard/${workspaceId}`);
      }
    });
  }, [collaborators, permissions, router, title, user?.id]);

  return (
    <div className="flex gap-4 flex-col">
      <div>
        <Label htmlFor="name" className="text-sm text-muted-foreground">
          Name
        </Label>
        <div className="flex justify-center items-center gap-2">
          <Input
            name="name"
            value={title}
            placeholder="Workspace Name"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="permissions" className="text-sm text-muted-foreground">
          Permissions
        </Label>
        <Select
          onValueChange={(val) => {
            setPermissions(val);
          }}
          defaultValue={permissions}
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
                      Your workspace is private to you. You can choose to share
                      it later.
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
      </div>

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

      <Button
        type="button"
        disabled={
          !title ||
          (permissions === "shared" && collaborators.length === 0) ||
          isPending
        }
        variant={"default"}
        onClick={createItem}
        className="mt-4"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
      </Button>
    </div>
  );
};
