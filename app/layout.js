import "./globals.css";

export const metadata = {
  title: "Renovate Your Room",
  description: "Odanın fotoğrafını yükle ve yapay zekâ ile yeniden tasarla.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
