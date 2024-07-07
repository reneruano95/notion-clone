import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { Lock, Share } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

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
import { toast } from "sonner";
import {
  addCollaborators,
  createWorkspace,
} from "@/lib/server-actions/dashboard-actions";

export const WorkspaceCreator = ({ user }: { user: User }) => {
  const router = useRouter();

  const [permissions, setPermissions] = useState("private");
  const [collaborators, setCollaborators] = useState<User[]>([]);

  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const addCollaborator = (user: User) => {
    setCollaborators([...collaborators, user]);
  };

  const removeCollaborator = (user: User) => {
    setCollaborators(collaborators.filter((u) => u.id !== user.id));
  };

  const createItem = async () => {
    setIsLoading(true);
    const workspaceId = uuidv4();

    if (user.id) {
      const newWorkspace: Tables<"workspaces"> = {
        id: workspaceId,
        data: "",
        created_at: new Date().toISOString(),
        emoji: "🖥️",
        in_trash: "",
        banner_url: "",
        title,
        workspace_owner_id: user.id,
        is_private: permissions === "private" ? true : false,
        logo: "",
      };

      if (permissions === "private") {
        toast(
          <span>
            Created private workspace <b>{newWorkspace.title}</b>
          </span>
        );
        await createWorkspace(newWorkspace);
        router.refresh();
      }

      if (permissions === "shared") {
        toast(
          <span>
            Created shared workspace <b>{newWorkspace.title}</b>
          </span>
        );
        await createWorkspace(newWorkspace);
        await addCollaborators(workspaceId, collaborators);

        router.refresh();
      }
    }
  };

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
                    <p>
                      Your workspace is private to you. You can choose to share
                      it later.
                    </p>
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
      <Button
        type="button"
        disabled={
          !title ||
          (permissions === "shared" && collaborators.length === 0) ||
          isLoading
        }
        variant={"default"}
        onClick={createItem}
      >
        Create
      </Button>
    </div>
  );
};
