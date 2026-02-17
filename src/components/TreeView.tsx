"use client";

import { useState, memo } from "react";

type JsonValue = string | number | boolean | null | JsonValue[] | { [k: string]: JsonValue };

const TYPE_COLORS: Record<string, string> = {
  string: "#008000",
  number: "#0000ff",
  boolean: "#cc0000",
  null: "#808080",
  object: "#555",
  array: "#555",
};

function typeOf(v: JsonValue): string {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  return typeof v;
}

function ValueSpan({ value }: { value: JsonValue }) {
  const type = typeOf(value);
  switch (type) {
    case "string":
      return <span style={{ color: TYPE_COLORS.string }}>&quot;{value as string}&quot;</span>;
    case "number":
      return <span style={{ color: TYPE_COLORS.number }}>{String(value)}</span>;
    case "boolean":
      return <span style={{ color: TYPE_COLORS.boolean }}>{String(value)}</span>;
    case "null":
      return <span style={{ color: TYPE_COLORS.null }}>null</span>;
    default:
      return null;
  }
}

function TypeBadge({ type }: { type: string }) {
  return (
    <span
      className="ml-2 text-[10px] px-1 py-0.5 rounded border border-gray-200 bg-gray-50"
      style={{ color: TYPE_COLORS[type] ?? "#555" }}
    >
      {type}
    </span>
  );
}

function CopyButton({ path }: { path: string }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(path); }}
      className="ml-2 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 hover:text-blue-500 transition-opacity"
      title={path}
    >
      📋
    </button>
  );
}

const TreeNode = memo(function TreeNode({ keyName, value, path, depth, showTypes, showArrayIndex, isLast }: {
  keyName: string | number | null;
  value: JsonValue;
  path: string;
  depth: number;
  showTypes: boolean;
  showArrayIndex: boolean;
  isLast: boolean;
}) {
  const [collapsed, setCollapsed] = useState(depth > 2);
  const type = typeOf(value);
  const expandable = type === "object" || type === "array";
  const comma = isLast ? "" : ",";
  const pad = { paddingLeft: depth * 20 };

  const key = keyName === null ? null
    : typeof keyName === "number"
      ? (showArrayIndex ? <span className="text-[#666] mr-1">{keyName}: </span> : null)
      : <span className="text-[#a52a2a] font-bold mr-1">&quot;{keyName}&quot;: </span>;

  if (!expandable) {
    return (
      <div className="group flex items-center py-px hover:bg-[#f5f5f5]" style={pad}>
        {key}
        <ValueSpan value={value} />
        <span>{comma}</span>
        {showTypes && <TypeBadge type={type} />}
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
        <span className="w-4 text-[11px] text-gray-500 mr-1 inline-flex items-center justify-center shrink-0">
          {collapsed ? "▶" : "▼"}
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
        {showTypes && <TypeBadge type={type} />}
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
            />
          ))}
          <div className="py-px" style={pad}>
            <span className="w-4 inline-block mr-1" />
            <span>{close}{comma}</span>
          </div>
        </>
      )}
    </div>
  );
});

export default function TreeView({ data, showTypes, showArrayIndex }: {
  data: unknown;
  showTypes: boolean;
  showArrayIndex: boolean;
}) {
  return (
    <div className="font-mono text-[13px] p-3 h-full overflow-auto" style={{ minHeight: 0 }}>
      <TreeNode
        keyName={null}
        value={data as JsonValue}
        path="$"
        depth={0}
        showTypes={showTypes}
        showArrayIndex={showArrayIndex}
        isLast
      />
    </div>
  );
}
