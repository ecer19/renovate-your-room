"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

const LAYERS = [
  { image: "/thumbs/styles/luxury.jpg", depth: 5, left: "12%", top: "20%", size: "w-14 sm:w-16" },
  { image: "/thumbs/rooms/kitchen.jpg", depth: 6, left: "88%", top: "75%", size: "w-14 sm:w-16" },
];

export default function PageHero() {
  const stageRef = useRef(null);

  function handlePointerMove(e) {
    const rect = stageRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    stageRef.current.style.setProperty("--px", px.toFixed(3));
    stageRef.current.style.setProperty("--py", py.toFixed(3));
  }

  function handlePointerLeave() {
    stageRef.current.style.setProperty("--px", 0);
    stageRef.current.style.setProperty("--py", 0);
  }

  return (
    <header
      ref={stageRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ perspective: 1200 }}
      className="hero-void animate-fade-up relative overflow-hidden rounded-b-[var(--radius-lg)] px-4 py-12 text-center sm:px-6 lg:px-8"
    >
      {LAYERS.map((layer) => (
        <div
          key={layer.image}
          className={`card-frame-sm absolute overflow-hidden opacity-50 blur-[2px] ${layer.size} aspect-square`}
          style={{
            left: layer.left,
            top: layer.top,
            transform: `translate3d(calc(-50% + var(--px, 0) * ${layer.depth}px), calc(-50% + var(--py, 0) * ${layer.depth}px), 0)`,
            transition: "transform 0.3s ease-out",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={layer.image} alt="" draggable={false} className="h-full w-full object-cover" />
        </div>
      ))}

      <div className="relative z-10 flex flex-col items-center gap-4">
        <div
          style={{
            transform: `translate3d(calc(var(--px, 0) * 16px), calc(var(--py, 0) * 16px), 0)`,
            transition: "transform 0.25s ease-out",
          }}
        >
          <motion.div
            animate={{ rotateY: [-6, 6, -6], rotateX: [2, -2, 2] }}
            transition={{
              rotateY: { duration: 10, repeat: Infinity, ease: "easeInOut" },
              rotateX: { duration: 12, repeat: Infinity, ease: "easeInOut" },
            }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative mx-auto mb-2"
          >
            <div className="absolute -inset-4 rounded-full bg-[var(--accent)]/40 blur-2xl" />
            <div className="card-frame-lg relative h-20 w-20 overflow-hidden sm:h-24 sm:w-24">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/thumbs/styles/modern.jpg"
                alt=""
                draggable={false}
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
        </div>

        <div>
          <h1 className="font-display text-2xl text-[var(--ink)] sm:text-3xl">Renovate Your Room</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--ink-soft)]">
            Fotoğrafını yükle, oda türünü ve stilini seç, yeniden tasarla.
          </p>
        </div>
      </div>
    </header>
  );
}
