export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";

import { QuillEditor } from "@/components/quill-editor/quill-editor";
import { getFileDetails } from "@/lib/server-actions/file-actions";

export default async function FileIdPage({
  params,
}: {
  params: { file_id: string };
}) {
  const { data, error } = await getFileDetails(params.file_id);

  if (!data || error) return redirect("/dashboard");

  return (
    <div className="relative">
      <QuillEditor
        dirDetails={data[0]}
        dirType="file"
        actualDirId={data[0].id}
      />
    </div>
  );
}
