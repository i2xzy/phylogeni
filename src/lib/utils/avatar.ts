// Avatars are stored in profiles.avatar_url as a directly-renderable URL: either
// an external provider photo (e.g. Google) or the public URL of a file we
// uploaded to the `avatars` storage bucket. Supabase public URLs contain this
// segment, which lets us tell our own uploads apart from external URLs and
// recover the storage path for deletion.
const AVATARS_PUBLIC_SEGMENT = '/storage/v1/object/public/avatars/';

// True when the URL points at a file we uploaded (vs an external provider URL).
export const isStorageAvatarUrl = (url: string) =>
  url.includes(AVATARS_PUBLIC_SEGMENT);

// The storage path for one of our uploaded avatars, or null for external URLs.
export const storagePathFromAvatarUrl = (url: string): string | null => {
  const i = url.indexOf(AVATARS_PUBLIC_SEGMENT);
  return i === -1 ? null : url.slice(i + AVATARS_PUBLIC_SEGMENT.length);
};
