export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";

import { Editor } from "@/components/block-note-editor/editor";
import { getFolderDetails } from "@/lib/server-actions/folder-actions";
import { CollaborativeRoom } from "@/components/liveblocks/collaborative-room";

export default async function FolderIdPage({
  params,
}: {
  params: { folder_id: string };
}) {
  const { data, error } = await getFolderDetails(params.folder_id);

  if (!data || error) return redirect("/dashboard");

  return (
    <div className="relative">
      <CollaborativeRoom>
        <Editor
          dirDetails={data[0]}
          dirType="folder"
          actualDirId={data[0].id}
        />
      </CollaborativeRoom>
    </div>
  );
}
