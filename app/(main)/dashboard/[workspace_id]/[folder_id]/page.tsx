export default function FolderIdPage({
  params,
}: {
  params: { folder_id: string };
}) {
  console.log("FolderIdPage", params.folder_id);

  return <div>FolderIdPage</div>;
}
