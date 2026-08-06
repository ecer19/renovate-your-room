"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";
import TiltCard from "@/components/TiltCard";
import MagneticButton from "@/components/MagneticButton";

const WALL_ITEMS = [
  { icon: "living", label: "Salon", tone: "accent", rotate: -6, y: 0 },
  { icon: "minimal", label: "Minimal", tone: "teal", rotate: 4, y: 18 },
  { icon: "bedroom", label: "Yatak Odası", tone: "teal", rotate: -3, y: -8 },
  { icon: "scandinavian", label: "Scandinavian", tone: "accent", rotate: 7, y: 10 },
  { icon: "kitchen", label: "Mutfak", tone: "accent", rotate: -8, y: -14 },
  { icon: "industrial", label: "Industrial", tone: "teal", rotate: 3, y: 6 },
  { icon: "luxury", label: "Luxury", tone: "teal", rotate: -4, y: 16 },
  { icon: "study", label: "Çalışma Odası", tone: "accent", rotate: 6, y: -10 },
  { icon: "cozy", label: "Cozy", tone: "accent", rotate: -2, y: 2 },
  { icon: "vintage", label: "Vintage", tone: "teal", rotate: 5, y: -12 },
];

const TITLE_LETTERS = "Renovate".split("");

const letterVariants = {
  hidden: { opacity: 0, y: 24, rotate: -6 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { delay: 0.25 + i * 0.035, type: "spring", stiffness: 260, damping: 18 },
  }),
};

export default function WelcomeScreen({ onStart }) {
  const wallRef = useRef(null);

  function handlePointerMove(e) {
    const rect = wallRef.current.getBoundingClientRect();
    wallRef.current.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    wallRef.current.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <main className="hero-vignette relative flex min-h-screen flex-col items-center justify-center gap-12 overflow-hidden px-4 py-16 text-center">
      <div
        ref={wallRef}
        onPointerMove={handlePointerMove}
        className="relative mx-auto flex max-w-xl flex-wrap items-center justify-center gap-3 sm:gap-4"
      >
        <div
          className="pointer-events-none absolute -inset-8 opacity-70 transition-opacity"
          style={{
            background:
              "radial-gradient(280px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.22), transparent 70%)",
          }}
        />
        {WALL_ITEMS.map((item, index) => (
          <TiltCard
            key={item.icon}
            baseRotate={item.rotate}
            initial={{ opacity: 0, scale: 0.6, y: item.y + 30 }}
            animate={{ opacity: 1, scale: 1, y: item.y }}
            transition={{ delay: index * 0.05, type: "spring", stiffness: 260, damping: 20 }}
            className="card-frame-sm relative flex h-16 w-14 flex-shrink-0 flex-col items-center justify-center gap-1.5 bg-[var(--card)] sm:h-20 sm:w-[4.5rem]"
          >
            <span
              className={`absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full ${
                item.tone === "accent" ? "bg-[var(--accent)]" : "bg-[var(--teal)]"
              }`}
            />
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full sm:h-8 sm:w-8 ${
                item.tone === "accent"
                  ? "bg-[var(--accent)]/15 text-[var(--accent-deep)]"
                  : "bg-[var(--teal)]/15 text-[var(--teal-deep)]"
              }`}
            >
              <Icon name={item.icon} className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
          </TiltCard>
        ))}
      </div>

      <div className="flex flex-col items-center gap-3">
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
            transition={{ delay: 0.65, duration: 0.5 }}
            className="text-[var(--card)]"
          >
            Your Room
          </motion.span>
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.5 }}
          className="max-w-sm text-sm text-[var(--card)]/85 sm:text-base"
        >
          Odanın fotoğrafını yükle, stilini seç, yapay zekâ ile yeniden tasarla.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 18 }}
      >
        <MagneticButton
          onClick={onStart}
          className="card-frame bg-[var(--accent)] px-10 py-4 font-display text-base text-white transition-colors hover:bg-[var(--accent-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--teal)]"
        >
          Başla
        </MagneticButton>
      </motion.div>
    </main>
  );
}
