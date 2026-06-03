// Centralised date formatting. We use a fixed international format (day before
// month, month spelled out) rather than the runtime locale so dates read the
// same for everyone and can't be misread as American month/day order.
const LOCALE = 'en-GB';

// e.g. "3 June 2026"
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

// e.g. "3 June 2026, 14:30"
export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString(LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
