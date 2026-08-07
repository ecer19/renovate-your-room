"use client";

import { useState } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import PageHero from "@/components/PageHero";
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
        analysis: data.analysis || null,
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
      <PageHero />

      <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
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
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
        <HistorySection refreshKey={historyVersion} />
      </div>
    </main>
  );
}
