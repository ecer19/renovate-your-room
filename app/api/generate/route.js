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

    return NextResponse.json({ originalImageUrl, generatedImageUrl });
  } catch (error) {
    console.error("Renovate üretim hatası:", error);
    return NextResponse.json(
      { error: "Oda yeniden tasarlanamadı. Lütfen tekrar dene." },
      { status: 500 }
    );
  }
}
