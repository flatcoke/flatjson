"use client";

import { samples } from "./SampleData";
import { themes } from "./themes";

interface ToolbarProps {
  onFormat: () => void;
  onMinify: () => void;
  onClear: () => void;
  isYaml?: boolean;
  showTypes: boolean;
  onShowTypesChange: (v: boolean) => void;
  showArrayIndex: boolean;
  onShowArrayIndexChange: (v: boolean) => void;
  vimMode: boolean;
  onVimModeChange: (v: boolean) => void;
  theme: string;
  onThemeChange: (t: string) => void;
  onLoadSample: (json: string) => void;
}

function Btn({ children, active, disabled, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`px-3 py-1 text-xs font-medium rounded border transition-colors ${
        disabled
          ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed"
          : active
            ? "bg-[#4A0E8F] text-white border-[#4A0E8F]"
            : "bg-white border-gray-300 hover:bg-gray-50 active:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <div className="w-px h-5 bg-gray-300" />;
}

export default function Toolbar({
  onFormat,
  onMinify,
  onClear,
  isYaml,
  showTypes,
  onShowTypesChange,
  showArrayIndex,
  onShowArrayIndexChange,
  vimMode,
  onVimModeChange,
  theme,
  onThemeChange,
  onLoadSample,
}: ToolbarProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-[#f8f9fa] border-b border-gray-200 flex-wrap">
      <Btn onClick={onFormat}>Format</Btn>
      <Btn onClick={onMinify} disabled={isYaml}>Minify</Btn>
      <Btn onClick={onClear}>Clear</Btn>

      <Sep />

      <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
        <input type="checkbox" checked={showTypes} onChange={e => onShowTypesChange(e.target.checked)} className="rounded accent-[#4A0E8F]" />
        Types
      </label>
      <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
        <input type="checkbox" checked={showArrayIndex} onChange={e => onShowArrayIndexChange(e.target.checked)} className="rounded accent-[#4A0E8F]" />
        Array Index
      </label>

      <Sep />

      <Btn active={vimMode} onClick={() => onVimModeChange(!vimMode)} title="Toggle Vim keybindings">
        Vim
      </Btn>

      <Sep />

      <select
        value={theme}
        onChange={e => onThemeChange(e.target.value)}
        className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
      >
        {Object.keys(themes).map(k => <option key={k} value={k}>{k}</option>)}
      </select>

      <Sep />

      <select
        onChange={e => { if (e.target.value) onLoadSample(samples[e.target.value]); e.target.value = ""; }}
        defaultValue=""
        className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
      >
        <option value="" disabled>Load Sample…</option>
        {Object.keys(samples).map(k => <option key={k} value={k}>{k}</option>)}
      </select>
    </div>
  );
}
