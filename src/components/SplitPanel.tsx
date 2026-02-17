"use client";

import { useRef, useEffect, useState } from "react";

export default function SplitPanel({ left, right, direction }: {
  left: React.ReactNode;
  right: React.ReactNode;
  direction: "horizontal" | "vertical";
}) {
  const [ratio, setRatio] = useState(0.5);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const horizontal = direction === "horizontal";

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const r = horizontal
        ? (e.clientX - rect.left) / rect.width
        : (e.clientY - rect.top) / rect.height;
      setRatio(Math.max(0.15, Math.min(0.85, r)));
    };
    const onUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [horizontal]);

  const startDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    document.body.style.cursor = horizontal ? "col-resize" : "row-resize";
    document.body.style.userSelect = "none";
  };

  return (
    <div ref={containerRef} className={`flex ${horizontal ? "flex-row" : "flex-col"} h-full w-full`}>
      <div className="overflow-hidden" style={horizontal ? { width: `${ratio * 100}%` } : { height: `${ratio * 100}%` }}>
        {left}
      </div>
      <div
        onMouseDown={startDrag}
        className={`shrink-0 bg-gray-200 hover:bg-blue-400 transition-colors ${
          horizontal ? "w-1.5 cursor-col-resize" : "h-1.5 cursor-row-resize"
        }`}
      />
      <div className="overflow-hidden flex-1" style={{ minWidth: 0, minHeight: 0 }}>
        {right}
      </div>
    </div>
  );
}
