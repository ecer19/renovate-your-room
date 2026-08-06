"use client";

import { motion, AnimatePresence } from "framer-motion";
import CompareSlider from "@/components/CompareSlider";

export default function ResultPanel({ status, result, errorMessage, onRegenerate }) {
  async function handleDownload() {
    if (!result?.generatedImageUrl) return;

    const res = await fetch(result.generatedImageUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `renovated-${result.roomType}-${result.style}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <AnimatePresence>
      {status !== "idle" && (
        <motion.section
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
          className="mt-14 flex flex-col items-center gap-6"
        >
          <h2 className="font-display text-2xl text-[var(--ink)]">Sonuç</h2>

          {status === "loading" && (
            <div className="card-frame-lg flex aspect-[16/9] w-full max-w-3xl flex-col items-center justify-center gap-3 bg-[var(--teal)]/10 text-sm text-[var(--ink)]">
              <span className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--teal)]/25 border-t-[var(--teal)]" />
              Odan yeniden tasarlanıyor...
            </div>
          )}

          {status === "error" && (
            <div className="card-frame-lg flex aspect-[16/9] w-full max-w-3xl flex-col items-center justify-center gap-2 border-red-500/40 bg-red-950/40 p-4 text-center text-sm text-red-300">
              {errorMessage || "Bir hata oluştu. Lütfen tekrar dene."}
            </div>
          )}

          {status === "success" && result && (
            <div className="flex w-full max-w-3xl flex-col items-center gap-6">
              <CompareSlider
                beforeSrc={result.originalImageUrl}
                afterSrc={result.generatedImageUrl}
                beforeAlt="Orijinal oda"
                afterAlt="Yenilenmiş oda"
              />
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={onRegenerate}
                  className="card-frame-sm bg-[var(--card)] px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-[var(--ink)] transition hover:bg-[var(--paper)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2"
                >
                  Tekrar Oluştur
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="card-frame-sm bg-[var(--accent)] px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[var(--accent-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-deep)] focus-visible:ring-offset-2"
                >
                  İndir
                </button>
              </div>
            </div>
          )}
        </motion.section>
      )}
    </AnimatePresence>
  );
}
