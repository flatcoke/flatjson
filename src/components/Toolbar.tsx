"use client";

import { useState, useRef, useEffect } from "react";
import { samples } from "./SampleData";
import { themes, getTheme } from "./themes";

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
  darkMode: boolean;
  onThemeChange: (t: string) => void;
  onLoadSample: (json: string) => void;
}

function Btn({ children, disabled, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`px-3 py-1 text-xs font-medium rounded border transition-all ${
        disabled
          ? "bg-gray-100 dark:bg-dark-btn text-gray-300 dark:text-gray-600 border-gray-200 dark:border-dark-border cursor-not-allowed"
          : "bg-white dark:bg-dark-btn border-gray-300 dark:border-dark-border-btn text-gray-800 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-btn-hover active:scale-95 active:bg-gray-200 dark:active:bg-dark-btn-hover"
      }`}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <div className="w-px h-5 bg-gray-300 dark:bg-dark-border" />;
}

const activeDropdown = { close: null as (() => void) | null };

function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function toggle() {
    if (open) {
      setOpen(false);
      activeDropdown.close = null;
    } else {
      activeDropdown.close?.();
      setOpen(true);
      activeDropdown.close = () => setOpen(false);
    }
  }

  return { open, toggle, ref };
}

const menuClass = "absolute left-1/2 -translate-x-1/4 top-full mt-0.5 z-50 min-w-[220px] py-1 bg-[#2b2b3d] border border-[#3d3d5c] rounded-md shadow-xl backdrop-blur";
const menuItemClass = "w-full px-3 py-1 text-[13px] text-left flex items-center gap-2 hover:bg-[#3478f6] hover:text-white text-gray-200 transition-colors";

function DropdownMenu({ label, items, closeOnSelect = false }: {
  label: string;
  items: ({ label: string; checked?: boolean; desc?: string; colors?: string[]; onSelect: () => void } | "divider")[];
  closeOnSelect?: boolean;
}) {
  const { open, toggle, ref } = useDropdown();

  return (
    <div className="relative" ref={ref}>
      <Btn onClick={toggle}>{label} ▾</Btn>
      {open && (
        <div className={menuClass}>
          {items.map((item, i) =>
            item === "divider" ? (
              <div key={`div-${i}`} className="my-1 border-t border-[#3d3d5c]" />
            ) : (
              <button
                key={item.label}
                onClick={() => { item.onSelect(); if (closeOnSelect) toggle(); }}
                className={menuItemClass}
              >
                <span className="w-4 text-center shrink-0">{item.checked !== undefined ? (item.checked ? "✓" : "") : ""}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {item.label}
                    {item.colors && (
                      <span className="flex gap-0.5">
                        {item.colors.map((c, i) => (
                          <span key={i} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
                        ))}
                      </span>
                    )}
                  </div>
                  {item.desc && <div className="text-[11px] text-gray-400 font-normal">{item.desc}</div>}
                </div>
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
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
  darkMode,
  onThemeChange,
  onLoadSample,
}: ToolbarProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-surface dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border flex-wrap">
      <Btn onClick={onFormat}>Format</Btn>
      <Btn onClick={onMinify} disabled={isYaml}>Minify</Btn>
      <Btn onClick={onClear}>Clear</Btn>

      <Sep />

      <DropdownMenu
        label={theme}
        closeOnSelect
        items={Object.keys(themes).map(k => {
          const t = getTheme(k, darkMode);
          return {
            label: k,
            checked: theme === k,
            colors: [t.key, t.string, t.number],
            onSelect: () => onThemeChange(k),
          };
        })}
      />

      <DropdownMenu
        label="Sample"
        closeOnSelect
        items={Object.keys(samples).map(k => ({
          label: k,
          onSelect: () => onLoadSample(samples[k]),
        }))}
      />

      <Sep />

      <DropdownMenu
        label="Options"
        items={[
          { label: "Vim", desc: "Vim keybindings in editor", checked: vimMode, onSelect: () => onVimModeChange(!vimMode) },
          "divider",
          { label: "Types", desc: "Show type badges in tree", checked: showTypes, onSelect: () => onShowTypesChange(!showTypes) },
          { label: "Array Index", desc: "Show array indices in tree", checked: showArrayIndex, onSelect: () => onShowArrayIndexChange(!showArrayIndex) },
        ]}
      />
    </div>
  );
}
