import YAML from "yaml";

export type ParseResult =
  | { ok: true; data: unknown; source: "json" | "yaml" }
  | { ok: false; empty: true }
  | { ok: false; empty: false; error: string; position?: number };

export function tryParse(input: string): ParseResult {
  const trimmed = input.trim();
  if (!trimmed) return { ok: false, empty: true };

  try {
    return { ok: true, data: JSON.parse(trimmed), source: "json" };
  } catch {}

  try {
    const data = YAML.parse(trimmed);
    if (data !== null && data !== undefined && typeof data === "object") {
      return { ok: true, data, source: "yaml" };
    }
  } catch {}

  try {
    JSON.parse(trimmed);
  } catch (e) {
    const err = e as Error;
    return { ok: false, empty: false, error: err.message, position: extractPosition(err, trimmed) };
  }
  return { ok: false, empty: false, error: "Invalid input" };
}

/** Check if a JSON prefix can be completed to valid JSON by closing brackets. */
function isCompletable(prefix: string): boolean {
  const stack: string[] = [];
  let inStr = false, esc = false;
  for (const ch of prefix) {
    if (esc) { esc = false; continue; }
    if (ch === "\\") { esc = true; continue; }
    if (ch === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (ch === "{" || ch === "[") stack.push(ch);
    if (ch === "}" || ch === "]") stack.pop();
  }
  let cleaned = prefix;
  if (inStr) { const q = cleaned.lastIndexOf('"'); if (q >= 0) cleaned = cleaned.slice(0, q); }
  const closers = [...stack].reverse().map(ch => ch === "{" ? "}" : "]").join("");
  const suffixes = [closers, "null" + closers, ":null" + closers];
  const trims = [cleaned, cleaned.replace(/,\s*$/, ""), cleaned.replace(/:\s*$/, "null,").replace(/,\s*$/, ""), cleaned.replace(/"[^"]*$/, "").replace(/[,:]\s*$/, "")];
  for (const t of trims) { for (const s of suffixes) { try { JSON.parse(t + s); return true; } catch {} } }
  return false;
}

function extractPosition(err: Error, text: string): number | undefined {
  const posMatch = err.message.match(/position\s+(\d+)/i);
  if (posMatch) return Number(posMatch[1]);
  const lcMatch = err.message.match(/line\s+(\d+)\s+column\s+(\d+)/i);
  if (lcMatch) {
    const tl = Number(lcMatch[1]), tc = Number(lcMatch[2]);
    let l = 1, c = 1;
    for (let i = 0; i < text.length; i++) {
      if (l === tl && c === tc) return i;
      if (text[i] === "\n") { l++; c = 1; } else { c++; }
    }
  }
  // Binary search: find longest completable prefix
  let lo = 0, hi = text.length;
  while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (isCompletable(text.slice(0, mid))) lo = mid; else hi = mid - 1; }
  return lo > 0 && lo < text.length ? lo : undefined;
}
