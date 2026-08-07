import { fal } from "@fal-ai/client";

// Danışman yorumu, önce/sonra, ipuçları, stil uygunluğu, ürün önerileri,
// renk paleti ve genel özet metinlerini tek bir çağrıda üretir. Başarısız
// olursa null döner — çağıran taraf görsel sonucu bundan etkilenmeden devam eder.
export async function generateAnalysis({ roomLabel, style, originalImageUrl, generatedImageUrl }) {
  try {
    const prompt =
      `Sen bir iç mimarlık danışmanısın. Aşağıda bir odanın "önce" ve "sonra" (yeniden tasarlanmış) ` +
      `fotoğrafları var. Oda türü: ${roomLabel}. Uygulanan stil: ${style}.\n\n` +
      `Sadece geçerli JSON döndür, başka hiçbir metin veya markdown code fence ekleme. JSON şu şekilde olmalı:\n` +
      `{\n` +
      `  "advisor": "Tasarımın güçlü yönlerini, neden başarılı olduğunu ve geliştirilebilecek noktaları içeren 3-4 cümlelik akıcı bir Türkçe değerlendirme.",\n` +
      `  "before": ["Önce durumunu anlatan 3 kısa Türkçe madde"],\n` +
      `  "after": ["Sonra durumunu anlatan 3 kısa Türkçe madde"],\n` +
      `  "tips": ["${style} stiline özel 4 ila 6 arası kısa Türkçe dekorasyon ipucu"],\n` +
      `  "fitFor": ["${style} stilinin uygun olduğu 4-5 kişilik/zevk tipi, kısa Türkçe madde"],\n` +
      `  "notFitFor": ["${style} stilinin çok uygun olmayabileceği 3-4 kişilik/zevk tipi, kısa Türkçe madde"],\n` +
      `  "products": [{"name": "Ürün adı", "description": "1 cümlelik kısa açıklama", "reason": "Bu odaya/stile neden uygun olduğu, 1 cümle"}] (bu stile uygun 4 ürün önerisi),\n` +
      `  "palette": [{"name": "Türkçe renk adı", "hex": "#RRGGBB"}] (sonuç görseldeki 5 baskın rengi temsil eden liste, açıktan koyuya sıralı),\n` +
      `  "summary": "Tasarımın genel değerlendirmesini özetleyen 2-3 cümlelik kapanış metni."\n` +
      `}\n\n` +
      `Tüm metinler Türkçe olmalı. Yalnızca JSON döndür.`;

    const result = await fal.subscribe("openrouter/router/vision", {
      input: {
        model: "google/gemini-2.5-flash-lite",
        prompt,
        image_urls: [originalImageUrl, generatedImageUrl],
        max_tokens: 1400,
      },
    });

    const raw = (result.data?.output || "").trim();
    const jsonText = raw.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/```\s*$/, "");
    const parsed = JSON.parse(jsonText);

    const requiredArrays = ["before", "after", "tips", "fitFor", "notFitFor", "products", "palette"];
    const isValid =
      parsed.advisor && parsed.summary && requiredArrays.every((key) => Array.isArray(parsed[key]));

    if (!isValid) {
      throw new Error("Beklenmeyen analiz formatı.");
    }

    return parsed;
  } catch (error) {
    console.error("Analiz üretilemedi:", error);
    return null;
  }
}
