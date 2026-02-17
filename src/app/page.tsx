"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import YAML from "yaml";
import TreeView from "@/components/TreeView";
import SplitPanel from "@/components/SplitPanel";
import Toolbar from "@/components/Toolbar";
import { samples, DEFAULT_SAMPLE } from "@/components/SampleData";

const JsonEditor = dynamic(() => import("@/components/JsonEditor"), {
  ssr: false,
  loading: () => <div className="h-full flex items-center justify-center text-gray-400 text-sm">Loading editor…</div>,
});

type ParseResult =
  | { ok: true; data: unknown; source: "json" | "yaml" }
  | { ok: false; empty: true }
  | { ok: false; empty: false; error: string };

function tryParse(input: string): ParseResult {
  const trimmed = input.trim();
  if (!trimmed) return { ok: false, empty: true };

  // Try JSON first
  try {
    return { ok: true, data: JSON.parse(trimmed), source: "json" };
  } catch {}

  // Try YAML
  try {
    const data = YAML.parse(trimmed);
    if (data !== null && data !== undefined && typeof data === "object") {
      return { ok: true, data, source: "yaml" };
    }
  } catch {}

  // JSON error message is more useful for the user
  try {
    JSON.parse(trimmed);
  } catch (e) {
    return { ok: false, empty: false, error: (e as Error).message };
  }

  return { ok: false, empty: false, error: "Invalid input" };
}

export default function Home() {
  const [input, setInput] = useState(samples[DEFAULT_SAMPLE]);
  const [showTypes, setShowTypes] = useState(false);
  const [showArrayIndex, setShowArrayIndex] = useState(true);
  const [vimMode, setVimMode] = useState(false);

  const parsed = useMemo(() => tryParse(input), [input]);

  function format() {
    if (!parsed.ok) return;
    setInput(JSON.stringify(parsed.data, null, 2));
  }

  function minify() {
    if (!parsed.ok) return;
    setInput(JSON.stringify(parsed.data));
  }

  function toYaml() {
    if (!parsed.ok) return;
    setInput(YAML.stringify(parsed.data, { indent: 2 }));
  }

  const statusLabel = parsed.ok
    ? parsed.source === "yaml"
      ? <span className="text-green-600 text-[11px]">✓ YAML detected</span>
      : <span className="text-green-600 text-[11px]">✓ Valid JSON</span>
    : !parsed.empty
      ? <span className="text-red-500 text-[11px]">⚠ Error</span>
      : null;

  return (
    <div className="h-screen flex flex-col bg-white">
      <header className="flex items-center gap-2 px-4 py-2 border-b border-gray-200">
        <h1 className="text-lg font-bold text-gray-800">
          <span className="text-blue-600">{"{"}</span> FlatJSON <span className="text-blue-600">{"}"}</span>
        </h1>
        <span className="text-xs text-gray-400">JSON & YAML Parser</span>
      </header>

      <Toolbar
        onFormat={format}
        onMinify={minify}
        onToYaml={toYaml}
        onClear={() => setInput("")}
        showTypes={showTypes}
        onShowTypesChange={setShowTypes}
        showArrayIndex={showArrayIndex}
        onShowArrayIndexChange={setShowArrayIndex}
        vimMode={vimMode}
        onVimModeChange={setVimMode}
        onLoadSample={setInput}
      />

      <div className="flex-1 min-h-0">
        <SplitPanel
          left={
            <div className="h-full flex flex-col border-r border-gray-200">
              <PanelHeader>Input</PanelHeader>
              <div className="flex-1 min-h-0">
                <JsonEditor value={input} onChange={setInput} vimMode={vimMode} />
              </div>
            </div>
          }
          right={
            <div className="h-full flex flex-col">
              <PanelHeader right={statusLabel}>Parsed Output</PanelHeader>
              <div className="flex-1 min-h-0 overflow-auto">
                {parsed.ok ? (
                  <TreeView data={parsed.data} showTypes={showTypes} showArrayIndex={showArrayIndex} />
                ) : parsed.empty ? (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    Paste JSON or YAML in the editor
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-red-700 text-sm font-medium">Parse Error</p>
                      <p className="text-red-600 text-xs font-mono mt-1">{parsed.error}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}

function PanelHeader({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="px-3 py-1.5 bg-[#fafafa] border-b border-gray-200 text-xs text-gray-500 font-medium flex items-center justify-between">
      <span>{children}</span>
      {right}
    </div>
  );
}
