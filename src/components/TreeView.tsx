"use client";

import { useState, memo } from "react";
import type { ColorTheme } from "./themes";

type JsonValue = string | number | boolean | null | JsonValue[] | { [k: string]: JsonValue };

function typeColors(t: ColorTheme): Record<string, string> {
  return {
    key: t.key,
    string: t.string,
    number: t.number,
    boolean: t.boolean,
    null: t.null,
    object: t.punctuation,
    array: t.punctuation,
  };
}

function typeOf(v: JsonValue): string {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  return typeof v;
}

function ValueSpan({ value, colors }: { value: JsonValue; colors: Record<string, string> }) {
  const type = typeOf(value);
  switch (type) {
    case "string":
      return <span style={{ color: colors.string }}>&quot;{value as string}&quot;</span>;
    case "number":
      return <span style={{ color: colors.number }}>{String(value)}</span>;
    case "boolean":
      return <span style={{ color: colors.boolean }}>{String(value)}</span>;
    case "null":
      return <span style={{ color: colors.null }}>null</span>;
    default:
      return null;
  }
}

function TypeBadge({ type, colors }: { type: string; colors: Record<string, string> }) {
  return (
    <span
      className="ml-2 text-[10px] px-1 py-0.5 rounded border border-gray-200 bg-gray-50"
      style={{ color: colors[type] ?? "#555" }}
    >
      {type}
    </span>
  );
}

function CopyButton({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);

  function copy(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(path).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  }

  return (
    <button
      onClick={copy}
      className={`ml-2 text-[10px] ${copied ? "text-green-500 opacity-100" : "opacity-0 group-hover:opacity-100 group-hover:transition-opacity text-gray-400 hover:text-[#4A0E8F]"}`}
      title={path}
    >
      {copied ? <span className="font-bold">Copied!</span> : "📋"}
    </button>
  );
}

const MAX_DEPTH = 20;

const TreeNode = memo(function TreeNode({ keyName, value, path, depth, showTypes, showArrayIndex, isLast, colors, defaultCollapsed }: {
  keyName: string | number | null;
  value: JsonValue;
  path: string;
  depth: number;
  showTypes: boolean;
  showArrayIndex: boolean;
  isLast: boolean;
  colors: Record<string, string>;
  defaultCollapsed: boolean;
}) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed && depth > 2);
  const type = typeOf(value);
  const expandable = type === "object" || type === "array";
  const comma = isLast ? "" : ",";
  const pad = { paddingLeft: depth * 20 };

  const key = keyName === null ? null
    : typeof keyName === "number"
      ? (showArrayIndex ? <span className="text-[#666] mr-1">{keyName}: </span> : null)
      : <span style={{ color: colors.key }} className="mr-1">&quot;{keyName}&quot;: </span>;

  if (depth >= MAX_DEPTH && expandable) {
    const preview = type === "array"
      ? `[…${(value as JsonValue[]).length} items]`
      : `{…${Object.keys(value as Record<string, JsonValue>).length} keys}`;
    return (
      <div className="group flex items-center py-px hover:bg-[#f5f5f5]" style={pad}>
        <span className="w-4 mr-0.5 shrink-0" />
        {key}
        <span className="text-gray-400 italic text-[11px]">{preview}</span>
        <span>{comma}</span>
        <CopyButton path={path} />
      </div>
    );
  }

  if (!expandable) {
    return (
      <div className="group flex items-center py-px hover:bg-[#f5f5f5]" style={pad}>
        <span className="w-4 mr-0.5 shrink-0" />
        {key}
        <ValueSpan value={value} colors={colors} />
        <span>{comma}</span>
        {showTypes && <TypeBadge type={type} colors={colors} />}
        <CopyButton path={path} />
      </div>
    );
  }

  const entries = Array.isArray(value)
    ? value.map((v, i) => [i, v] as const)
    : Object.entries(value as Record<string, JsonValue>);

  const open = type === "array" ? "[" : "{";
  const close = type === "array" ? "]" : "}";
  const count = entries.length;
  const countLabel = type === "array" ? `${count} item${count !== 1 ? "s" : ""}` : `${count} key${count !== 1 ? "s" : ""}`;

  return (
    <div>
      <div
        className="group flex items-center py-px hover:bg-[#f5f5f5] cursor-pointer select-none"
        style={pad}
        onClick={() => setCollapsed(c => !c)}
      >
        <span className="w-4 mr-0.5 inline-flex items-center justify-center shrink-0">
          <svg width="10" height="10" viewBox="0 0 10 10" className={`text-gray-400 transition-transform ${collapsed ? "" : "rotate-90"}`}>
            <path d="M3 2 L7 5 L3 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        {key}
        <span>{open}</span>
        {collapsed && (
          <>
            <span className="text-gray-400 mx-0.5">…</span>
            <span>{close}</span>
            <span className="text-gray-400 ml-1 text-[11px] italic">{countLabel}</span>
            <span>{comma}</span>
          </>
        )}
        {showTypes && <TypeBadge type={type} colors={colors} />}
        <CopyButton path={path} />
      </div>
      {!collapsed && (
        <>
          {entries.map(([k, v], i) => (
            <TreeNode
              key={String(k)}
              keyName={k}
              value={v}
              path={typeof k === "number" ? `${path}[${k}]` : `${path}.${k}`}
              depth={depth + 1}
              showTypes={showTypes}
              showArrayIndex={showArrayIndex}
              isLast={i === entries.length - 1}
              colors={colors}
              defaultCollapsed={defaultCollapsed}
            />
          ))}
          <div className="py-px" style={pad}>
            <span className="w-4 inline-block mr-0.5 shrink-0" />
            <span>{close}{comma}</span>
          </div>
        </>
      )}
    </div>
  );
});

const COLLAPSE_THRESHOLD = 500 * 1024; // 500KB

export default function TreeView({ data, showTypes, showArrayIndex, colorTheme, inputSize }: {
  data: unknown;
  showTypes: boolean;
  showArrayIndex: boolean;
  colorTheme: ColorTheme;
  inputSize: number;
}) {
  const colors = typeColors(colorTheme);
  const shouldCollapse = inputSize > COLLAPSE_THRESHOLD;
  return (
    <div className="font-mono text-[12px] font-normal p-3 h-full overflow-auto" style={{ minHeight: 0 }}>
      <TreeNode
        keyName={null}
        value={data as JsonValue}
        path="$"
        depth={0}
        showTypes={showTypes}
        showArrayIndex={showArrayIndex}
        isLast
        colors={colors}
        defaultCollapsed={shouldCollapse}
      />
    </div>
  );
}
