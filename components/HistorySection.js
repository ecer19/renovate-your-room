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
    <section className="mt-10 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-sm font-semibold text-slate-700">Geçmiş Tasarımlar</h2>

      {status === "loading" && <p className="text-sm text-slate-400">Yükleniyor...</p>}

      {status === "unconfigured" && (
        <p className="text-sm text-slate-400">
          Supabase henüz yapılandırılmamış. <code>.env.local</code> dosyasına{" "}
          <code>NEXT_PUBLIC_SUPABASE_URL</code> ve <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>{" "}
          eklendiğinde geçmiş tasarımların burada görünecek.
        </p>
      )}

      {status === "error" && <p className="text-sm text-red-500">Geçmiş tasarımlar yüklenemedi.</p>}

      {status === "loaded" && items.length === 0 && (
        <p className="text-sm text-slate-400">Henüz bir tasarım oluşturmadın.</p>
      )}

      {status === "loaded" && items.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setZoomed(item)}
              className="flex flex-col gap-2 rounded-2xl border border-slate-200 p-3 text-left transition hover:border-slate-300"
            >
              <div className="aspect-square w-full overflow-hidden rounded-xl bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.generated_image_url}
                  alt={`${roomLabel(item.room_type)} - ${item.style}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="truncate text-xs font-semibold text-slate-700">{roomLabel(item.room_type)}</p>
              <p className="truncate text-xs text-slate-500">{item.style}</p>
              <p className="text-[11px] text-slate-400">{dateFormatter.format(new Date(item.created_at))}</p>
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
