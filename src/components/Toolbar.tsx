"use client";

import { samples } from "./SampleData";

interface ToolbarProps {
  onFormat: () => void;
  onMinify: () => void;
  layout: "horizontal" | "vertical";
  onLayoutChange: (layout: "horizontal" | "vertical") => void;
  showTypes: boolean;
  onShowTypesChange: (show: boolean) => void;
  showArrayIndex: boolean;
  onShowArrayIndexChange: (show: boolean) => void;
  vimMode: boolean;
  onVimModeChange: (enabled: boolean) => void;
  onLoadSample: (json: string) => void;
  onClear: () => void;
}

export default function Toolbar({
  onFormat,
  onMinify,
  layout,
  onLayoutChange,
  showTypes,
  onShowTypesChange,
  showArrayIndex,
  onShowArrayIndexChange,
  vimMode,
  onVimModeChange,
  onLoadSample,
  onClear,
}: ToolbarProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-[#f8f9fa] border-b border-gray-200 flex-wrap">
      <div className="flex items-center gap-1.5">
        <button
          onClick={onFormat}
          className="px-3 py-1 text-xs font-medium bg-white border border-gray-300 rounded hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          Format
        </button>
        <button
          onClick={onMinify}
          className="px-3 py-1 text-xs font-medium bg-white border border-gray-300 rounded hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          Minify
        </button>
        <button
          onClick={onClear}
          className="px-3 py-1 text-xs font-medium bg-white border border-gray-300 rounded hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="w-px h-5 bg-gray-300" />

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onLayoutChange("horizontal")}
          className={`px-2 py-1 text-xs rounded border transition-colors ${
            layout === "horizontal"
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white border-gray-300 hover:bg-gray-50"
          }`}
          title="Side by side"
        >
          ◫
        </button>
        <button
          onClick={() => onLayoutChange("vertical")}
          className={`px-2 py-1 text-xs rounded border transition-colors ${
            layout === "vertical"
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white border-gray-300 hover:bg-gray-50"
          }`}
          title="Top and bottom"
        >
          ⬒
        </button>
      </div>

      <div className="w-px h-5 bg-gray-300" />

      <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
        <input
          type="checkbox"
          checked={showTypes}
          onChange={(e) => onShowTypesChange(e.target.checked)}
          className="rounded"
        />
        Types
      </label>
      <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
        <input
          type="checkbox"
          checked={showArrayIndex}
          onChange={(e) => onShowArrayIndexChange(e.target.checked)}
          className="rounded"
        />
        Array Index
      </label>

      <div className="w-px h-5 bg-gray-300" />

      <button
        onClick={() => onVimModeChange(!vimMode)}
        className={`px-2 py-1 text-xs font-medium rounded border transition-colors ${
          vimMode
            ? "bg-green-600 text-white border-green-600"
            : "bg-white border-gray-300 hover:bg-gray-50 text-gray-600"
        }`}
        title="Toggle Vim keybindings"
      >
        Vim
      </button>

      <div className="w-px h-5 bg-gray-300" />

      <select
        onChange={(e) => {
          const key = e.target.value;
          if (key && samples[key]) {
            onLoadSample(samples[key]);
          }
          e.target.value = "";
        }}
        defaultValue=""
        className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
      >
        <option value="" disabled>
          Load Sample...
        </option>
        {Object.keys(samples).map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
    </div>
  );
}
