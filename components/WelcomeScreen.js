"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import MagneticButton from "@/components/MagneticButton";

// Depth-ordered photo layers for the parallax "diorama" — far (small, blurred,
// barely moves) to near (large, sharp, moves most, has its own autonomous
// 3D drift). Position is % of the stage, deliberately scattered, not a grid.
const LAYERS = [
  { image: "/thumbs/rooms/kitchen.jpg", depth: 6, left: "10%", top: "12%", size: "w-16 sm:w-20", blur: "blur-[3px]", opacity: "opacity-40" },
  { image: "/thumbs/styles/luxury.jpg", depth: 7, left: "82%", top: "70%", size: "w-16 sm:w-20", blur: "blur-[3px]", opacity: "opacity-40" },
  { image: "/thumbs/rooms/bedroom.jpg", depth: 15, left: "80%", top: "14%", size: "w-24 sm:w-32", blur: "blur-[1px]", opacity: "opacity-70" },
  { image: "/thumbs/styles/scandinavian.jpg", depth: 16, left: "8%", top: "66%", size: "w-24 sm:w-32", blur: "blur-[1px]", opacity: "opacity-70" },
];

const TITLE_LETTERS = "Renovate".split("");

const letterVariants = {
  hidden: { opacity: 0, y: 24, rotate: -6 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { delay: 0.35 + i * 0.035, type: "spring", stiffness: 260, damping: 18 },
  }),
};

export default function WelcomeScreen({ onStart }) {
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
    <main className="hero-void relative flex min-h-screen flex-col items-center justify-center gap-10 overflow-hidden px-4 py-16 text-center">
      <div className="blob blob-a -left-24 -top-24 h-[26rem] w-[26rem] bg-[var(--accent)]/35" />
      <div className="blob blob-c -bottom-32 right-0 h-[26rem] w-[26rem] bg-[var(--teal)]/45" />

      <div
        ref={stageRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{ perspective: 1600 }}
        className="relative h-[22rem] w-full max-w-2xl sm:h-[28rem]"
      >
        {LAYERS.map((layer, i) => (
          <div
            key={layer.image}
            className={`card-frame-sm absolute overflow-hidden ${layer.size} ${layer.blur} ${layer.opacity} aspect-square`}
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

        {/* Hero object — the featured photo, floating and slowly turning in space */}
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            style={{
              transform: `translate3d(calc(var(--px, 0) * 30px), calc(var(--py, 0) * 30px), 0)`,
              transition: "transform 0.25s ease-out",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotateY: -20 }}
              animate={{
                opacity: 1,
                scale: 1,
                rotateY: [-10, 10, -10],
                rotateX: [4, -4, 4],
              }}
              transition={{
                opacity: { duration: 0.7 },
                scale: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                rotateY: { duration: 9, repeat: Infinity, ease: "easeInOut" },
                rotateX: { duration: 11, repeat: Infinity, ease: "easeInOut" },
              }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative"
            >
              <div className="absolute -inset-6 rounded-full bg-[var(--accent)]/40 blur-3xl" />
              <div className="card-frame-lg relative h-56 w-56 overflow-hidden sm:h-72 sm:w-72">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/thumbs/rooms/living.jpg"
                  alt="Yenilenmiş oda örneği"
                  draggable={false}
                  className="h-full w-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, var(--scrim), transparent 60%)" }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="relative z-20 -mt-8 flex flex-col items-center gap-3">
        <h1 className="font-display flex flex-wrap items-baseline justify-center gap-x-4 text-4xl uppercase leading-tight tracking-tight sm:text-6xl">
          <span className="flex" style={{ color: "var(--accent)" }}>
            {TITLE_LETTERS.map((letter, i) => (
              <motion.span key={i} custom={i} variants={letterVariants} initial="hidden" animate="visible">
                {letter}
              </motion.span>
            ))}
          </span>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.5 }}
            className="text-[var(--ink)]"
          >
            Your Room
          </motion.span>
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.5 }}
          className="max-w-sm text-sm text-[var(--ink-soft)] sm:text-base"
        >
          Odanın fotoğrafını yükle, stilini seç, yapay zekâ ile yeniden tasarla.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1, type: "spring", stiffness: 260, damping: 18 }}
        className="relative z-20"
      >
        <MagneticButton
          onClick={onStart}
          className="card-frame bg-[var(--accent)] px-10 py-4 font-display text-base text-white transition-colors hover:bg-[var(--accent-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]"
        >
          Başla
        </MagneticButton>
      </motion.div>
    </main>
  );
}
