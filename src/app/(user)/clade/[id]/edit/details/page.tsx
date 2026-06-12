import getCladeDetails from '~/lib/utils/supabase/queries/getCladeDetails';
import { nomenclatureForLineage } from '~/lib/constants/ranks';

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
  const nomenclature = nomenclatureForLineage([
    clade.name,
    ...clade.lineage.map((a) => a.name),
  ]);

  // Ancestor ranks constrain the options to ranks finer than them.
  const ancestorRanks = clade.lineage
    .map((a) => a.rank)
    .filter((r): r is string => Boolean(r));

  return (
    <DetailsForm
      clade={clade}
      nomenclature={nomenclature}
      ancestorRanks={ancestorRanks}
    />
  );
}
