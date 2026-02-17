"use client";

import { samples } from "./SampleData";

function Btn({ active, onClick, children, title }: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`px-2.5 py-1 text-xs font-medium rounded border transition-colors ${
        active
          ? "bg-blue-500 text-white border-blue-500"
          : "bg-white border-gray-300 hover:bg-gray-50 active:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

function Toggle({ checked, onChange, label }: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="rounded" />
      {label}
    </label>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-gray-300" />;
}

export default function Toolbar(props: {
  onFormat: () => void;
  onMinify: () => void;
  onClear: () => void;
  layout: "horizontal" | "vertical";
  onLayoutChange: (l: "horizontal" | "vertical") => void;
  showTypes: boolean;
  onShowTypesChange: (v: boolean) => void;
  showArrayIndex: boolean;
  onShowArrayIndexChange: (v: boolean) => void;
  vimMode: boolean;
  onVimModeChange: (v: boolean) => void;
  onLoadSample: (json: string) => void;
}) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2 bg-[#f8f9fa] border-b border-gray-200 flex-wrap">
      <div className="flex items-center gap-1.5">
        <Btn onClick={props.onFormat}>Format</Btn>
        <Btn onClick={props.onMinify}>Minify</Btn>
        <Btn onClick={props.onClear}>Clear</Btn>
      </div>

      <Divider />

      <div className="flex items-center gap-1.5">
        <Btn active={props.layout === "horizontal"} onClick={() => props.onLayoutChange("horizontal")} title="Side by side">◫</Btn>
        <Btn active={props.layout === "vertical"} onClick={() => props.onLayoutChange("vertical")} title="Top and bottom">⬒</Btn>
      </div>

      <Divider />

      <Toggle checked={props.showTypes} onChange={props.onShowTypesChange} label="Types" />
      <Toggle checked={props.showArrayIndex} onChange={props.onShowArrayIndexChange} label="Index" />

      <Divider />

      <button
        onClick={() => props.onVimModeChange(!props.vimMode)}
        className={`px-2 py-1 text-xs font-mono font-bold rounded border transition-colors ${
          props.vimMode
            ? "bg-green-600 text-white border-green-600"
            : "bg-white border-gray-300 hover:bg-gray-50 text-gray-500"
        }`}
      >
        VIM
      </button>

      <Divider />

      <select
        onChange={e => { if (e.target.value) props.onLoadSample(samples[e.target.value]); e.target.value = ""; }}
        defaultValue=""
        className="px-2 py-1 text-xs bg-white border border-gray-300 rounded cursor-pointer"
      >
        <option value="" disabled>Load Sample…</option>
        {Object.keys(samples).map(k => <option key={k} value={k}>{k}</option>)}
      </select>
    </div>
  );
}
