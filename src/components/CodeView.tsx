"use client";

import { useMemo } from "react";
import YAML from "yaml";
import type { ColorTheme } from "./themes";

function colorizeJson(text: string, theme: ColorTheme): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let i = 0;

  const regex = /("(?:[^"\\]|\\.)*")\s*:|("(?:[^"\\]|\\.)*")|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|(\btrue\b|\bfalse\b)|(\bnull\b)|([{}[\]:,])/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={i++}>{text.slice(lastIndex, match.index)}</span>);
    }

    if (match[1]) {
      parts.push(<span key={i++} style={{ color: theme.key }}>{match[1]}</span>);
      parts.push(<span key={i++} style={{ color: theme.punctuation }}>:</span>);
    } else if (match[2]) {
      parts.push(<span key={i++} style={{ color: theme.string }}>{match[2]}</span>);
    } else if (match[3]) {
      parts.push(<span key={i++} style={{ color: theme.number }}>{match[3]}</span>);
    } else if (match[4]) {
      parts.push(<span key={i++} style={{ color: theme.boolean }}>{match[4]}</span>);
    } else if (match[5]) {
      parts.push(<span key={i++} style={{ color: theme.null }}>{match[5]}</span>);
    } else if (match[6]) {
      parts.push(<span key={i++} style={{ color: theme.punctuation }}>{match[6]}</span>);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={i++}>{text.slice(lastIndex)}</span>);
  }

  return parts;
}

function yamlValueColor(val: string, theme: ColorTheme): string {
  const v = val.trim();
  if (!v) return theme.punctuation;
  if (v === "null" || v === "~") return theme.null;
  if (v === "true" || v === "false") return theme.boolean;
  if (/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(v)) return theme.number;
  return theme.string;
}

function colorizeYaml(text: string, theme: ColorTheme): React.ReactNode[] {
  return text.split("\n").map((line, i) => {
    const kvMatch = line.match(/^(\s*)([\w][\w.-]*)(:\s*)(.*)/);
    if (kvMatch) {
      const [, indent, key, colon, val] = kvMatch;
      return (
        <span key={i}>
          {indent}
          <span style={{ color: theme.key }}>{key}</span>
          <span style={{ color: theme.punctuation }}>{colon}</span>
          {val && <span style={{ color: yamlValueColor(val, theme) }}>{val}</span>}
          {"\n"}
        </span>
      );
    }
    const listMatch = line.match(/^(\s*)(- )(.*)/);
    if (listMatch) {
      const [, indent, dash, val] = listMatch;
      return (
        <span key={i}>
          {indent}
          <span style={{ color: theme.punctuation }}>{dash}</span>
          <span style={{ color: yamlValueColor(val, theme) }}>{val}</span>
          {"\n"}
        </span>
      );
    }
    return <span key={i}>{line}{"\n"}</span>;
  });
}

export default function CodeView({ text, mode, theme }: {
  text: string;
  mode: "json" | "yaml";
  theme: ColorTheme;
}) {
  const colored = useMemo(
    () => mode === "yaml" ? colorizeYaml(text, theme) : colorizeJson(text, theme),
    [text, mode, theme],
  );

  return (
    <pre className="p-4 text-[12px] font-mono font-light whitespace-pre-wrap" style={{ minHeight: 0 }}>
      {colored}
    </pre>
  );
}
