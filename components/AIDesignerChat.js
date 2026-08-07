"use client";

import { useState } from "react";
import { Send } from "lucide-react";

const QUICK_ACTIONS = [
  { emoji: "✨", label: "Daha Aydınlık Yap", instruction: "Make the room noticeably brighter, with more natural and artificial light." },
  { emoji: "🌿", label: "Bitki Ekle", instruction: "Add several indoor plants to the room." },
  { emoji: "🪵", label: "Daha Fazla Ahşap Kullan", instruction: "Use more natural wood elements and textures in the furniture and decor." },
  { emoji: "💎", label: "Daha Lüks Yap", instruction: "Make the room feel more luxurious, with richer materials and finishes." },
  { emoji: "🖼", label: "Duvar Dekoru Ekle", instruction: "Add wall art or decorative wall pieces." },
  { emoji: "🛋", label: "Daha Modern Mobilyalar", instruction: "Replace the furniture with more modern-styled pieces." },
  { emoji: "🎨", label: "Duvar Rengini Değiştir", instruction: "Change the wall paint color to something that complements the room's style." },
];

export default function AIDesignerChat({ onRefine, isRefining }) {
  const [text, setText] = useState("");

  function submitInstruction(instruction) {
    if (!instruction.trim() || isRefining) return;
    onRefine(instruction.trim());
    setText("");
  }

  return (
    <div className="card-frame flex w-full flex-col gap-4 bg-[var(--card)] p-5 sm:p-6">
      <h3 className="font-display text-lg text-[var(--ink)]">💬 AI İç Mimar</h3>

      <div className="flex flex-wrap gap-2">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            type="button"
            disabled={isRefining}
            onClick={() => submitInstruction(action.instruction)}
            className="card-frame-sm bg-[var(--paper)] px-3 py-1.5 text-xs font-medium text-[var(--ink)] transition hover:-translate-y-0.5 hover:bg-[var(--accent)]/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {action.emoji} {action.label}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitInstruction(text);
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isRefining}
          placeholder="Odanız hakkında istediğiniz değişikliği yazın..."
          className="card-frame-sm min-w-0 flex-1 bg-[var(--paper)] px-4 py-2.5 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-soft)] disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isRefining || !text.trim()}
          className="card-frame-sm flex flex-shrink-0 items-center gap-1.5 bg-[var(--accent)] px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[var(--accent-deep)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isRefining ? (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <>
              Gönder <Send className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
