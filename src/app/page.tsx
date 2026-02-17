"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import TreeView from "@/components/TreeView";
import SplitPanel from "@/components/SplitPanel";
import Toolbar from "@/components/Toolbar";
import { samples, DEFAULT_SAMPLE } from "@/components/SampleData";

const JsonEditor = dynamic(() => import("@/components/JsonEditor"), {
  ssr: false,
  loading: () => <div className="h-full flex items-center justify-center text-gray-400 text-sm">Loading editor…</div>,
});

export default function Home() {
  const [input, setInput] = useState(samples[DEFAULT_SAMPLE]);
  const [layout, setLayout] = useState<"horizontal" | "vertical">("horizontal");
  const [showTypes, setShowTypes] = useState(false);
  const [showArrayIndex, setShowArrayIndex] = useState(true);
  const [vimMode, setVimMode] = useState(false);

  const parsed = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return { ok: false as const, empty: true } as const;
    try {
      return { ok: true as const, data: JSON.parse(trimmed) };
    } catch (e) {
      return { ok: false as const, empty: false, error: (e as Error).message };
    }
  }, [input]);

  function format() {
    try { setInput(JSON.stringify(JSON.parse(input), null, 2)); } catch {}
  }

  function minify() {
    try { setInput(JSON.stringify(JSON.parse(input))); } catch {}
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      <header className="flex items-center gap-2 px-4 py-2 border-b border-gray-200">
        <h1 className="text-lg font-bold text-gray-800">
          <span className="text-blue-600">{"{"}</span> FlatJSON <span className="text-blue-600">{"}"}</span>
        </h1>
        <span className="text-xs text-gray-400">JSON Parser & Formatter</span>
      </header>

      <Toolbar
        onFormat={format}
        onMinify={minify}
        onClear={() => setInput("")}
        layout={layout}
        onLayoutChange={setLayout}
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
          direction={layout}
          left={
            <div className="h-full flex flex-col border-r border-gray-200">
              <PanelHeader>JSON Input</PanelHeader>
              <div className="flex-1 min-h-0">
                <JsonEditor value={input} onChange={setInput} vimMode={vimMode} />
              </div>
            </div>
          }
          right={
            <div className="h-full flex flex-col">
              <PanelHeader right={
                parsed.ok
                  ? <span className="text-green-600 text-[11px]">✓ Valid</span>
                  : !('empty' in parsed && parsed.empty) && <span className="text-red-500 text-[11px]">⚠ Error</span>
              }>
                Parsed Output
              </PanelHeader>
              <div className="flex-1 min-h-0 overflow-auto">
                {('empty' in parsed && parsed.empty) && (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    Paste JSON in the editor
                  </div>
                )}
                {'error' in parsed && parsed.error && (
                  <div className="p-4">
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-red-700 text-sm font-medium">Parse Error</p>
                      <p className="text-red-600 text-xs font-mono mt-1">{parsed.error}</p>
                    </div>
                  </div>
                )}
                {parsed.ok && (
                  <TreeView data={parsed.data} showTypes={showTypes} showArrayIndex={showArrayIndex} />
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
