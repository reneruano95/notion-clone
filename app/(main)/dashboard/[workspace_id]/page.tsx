export default function WorkspaceIdPage({
  params,
}: {
  params: { workspace_id: string };
}) {
  console.log("WorkspaceIdPage", params.workspace_id);

  return <div>{params.workspace_id}</div>;
}
