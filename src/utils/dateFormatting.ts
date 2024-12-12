export function formatDateForInput(date: Date | string): string {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

export function formatDateForDisplay(date: Date | string): string {
  return new Date(date).toLocaleDateString();
}