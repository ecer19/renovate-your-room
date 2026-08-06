"use client";

import { useRef, useState } from "react";

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
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center transition ${
            isDragging ? "border-slate-500 bg-slate-50" : "border-slate-300 hover:border-slate-400"
          }`}
        >
          <span className="text-2xl">📷</span>
          <span className="text-sm font-medium text-slate-600">
            Oda fotoğrafını sürükle bırak ya da tıkla
          </span>
          <span className="text-xs text-slate-400">PNG, JPG</span>
        </button>
      ) : (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="Yüklenen oda fotoğrafı" className="h-56 w-full object-cover" />
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
            aria-label="Fotoğrafı kaldır"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
