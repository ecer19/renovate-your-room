"use client";

import { useState } from "react";
import RenovateForm from "@/components/RenovateForm";
import ResultPanel from "@/components/ResultPanel";
import HistorySection from "@/components/HistorySection";

const initialForm = {
  imageFile: null,
  imagePreviewUrl: null,
  roomType: "",
  style: "",
};

export default function Home() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [historyVersion, setHistoryVersion] = useState(0);

  const isValid = Boolean(form.imageFile) && Boolean(form.roomType) && Boolean(form.style);

  function handleSelectImage(file) {
    setForm((prev) => {
      if (prev.imagePreviewUrl) URL.revokeObjectURL(prev.imagePreviewUrl);
      return { ...prev, imageFile: file, imagePreviewUrl: URL.createObjectURL(file) };
    });
  }

  function handleClearImage() {
    setForm((prev) => {
      if (prev.imagePreviewUrl) URL.revokeObjectURL(prev.imagePreviewUrl);
      return { ...prev, imageFile: null, imagePreviewUrl: null };
    });
  }

  function handleSelectRoomType(roomType) {
    setForm((prev) => ({ ...prev, roomType }));
  }

  function handleSelectStyle(style) {
    setForm((prev) => ({ ...prev, style }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid || status === "loading") return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const body = new FormData();
      body.append("image", form.imageFile);
      body.append("roomType", form.roomType);
      body.append("style", form.style);

      const res = await fetch("/api/generate", { method: "POST", body });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Oda yeniden tasarlanamadı.");
      }

      setResult({
        roomType: form.roomType,
        style: form.style,
        originalImageUrl: data.originalImageUrl,
        generatedImageUrl: data.generatedImageUrl,
      });
      setStatus("success");
      setHistoryVersion((v) => v + 1);
    } catch (err) {
      setErrorMessage(err.message || "Bir hata oluştu. Lütfen tekrar dene.");
      setStatus("error");
    }
  }

  function handleRegenerate() {
    setResult(null);
    setStatus("idle");
    setErrorMessage("");
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-10 flex flex-col items-center gap-3 text-center">
        <span className="text-3xl">🛋️</span>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Renovate Your Room
        </h1>
        <p className="max-w-md text-sm text-slate-500 sm:text-base">
          Odanın fotoğrafını yükle, stilini seç, yapay zekâ ile yeniden tasarla.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <RenovateForm
          form={form}
          onSelectImage={handleSelectImage}
          onClearImage={handleClearImage}
          onSelectRoomType={handleSelectRoomType}
          onSelectStyle={handleSelectStyle}
          onSubmit={handleSubmit}
          isValid={isValid}
          status={status}
        />
        <ResultPanel
          status={status}
          result={result}
          errorMessage={errorMessage}
          onRegenerate={handleRegenerate}
        />
      </div>

      <HistorySection refreshKey={historyVersion} />
    </main>
  );
}
