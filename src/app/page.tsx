"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import YAML from "yaml";
import TreeView from "@/components/TreeView";
import CodeView from "@/components/CodeView";
import Toolbar from "@/components/Toolbar";
import SplitPanel from "@/components/SplitPanel";
import { samples, DEFAULT_SAMPLE } from "@/components/SampleData";
import { themes, DEFAULT_THEME } from "@/components/themes";

const TREE_THRESHOLD = 1024 * 1024; // 1MB

const JsonEditor = dynamic(() => import("@/components/JsonEditor"), {
  ssr: false,
  loading: () => <div className="h-full flex items-center justify-center text-gray-400 text-sm">Loading editor…</div>,
});

type OutputTab = "tree" | "json" | "yaml";

type ParseResult =
  | { ok: true; data: unknown; source: "json" | "yaml" }
  | { ok: false; empty: true }
  | { ok: false; empty: false; error: string };

function tryParse(input: string): ParseResult {
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

  try { JSON.parse(trimmed); } catch (e) {
    return { ok: false, empty: false, error: (e as Error).message };
  }
  return { ok: false, empty: false, error: "Invalid input" };
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <button
      onClick={copy}
      className="p-1 rounded hover:bg-gray-200 active:bg-gray-300 transition-colors text-gray-400 hover:text-gray-600"
      title="Copy"
    >
      {copied ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
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

export default function Home() {
  const [input, setInput] = useState("");
  const [showTypes, setShowTypes] = useState(false);
  const [showArrayIndex, setShowArrayIndex] = useState(true);
  const [outputTab, setOutputTab] = useState<OutputTab>("tree");
  const [vimMode, setVimMode] = useState(false);
  const [themeName, setThemeName] = useState(DEFAULT_THEME);
  const [mounted, setMounted] = useState(false);
  const [largeFile, setLargeFile] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("flatjson:vim") === "true") setVimMode(true);
    const saved = localStorage.getItem("flatjson:theme");
    if (saved && themes[saved]) setThemeName(saved);
    if (!localStorage.getItem("flatjson:visited")) {
      setInput(samples[DEFAULT_SAMPLE]);
      localStorage.setItem("flatjson:visited", "1");
    }
    setMounted(true);
  }, []);

  function toggleVim(v: boolean) {
    setVimMode(v);
    localStorage.setItem("flatjson:vim", String(v));
  }

  function changeTheme(t: string) {
    setThemeName(t);
    localStorage.setItem("flatjson:theme", t);
  }

  const colorTheme = themes[themeName];

  const parsed = useMemo(() => tryParse(input), [input]);

  const formattedJson = useMemo(() => {
    if (!parsed.ok) return "";
    return JSON.stringify(parsed.data, null, 2);
  }, [parsed]);

  const formattedYaml = useMemo(() => {
    if (!parsed.ok || outputTab !== "yaml") return "";
    return YAML.stringify(parsed.data, { indent: 2 });
  }, [parsed, outputTab]);

  const treeDisabled = input.length > TREE_THRESHOLD;

  const statusLabel = parsed.ok
    ? <span className="text-green-600 text-[11px]">
        ✓ {parsed.source === "yaml" ? "YAML" : "JSON"}
        {largeFile && <span className="text-amber-500 ml-1">⚡ Lite</span>}
      </span>
    : !parsed.empty
      ? <span className="text-red-500 text-[11px]">⚠ Error</span>
      : null;

  if (!mounted) {
    return <div className="h-screen bg-white" />;
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      <header className="flex items-center gap-2 px-4 py-2 border-b border-gray-200">
        <h1 className="text-lg font-bold text-gray-800">
          <span className="text-[#4A0E8F]">{"{"}</span> flatJSON <span className="text-[#4A0E8F]">{"}"}</span>
        </h1>
        <span className="text-xs text-gray-400">JSON & YAML Parser</span>
      </header>

      <Toolbar
        onFormat={() => { if (parsed.ok) setInput(parsed.source === "yaml" ? YAML.stringify(parsed.data, { indent: 2 }) : JSON.stringify(parsed.data, null, 2)); }}
        onMinify={() => { if (parsed.ok) setInput(JSON.stringify(parsed.data)); }}
        isYaml={parsed.ok && parsed.source === "yaml"}
        onClear={() => setInput("")}
        showTypes={showTypes}
        onShowTypesChange={setShowTypes}
        showArrayIndex={showArrayIndex}
        onShowArrayIndexChange={setShowArrayIndex}
        vimMode={vimMode}
        onVimModeChange={toggleVim}
        theme={themeName}
        onThemeChange={changeTheme}
        onLoadSample={setInput}
      />

      <div className="flex-1 min-h-0">
        <SplitPanel
          left={
            <div className="h-full flex flex-col border-r border-gray-200">
              <PanelHeader right={statusLabel}>Input</PanelHeader>
              <div className="flex-1 min-h-0">
                <JsonEditor value={input} onChange={setInput} vimMode={vimMode} onLargeFile={setLargeFile} />
              </div>
            </div>
          }
          right={
            <div className="h-full flex flex-col">
              <div className="px-3 py-1.5 bg-[#fafafa] border-b border-gray-200 flex items-center justify-between">
                <div className="flex gap-1">
                  {(["tree", "json", "yaml"] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setOutputTab(tab)}
                      className={`px-2.5 py-0.5 text-xs font-medium rounded transition-colors ${
                        outputTab === tab
                          ? "bg-[#4A0E8F] text-white"
                          : "text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {tab === "tree" ? "Tree" : tab.toUpperCase()}
                    </button>
                  ))}
                </div>
                {parsed.ok && (
                  <CopyBtn text={outputTab === "yaml" ? formattedYaml : formattedJson} />
                )}
              </div>
              <div className="flex-1 min-h-0 overflow-auto">
                {parsed.ok ? (
                  outputTab === "tree" ? (
                    treeDisabled ? (
                      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        <div className="text-center">
                          <p className="text-amber-500 font-medium">⚡ Large file — Tree view disabled</p>
                          <p className="mt-1 text-xs">Switch to JSON or YAML tab to view</p>
                        </div>
                      </div>
                    ) : (
                      <TreeView data={parsed.data} showTypes={showTypes} showArrayIndex={showArrayIndex} colorTheme={colorTheme} inputSize={input.length} />
                    )
                  ) : (
                    largeFile ? (
                      <pre className="p-4 text-[12px] font-mono font-normal whitespace-pre-wrap text-gray-700" style={{ minHeight: 0 }}>
                        {outputTab === "json" ? formattedJson : formattedYaml}
                      </pre>
                    ) : (
                      <CodeView
                        text={outputTab === "json" ? formattedJson : formattedYaml}
                        mode={outputTab as "json" | "yaml"}
                        theme={colorTheme}
                      />
                    )
                  )
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
