"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import YAML from "yaml";
import Toolbar from "@/components/Toolbar";
import SplitPanel from "@/components/SplitPanel";
import PanelHeader from "@/components/PanelHeader";
import StatusLabel from "@/components/StatusLabel";
import OutputPanel from "@/components/OutputPanel";
import { samples, DEFAULT_SAMPLE } from "@/components/SampleData";
import { themes, DEFAULT_THEME } from "@/components/themes";
import { tryParse } from "@/lib/parser";

const TREE_THRESHOLD = 1024 * 1024; // 1MB

const JsonEditor = dynamic(() => import("@/components/JsonEditor"), {
  ssr: false,
  loading: () => <div className="h-full flex items-center justify-center text-gray-400 text-sm">Loading editor…</div>,
});

type OutputTab = "tree" | "json" | "yaml";

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

  if (!mounted) {
    return <div className="h-screen bg-white" />;
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      <header className="flex items-baseline gap-2 px-4 py-2 border-b border-gray-200">
        <h1 className="text-lg font-bold text-gray-800">
          <span className="text-brand font-mono logo-brace mr-0.5">{"{"}</span>flatJSON<span className="text-brand font-mono logo-brace ml-0.5">{"}"}</span>
        </h1>
        <span className="text-xs text-gray-400 self-center">JSON & YAML Parser</span>
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
              <PanelHeader right={<StatusLabel parsed={parsed} largeFile={largeFile} />}>Input</PanelHeader>
              <div className="flex-1 min-h-0">
                <JsonEditor value={input} onChange={setInput} vimMode={vimMode} onLargeFile={setLargeFile} />
              </div>
            </div>
          }
          right={
            <OutputPanel
              parsed={parsed}
              outputTab={outputTab}
              onTabChange={setOutputTab}
              formattedJson={formattedJson}
              formattedYaml={formattedYaml}
              showTypes={showTypes}
              showArrayIndex={showArrayIndex}
              colorTheme={colorTheme}
              inputSize={input.length}
              treeDisabled={input.length > TREE_THRESHOLD}
              largeFile={largeFile}
            />
          }
        />
      </div>
    </div>
  );
}
