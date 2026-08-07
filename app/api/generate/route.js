import { fal } from "@fal-ai/client";
import { NextResponse } from "next/server";
import { buildRenovatePrompt } from "@/lib/buildPrompt";
import { ROOM_TYPES } from "@/lib/constants";
import { supabase } from "@/lib/supabaseClient";

fal.config({
  credentials: process.env.FAL_KEY,
});

export async function POST(request) {
  const formData = await request.formData();
  const image = formData.get("image");
  const roomType = formData.get("roomType");
  const style = formData.get("style");

  if (!(image instanceof Blob) || image.size === 0) {
    return NextResponse.json({ error: "Lütfen bir oda fotoğrafı yükle." }, { status: 400 });
  }

  if (typeof roomType !== "string" || !roomType.trim()) {
    return NextResponse.json({ error: "Lütfen bir oda türü seç." }, { status: 400 });
  }

  if (typeof style !== "string" || !style.trim()) {
    return NextResponse.json({ error: "Lütfen bir dekorasyon stili seç." }, { status: 400 });
  }

  const roomTypeInfo = ROOM_TYPES.find((r) => r.key === roomType);

  if (!roomTypeInfo) {
    return NextResponse.json({ error: "Geçersiz oda türü." }, { status: 400 });
  }

  const prompt = buildRenovatePrompt({ roomTypeEn: roomTypeInfo.en, style });

  try {
    const originalImageUrl = await fal.storage.upload(image);

    const check = await fal.subscribe("openrouter/router/vision", {
      input: {
        model: "google/gemini-2.5-flash-lite",
        prompt:
          "Does this image show the interior of a real room (e.g. bedroom, living room, kitchen, bathroom, office)? " +
          "Answer with exactly one word: YES or NO.",
        image_urls: [originalImageUrl],
      },
    });

    const checkAnswer = (check.data?.output || "").trim().toUpperCase();

    if (!checkAnswer.startsWith("YES")) {
      return NextResponse.json(
        { error: "Bu görselde bir oda göremedim. Lütfen odanın net göründüğü bir fotoğraf yükle." },
        { status: 400 }
      );
    }

    const result = await fal.subscribe("fal-ai/nano-banana-pro/edit", {
      input: {
        prompt,
        image_urls: [originalImageUrl],
      },
    });

    const generatedImageUrl = result.data?.images?.[0]?.url;

    if (!generatedImageUrl) {
      throw new Error("fal.ai görsel döndürmedi.");
    }

    if (supabase) {
      const { error: insertError } = await supabase.from("renovations").insert({
        room_type: roomType,
        style,
        original_image_url: originalImageUrl,
        generated_image_url: generatedImageUrl,
      });

      if (insertError) {
        console.error("Supabase kayıt hatası:", insertError.message);
      }
    } else {
      console.warn("Supabase yapılandırılmamış, sonuç kaydedilmedi.");
    }

    const analysis = await generateAnalysis({
      roomLabel: roomTypeInfo.label,
      style,
      originalImageUrl,
      generatedImageUrl,
    });

    return NextResponse.json({ originalImageUrl, generatedImageUrl, analysis });
  } catch (error) {
    console.error("Renovate üretim hatası:", error);
    return NextResponse.json(
      { error: "Oda yeniden tasarlanamadı. Lütfen tekrar dene." },
      { status: 500 }
    );
  }
}

// Değerlendirme, önce/sonra ve ipuçları metinlerini tek bir çağrıda üretir.
// Bu adım başarısız olursa görsel sonucu etkilemesin diye ayrı try/catch'te tutulur.
async function generateAnalysis({ roomLabel, style, originalImageUrl, generatedImageUrl }) {
  try {
    const prompt =
      `Sen bir iç mimarlık danışmanısın. Aşağıda bir odanın "önce" ve "sonra" (yeniden tasarlanmış) ` +
      `fotoğrafları var. Oda türü: ${roomLabel}. Uygulanan stil: ${style}.\n\n` +
      `Sadece geçerli JSON döndür, başka hiçbir metin veya markdown code fence ekleme. JSON şu şekilde olmalı:\n` +
      `{\n` +
      `  "advisor": "Tasarımın güçlü yönlerini, neden başarılı olduğunu ve geliştirilebilecek noktaları içeren 3-4 cümlelik akıcı bir Türkçe değerlendirme.",\n` +
      `  "before": ["Önce durumunu anlatan 3 kısa Türkçe madde"],\n` +
      `  "after": ["Sonra durumunu anlatan 3 kısa Türkçe madde"],\n` +
      `  "tips": ["${style} stiline özel 4 ila 6 arası kısa Türkçe dekorasyon ipucu"]\n` +
      `}\n\n` +
      `Tüm metinler Türkçe olmalı. Yalnızca JSON döndür.`;

    const result = await fal.subscribe("openrouter/router/vision", {
      input: {
        model: "google/gemini-2.5-flash-lite",
        prompt,
        image_urls: [originalImageUrl, generatedImageUrl],
        max_tokens: 700,
      },
    });

    const raw = (result.data?.output || "").trim();
    const jsonText = raw.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/```\s*$/, "");
    const parsed = JSON.parse(jsonText);

    if (!parsed.advisor || !Array.isArray(parsed.before) || !Array.isArray(parsed.after) || !Array.isArray(parsed.tips)) {
      throw new Error("Beklenmeyen analiz formatı.");
    }

    return parsed;
  } catch (error) {
    console.error("Analiz üretilemedi:", error);
    return null;
  }
}
