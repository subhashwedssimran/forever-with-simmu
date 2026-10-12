import { useEffect, useId, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import type { StarId } from "../i18n/copy"
import { useLanguage } from "../context/LanguageContext"
import { asset } from "../lib/asset"
import { NightSky } from "./NightSky"
import { SceneControls } from "./SceneControls"

const HEART_PATH =
  "M50 31 C43 21 33 18 27 28 C19 40 18 50 27 60 C35 69 43 74 50 79 C57 74 65 69 73 60 C82 50 81 40 73 28 C67 18 57 21 50 31 Z"

const STARS: { id: StarId; x: number; y: number }[] = [
  { id: "beginning", x: 27, y: 36 },
  { id: "moments", x: 73, y: 36 },
  { id: "forever", x: 50, y: 74 },
]

const MEMORY_PHOTOS: Record<StarId, { src: string; focus: string; ratio: string }> = {
  beginning: { src: asset("images/memory-beginning.jpg"), focus: "center 64%", ratio: "4 / 3" },
  moments: { src: asset("images/memory-moments.jpg"), focus: "center", ratio: "16 / 10" },
  forever: { src: asset("images/memory-forever.jpg"), focus: "center 58%", ratio: "4 / 3" },
}

const DUST = [
  { x: 50, y: 30 },
  { x: 38, y: 23 },
  { x: 18, y: 48 },
  { x: 33, y: 62 },
  { x: 62, y: 23 },
  { x: 82, y: 48 },
  { x: 67, y: 62 },
]

type ConstellationSceneProps = {
  opened: StarId[]
  onOpen: (id: StarId) => void
  onBack: () => void
  onSkip: () => void
  onContinue: () => void
}

function StarGlyph({ lit }: { lit: boolean }) {
  const raw = useId().replace(/:/g, "")
  return (
    <svg viewBox="0 0 64 64" className="h-11 w-11 overflow-visible sm:h-14 sm:w-14" aria-hidden="true">
      <defs>
        <radialGradient id={`${raw}-core`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fffaf3" />
          <stop offset="45%" stopColor={lit ? "#f0c48a" : "#d5def8"} />
          <stop offset="100%" stopColor={lit ? "rgba(232,168,120,0)" : "rgba(150,170,230,0)"} />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="18" fill={`url(#${raw}-core)`} opacity={lit ? 0.95 : 0.7} />
      <path
        d="M32 3 36.2 24.8 58 32 36.2 39.2 32 61 27.8 39.2 6 32 27.8 24.8Z"
        fill={lit ? "#ffe7c4" : "#f4f0ff"}
      />
      <path
        d="M32 14 34.4 28.2 48 32 34.4 35.8 32 50 29.6 35.8 16 32 29.6 28.2Z"
        fill={lit ? "#ffe1b5" : "#f7f4ff"}
        opacity="0.9"
      />
    </svg>
  )
}

export function ConstellationScene({
  opened,
  onOpen,
  onBack,
  onSkip,
  onContinue,
}: ConstellationSceneProps) {
  const { lang, t } = useLanguage()
  const reduce = useReducedMotion()
  const glowId = useId().replace(/:/g, "")
  const [active, setActive] = useState<StarId | null>(null)
  const [burst, setBurst] = useState<StarId | null>(null)
  const hindi = lang === "hi"
  const complete = opened.length === STARS.length
  const memory = active ? t.stars[active] : null

  useEffect(() => {
    if (!burst) return
    const timer = window.setTimeout(() => setBurst(null), 800)
    return () => window.clearTimeout(timer)
  }, [burst])

  useEffect(() => {
    if (!active) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [active])

  const choose = (id: StarId) => {
    onOpen(id)
    setActive(id)
    setBurst(id)
  }

  return (
    <section className="relative h-dvh w-full overflow-hidden">
      <NightSky tone="indigo" />
      <SceneControls onBack={onBack} onSkip={onSkip} skipLabel={t.skipPortal} />

      <main className="relative z-10 mx-auto flex h-full w-full max-w-5xl flex-col items-center px-4 pt-[4.6rem] pb-20 text-center">
        <h1
          data-lang={lang}
          className={`opening-title max-w-3xl text-balance text-ivory [text-shadow:0_2px_18px_rgba(0,0,0,0.45)] ${
            hindi ? "font-hindi" : "font-display"
          }`}
        >
          {t.constellationTitle}
        </h1>
        <p
          className={`mt-2 max-w-md text-balance text-[0.95rem] text-ivory/75 sm:text-base ${
            hindi ? "font-hindi" : "font-sans"
          }`}
        >
          {complete ? t.constellationDone : t.constellationHint}
        </p>

        <div className="flex min-h-0 w-full flex-1 items-center justify-center py-2">
          <div className="relative aspect-square w-[min(88vw,52vh,460px)]">
            <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100">
              <defs>
                <linearGradient id={`${glowId}-gold`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f8e7c8" />
                  <stop offset="55%" stopColor="#e7b583" />
                  <stop offset="100%" stopColor="#f0c6d6" />
                </linearGradient>
                <filter id={`${glowId}-line`} x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="0.7" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {complete ? (
                <motion.path
                  d={HEART_PATH}
                  fill="none"
                  stroke={`url(#${glowId}-gold)`}
                  strokeWidth="0.55"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter={`url(#${glowId}-line)`}
                  initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: reduce ? 0.01 : 1.7, ease: "easeInOut" }}
                />
              ) : null}
              {DUST.map((point) => (
                <circle
                  key={`${point.x}-${point.y}`}
                  cx={point.x}
                  cy={point.y}
                  r={complete ? 1.05 : 0.7}
                  fill={complete ? "#f6ddb8" : "#efe4ff"}
                  opacity={complete ? 1 : 0.8}
                />
              ))}
            </svg>
            {complete ? (
              <motion.p
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: reduce ? 0 : 1.7, duration: reduce ? 0.2 : 1.15, ease: "easeOut" }}
                className="pointer-events-none absolute top-[48%] left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 font-script text-[clamp(1.2rem,3.5vw,1.65rem)] leading-none text-[#f3d7b0] [text-shadow:0_0_10px_rgba(243,215,176,0.8),0_0_18px_rgba(232,186,140,0.35)]"
              >
                Simran
              </motion.p>
            ) : null}

            {STARS.map((star) => {
              const lit = opened.includes(star.id)
              const selected = active === star.id
              return (
                <button
                  key={star.id}
                  type="button"
                  onClick={() => choose(star.id)}
                  aria-pressed={lit}
                  aria-label={t.stars[star.id].title}
                  className="absolute z-10 flex min-h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0d2b4]"
                  style={{ left: `${star.x}%`, top: `${star.y}%`, touchAction: "manipulation" }}
                >
                  <motion.span
                    className="relative grid place-items-center"
                    animate={
                      selected && !reduce ? { scale: [1, 1.12, 1] } : { scale: lit ? 1.05 : 1 }
                    }
                    transition={
                      selected && !reduce
                        ? { duration: 0.8, ease: "easeInOut" }
                        : { duration: 0.3 }
                    }
                    style={{
                      filter: lit
                        ? "drop-shadow(0 0 8px rgba(255,236,210,0.95)) drop-shadow(0 0 16px rgba(232,176,120,0.75))"
                        : "drop-shadow(0 0 8px rgba(190,205,255,0.65))",
                    }}
                  >
                    <StarGlyph lit={lit || selected} />
                    {burst === star.id && !reduce
                      ? Array.from({ length: 10 }, (_, index) => {
                          const angle = (index / 10) * Math.PI * 2
                          const distance = 34 + (index % 3) * 12
                          return (
                            <motion.span
                              key={`${star.id}-${index}`}
                              className="pointer-events-none absolute h-1 w-1 rounded-full bg-[#ffe7c2]"
                              style={{ boxShadow: "0 0 8px 2px rgba(255,214,160,0.8)" }}
                              initial={{ x: 0, y: 0, opacity: 1 }}
                              animate={{
                                x: Math.cos(angle) * distance,
                                y: Math.sin(angle) * distance,
                                opacity: 0,
                              }}
                              transition={{ duration: 0.7, ease: "easeOut" }}
                            />
                          )
                        })
                      : null}
                  </motion.span>
                  <span
                    className={`pointer-events-none absolute top-[calc(100%-0.15rem)] left-1/2 w-[6.4rem] -translate-x-1/2 text-center text-[0.68rem] leading-tight sm:w-[7.5rem] sm:text-xs ${
                      hindi ? "font-hindi" : "font-sans"
                    } ${lit ? "text-[#f6e2c6]" : "text-ivory/70"}`}
                  >
                    {t.stars[star.id].title}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex h-14 shrink-0 items-center justify-center">
          {complete ? (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={onContinue}
              className={`enter-button max-w-[92vw] cursor-pointer rounded-full px-5 py-3 text-ivory focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0d2b4] sm:px-7 ${
                hindi ? "font-hindi text-[0.98rem]" : "font-sans text-[0.92rem] tracking-[0.08em]"
              }`}
            >
              {t.continueForever}
            </motion.button>
          ) : null}
        </div>
      </main>

      <AnimatePresence>
        {memory && active ? (
          <motion.div
            className="absolute inset-0 z-30 flex items-center justify-center px-4 pt-16 pb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-[#070814]/55"
              aria-label={t.close}
              onClick={() => setActive(null)}
            />
            <motion.article
              role="dialog"
              aria-modal="true"
              aria-labelledby="memory-title"
              className="memory-card relative z-10 w-[min(92vw,26rem)] rounded-3xl px-5 py-5 text-left sm:px-6"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: reduce ? 0.2 : 0.35 }}
            >
              <div className="flex items-start justify-between gap-3">
                <h2
                  id="memory-title"
                  className={`text-[1.45rem] leading-tight text-[#fff6ea] sm:text-[1.7rem] ${
                    hindi ? "font-hindi" : "font-display"
                  }`}
                >
                  {memory.title}
                </h2>
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  className="min-h-10 shrink-0 cursor-pointer rounded-full border border-[#f0d2b4]/40 px-3 font-sans text-[0.75rem] text-[#f6e7d4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f0d2b4]"
                >
                  {t.close}
                </button>
              </div>
              <div className="memory-photo relative mt-4 overflow-hidden rounded-2xl" style={{ aspectRatio: MEMORY_PHOTOS[active].ratio }}>
                <img
                  src={MEMORY_PHOTOS[active].src}
                  alt={memory.photoAlt}
                  draggable={false}
                  className="h-full w-full object-cover"
                  style={{ objectPosition: MEMORY_PHOTOS[active].focus }}
                />
                <div className="pointer-events-none absolute inset-3 border border-[#f0d2b4]/40" />
              </div>
              <p
                className={`mt-4 text-[1.02rem] leading-relaxed text-ivory/90 sm:text-[1.08rem] ${
                  hindi ? "font-hindi" : "font-display"
                }`}
              >
                {memory.message}
              </p>
            </motion.article>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
