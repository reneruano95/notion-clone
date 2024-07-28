export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getWorkspaceDetails } from "@/lib/server-actions/workspaces-actions";
import { Editor } from "@/components/block-note-editor/editor";
import { CollaborativeRoom } from "@/components/liveblocks/collaborative-room";
import { getRoom } from "@/lib/server-actions/liveblock-actions";
import { getUser } from "@/lib/server-actions/auth-actions";
import { getUsers } from "@/lib/server-actions/user-actions";

export default async function WorkspaceIdPage({
  params,
}: {
  params: { workspace_id: string };
}) {
  const { data: user } = await getUser();
  if (!user) {
    return redirect("/sign-in");
  }

  const { data: workspaceDetails, error: workspaceDetailsError } =
    await getWorkspaceDetails(params.workspace_id);
  if (!workspaceDetails?.length || workspaceDetailsError) {
    return redirect("/dashboard");
  }

  const { data: room, error } = await getRoom({
    roomId: params.workspace_id,
    userId: user?.email!,
  });
  if (!room || error) {
    console.log("Error fetching room", error);
    return redirect("/dashboard");
  }

  const userEmails = Object.keys(room.usersAccesses);
  const { data: users, error: usersError } = await getUsers({ userEmails });

  if (!users || usersError) {
    console.log("Error fetching users", usersError);
  }

  const usersData =
    (users?.map((user: any) => ({
      ...user,
      // @ts-ignore
      userType: room.usersAccesses[user?.email!].includes("room:write")
        ? "editor"
        : "viewer",
    })) as Array<CollaborativeUser>) || [];

  console.log(usersData);

  return (
    <div className="relative">
      <CollaborativeRoom roomId={params.workspace_id}>
        <Editor
          dirDetails={workspaceDetails[0]}
          dirType="workspace"
          actualDirId={workspaceDetails[0].id}
        />
      </CollaborativeRoom>
    </div>
  );
}
