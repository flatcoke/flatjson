"use client";

import { useState, useRef, useEffect } from "react";
import { samples } from "./SampleData";

export default function LoadSampleMenu({ onLoad }: { onLoad: (json: string) => void }) {
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
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="px-2.5 py-0.5 text-xs font-medium rounded transition-colors text-gray-500 dark:text-dark-text-muted hover:bg-gray-200 dark:hover:bg-dark-btn-hover"
      >
        Sample <span className="text-[10px] opacity-60">▾</span>
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-0.5 z-50 min-w-[160px] py-1 bg-[#2b2b3d] border border-[#3d3d5c] rounded-md shadow-xl backdrop-blur">
          {Object.keys(samples).map(k => (
            <button
              key={k}
              onClick={() => { onLoad(samples[k]); setOpen(false); }}
              className="w-full px-3 py-1 text-[13px] text-left hover:bg-[#3478f6] hover:text-white text-gray-200 transition-colors"
            >
              {k}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
