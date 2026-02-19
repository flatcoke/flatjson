"use client";

import { useRef, useCallback, useEffect, useState } from "react";

interface SplitPanelProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

const MOBILE_BREAKPOINT = 768;

export default function SplitPanel({ left, right }: SplitPanelProps) {
  const [ratio, setRatio] = useState(0.5);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    draggingRef.current = true;
    setIsDragging(true);
    document.body.style.cursor = isMobile ? "row-resize" : "col-resize";
    document.body.style.userSelect = "none";
  }, [isMobile]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!draggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (isMobile) {
        setRatio(Math.max(0.15, Math.min(0.85, (e.clientY - rect.top) / rect.height)));
      } else {
        setRatio(Math.max(0.15, Math.min(0.85, (e.clientX - rect.left) / rect.width)));
      }
    };

    const onUp = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      setIsDragging(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [isMobile]);

  // Touch support for mobile
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onTouchMove = (e: TouchEvent) => {
      if (!draggingRef.current) return;
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      if (isMobile) {
        setRatio(Math.max(0.15, Math.min(0.85, (touch.clientY - rect.top) / rect.height)));
      } else {
        setRatio(Math.max(0.15, Math.min(0.85, (touch.clientX - rect.left) / rect.width)));
      }
    };

    const onTouchEnd = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      setIsDragging(false);
    };

    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onTouchEnd);
    return () => {
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [isMobile]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    draggingRef.current = true;
    setIsDragging(true);
  }, []);

  if (isMobile) {
    return (
      <div ref={containerRef} className="flex flex-col h-full w-full">
        <div className="overflow-hidden" style={{ height: `${ratio * 100}%`, minHeight: 0 }}>
          {left}
        </div>
        <div
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          className={`flex-shrink-0 h-1.5 transition-colors cursor-row-resize ${
            isDragging ? "bg-brand" : "bg-gray-200 hover:bg-brand"
          }`}
        />
        <div className="overflow-hidden flex-1" style={{ minHeight: 0 }}>
          {right}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-row h-full w-full">
      <div className="overflow-hidden" style={{ width: `${ratio * 100}%`, minWidth: 0 }}>
        {left}
      </div>
      <div
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        className={`flex-shrink-0 w-1.5 transition-colors cursor-col-resize ${
          isDragging ? "bg-brand" : "bg-gray-200 hover:bg-brand"
        }`}
      />
      <div className="overflow-hidden flex-1" style={{ minWidth: 0 }}>
        {right}
      </div>
    </div>
  );
}
