import { fal } from "@fal-ai/client";
import fs from "node:fs";
import path from "node:path";

const envPath = path.resolve(process.cwd(), ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
for (const line of envContent.split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
}

fal.config({ credentials: process.env.FAL_KEY });

const ROOM_TYPES = [
  { key: "bedroom", prompt: "a bright, tastefully furnished bedroom interior, photorealistic, soft natural daylight, editorial interior photography, no people, no text" },
  { key: "study", prompt: "a bright home office study room interior with a desk, photorealistic, soft natural daylight, editorial interior photography, no people, no text" },
  { key: "living", prompt: "a bright, tastefully furnished living room interior, photorealistic, soft natural daylight, editorial interior photography, no people, no text" },
  { key: "kids", prompt: "a bright, cheerful kids bedroom interior, photorealistic, soft natural daylight, editorial interior photography, no people, no text" },
  { key: "kitchen", prompt: "a bright modern kitchen interior, photorealistic, soft natural daylight, editorial interior photography, no people, no text" },
  { key: "bathroom", prompt: "a bright modern bathroom interior with a bathtub, photorealistic, soft natural daylight, editorial interior photography, no people, no text" },
  { key: "toilet", prompt: "a small elegant powder room toilet interior, photorealistic, soft natural daylight, editorial interior photography, no people, no text" },
];

const STYLES = [
  { key: "minimal", prompt: "a minimalist interior design corner, clean lines, neutral palette, photorealistic, editorial interior photography, no people, no text" },
  { key: "modern", prompt: "a modern interior design corner, sleek furniture, photorealistic, editorial interior photography, no people, no text" },
  { key: "scandinavian", prompt: "a scandinavian style interior design corner, light wood, cozy textiles, photorealistic, editorial interior photography, no people, no text" },
  { key: "industrial", prompt: "an industrial style interior design corner, exposed brick and metal, photorealistic, editorial interior photography, no people, no text" },
  { key: "bohemian", prompt: "a bohemian style interior design corner, layered textiles and plants, photorealistic, editorial interior photography, no people, no text" },
  { key: "luxury", prompt: "a luxury interior design corner, opulent materials, photorealistic, editorial interior photography, no people, no text" },
  { key: "cozy", prompt: "a cozy interior design corner, warm textiles and soft lighting, photorealistic, editorial interior photography, no people, no text" },
  { key: "vintage", prompt: "a vintage style interior design corner, retro furniture, photorealistic, editorial interior photography, no people, no text" },
];

async function generateAndSave(item, outDir) {
  const result = await fal.subscribe("fal-ai/flux/schnell", {
    input: { prompt: item.prompt, image_size: "square", num_images: 1 },
  });
  const url = result.data?.images?.[0]?.url;
  if (!url) throw new Error(`No image returned for ${item.key}`);
  const res = await fetch(url);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, `${item.key}.jpg`), buffer);
  console.log(`saved ${item.key}`);
}

const publicDir = path.resolve(process.cwd(), "public", "thumbs");

for (const item of ROOM_TYPES) {
  await generateAndSave(item, path.join(publicDir, "rooms"));
}
for (const item of STYLES) {
  await generateAndSave(item, path.join(publicDir, "styles"));
}

console.log("Done.");
