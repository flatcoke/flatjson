"use client";

import { useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import TreeView from "@/components/TreeView";
import SplitPanel from "@/components/SplitPanel";
import Toolbar from "@/components/Toolbar";
import { sampleData, defaultSample } from "@/components/SampleData";

const JsonEditor = dynamic(() => import("@/components/JsonEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center text-gray-400 text-sm">
      Loading editor...
    </div>
  ),
});

export default function Home() {
  const [input, setInput] = useState(sampleData[defaultSample]);
  const [layout, setLayout] = useState<"horizontal" | "vertical">("horizontal");
  const [showTypes, setShowTypes] = useState(false);
  const [showArrayIndex, setShowArrayIndex] = useState(true);
  const [vimMode, setVimMode] = useState(false);
  const parseResult = useMemo(() => {
    if (!input.trim()) {
      return { data: null, error: null, empty: true };
    }
    try {
      const data = JSON.parse(input);
      return { data, error: null, empty: false };
    } catch (e) {
      return { data: null, error: (e as Error).message, empty: false };
    }
  }, [input]);

  const handleFormat = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, 2));
    } catch {
      // ignore if invalid
    }
  }, [input]);

  const handleMinify = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
    } catch {
      // ignore if invalid
    }
  }, [input]);

  const handleClear = useCallback(() => {
    setInput("");
  }, []);

  const handleLoadSample = useCallback((json: string) => {
    setInput(json);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-gray-800">
            <span className="text-blue-600">{"{"}</span>
            {" FlatJSON "}
            <span className="text-blue-600">{"}"}</span>
          </h1>
          <span className="text-xs text-gray-400">JSON Parser & Formatter</span>
        </div>
      </header>

      {/* Toolbar */}
      <Toolbar
        onFormat={handleFormat}
        onMinify={handleMinify}
        layout={layout}
        onLayoutChange={setLayout}
        showTypes={showTypes}
        onShowTypesChange={setShowTypes}
        showArrayIndex={showArrayIndex}
        onShowArrayIndexChange={setShowArrayIndex}
        vimMode={vimMode}
        onVimModeChange={setVimMode}
        onLoadSample={handleLoadSample}
        onClear={handleClear}
      />

      {/* Main content */}
      <div className="flex-1 min-h-0">
        <SplitPanel
          direction={layout}
          left={
            <div className="h-full flex flex-col border-r border-gray-200">
              <div className="px-3 py-1.5 bg-[#fafafa] border-b border-gray-200 text-xs text-gray-500 font-medium">
                JSON Input
              </div>
              <div className="flex-1 min-h-0">
                <JsonEditor value={input} onChange={setInput} vimMode={vimMode} />
              </div>
            </div>
          }
          right={
            <div className="h-full flex flex-col">
              <div className="px-3 py-1.5 bg-[#fafafa] border-b border-gray-200 text-xs text-gray-500 font-medium flex items-center justify-between">
                <span>Parsed Output</span>
                {parseResult.error && (
                  <span className="text-red-500 text-[11px]">⚠ Parse Error</span>
                )}
                {!parseResult.error && !parseResult.empty && (
                  <span className="text-green-600 text-[11px]">✓ Valid JSON</span>
                )}
              </div>
              <div className="flex-1 min-h-0 overflow-auto">
                {parseResult.empty && (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    Enter or paste JSON in the editor
                  </div>
                )}
                {parseResult.error && (
                  <div className="p-4">
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <div className="text-red-700 text-sm font-medium mb-1">
                        Parse Error
                      </div>
                      <div className="text-red-600 text-xs font-mono">
                        {parseResult.error}
                      </div>
                    </div>
                  </div>
                )}
                {!parseResult.error && !parseResult.empty && parseResult.data !== null && (
                  <TreeView
                    data={parseResult.data}
                    showTypes={showTypes}
                    showArrayIndex={showArrayIndex}
                  />
                )}
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}
