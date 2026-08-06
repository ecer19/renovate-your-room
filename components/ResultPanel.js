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
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-sm font-semibold text-slate-700">Sonuç</h2>

      {status === "idle" && (
        <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 text-center text-sm text-slate-400">
          Fotoğrafını yükle ve Renovate butonuna bas.
        </div>
      )}

      {status === "loading" && (
        <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-500">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
          Odan yeniden tasarlanıyor...
        </div>
      )}

      {status === "error" && (
        <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600">
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
              className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
            >
              Tekrar Oluştur
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              İndir
            </button>
          </div>
        </>
      )}
    </div>
  );
}
