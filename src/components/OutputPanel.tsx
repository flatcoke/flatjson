"use client";

import TreeView from "./TreeView";
import CodeView from "./CodeView";
import CopyBtn from "./CopyBtn";
import type { ColorTheme } from "./themes";
import type { ParseResult } from "@/lib/parser";

type OutputTab = "tree" | "json" | "yaml";

interface OutputPanelProps {
  parsed: ParseResult;
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
}

export default function OutputPanel({
  parsed,
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
}: OutputPanelProps) {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-dark-bg">
      <div className="px-3 py-1.5 bg-surface dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border flex items-center justify-between">
        <div className="flex gap-1">
          {(["tree", "json", "yaml"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-2.5 py-0.5 text-xs font-medium rounded transition-colors ${
                outputTab === tab
                  ? "bg-brand text-white"
                  : "text-gray-500 dark:text-dark-text-muted hover:bg-gray-200 dark:hover:bg-dark-btn-hover"
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
          <div className="p-4">
            <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-red-700 dark:text-red-400 text-sm font-medium">Parse Error</p>
              <p className="text-red-600 dark:text-red-300 text-xs font-mono mt-1">{parsed.error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
