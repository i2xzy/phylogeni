import getCladeDetails from '~/lib/utils/supabase/queries/getCladeDetails';
import { codeForLineageNames } from '~/lib/constants/ranks';

import DetailsForm from './details-form';

export default async function CladeDetailsTab({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const clade = await getCladeDetails(id);
  if (!clade) {
    return null;
  }

  // The applicable nomenclatural code (which rank list to show) is fixed by the
  // clade's kingdom — look for a marker clade anywhere in its lineage.
  const code = codeForLineageNames([
    clade.name,
    ...clade.lineage.map((a) => a.name),
  ]);

  return <DetailsForm clade={clade} code={code} />;
}
