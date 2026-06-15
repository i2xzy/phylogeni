// Readable English lists: "A", "A and B", or "A, B and C" (no Oxford comma).
// Callers decide how to handle long lists (e.g. let them wrap).
export const formatNameList = (names: string[]): string =>
  names.length <= 1
    ? names.join('')
    : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;

// The separator that precedes item `index` when rendering the same list as JSX
// (e.g. with links): '' for the first, ' and ' before the last, ', ' between.
export const listSeparator = (index: number, length: number): string =>
  index === 0 ? '' : index === length - 1 ? ' and ' : ', ';
