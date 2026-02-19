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
            ? "bg-brand text-white border-brand"
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
    <div className="flex items-center gap-3 px-4 py-2 bg-surface border-b border-gray-200 flex-wrap">
      <Btn onClick={onFormat}>Format</Btn>
      <Btn onClick={onMinify} disabled={isYaml}>Minify</Btn>
      <Btn onClick={onClear}>Clear</Btn>

      <Sep />

      <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
        <input type="checkbox" checked={showTypes} onChange={e => onShowTypesChange(e.target.checked)} className="rounded accent-brand" />
        Types
      </label>
      <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
        <input type="checkbox" checked={showArrayIndex} onChange={e => onShowArrayIndexChange(e.target.checked)} className="rounded accent-brand" />
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
        className="appearance-none pl-2 pr-6 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2210%22%20height%3D%226%22%3E%3Cpath%20d%3D%22M0%200l5%206%205-6z%22%20fill%3D%22%23666%22/%3E%3C/svg%3E')] bg-[length:10px_6px] bg-[position:right_6px_center] bg-no-repeat"
      >
        {Object.keys(themes).map(k => <option key={k} value={k}>{k}</option>)}
      </select>

      <Sep />

      <select
        onChange={e => { if (e.target.value) onLoadSample(samples[e.target.value]); e.target.value = ""; }}
        defaultValue=""
        className="appearance-none pl-2 pr-6 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2210%22%20height%3D%226%22%3E%3Cpath%20d%3D%22M0%200l5%206%205-6z%22%20fill%3D%22%23666%22/%3E%3C/svg%3E')] bg-[length:10px_6px] bg-[position:right_6px_center] bg-no-repeat"
      >
        <option value="" disabled>Load Sample…</option>
        {Object.keys(samples).map(k => <option key={k} value={k}>{k}</option>)}
      </select>
    </div>
  );
}
