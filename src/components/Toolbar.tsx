"use client";

import { samples } from "./SampleData";

interface ToolbarProps {
  onFormat: () => void;
  onMinify: () => void;
  onToYaml: () => void;
  onClear: () => void;
  showTypes: boolean;
  onShowTypesChange: (v: boolean) => void;
  showArrayIndex: boolean;
  onShowArrayIndexChange: (v: boolean) => void;
  vimMode: boolean;
  onVimModeChange: (v: boolean) => void;
  onLoadSample: (json: string) => void;
}

function Btn({ children, active, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      {...props}
      className={`px-3 py-1 text-xs font-medium rounded border transition-colors ${
        active
          ? "bg-blue-500 text-white border-blue-500"
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
  onToYaml,
  onClear,
  showTypes,
  onShowTypesChange,
  showArrayIndex,
  onShowArrayIndexChange,
  vimMode,
  onVimModeChange,
  onLoadSample,
}: ToolbarProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-[#f8f9fa] border-b border-gray-200 flex-wrap">
      <div className="flex items-center gap-1.5">
        <Btn onClick={onFormat}>Format</Btn>
        <Btn onClick={onMinify}>Minify</Btn>
        <Btn onClick={onToYaml}>To YAML</Btn>
        <Btn onClick={onClear}>Clear</Btn>
      </div>

      <Sep />

      <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
        <input type="checkbox" checked={showTypes} onChange={e => onShowTypesChange(e.target.checked)} className="rounded" />
        Types
      </label>
      <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
        <input type="checkbox" checked={showArrayIndex} onChange={e => onShowArrayIndexChange(e.target.checked)} className="rounded" />
        Array Index
      </label>

      <Sep />

      <Btn active={vimMode} onClick={() => onVimModeChange(!vimMode)} title="Toggle Vim keybindings">
        Vim
      </Btn>

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
