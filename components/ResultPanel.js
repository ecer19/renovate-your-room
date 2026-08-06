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
    <div className="card-frame flex flex-col gap-4 bg-[var(--card)] p-5 sm:p-7">
      <h2 className="font-display text-xs uppercase tracking-wide text-[var(--ink)]">Sonuç</h2>

      {status === "idle" && (
        <div className="card-frame-sm flex aspect-[4/3] w-full items-center justify-center border-dashed bg-[var(--paper)] text-center text-sm text-[var(--ink-soft)]">
          Fotoğrafını yükle ve Renovate butonuna bas.
        </div>
      )}

      {status === "loading" && (
        <div className="card-frame-sm flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 bg-[var(--teal)]/10 text-sm text-[var(--ink)]">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--teal)]/25 border-t-[var(--teal)]" />
          Odan yeniden tasarlanıyor...
        </div>
      )}

      {status === "error" && (
        <div className="card-frame-sm flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 border-red-300 bg-red-50 p-4 text-center text-sm text-red-700">
          {errorMessage || "Bir hata oluştu. Lütfen tekrar dene."}
        </div>
      )}

      {status === "success" && result && (
        <>
          <CompareSlider
            beforeSrc={result.originalImageUrl}
            afterSrc={result.generatedImageUrl}
            beforeAlt="Orijinal oda"
            afterAlt="Yenilenmiş oda"
          />
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onRegenerate}
              className="card-frame-sm flex-1 bg-[var(--card)] px-4 py-2.5 font-display text-xs uppercase tracking-wide text-[var(--ink)] transition hover:bg-[var(--paper)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2"
            >
              Tekrar Oluştur
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="card-frame-sm flex-1 bg-[var(--accent)] px-4 py-2.5 font-display text-xs uppercase tracking-wide text-white transition hover:bg-[var(--accent-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-deep)] focus-visible:ring-offset-2"
            >
              İndir
            </button>
          </div>
        </>
      )}
    </div>
  );
}
