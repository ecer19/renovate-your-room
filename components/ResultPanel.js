"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, Lightbulb } from "lucide-react";
import CompareSlider from "@/components/CompareSlider";

function AnalysisCard({ icon: IconCmp, tone, title, children }) {
  return (
    <div className="card-frame flex flex-col gap-3 bg-[var(--card)] p-5 transition hover:-translate-y-1 sm:p-6">
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
          style={{
            background: tone === "accent" ? "rgba(193,83,27,0.15)" : "rgba(31,77,62,0.15)",
            color: tone === "accent" ? "var(--accent-deep)" : "var(--teal-deep)",
          }}
        >
          <IconCmp className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <h3 className="font-display text-base text-[var(--ink)]">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function BulletList({ items, markerTone }) {
  return (
    <ul className="flex flex-col gap-1.5 text-sm text-[var(--ink-soft)]">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span
            className="mt-2 h-1 w-1 flex-shrink-0 rounded-full"
            style={{ background: markerTone === "accent" ? "var(--accent)" : "var(--teal)" }}
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

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

              {result.analysis && (
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                  <AnalysisCard icon={Brain} tone="accent" title="AI Dekorasyon Danışmanı">
                    <p className="text-sm text-[var(--ink-soft)]">{result.analysis.advisor}</p>
                  </AnalysisCard>

                  <AnalysisCard icon={Sparkles} tone="teal" title="Önce / Sonra Analizi">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--accent-deep)]">
                          Önce
                        </span>
                        <BulletList items={result.analysis.before} markerTone="accent" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--teal-deep)]">
                          Sonra
                        </span>
                        <BulletList items={result.analysis.after} markerTone="teal" />
                      </div>
                    </div>
                  </AnalysisCard>

                  <AnalysisCard icon={Lightbulb} tone="accent" title="Dekorasyon İpuçları">
                    <BulletList items={result.analysis.tips} markerTone="accent" />
                  </AnalysisCard>
                </div>
              )}
            </div>
          )}
        </motion.section>
      )}
    </AnimatePresence>
  );
}
