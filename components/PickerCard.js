"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Icon from "@/components/Icon";

export default function PickerCard({ icon, label, image, isActive, tone, onClick }) {
  const toneSolid = tone === "accent" ? "var(--accent)" : "var(--teal)";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      style={{ perspective: 700 }}
      className="relative h-28 w-full rounded-[var(--radius-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
    >
      <motion.div
        initial={false}
        animate={{ rotateY: isActive ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative h-full w-full"
      >
        {/* Front face — the sample photo as it sits in the tray */}
        <div
          style={{ backfaceVisibility: "hidden" }}
          className="card-frame-sm absolute inset-0 overflow-hidden bg-[var(--card)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, var(--scrim), transparent 55%)" }}
          />
          <span
            className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full"
            style={{ background: toneSolid, color: "white" }}
          >
            <Icon name={icon} className="h-3.5 w-3.5" />
          </span>
          <span className="absolute inset-x-1.5 bottom-1.5 text-center text-[10px] font-bold uppercase leading-tight tracking-wide text-white">
            {label}
          </span>
        </div>

        {/* Back face — the sample turned over once picked */}
        <div
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: toneSolid }}
          className="card-frame-sm absolute inset-0 flex flex-col items-center justify-center gap-2 px-2 py-3 text-white"
        >
          <Check className="h-6 w-6" strokeWidth={2} />
          <span className="text-center text-[10px] font-bold uppercase leading-tight tracking-wide">{label}</span>
        </div>
      </motion.div>
    </button>
  );
}
