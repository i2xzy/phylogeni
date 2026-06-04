// Single source of truth for taxonomic ranks (zoological + botanical), ordered
// broadest -> finest. `value` is what's stored in taxa.rank; `label` is for
// display. The array order encodes the hierarchy, so rankIndex() gives the
// level used to validate that a clade's rank is finer than its ancestors'.
//
// Casing: values are lowercase (matching how external sources represent ranks);
// imports from other databases should be normalised to these values.

export type Rank = { value: string; label: string };

export const RANKS: Rank[] = [
  { value: 'domain', label: 'Domain' },
  { value: 'superkingdom', label: 'Superkingdom' },
  { value: 'kingdom', label: 'Kingdom' },
  { value: 'subkingdom', label: 'Subkingdom' },
  { value: 'infrakingdom', label: 'Infrakingdom' },
  { value: 'superphylum', label: 'Superphylum' },
  { value: 'phylum', label: 'Phylum' },
  { value: 'subphylum', label: 'Subphylum' },
  { value: 'infraphylum', label: 'Infraphylum' },
  { value: 'division', label: 'Division' }, // botany (~ phylum)
  { value: 'subdivision', label: 'Subdivision' }, // botany
  { value: 'superclass', label: 'Superclass' },
  { value: 'class', label: 'Class' },
  { value: 'subclass', label: 'Subclass' },
  { value: 'infraclass', label: 'Infraclass' },
  { value: 'superorder', label: 'Superorder' },
  { value: 'order', label: 'Order' },
  { value: 'suborder', label: 'Suborder' },
  { value: 'infraorder', label: 'Infraorder' },
  { value: 'parvorder', label: 'Parvorder' },
  { value: 'superfamily', label: 'Superfamily' },
  { value: 'family', label: 'Family' },
  { value: 'subfamily', label: 'Subfamily' },
  { value: 'tribe', label: 'Tribe' },
  { value: 'subtribe', label: 'Subtribe' },
  { value: 'genus', label: 'Genus' },
  { value: 'subgenus', label: 'Subgenus' },
  { value: 'section', label: 'Section' }, // botany
  { value: 'subsection', label: 'Subsection' }, // botany
  { value: 'series', label: 'Series' }, // botany
  { value: 'subseries', label: 'Subseries' }, // botany
  { value: 'species', label: 'Species' },
  { value: 'subspecies', label: 'Subspecies' },
  { value: 'variety', label: 'Variety' }, // botany (varietas)
  { value: 'subvariety', label: 'Subvariety' }, // botany
  { value: 'form', label: 'Form' }, // botany (forma)
  { value: 'subform', label: 'Subform' }, // botany
];

export const RANK_VALUES = RANKS.map((r) => r.value);

// UI option representing "no rank" — stored as null, never as a string.
export const NO_RANK = 'No rank';

const RANK_LABELS = new Map(RANKS.map((r) => [r.value, r.label]));

// Display label for a stored (lowercase) rank value. Falls back to
// capitalising unknown values (e.g. legacy/imported ranks not in the list).
export const rankLabel = (value: string) =>
  RANK_LABELS.get(value) ?? value.charAt(0).toUpperCase() + value.slice(1);

export const isValidRank = (value: string) => RANK_VALUES.includes(value);

// Position in the hierarchy: 0 = broadest, higher = finer. -1 if unknown.
export const rankIndex = (value: string) => RANK_VALUES.indexOf(value);

// The principal ranks, e.g. for filtering external (OTT) search results.
export const MAIN_RANKS = [
  'domain',
  'kingdom',
  'phylum',
  'class',
  'order',
  'family',
  'genus',
];
