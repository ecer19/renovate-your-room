# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Bireysel kullanıcılar (Exposure AI Academy öğrencisinin geliştirdiği bir okul projesi olarak) — kendi odalarının fotoğrafını yükleyip farklı bir dekorasyon stiliyle nasıl görüneceğini merak eden herkes. Giriş/kayıt yok, herkes doğrudan kullanabiliyor.

## Product Purpose

Kullanıcı bir oda fotoğrafı yükler, oda türünü ve dekorasyon stilini seçer; yapay zekâ (fal.ai `nano-banana-pro/edit`) odayı seçilen stile göre yeniden tasarlar. Sonuç önce/sonra karşılaştırmalı gösterilir, indirilebilir ve geçmiş tasarımlar listesinde saklanır (Supabase).

## Positioning

Tek fotoğraf + tek stil seçimiyle, odanın mimari yapısını (duvar, pencere, kapı) koruyarak fotogerçekçi bir "renovate" önizlemesi üretmek — genel bir "AI görsel üretici" değil, spesifik olarak "bu odanın kendisi başka bir stilde nasıl görünür" sorusuna cevap veren bir araç.

## Operating Context

- Next.js (App Router) + Tailwind v4, tek sayfalık akış (`app/page.js`).
- Kullanıcı adımları: 1) fotoğraf yükle, 2) oda türü seç (Yatak Odası, Çalışma Odası, Salon, Çocuk Odası, Mutfak, Banyo, Tuvalet), 3) stil seç (Minimal, Modern, Scandinavian, Industrial, Bohemian, Luxury, Cozy, Vintage), 4) "Renovate" ile üret.
- Üretim ~30-90 saniye sürüyor (fal.ai edit modeli senkron/subscribe ile çağrılıyor).
- Sonuç: önce/sonra slider, indirme butonu, "tekrar oluştur".
- Geçmiş tasarımlar bölümü Supabase'den client-side çekiliyor, ızgara halinde gösteriliyor.
- Mobil kullanım bekleniyor (öğrenciler telefondan da deneyecek) — responsive şart.
- Kardeş proje `ai-bouqet-maker` (aynı akademi, farklı ürün — çiçek buketi üretici) altın/gümüş, zarif/anneler günü temalı bir kimlik kullanıyor; bu proje görsel olarak ondan bağımsız, kendi kimliğini kuruyor.

## Capabilities and Constraints

- Auth yok, herkes insert/select yapabiliyor (açık RLS).
- Sadece fal.ai ve Supabase'e bağımlı; başka bir backend yok.
- Deploy hedefi Vercel.
- Şu an tasarım son derece varsayılan (düz slate/beyaz Tailwind) — kullanıcı bunu "çok sade" buldu, kimlik henüz kurulmadı.

## Brand Commitments

Yok — ürün adı "Renovate Your Room", henüz sabit bir görsel kimliği yok.

## Evidence on Hand

Gerçek kullanıcı içeriği/örnek görsel yok; demo/test amaçlı üretilen görseller var ama pazarlama materyali değil. Bu bir okul projesi, iddialı pazarlama claim'leri (müşteri sayısı, ölçüm, vb.) uydurulmayacak.

## Product Principles

- Görev odaklı (Operate): tasarım hiçbir zaman yükleme/seçim/sonuç akışının önüne geçmemeli.
- Önce/sonra karşılaştırması ürünün kalbi — bu ana her zaman görsel ağırlık verilmeli.
- Basit, hızlı, mobil-dostu; öğrenci projesi olduğu için abartılı karmaşıklıktan kaçınılmalı ama "sade" olmaktan çıkıp kendine özgü bir kimliğe kavuşmalı.

## Accessibility & Inclusion

Özel bir gereksinim belirtilmedi; standart kontrast/okunabilirlik beklentisi geçerli.
