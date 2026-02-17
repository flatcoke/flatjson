"use client";

import { useRef, useCallback, useEffect, useState } from "react";

interface SplitPanelProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

export default function SplitPanel({ left, right }: SplitPanelProps) {
  const [ratio, setRatio] = useState(0.5);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setRatio(Math.max(0.15, Math.min(0.85, (e.clientX - rect.left) / rect.width)));
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
  }, []);

  return (
    <div ref={containerRef} className="flex flex-row h-full w-full">
      <div className="overflow-hidden" style={{ width: `${ratio * 100}%`, minWidth: 0 }}>
        {left}
      </div>
      <div
        onMouseDown={onMouseDown}
        className="flex-shrink-0 w-1.5 bg-gray-200 hover:bg-blue-400 transition-colors cursor-col-resize"
      />
      <div className="overflow-hidden flex-1" style={{ minWidth: 0 }}>
        {right}
      </div>
    </div>
  );
}
