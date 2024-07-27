export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";

import { Editor } from "@/components/block-note-editor/editor";
import { getFileDetails } from "@/lib/server-actions/file-actions";
import { CollaborativeRoom } from "@/components/liveblocks/collaborative-room";
import { getUser } from "@/lib/server-actions/auth-actions";
import { getRoom } from "@/lib/server-actions/liveblock-actions";

export default async function FileIdPage({
  params,
}: {
  params: { file_id: string };
}) {
  const { data: user } = await getUser();
  if (!user) return redirect("/sign-in");

  const { data: fileDetails, error } = await getFileDetails(params.file_id);
  if (!fileDetails || error) return redirect("/dashboard");

  const room = await getRoom({
    roomId: params.file_id,
    userId: user?.id,
  });
  if (!room) return redirect("/dashboard");

  return (
    <div className="relative">
      <CollaborativeRoom roomId={params.file_id} roomMetadata={room.metadata}>
        <Editor
          dirDetails={fileDetails[0]}
          dirType="file"
          actualDirId={fileDetails[0].id}
        />
      </CollaborativeRoom>
    </div>
  );
}
