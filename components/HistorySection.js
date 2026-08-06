"use client";

import { useEffect, useState } from "react";
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
        .select("id, room_type, style, original_image_url, generated_image_url, created_at")
        .order("created_at", { ascending: false })
        .limit(12);

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

  if (status === "loaded" && items.length === 0) return null;

  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-display text-center text-xl text-[var(--ink)]">Geçmiş Tasarımlar</h2>

      {status === "loading" && <p className="text-center text-sm text-[var(--ink-soft)]">Yükleniyor...</p>}

      {status === "unconfigured" && (
        <p className="text-center text-sm text-[var(--ink-soft)]">
          Supabase henüz yapılandırılmamış. <code>.env.local</code> dosyasına{" "}
          <code>NEXT_PUBLIC_SUPABASE_URL</code> ve <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>{" "}
          eklendiğinde geçmiş tasarımların burada görünecek.
        </p>
      )}

      {status === "error" && <p className="text-center text-sm text-red-700">Geçmiş tasarımlar yüklenemedi.</p>}

      {status === "loaded" && items.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item, index) => (
            <TiltCard
              key={item.id}
              as="button"
              onClick={() => setZoomed(item)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(index, 7) * 0.06, type: "spring", stiffness: 260, damping: 22 }}
              className="card-frame-sm flex flex-col gap-2 bg-[var(--card)] p-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
            >
              <div className="aspect-square w-full overflow-hidden rounded-md border border-[var(--line)]/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.generated_image_url}
                  alt={`${roomLabel(item.room_type)} - ${item.style}`}
                  className="h-full w-full object-cover"
                />
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
