"use client";

import { useEffect, useRef, useState } from "react";

export default function CompareSlider({ beforeSrc, afterSrc, beforeAlt, afterAlt }) {
  const [position, setPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setPosition(50), 200);
    return () => clearTimeout(timer);
  }, []);

  function updateFromClientX(clientX) {
    const rect = containerRef.current.getBoundingClientRect();
    const percent = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, percent)));
  }

  function handlePointerDown(e) {
    setIsDragging(true);
    updateFromClientX(e.clientX);

    function handleMove(moveEvent) {
      updateFromClientX(moveEvent.clientX);
    }

    function handleUp() {
      setIsDragging(false);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    }

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  }

  const smooth = isDragging ? "" : "transition-[left,clip-path] duration-700 ease-out";

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      className="card-frame relative aspect-[4/3] w-full cursor-ew-resize select-none overflow-hidden bg-[var(--card)]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={afterSrc} alt={afterAlt} draggable={false} className="absolute inset-0 h-full w-full object-cover" />

      <div
        className={`absolute inset-0 h-full w-full ${smooth}`}
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={beforeSrc} alt={beforeAlt} draggable={false} className="absolute inset-0 h-full w-full object-cover" />
      </div>

      <div className={`absolute bottom-0 top-0 w-0.5 bg-white ${smooth}`} style={{ left: `${position}%` }}>
        <div className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[var(--line)] bg-white text-xs text-[var(--ink)] shadow-[2px_2px_0_var(--line)]">
          ⟷
        </div>
      </div>

      <span className="font-display absolute left-3 top-3 rounded-full border-[1.5px] border-[var(--line)] bg-white/90 px-2.5 py-1 text-[10px] uppercase tracking-wide text-[var(--ink)]">
        Önce
      </span>
      <span className="font-display absolute right-3 top-3 rounded-full border-[1.5px] border-[var(--line)] bg-[var(--teal)] px-2.5 py-1 text-[10px] uppercase tracking-wide text-white">
        Sonra
      </span>
    </div>
  );
}
