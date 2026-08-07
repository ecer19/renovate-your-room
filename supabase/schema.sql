-- Renovate Your Room — Supabase tablosu

create table if not exists renovations (
  id                   uuid primary key default gen_random_uuid(),
  room_type            text not null,
  style                text not null,
  original_image_url   text not null,
  generated_image_url  text not null,
  is_favorite          boolean not null default false,
  created_at           timestamptz not null default now()
);

alter table renovations add column if not exists is_favorite boolean not null default false;

-- Geçmiş üretimleri en yeniden eskiye listelemek için
create index if not exists renovations_created_at_idx on renovations (created_at desc);

-- Bu proje kullanıcı girişi (auth) içermiyor; formu dolduran herkes
-- kayıt oluşturabilsin, geçmişi görebilsin ve favori durumunu değiştirebilsin
-- diye RLS'i açık bırakıyoruz.
alter table renovations enable row level security;

drop policy if exists "Herkes tasarım ekleyebilir" on renovations;
create policy "Herkes tasarım ekleyebilir"
  on renovations for insert
  with check (true);

drop policy if exists "Herkes tasarımları görebilir" on renovations;
create policy "Herkes tasarımları görebilir"
  on renovations for select
  using (true);

drop policy if exists "Herkes favori durumunu güncelleyebilir" on renovations;
create policy "Herkes favori durumunu güncelleyebilir"
  on renovations for update
  using (true)
  with check (true);
