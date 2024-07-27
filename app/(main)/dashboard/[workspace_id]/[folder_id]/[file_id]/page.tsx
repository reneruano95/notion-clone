export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";

import { Editor } from "@/components/block-note-editor/editor";
import { getFileDetails } from "@/lib/server-actions/file-actions";
import { CollaborativeRoom } from "@/components/liveblocks/collaborative-room";

export default async function FileIdPage({
  params,
}: {
  params: { file_id: string };
}) {
  const { data, error } = await getFileDetails(params.file_id);

  if (!data || error) return redirect("/dashboard");

  return (
    <div className="relative">
      <CollaborativeRoom>
        <Editor dirDetails={data[0]} dirType="file" actualDirId={data[0].id} />
      </CollaborativeRoom>
    </div>
  );
}
