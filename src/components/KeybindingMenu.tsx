"use client";

import { useState, useRef, useEffect } from "react";

type Keybinding = "default" | "vim" | "emacs";

const OPTIONS: { value: Keybinding; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "vim", label: "Vim" },
  { value: "emacs", label: "Emacs" },
];

export default function KeybindingMenu({ value, onChange }: { value: Keybinding; onChange: (k: Keybinding) => void }) {
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

  return (
    <div className="relative flex items-center" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="px-2.5 h-6 text-xs font-medium rounded inline-flex items-center transition-colors text-gray-500 dark:text-dark-text-muted hover:bg-gray-200 dark:hover:bg-dark-btn-hover"
        title="Keybinding"
      >
        Keybindings
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-0.5 z-50 min-w-[120px] py-1 bg-[#2b2b3d] border border-[#3d3d5c] rounded-md shadow-xl backdrop-blur">
          {OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className="w-full px-3 py-1 text-[13px] text-left flex items-center gap-2 hover:bg-[#3478f6] hover:text-white text-gray-200 transition-colors"
            >
              <span className="w-4 text-center shrink-0">{value === opt.value ? "✓" : ""}</span>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
