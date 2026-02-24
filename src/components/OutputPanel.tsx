"use client";

import TreeView from "./TreeView";
import CodeView from "./CodeView";
import CopyBtn from "./CopyBtn";
import { colorizeJson } from "./CodeView";
import type { ColorTheme } from "./themes";
import type { ParseResult } from "@/lib/parser";

type OutputTab = "tree" | "json" | "yaml";

interface OutputPanelProps {
  parsed: ParseResult;
  input: string;
  outputTab: OutputTab;
  onTabChange: (tab: OutputTab) => void;
  formattedJson: string;
  formattedYaml: string;
  showTypes: boolean;
  showArrayIndex: boolean;
  colorTheme: ColorTheme;
  inputSize: number;
  treeDisabled: boolean;
  largeFile: boolean;
  settingsSlot?: React.ReactNode;
}

export default function OutputPanel({
  parsed,
  input,
  outputTab,
  onTabChange,
  formattedJson,
  formattedYaml,
  showTypes,
  showArrayIndex,
  colorTheme,
  inputSize,
  treeDisabled,
  largeFile,
  settingsSlot,
}: OutputPanelProps) {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-dark-bg">
      <div className="px-3 bg-surface dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border flex items-center justify-between h-[33px]">
        <div className="flex h-full items-center">
          {(["tree", "json", "yaml"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-3 text-xs font-medium transition-colors h-full border-b-2 ${
                outputTab === tab
                  ? "border-brand text-gray-800 dark:text-dark-text"
                  : "border-transparent text-gray-400 dark:text-dark-text-muted hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              {tab === "tree" ? "Tree" : tab.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          {parsed.ok && (
            <CopyBtn text={outputTab === "yaml" ? formattedYaml : formattedJson} />
          )}
          {settingsSlot}
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-auto">
        {parsed.ok ? (
          outputTab === "tree" ? (
            treeDisabled ? (
              <div className="flex items-center justify-center h-full text-gray-400 dark:text-dark-text-muted text-sm">
                <div className="text-center">
                  <p className="text-amber-500 font-medium">⚡ Large file — Tree view disabled</p>
                  <p className="mt-1 text-xs">Switch to JSON or YAML tab to view</p>
                </div>
              </div>
            ) : (
              <TreeView data={parsed.data} showTypes={showTypes} showArrayIndex={showArrayIndex} colorTheme={colorTheme} inputSize={inputSize} />
            )
          ) : (
            largeFile ? (
              <pre className="p-4 text-code font-mono font-normal whitespace-pre-wrap text-gray-700 dark:text-dark-text-secondary min-h-0">
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
          <div className="flex items-center justify-center h-full text-gray-400 dark:text-dark-text-muted text-sm">
            Paste JSON or YAML in the editor
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="px-3 py-2 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 shrink-0">
              <p className="text-red-600 dark:text-red-400 text-xs font-mono truncate" title={parsed.error}>⚠ {parsed.error}</p>
            </div>
            {parsed.position !== undefined && input.trim() ? (
              <pre className="flex-1 px-4 pb-4 text-code font-mono font-normal whitespace-pre-wrap overflow-auto min-h-0">
                {colorizeJson(input.trim().slice(0, parsed.position), colorTheme)}
                <span className="bg-black/80 text-white dark:bg-white/90 dark:text-black rounded-sm px-0.5">{input.trim().slice(parsed.position, parsed.position + 1) || "⌁"}</span>
                <span className="text-gray-400 dark:text-gray-600">{input.trim().slice(parsed.position + 1)}</span>
              </pre>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
