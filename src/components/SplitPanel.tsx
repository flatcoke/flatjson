"use client";

import { useRef, useCallback, useEffect, useState } from "react";

interface SplitPanelProps {
  left: React.ReactNode;
  right: React.ReactNode;
  direction: "horizontal" | "vertical";
}

export default function SplitPanel({ left, right, direction }: SplitPanelProps) {
  const [ratio, setRatio] = useState(0.5);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    document.body.style.cursor = direction === "horizontal" ? "col-resize" : "row-resize";
    document.body.style.userSelect = "none";
  }, [direction]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      let newRatio: number;
      if (direction === "horizontal") {
        newRatio = (e.clientX - rect.left) / rect.width;
      } else {
        newRatio = (e.clientY - rect.top) / rect.height;
      }
      setRatio(Math.max(0.15, Math.min(0.85, newRatio)));
    };

    const handleMouseUp = () => {
      if (dragging.current) {
        dragging.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [direction]);

  const isHorizontal = direction === "horizontal";

  return (
    <div
      ref={containerRef}
      className={`flex ${isHorizontal ? "flex-row" : "flex-col"} h-full w-full`}
    >
      <div
        className="overflow-hidden"
        style={
          isHorizontal
            ? { width: `${ratio * 100}%`, minWidth: 0 }
            : { height: `${ratio * 100}%`, minHeight: 0 }
        }
      >
        {left}
      </div>
      <div
        onMouseDown={handleMouseDown}
        className={`flex-shrink-0 bg-gray-200 hover:bg-blue-400 transition-colors ${
          isHorizontal
            ? "w-1.5 cursor-col-resize"
            : "h-1.5 cursor-row-resize"
        }`}
      />
      <div
        className="overflow-hidden flex-1"
        style={{ minWidth: 0, minHeight: 0 }}
      >
        {right}
      </div>
    </div>
  );
}
