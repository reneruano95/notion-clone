export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getWorkspaceDetails } from "@/lib/server-actions/workspaces-actions";
import { Editor } from "@/components/block-note-editor/editor";
import { CollaborativeRoom } from "@/components/liveblocks/collaborative-room";

export default async function WorkspaceIdPage({
  params,
}: {
  params: { workspace_id: string };
}) {
  const { data, error } = await getWorkspaceDetails(params.workspace_id);

  if (!data?.length || error) return redirect("/dashboard");

  return (
    <div className="relative">
      <CollaborativeRoom>
        <Editor
          dirDetails={data[0]}
          dirType="workspace"
          actualDirId={data[0].id}
        />
      </CollaborativeRoom>
    </div>
  );
}
