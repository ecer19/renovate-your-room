import { fal } from "@fal-ai/client";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

fal.config({
  credentials: process.env.FAL_KEY,
});

// Mevcut bir üretimi, kullanıcının serbest metin isteğiyle üzerine inşa ederek
// yeniden düzenler — sıfırdan başlamaz, aynı oda üzerinde devam eder.
export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { baseImageUrl, previousPrompt, instruction, roomType, style } = body;

  if (typeof baseImageUrl !== "string" || !baseImageUrl.trim()) {
    return NextResponse.json({ error: "Geçersiz görsel." }, { status: 400 });
  }

  if (typeof previousPrompt !== "string" || !previousPrompt.trim()) {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  if (typeof instruction !== "string" || !instruction.trim()) {
    return NextResponse.json({ error: "Lütfen bir değişiklik iste." }, { status: 400 });
  }

  const newPrompt =
    `${previousPrompt} Additionally: ${instruction.trim()}. ` +
    `Preserve everything else about the room exactly as it currently is.`;

  try {
    const result = await fal.subscribe("fal-ai/nano-banana-pro/edit", {
      input: {
        prompt: newPrompt,
        image_urls: [baseImageUrl],
      },
    });

    const generatedImageUrl = result.data?.images?.[0]?.url;

    if (!generatedImageUrl) {
      throw new Error("fal.ai görsel döndürmedi.");
    }

    if (supabase && roomType && style) {
      const { error: insertError } = await supabase.from("renovations").insert({
        room_type: roomType,
        style,
        original_image_url: baseImageUrl,
        generated_image_url: generatedImageUrl,
      });

      if (insertError) {
        console.error("Supabase kayıt hatası:", insertError.message);
      }
    }

    return NextResponse.json({ generatedImageUrl, prompt: newPrompt });
  } catch (error) {
    console.error("Refine hatası:", error);
    return NextResponse.json({ error: "Değişiklik uygulanamadı. Lütfen tekrar dene." }, { status: 500 });
  }
}
