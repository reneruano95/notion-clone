export default function WorkspaceIdPage({
  params,
}: {
  params: { workspace_id: string };
}) {
  console.log(params.workspace_id);
  return <div>{params.workspace_id}</div>;
}
