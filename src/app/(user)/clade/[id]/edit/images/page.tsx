import ImagesPanel from './images-panel';

export default async function CladeImagesTab({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ImagesPanel id={id} />;
}
