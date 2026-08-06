"use client";

import { useRef, useState } from "react";
import { Camera, X } from "lucide-react";

export default function ImageUploader({ previewUrl, onSelect, onClear }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFiles(fileList) {
    const selected = fileList?.[0];
    if (selected && selected.type.startsWith("image/")) {
      onSelect(selected);
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {!previewUrl ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={`card-frame-sm flex w-full flex-col items-center justify-center gap-2 border-dashed p-8 text-center transition ${
            isDragging ? "border-[var(--accent)] bg-[var(--accent)]/10" : "bg-[var(--card)]"
          }`}
        >
          <Camera className="h-6 w-6 text-[var(--ink-soft)]" strokeWidth={1.5} />
          <span className="font-display text-base text-[var(--ink)]">Fotoğraf Yükle</span>
          <span className="text-xs text-[var(--ink-soft)]">Sürükle bırak ya da tıkla</span>
        </button>
      ) : (
        <div className="card-frame-sm relative overflow-hidden bg-[var(--card)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="Yüklenen oda fotoğrafı" className="h-56 w-full object-cover" />
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border-[1.5px] border-[var(--line)] bg-[var(--card)] text-[var(--ink)] shadow-[2px_2px_0_var(--line)]"
            aria-label="Fotoğrafı kaldır"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}
