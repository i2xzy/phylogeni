import { RevisionWithUser } from '~/types/database';

export type RevisionGroup = {
  key: string;
  mode: RevisionWithUser['mode'];
  user: RevisionWithUser['user'];
  revisions: RevisionWithUser[];
};

// A burst of edits made in one sitting: revisions closer together than this are
// treated as part of the same action.
const DEFAULT_GAP_MS = 10 * 60 * 1000; // 10 minutes

// Collapse consecutive revisions by the same user and the same mode that happen
// within `gapMs` of each other into a single group. Input is assumed sorted by
// created_at (the feed is newest-first); grouping is order-preserving and makes
// no assumption about the clade, so it also fits a cross-clade activity feed.
export const groupRevisions = (
  rows: RevisionWithUser[],
  gapMs: number = DEFAULT_GAP_MS
): RevisionGroup[] => {
  const groups: RevisionGroup[] = [];

  for (const row of rows) {
    const group = groups[groups.length - 1];
    const prev = group?.revisions[group.revisions.length - 1];
    const sameUser = (group?.user?.id ?? null) === (row.user?.id ?? null);
    const sameMode = group?.mode === row.mode;
    const closeInTime =
      prev != null &&
      Math.abs(
        new Date(prev.created_at).getTime() - new Date(row.created_at).getTime()
      ) <= gapMs;

    if (group && sameUser && sameMode && closeInTime) {
      group.revisions.push(row);
    } else {
      groups.push({
        key: String(row.id),
        mode: row.mode,
        user: row.user,
        revisions: [row],
      });
    }
  }

  return groups;
};

// The clade a revision is about. Deletes null out clade_id (the row is gone),
// so fall back to the snapshot name to still tell two deleted clades apart.
export const subjectKey = (r: RevisionWithUser): string =>
  r.clade_id != null
    ? `id:${r.clade_id}`
    : `name:${r.after?.name ?? r.before?.name ?? ''}`;

// Whether a group should collapse into one sentence that names the clades. Only
// when it spans 2+ distinct clades ("A, B and C were moved..."). A single clade
// touched repeatedly stays as individual rows — naming it twice, or saying
// "deleted 2 times", reads wrong.
export const isGroupCollapsible = (group: RevisionGroup): boolean => {
  if (group.revisions.length < 2) return false;
  return new Set(group.revisions.map(subjectKey)).size >= 2;
};
