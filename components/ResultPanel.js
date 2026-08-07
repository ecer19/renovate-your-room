"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Sparkles,
  Lightbulb,
  Target,
  CircleCheck,
  TriangleAlert,
  ShoppingCart,
  Palette,
  Search,
  FileDown,
  Image as ImageIcon,
} from "lucide-react";
import CompareSlider from "@/components/CompareSlider";
import AIDesignerChat from "@/components/AIDesignerChat";

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

export default function ResultPanel({ status, result, errorMessage, onRegenerate, onRefine, isRefining }) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

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

  async function handleDownloadPdf() {
    if (!result?.generatedImageUrl || isGeneratingPdf) return;

    setIsGeneratingPdf(true);
    try {
      const [{ pdf }, { default: RenovationReportDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/RenovationReportPdf"),
      ]);

      const roomLabel = result.roomTypeLabel || result.roomType;
      const blob = await pdf(
        <RenovationReportDocument roomLabel={roomLabel} style={result.style} result={result} />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `renovate-your-room-rapor-${result.roomType}-${result.style}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF oluşturulamadı:", error);
    } finally {
      setIsGeneratingPdf(false);
    }
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
              <div className="relative w-full">
                <CompareSlider
                  beforeSrc={result.originalImageUrl}
                  afterSrc={result.generatedImageUrl}
                  beforeAlt="Orijinal oda"
                  afterAlt="Yenilenmiş oda"
                />
                {isRefining && (
                  <div className="card-frame-lg absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[var(--void)]/70 text-sm text-white">
                    <span className="h-10 w-10 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                    İsteğin uygulanıyor...
                  </div>
                )}
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={onRegenerate}
                  disabled={isRefining}
                  className="card-frame-sm bg-[var(--card)] px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-[var(--ink)] transition hover:bg-[var(--paper)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Tekrar Oluştur
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isRefining}
                  className="card-frame-sm flex items-center gap-1.5 bg-[var(--accent)] px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[var(--accent-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-deep)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ImageIcon className="h-3.5 w-3.5" strokeWidth={2} /> Görsel İndir
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isRefining || isGeneratingPdf}
                  className="card-frame-sm flex items-center gap-1.5 bg-[var(--teal)] px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[var(--teal-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--teal-deep)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isGeneratingPdf ? (
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <FileDown className="h-3.5 w-3.5" strokeWidth={2} />
                  )}
                  PDF Raporu İndir
                </button>
              </div>

              <AIDesignerChat onRefine={onRefine} isRefining={isRefining} />

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

                  <AnalysisCard icon={Target} tone="teal" title="Bu Stil Sana Uygun mu?">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5">
                        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-[var(--teal-deep)]">
                          <CircleCheck className="h-3.5 w-3.5" strokeWidth={2} /> Kimler İçin Uygun?
                        </span>
                        <BulletList items={result.analysis.fitFor} markerTone="teal" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-[var(--accent-deep)]">
                          <TriangleAlert className="h-3.5 w-3.5" strokeWidth={2} /> Çok Uygun Olmayabilir
                        </span>
                        <BulletList items={result.analysis.notFitFor} markerTone="accent" />
                      </div>
                    </div>
                  </AnalysisCard>

                  {result.analysis.products && (
                    <AnalysisCard icon={ShoppingCart} tone="accent" title="AI Ürün Önerileri">
                      <div className="flex flex-col gap-3">
                        {result.analysis.products.map((product, i) => (
                          <div key={i} className="border-t border-[var(--line)]/15 pt-3 first:border-t-0 first:pt-0">
                            <p className="text-sm font-bold text-[var(--ink)]">{product.name}</p>
                            <p className="text-xs text-[var(--ink-soft)]">{product.description}</p>
                            {product.reason && (
                              <p className="mt-0.5 text-xs italic text-[var(--teal-deep)]">{product.reason}</p>
                            )}
                            <a
                              href={`https://www.google.com/search?q=${encodeURIComponent(product.name)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-[var(--accent-deep)] hover:underline"
                            >
                              <Search className="h-3 w-3" strokeWidth={2} /> İnternette Ara
                            </a>
                          </div>
                        ))}
                      </div>
                    </AnalysisCard>
                  )}

                  {result.analysis.palette && (
                    <AnalysisCard icon={Palette} tone="teal" title="Renk Paleti">
                      <div className="grid grid-cols-5 gap-2">
                        {result.analysis.palette.map((color, i) => (
                          <div key={i} className="flex flex-col items-center gap-1">
                            <span
                              className="h-9 w-full rounded-md border border-[var(--line)]/30"
                              style={{ background: color.hex }}
                            />
                            <span className="text-center text-[9px] font-bold leading-tight text-[var(--ink)]">
                              {color.name}
                            </span>
                            <span className="text-[8px] text-[var(--ink-soft)]">{color.hex}</span>
                          </div>
                        ))}
                      </div>
                    </AnalysisCard>
                  )}
                </div>
              )}
            </div>
          )}
        </motion.section>
      )}
    </AnimatePresence>
  );
}
