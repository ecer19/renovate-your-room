-- Renovate Your Room — Supabase tablosu

create table if not exists renovations (
  id                   uuid primary key default gen_random_uuid(),
  room_type            text not null,
  style                text not null,
  original_image_url   text not null,
  generated_image_url  text not null,
  created_at           timestamptz not null default now()
);

-- Geçmiş üretimleri en yeniden eskiye listelemek için
create index if not exists renovations_created_at_idx on renovations (created_at desc);

-- Bu proje kullanıcı girişi (auth) içermiyor; formu dolduran herkes
-- kayıt oluşturabilsin ve geçmişi görebilsin diye RLS'i açık bırakıyoruz.
alter table renovations enable row level security;

create policy "Herkes tasarım ekleyebilir"
  on renovations for insert
  with check (true);

create policy "Herkes tasarımları görebilir"
  on renovations for select
  using (true);
