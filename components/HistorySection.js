"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ROOM_TYPES } from "@/lib/constants";
import ImageLightbox from "@/components/ImageLightbox";

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

  return (
    <section className="card-frame mt-8 flex flex-col gap-4 bg-[var(--card)] p-5 sm:p-7">
      <h2 className="font-display text-xs uppercase tracking-wide text-[var(--ink)]">Geçmiş Tasarımlar</h2>

      {status === "loading" && <p className="text-sm text-[var(--ink-soft)]">Yükleniyor...</p>}

      {status === "unconfigured" && (
        <p className="text-sm text-[var(--ink-soft)]">
          Supabase henüz yapılandırılmamış. <code>.env.local</code> dosyasına{" "}
          <code>NEXT_PUBLIC_SUPABASE_URL</code> ve <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>{" "}
          eklendiğinde geçmiş tasarımların burada görünecek.
        </p>
      )}

      {status === "error" && <p className="text-sm text-red-700">Geçmiş tasarımlar yüklenemedi.</p>}

      {status === "loaded" && items.length === 0 && (
        <p className="text-sm text-[var(--ink-soft)]">Henüz bir tasarım oluşturmadın.</p>
      )}

      {status === "loaded" && items.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setZoomed(item)}
              className="card-frame-sm animate-fade-up flex flex-col gap-2 bg-[var(--card)] p-2 text-left transition hover:-translate-y-0.5"
              style={{ animationDelay: `${Math.min(index, 7) * 0.06}s` }}
            >
              <div className="aspect-square w-full overflow-hidden rounded-md border border-[var(--line)]/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.generated_image_url}
                  alt={`${roomLabel(item.room_type)} - ${item.style}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="font-display truncate text-[10px] uppercase tracking-wide text-[var(--ink)]">
                {roomLabel(item.room_type)}
              </p>
              <p className="truncate text-xs text-[var(--ink-soft)]">{item.style}</p>
              <p className="text-[10px] text-[var(--ink-soft)]/70">{dateFormatter.format(new Date(item.created_at))}</p>
            </button>
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
