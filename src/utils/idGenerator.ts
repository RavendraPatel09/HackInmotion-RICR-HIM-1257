/**
 * Generates unique tracking IDs in format: CFX-2026-XXXX (e.g. CFX-2026-8A72)
 */
export function generateTrackingId(): string {
  const year = new Date().getFullYear();
  const hex = Math.floor(1000 + Math.random() * 9000)
    .toString(16)
    .toUpperCase();
  const randNum = Math.floor(10 + Math.random() * 89);
  return `CFX-${year}-${hex}${randNum}`;
}

export function generateIssueId(): string {
  return `iss-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}
