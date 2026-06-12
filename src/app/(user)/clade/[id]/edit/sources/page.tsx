import { getCladeName } from '../../../get-clade-name';
import SourcesPanel from './sources-panel';

export default async function CladeSourcesTab({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const clade = await getCladeName(id);
  if (!clade) {
    return null;
  }

  return <SourcesPanel cladeName={clade.name} />;
}
