"use client";

import { useRef, useState } from "react";

export default function CompareSlider({ beforeSrc, afterSrc, beforeAlt, afterAlt }) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef(null);

  function updateFromClientX(clientX) {
    const rect = containerRef.current.getBoundingClientRect();
    const percent = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, percent)));
  }

  function handlePointerDown(e) {
    updateFromClientX(e.clientX);

    function handleMove(moveEvent) {
      updateFromClientX(moveEvent.clientX);
    }

    function handleUp() {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    }

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      className="relative aspect-[4/3] w-full cursor-ew-resize select-none overflow-hidden rounded-2xl border border-slate-200"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={afterSrc} alt={afterAlt} draggable={false} className="absolute inset-0 h-full w-full object-cover" />

      <div className="absolute inset-0 h-full w-full" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={beforeSrc} alt={beforeAlt} draggable={false} className="absolute inset-0 h-full w-full object-cover" />
      </div>

      <div className="absolute bottom-0 top-0 w-0.5 bg-white shadow-lg" style={{ left: `${position}%` }}>
        <div className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xs text-slate-600 shadow-md">
          ⟷
        </div>
      </div>

      <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2 py-1 text-xs text-white">Önce</span>
      <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-1 text-xs text-white">Sonra</span>
    </div>
  );
}
