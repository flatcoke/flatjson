"use client";

import { useState, useCallback, memo } from "react";

interface TreeViewProps {
  data: unknown;
  showTypes: boolean;
  showArrayIndex: boolean;
}

interface TreeNodeProps {
  keyName: string | number | null;
  value: unknown;
  path: string;
  depth: number;
  showTypes: boolean;
  showArrayIndex: boolean;
  isLast: boolean;
}

function getType(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {});
}

const TreeNode = memo(function TreeNode({
  keyName,
  value,
  path,
  depth,
  showTypes,
  showArrayIndex,
  isLast,
}: TreeNodeProps) {
  const [collapsed, setCollapsed] = useState(depth > 2);
  const type = getType(value);
  const isExpandable = type === "object" || type === "array";

  const handleToggle = useCallback(() => {
    if (isExpandable) setCollapsed((c) => !c);
  }, [isExpandable]);

  const handleCopyPath = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      copyToClipboard(path);
    },
    [path]
  );

  const renderKey = () => {
    if (keyName === null) return null;
    if (typeof keyName === "number") {
      if (!showArrayIndex) return null;
      return <span className="text-[#666] mr-1">{keyName}: </span>;
    }
    return (
      <span className="text-[#881280] mr-1">
        &quot;{keyName}&quot;:{" "}
      </span>
    );
  };

  const renderValue = () => {
    switch (type) {
      case "string":
        return (
          <span className="text-[#067d17]">
            &quot;{String(value)}&quot;
          </span>
        );
      case "number":
        return <span className="text-[#1a1aa6]">{String(value)}</span>;
      case "boolean":
        return <span className="text-[#c41a16]">{String(value)}</span>;
      case "null":
        return <span className="text-[#808080]">null</span>;
      default:
        return null;
    }
  };

  const renderTypeTag = () => {
    if (!showTypes) return null;
    const colors: Record<string, string> = {
      string: "#067d17",
      number: "#1a1aa6",
      boolean: "#c41a16",
      null: "#808080",
      object: "#555",
      array: "#555",
    };
    return (
      <span
        className="ml-2 text-[10px] px-1 py-0.5 rounded"
        style={{
          color: colors[type] || "#555",
          backgroundColor: "#f0f0f0",
          border: "1px solid #e0e0e0",
        }}
      >
        {type}
      </span>
    );
  };

  const comma = isLast ? "" : ",";

  if (!isExpandable) {
    return (
      <div
        className="group flex items-center py-[1px] hover:bg-[#f5f5f5] cursor-default"
        style={{ paddingLeft: depth * 20 }}
      >
        {renderKey()}
        {renderValue()}
        <span className="text-[#333]">{comma}</span>
        {renderTypeTag()}
        <button
          onClick={handleCopyPath}
          className="ml-2 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 hover:text-blue-500 transition-opacity"
          title={`Copy path: ${path}`}
        >
          📋
        </button>
      </div>
    );
  }

  const entries =
    type === "array"
      ? (value as unknown[]).map((v, i) => [i, v] as const)
      : Object.entries(value as Record<string, unknown>);

  const openBracket = type === "array" ? "[" : "{";
  const closeBracket = type === "array" ? "]" : "}";
  const count =
    type === "array"
      ? `${(value as unknown[]).length} items`
      : `${Object.keys(value as Record<string, unknown>).length} keys`;

  return (
    <div>
      <div
        className="group flex items-center py-[1px] hover:bg-[#f5f5f5] cursor-pointer select-none"
        style={{ paddingLeft: depth * 20 }}
        onClick={handleToggle}
      >
        <span className="w-4 text-[11px] text-gray-500 mr-1 inline-flex items-center justify-center flex-shrink-0">
          {collapsed ? "▶" : "▼"}
        </span>
        {renderKey()}
        <span className="text-[#333]">{openBracket}</span>
        {collapsed && (
          <>
            <span className="text-gray-400 mx-1 text-xs">
              {count}
            </span>
            <span className="text-[#333]">
              {closeBracket}
              {comma}
            </span>
          </>
        )}
        {renderTypeTag()}
        <button
          onClick={handleCopyPath}
          className="ml-2 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 hover:text-blue-500 transition-opacity"
          title={`Copy path: ${path}`}
        >
          📋
        </button>
      </div>
      {!collapsed && (
        <>
          {entries.map(([key, val], idx) => (
            <TreeNode
              key={typeof key === "number" ? key : String(key)}
              keyName={key}
              value={val}
              path={
                typeof key === "number"
                  ? `${path}[${key}]`
                  : `${path}.${key}`
              }
              depth={depth + 1}
              showTypes={showTypes}
              showArrayIndex={showArrayIndex}
              isLast={idx === entries.length - 1}
            />
          ))}
          <div
            className="py-[1px]"
            style={{ paddingLeft: depth * 20 }}
          >
            <span className="w-4 inline-block mr-1" />
            <span className="text-[#333]">
              {closeBracket}
              {comma}
            </span>
          </div>
        </>
      )}
    </div>
  );
});

export default function TreeView({
  data,
  showTypes,
  showArrayIndex,
}: TreeViewProps) {
  return (
    <div
      className="font-mono text-[13px] p-3 h-full overflow-auto"
      style={{ minHeight: 0 }}
    >
      <TreeNode
        keyName={null}
        value={data}
        path="$"
        depth={0}
        showTypes={showTypes}
        showArrayIndex={showArrayIndex}
        isLast={true}
      />
    </div>
  );
}
