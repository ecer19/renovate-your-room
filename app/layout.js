import { DM_Serif_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const display = DM_Serif_Display({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-display",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata = {
  title: "Renovate Your Room",
  description: "Odanın fotoğrafını yükle ve yapay zekâ ile yeniden tasarla.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen antialiased">
        {/*
          THESIS: A real material sample you turn over in your hand — the room's own photo
          is the proof, the swatch card is the only device carrying personality.
          OWN-WORLD: Warm paper ground (#f1e9dc), clay + pine two-tone accent, DM Serif
          Display for headlines, DM Sans for body/forms, lucide line icons, hard graphic
          shadow on small chips, soft lifted shadow on large surfaces.
          STORY: Visitor understands this is a focused room-redesign tool: upload a photo,
          pick room + style — each pick flips like a real swatch — get a real before/after,
          keep it in history.
          FIRST VIEWPORT: Header band on hero-vignette pine, "Renovate Your Room" in serif
          display type, plain "Başla" button below a scattered swatch wall.
          FORM: user-directed "Numune" (swatch) direction, chosen from 3 named options
          (Atölye / Numune / Blueprint) via explicit brief; structure, routes, props, state,
          and flow are frozen — this pass is tokens + visual restyle only.
          FINISH: unreviewed and undocumented is unfinished; this build ends with the finish
          review, the verdict, and DESIGN.md.
        */}
        {children}
      </body>
    </html>
  );
}
