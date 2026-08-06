"use client";

import { useState } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
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
  const [started, setStarted] = useState(false);
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

  if (!started) {
    return <WelcomeScreen onStart={() => setStarted(true)} />;
  }

  return (
    <main className="min-h-screen bg-[var(--paper)]">
      <header className="hero-vignette animate-fade-up rounded-b-[2rem] px-4 py-10 text-center shadow-[0_8px_0_rgba(0,0,0,0.06)] sm:px-6 lg:px-8">
        <h1 className="font-display text-2xl uppercase tracking-tight text-[var(--card)] sm:text-3xl">
          Renovate Your Room
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-[var(--card)]/85">
          Fotoğrafını yükle, oda türünü ve stilini seç, yeniden tasarla.
        </p>
      </header>

      <div className="mx-auto flex w-full max-w-5xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <div
          className="animate-fade-up grid gap-6 lg:grid-cols-2 lg:items-start"
          style={{ animationDelay: "0.1s" }}
        >
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
      </div>
    </main>
  );
}
