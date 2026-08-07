"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { ROOM_TYPES } from "@/lib/constants";
import ImageLightbox from "@/components/ImageLightbox";
import TiltCard from "@/components/TiltCard";

const dateFormatter = new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" });

function roomLabel(key) {
  return ROOM_TYPES.find((r) => r.key === key)?.label || key;
}

export default function HistorySection({ refreshKey }) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [zoomed, setZoomed] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      if (!supabase) {
        setStatus("unconfigured");
        return;
      }

      setStatus("loading");

      const { data, error } = await supabase
        .from("renovations")
        .select("id, room_type, style, original_image_url, generated_image_url, created_at, is_favorite")
        .order("created_at", { ascending: false })
        .limit(24);

      if (cancelled) return;

      if (error) {
        console.error("Geçmiş tasarımlar alınamadı:", error.message);
        setStatus("error");
        return;
      }

      setItems(data);
      setStatus("loaded");
    }

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  async function handleToggleFavorite(item) {
    if (!supabase) return;
    const nextValue = !item.is_favorite;

    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, is_favorite: nextValue } : i)));

    const { error } = await supabase.from("renovations").update({ is_favorite: nextValue }).eq("id", item.id);

    if (error) {
      console.error("Favori güncellenemedi:", error.message);
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, is_favorite: !nextValue } : i)));
    }
  }

  const visibleItems = useMemo(
    () => (activeTab === "favorites" ? items.filter((i) => i.is_favorite) : items),
    [items, activeTab]
  );

  if (status === "loaded" && items.length === 0) return null;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4">
        <h2 className="font-display text-xl text-[var(--ink)]">Geçmiş Tasarımlar</h2>

        {status === "loaded" && items.length > 0 && (
          <div className="card-frame-sm inline-flex gap-1 bg-[var(--card)] p-1">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`rounded-[calc(var(--radius-sm)-4px)] px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition ${
                activeTab === "all" ? "bg-[var(--accent)] text-white" : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
              }`}
            >
              Tümü
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("favorites")}
              className={`rounded-[calc(var(--radius-sm)-4px)] px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition ${
                activeTab === "favorites" ? "bg-[var(--accent)] text-white" : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
              }`}
            >
              Favoriler
            </button>
          </div>
        )}
      </div>

      {status === "loading" && <p className="text-center text-sm text-[var(--ink-soft)]">Yükleniyor...</p>}

      {status === "unconfigured" && (
        <p className="text-center text-sm text-[var(--ink-soft)]">
          Supabase henüz yapılandırılmamış. <code>.env.local</code> dosyasına{" "}
          <code>NEXT_PUBLIC_SUPABASE_URL</code> ve <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>{" "}
          eklendiğinde geçmiş tasarımların burada görünecek.
        </p>
      )}

      {status === "error" && <p className="text-center text-sm text-red-400">Geçmiş tasarımlar yüklenemedi.</p>}

      {status === "loaded" && visibleItems.length === 0 && (
        <p className="text-center text-sm text-[var(--ink-soft)]">
          {activeTab === "favorites" ? "Henüz favori tasarımın yok." : "Henüz bir tasarım oluşturmadın."}
        </p>
      )}

      {status === "loaded" && visibleItems.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {visibleItems.map((item, index) => (
            <TiltCard
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => setZoomed(item)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setZoomed(item);
              }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(index, 7) * 0.06, type: "spring", stiffness: 260, damping: 22 }}
              className="card-frame-sm flex cursor-pointer flex-col gap-2 bg-[var(--card)] p-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-md border border-[var(--line)]/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.generated_image_url}
                  alt={`${roomLabel(item.room_type)} - ${item.style}`}
                  className="h-full w-full object-cover"
                />
                <motion.button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(item);
                  }}
                  whileTap={{ scale: 1.35 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/45 backdrop-blur-sm"
                  aria-label={item.is_favorite ? "Favoriden çıkar" : "Favorilere ekle"}
                  aria-pressed={Boolean(item.is_favorite)}
                >
                  <Heart
                    className="h-3.5 w-3.5"
                    strokeWidth={2}
                    fill={item.is_favorite ? "#c1531b" : "none"}
                    stroke={item.is_favorite ? "#c1531b" : "#ffffff"}
                  />
                </motion.button>
              </div>
              <p className="truncate text-[10px] font-bold uppercase tracking-wide text-[var(--ink)]">
                {roomLabel(item.room_type)}
              </p>
              <p className="truncate text-xs text-[var(--ink-soft)]">{item.style}</p>
              <p className="text-[10px] text-[var(--ink-soft)]/70">{dateFormatter.format(new Date(item.created_at))}</p>
            </TiltCard>
          ))}
        </div>
      )}

      {zoomed && (
        <ImageLightbox
          src={zoomed.generated_image_url}
          alt={`${roomLabel(zoomed.room_type)} - ${zoomed.style}`}
          onClose={() => setZoomed(null)}
        />
      )}
    </section>
  );
}
