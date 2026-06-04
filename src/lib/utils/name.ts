// Full names are letters only (no digits or punctuation). Shared by the account
// form (live field validation) and the saveProfile server action so the two
// can't drift. Both trim before checking.
const DISALLOWED = /\d|[$&\\+,:;=?@#|'<>.^*()%!-]/;

export const hasDisallowedNameChars = (value: string) => DISALLOWED.test(value);

export const isValidFullName = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length > 0 && !hasDisallowedNameChars(trimmed);
};
