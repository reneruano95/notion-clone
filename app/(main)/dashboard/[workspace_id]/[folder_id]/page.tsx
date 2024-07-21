export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";

import { QuillEditor } from "@/components/quill-editor/quill-editor";
import { getFolderDetails } from "@/lib/server-actions/folder-actions";

export default async function FolderIdPage({
  params,
}: {
  params: { folder_id: string };
}) {
  const { data, error } = await getFolderDetails(params.folder_id);

  if (!data || error) return redirect("/dashboard");

  return (
    <div className="relative">
      <QuillEditor
        dirDetails={data[0]}
        dirType="folder"
        actualDirId={data[0].id}
      />
    </div>
  );
}
