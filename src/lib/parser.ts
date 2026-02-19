import YAML from "yaml";

export type ParseResult =
  | { ok: true; data: unknown; source: "json" | "yaml" }
  | { ok: false; empty: true }
  | { ok: false; empty: false; error: string };

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
    return { ok: false, empty: false, error: (e as Error).message };
  }
  return { ok: false, empty: false, error: "Invalid input" };
}
