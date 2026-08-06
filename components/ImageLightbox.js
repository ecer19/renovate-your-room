"use client";

import { useEffect } from "react";

export default function ImageLightbox({ src, alt, onClose }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--ink)]/85 p-4" onClick={onClose}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="card-frame max-h-full max-w-full bg-[var(--card)] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        type="button"
        onClick={onClose}
        className="card-frame-sm absolute right-4 top-4 flex h-10 w-10 items-center justify-center bg-white text-[var(--ink)]"
        aria-label="Kapat"
      >
        ✕
      </button>
    </div>
  );
}
