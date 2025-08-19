export type PuzzleCode = {
  height: number;
  width: number;
  fillPercent: number;
  seed: string;
  code: string; // formatted code with hyphen
};

export function validatePuzzleCode(rawCode: string | undefined): PuzzleCode | null {
  if (!rawCode || typeof rawCode !== 'string') return null;
  // first 6 digits are numbers, at least 1 [a-zA-Z0-9] after
  if (!/^\d{6}[a-zA-Z0-9]+$/.test(rawCode)) return null;
  // h, w must be 5 to 30
  const height = parseInt(rawCode.slice(0, 2), 10);
  const width = parseInt(rawCode.slice(2, 4), 10);
  if (height < 5 || height > 30 || width < 5 || width > 30) return null;
  // fillPercent must be 10 to 90
  const fillPercent = parseInt(rawCode.slice(4, 6), 10);
  if (fillPercent < 10 || fillPercent > 90) return null;
  // seed is the rest
  const seed = rawCode.slice(6).toUpperCase();
  const code = `${rawCode.slice(0, 6)}-${rawCode.slice(6).toUpperCase()}`;
  return { height, width, fillPercent, seed, code };
}
