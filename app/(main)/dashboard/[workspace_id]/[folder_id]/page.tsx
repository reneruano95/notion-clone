export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";

import { Editor } from "@/components/block-note-editor/editor";
import { getFolderDetails } from "@/lib/server-actions/folder-actions";
import { CollaborativeRoom } from "@/components/liveblocks/collaborative-room";
import { getUser } from "@/lib/server-actions/auth-actions";
import { getRoom } from "@/lib/server-actions/liveblock-actions";

export default async function FolderIdPage({
  params,
}: {
  params: { folder_id: string };
}) {
  const { data: user } = await getUser();
  if (!user) return redirect("/sign-in");

  const { data: folderDetails, error } = await getFolderDetails(
    params.folder_id
  );
  if (!folderDetails || error) return redirect("/dashboard");

  const room = await getRoom({
    roomId: params.folder_id,
    userId: user?.id,
  });

  if (!room) return redirect("/dashboard");

  return (
    <div className="relative">
      <CollaborativeRoom roomId={params.folder_id}>
        <Editor
          dirDetails={folderDetails[0]}
          dirType="folder"
          actualDirId={folderDetails[0].id}
        />
      </CollaborativeRoom>
    </div>
  );
}
