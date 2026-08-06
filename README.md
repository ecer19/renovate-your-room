# Renovate Your Room

Kullanıcının oda fotoğrafını yükleyip seçtiği dekorasyon stiline göre yapay zekâ ile yeniden tasarlayan bir Next.js uygulaması.

## Kurulum

```bash
npm install
cp .env.example .env.local
```

`.env.local` içine şu değerleri gir:

```
FAL_KEY=...                                  # fal.ai API anahtarın
NEXT_PUBLIC_SUPABASE_URL=...                 # Supabase proje URL'i
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...     # Supabase anon/publishable key
```

### Supabase tablosunu oluşturma

Supabase projende SQL Editor'ü aç ve `supabase/schema.sql` içeriğini çalıştır. Bu, `renovations` tablosunu ve RLS policy'lerini oluşturur.

## Geliştirme

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) adresini aç.

## Mimari

- `app/page.js` — form + sonuç + geçmiş bölümlerini yöneten ana sayfa (client component).
- `app/api/generate/route.js` — backend API route. Yüklenen görseli `fal.storage.upload` ile fal.ai'ye yükler, `fal-ai/nano-banana-pro/edit` modelini çağırır, sonucu Supabase'e kaydeder.
- `lib/buildPrompt.js` — kullanıcı seçimlerinden (oda türü + stil) edit prompt'u üretir.
- `lib/supabaseClient.js` — tek Supabase client (hem API route'ta insert, hem `HistorySection` içinde select için kullanılır).
- `components/HistorySection.js` — geçmiş tasarımları doğrudan Supabase'den client-side çeker.

## Deploy

GitHub'a push ettikten sonra Vercel'de projeyi import et ve şu environment variable'ları ekle:

```
FAL_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```
