import { redirect } from 'next/navigation';

// The edit section is tabbed; default to the Details tab.
export default async function CladeEditIndex({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/clade/${id}/edit/details`);
}
