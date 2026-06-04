// Single source of truth for taxonomic ranks. The nomenclatural codes
// (zoological = ICZN, botanical = ICN) recognise different ranks and, at the
// phylum level, use different names (zoology "phylum" vs botany "division"), so
// each code has its own ordered list. A clade's code is derived from its
// lineage (its kingdom), see codeForLineageNames().
//
// Casing: values are lowercase (how external sources represent ranks); imports
// from other databases should be normalised to these values.

export type Rank = { value: string; label: string };

export type NomenclatureCode = 'zoological' | 'botanical';

// Every rank across all codes, with its display label. Used for labels,
// validation, and as the fallback list when a clade's code is unknown.
export const RANKS: Rank[] = [
  { value: 'domain', label: 'Domain' },
  { value: 'superkingdom', label: 'Superkingdom' },
  { value: 'kingdom', label: 'Kingdom' },
  { value: 'subkingdom', label: 'Subkingdom' },
  { value: 'infrakingdom', label: 'Infrakingdom' },
  { value: 'superphylum', label: 'Superphylum' },
  { value: 'phylum', label: 'Phylum' }, // zoology
  { value: 'subphylum', label: 'Subphylum' }, // zoology
  { value: 'infraphylum', label: 'Infraphylum' }, // zoology
  { value: 'division', label: 'Division' }, // botany (~ phylum)
  { value: 'subdivision', label: 'Subdivision' }, // botany
  { value: 'superclass', label: 'Superclass' },
  { value: 'class', label: 'Class' },
  { value: 'subclass', label: 'Subclass' },
  { value: 'infraclass', label: 'Infraclass' },
  { value: 'superorder', label: 'Superorder' },
  { value: 'order', label: 'Order' },
  { value: 'suborder', label: 'Suborder' },
  { value: 'infraorder', label: 'Infraorder' }, // zoology
  { value: 'parvorder', label: 'Parvorder' }, // zoology
  { value: 'superfamily', label: 'Superfamily' }, // zoology
  { value: 'family', label: 'Family' },
  { value: 'subfamily', label: 'Subfamily' },
  { value: 'tribe', label: 'Tribe' },
  { value: 'subtribe', label: 'Subtribe' },
  { value: 'genus', label: 'Genus' },
  { value: 'subgenus', label: 'Subgenus' },
  { value: 'section', label: 'Section' }, // botany (infrageneric)
  { value: 'subsection', label: 'Subsection' }, // botany
  { value: 'series', label: 'Series' }, // botany (infrageneric)
  { value: 'subseries', label: 'Subseries' }, // botany
  { value: 'species', label: 'Species' },
  { value: 'subspecies', label: 'Subspecies' },
  { value: 'variety', label: 'Variety' }, // botany (infraspecific)
  { value: 'subvariety', label: 'Subvariety' }, // botany
  { value: 'form', label: 'Form' }, // botany (infraspecific)
  { value: 'subform', label: 'Subform' }, // botany
];

export const RANK_VALUES = RANKS.map((r) => r.value);

// Ordered rank values per code (broadest -> finest).
const ZOOLOGICAL_RANK_VALUES = [
  'domain',
  'superkingdom',
  'kingdom',
  'subkingdom',
  'infrakingdom',
  'superphylum',
  'phylum',
  'subphylum',
  'infraphylum',
  'superclass',
  'class',
  'subclass',
  'infraclass',
  'superorder',
  'order',
  'suborder',
  'infraorder',
  'parvorder',
  'superfamily',
  'family',
  'subfamily',
  'tribe',
  'subtribe',
  'genus',
  'subgenus',
  'species',
  'subspecies',
];

const BOTANICAL_RANK_VALUES = [
  'domain',
  'superkingdom',
  'kingdom',
  'subkingdom',
  'infrakingdom',
  'division',
  'subdivision',
  'superclass',
  'class',
  'subclass',
  'infraclass',
  'superorder',
  'order',
  'suborder',
  'family',
  'subfamily',
  'tribe',
  'subtribe',
  'genus',
  'subgenus',
  'section',
  'subsection',
  'series',
  'subseries',
  'species',
  'subspecies',
  'variety',
  'subvariety',
  'form',
  'subform',
];

const RANK_VALUES_BY_CODE: Record<NomenclatureCode, string[]> = {
  zoological: ZOOLOGICAL_RANK_VALUES,
  botanical: BOTANICAL_RANK_VALUES,
};

// UI option representing "no rank" — stored as null, never as a string.
export const NO_RANK = 'No rank';

const RANK_LABELS = new Map(RANKS.map((r) => [r.value, r.label]));

// Display label for a stored (lowercase) rank value. Falls back to
// capitalising unknown values (e.g. legacy/imported ranks not in the list).
export const rankLabel = (value: string) =>
  RANK_LABELS.get(value) ?? value.charAt(0).toUpperCase() + value.slice(1);

export const isValidRank = (value: string) => RANK_VALUES.includes(value);

// The ranks to offer for a clade, given its code. Unknown code -> all ranks.
export const ranksForCode = (code: NomenclatureCode | null): Rank[] => {
  const values = code ? RANK_VALUES_BY_CODE[code] : RANK_VALUES;
  return values.map((value) => ({ value, label: rankLabel(value) }));
};

// Position in the hierarchy (0 = broadest), within a code's ordering or the
// full list. -1 if the rank isn't part of that ordering.
export const rankIndex = (
  value: string,
  code: NomenclatureCode | null = null
) => (code ? RANK_VALUES_BY_CODE[code] : RANK_VALUES).indexOf(value);

// Clades governed by the ICN (algae, fungi, plants) use botanical ranks;
// everything else (animals, bacteria, protists, ...) defaults to zoological.
// Matched case-insensitively against any name in a clade's lineage. Algae are
// scattered across the tree, so extend this list as the tree is seeded.
export const ICN_GOVERNED_CLADES = [
  // Plants + green algae
  'archaeplastida',
  'plantae',
  'viridiplantae',
  'chloroplastida',
  'embryophyta',
  'chlorophyta',
  // Red algae, glaucophytes
  'rhodophyta',
  'glaucophyta',
  // Fungi
  'fungi',
  // Photosynthetic stramenopiles (brown algae, diatoms)
  'ochrophyta',
  'phaeophyceae',
  'bacillariophyta',
];

// Clades where only zoological ranks make sense (animals + groups that never
// use botanical ranks). Used to resolve the otherwise-ambiguous default.
export const ZOOLOGICAL_SAFE_CLADES = [
  'animalia',
  'metazoa',
  'bacteria',
  'archaea',
];

// Derive the nomenclatural code from a lineage (the clade's own + ancestor
// names): botanical under an ICN-governed clade, zoological under a
// zoological-safe clade, or null (ambiguous) when neither — let the user pick.
export const codeForLineageNames = (
  names: (string | null | undefined)[]
): NomenclatureCode | null => {
  const lower = names
    .filter((n): n is string => Boolean(n))
    .map((n) => n.toLowerCase());
  if (lower.some((n) => ICN_GOVERNED_CLADES.includes(n))) return 'botanical';
  if (lower.some((n) => ZOOLOGICAL_SAFE_CLADES.includes(n)))
    return 'zoological';
  return null;
};

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
