export default function FileIdPage({
  params,
}: {
  params: { file_id: string };
}) {
  return <div>File Id Page {params.file_id}</div>;
}
