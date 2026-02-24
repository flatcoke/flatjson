"use client";

import { useState, useRef, useEffect } from "react";
import { themes, getTheme } from "./themes";

type Keybinding = "default" | "vim" | "emacs";

interface SettingsMenuProps {
  showTypes: boolean;
  onShowTypesChange: (v: boolean) => void;
  showArrayIndex: boolean;
  onShowArrayIndexChange: (v: boolean) => void;
  theme: string;
  darkMode: boolean;
  onThemeChange: (t: string) => void;
  keybinding: Keybinding;
  onKeybindingChange: (k: Keybinding) => void;
}

const KEYBINDING_OPTIONS: { value: Keybinding; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "vim", label: "Vim" },
  { value: "emacs", label: "Emacs" },
];

export default function SettingsMenu({
  showTypes, onShowTypesChange,
  showArrayIndex, onShowArrayIndexChange,
  theme, darkMode, onThemeChange,
  keybinding, onKeybindingChange,
}: SettingsMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const themeColors = getTheme(theme, darkMode);

  type Item = { label: string; checked?: boolean; colors?: string[]; onSelect: () => void } | "divider" | "heading";

  const items: (Item | string)[] = [
    "Keybinding",
    ...KEYBINDING_OPTIONS.map(opt => ({
      label: opt.label,
      checked: keybinding === opt.value,
      onSelect: () => onKeybindingChange(opt.value),
    })),
    "divider",
    "Color Theme",
    ...Object.keys(themes).map(k => {
      const t = getTheme(k, darkMode);
      return { label: k, checked: theme === k, colors: [t.key, t.string, t.number], onSelect: () => onThemeChange(k) };
    }),
    "divider",
    "Tree",
    { label: "Types", checked: showTypes, onSelect: () => onShowTypesChange(!showTypes) },
    { label: "Array Index", checked: showArrayIndex, onSelect: () => onShowArrayIndexChange(!showArrayIndex) },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-dark-btn-hover transition-colors"
        title="Settings"
      >
        <svg className="w-4 h-4 text-gray-500 dark:text-dark-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-0.5 z-50 min-w-[200px] max-h-[400px] overflow-y-auto py-1 bg-[#2b2b3d] border border-[#3d3d5c] rounded-md shadow-xl backdrop-blur">
          {items.map((item, i) => {
            if (item === "divider") return <div key={`d-${i}`} className="my-1 border-t border-[#3d3d5c]" />;
            if (typeof item === "string") return <div key={item} className="px-3 py-1 text-[11px] text-gray-400 font-semibold uppercase tracking-wider">{item}</div>;
            return (
              <button
                key={item.label}
                onClick={() => item.onSelect()}
                className="w-full px-3 py-1 text-[13px] text-left flex items-center gap-2 hover:bg-[#3478f6] hover:text-white text-gray-200 transition-colors"
              >
                <span className="w-4 text-center shrink-0">{item.checked !== undefined ? (item.checked ? "✓" : "") : ""}</span>
                <span className="flex items-center gap-2">
                  {item.label}
                  {item.colors && (
                    <span className="flex gap-0.5">
                      {item.colors.map((c, j) => <span key={j} className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />)}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
