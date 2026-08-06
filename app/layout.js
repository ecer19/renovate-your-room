import { Alfa_Slab_One, Inter } from "next/font/google";
import "./globals.css";

const display = Alfa_Slab_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Inter({
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
          THESIS: A calm sample-card system, not a game — the room's own photo is the proof,
          contour-bordered cards are the only device carrying personality.
          OWN-WORLD: Warm paper ground (#f6efe1), ink-black contour cards with a hard offset
          shadow, one amber accent reserved for CTAs and active state; Alfa Slab One for
          labels, Inter for body and forms.
          STORY: Visitor understands this is a focused room-redesign tool: upload a photo,
          pick room + style, get a real before/after, keep it in history.
          FIRST VIEWPORT: Four icon chips on paper ground, "Renovate Your Room" in slab caps,
          one plain "Başla" button.
          FORM: started from user-pinned challenger "Renovation Lotería" (seed ae4e9e4b), then
          walked back to Restrained on direct user feedback — carnival palette and game
          framing read as tiring and gimmicky, and dotted background broke text contrast.
          FINISH: unreviewed and undocumented is unfinished; this build ends with the finish
          review, the verdict, and DESIGN.md.
        */}
        {children}
      </body>
    </html>
  );
}
