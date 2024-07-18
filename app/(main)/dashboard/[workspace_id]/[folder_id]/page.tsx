export default function FolderIdPage({
  params,
}: {
  params: { folder_id: string };
}) {
  return <div>FolderIdPage {params.folder_id}</div>;
}
