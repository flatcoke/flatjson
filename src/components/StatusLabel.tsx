import type { ParseResult } from "@/lib/parser";

export default function StatusLabel({ parsed, largeFile }: { parsed: ParseResult; largeFile: boolean }) {
  if (parsed.ok) {
    return (
      <span className="text-green-600 text-code-sm">
        ✓ {parsed.source === "yaml" ? "YAML" : "JSON"}
        {largeFile && <span className="text-amber-500 ml-1">⚡ Lite</span>}
      </span>
    );
  }
  if (!parsed.empty) {
    return <span className="text-red-500 text-code-sm">⚠ Error</span>;
  }
  return null;
}
