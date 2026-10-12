import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { useLanguage } from "../context/LanguageContext"
import { NightSky } from "./NightSky"
import { SceneControls } from "./SceneControls"
import { asset } from "../lib/asset"

const LIT = asset("images/birthday-cake-lit.webp")
const UNLIT = asset("images/birthday-cake-unlit.webp")

/** Wick positions measured from the lit photograph, as percentages of the image. */
const WICKS = [
  { x: 39.65, y: 15.4 },
  { x: 44.84, y: 15.5 },
  { x: 50.01, y: 16.1 },
  { x: 55.03, y: 15.7 },
  { x: 60.1, y: 15.6 },
]

const RISING = [
  { left: "18%", delay: "0s", duration: "6.5s" },
  { left: "32%", delay: "1.2s", duration: "7.2s" },
  { left: "47%", delay: "0.4s", duration: "6.8s" },
  { left: "61%", delay: "1.8s", duration: "7.4s" },
  { left: "74%", delay: "0.8s", duration: "6.2s" },
  { left: "26%", delay: "2.2s", duration: "7.6s" },
  { left: "54%", delay: "2.6s", duration: "6.4s" },
  { left: "84%", delay: "1.5s", duration: "7s" },
]

const PETALS = [
  { left: "6%", delay: "0s", duration: "7.2s", drift: "24px", color: "#9a2748", size: 13 },
  { left: "16%", delay: "0.4s", duration: "8s", drift: "-16px", color: "#d46a86", size: 11 },
  { left: "28%", delay: "0.15s", duration: "7.6s", drift: "18px", color: "#7c1d38", size: 12 },
  { left: "40%", delay: "0.7s", duration: "8.4s", drift: "-22px", color: "#e7a0b4", size: 10 },
  { left: "52%", delay: "0.25s", duration: "7.4s", drift: "14px", color: "#b43a5c", size: 13 },
  { left: "63%", delay: "0.9s", duration: "8.1s", drift: "-12px", color: "#f0c2ce", size: 10 },
  { left: "74%", delay: "0.35s", duration: "7.8s", drift: "20px", color: "#8e2344", size: 12 },
  { left: "84%", delay: "0.55s", duration: "8.6s", drift: "-18px", color: "#c45b78", size: 11 },
  { left: "12%", delay: "1.1s", duration: "7.9s", drift: "10px", color: "#a83256", size: 9 },
  { left: "91%", delay: "0.2s", duration: "7.3s", drift: "-14px", color: "#e8b4c2", size: 12 },
]

const CONFETTI = [
  { left: "10%", delay: "0.1s", duration: "6.4s", drift: "16px" },
  { left: "22%", delay: "0.5s", duration: "7s", drift: "-10px" },
  { left: "33%", delay: "0.2s", duration: "6.2s", drift: "12px" },
  { left: "44%", delay: "0.8s", duration: "7.2s", drift: "-18px" },
  { left: "55%", delay: "0.3s", duration: "6.6s", drift: "8px" },
  { left: "66%", delay: "0.6s", duration: "7.4s", drift: "-14px" },
  { left: "76%", delay: "0.15s", duration: "6.8s", drift: "18px" },
  { left: "88%", delay: "0.45s", duration: "6.3s", drift: "-8px" },
  { left: "18%", delay: "1s", duration: "7.1s", drift: "6px" },
  { left: "48%", delay: "0.9s", duration: "6.5s", drift: "-12px" },
  { left: "70%", delay: "1.1s", duration: "7.3s", drift: "14px" },
  { left: "94%", delay: "0.35s", duration: "6.9s", drift: "-6px" },
]

type BirthdayCakeSceneProps = {
  blown: boolean
  onBlow: () => void
  onBack: () => void
  onSkip: () => void
  onLetter: () => void
}

export function BirthdayCakeScene({ blown, onBlow, onBack, onSkip, onLetter }: BirthdayCakeSceneProps) {
  const { lang, t } = useLanguage()
  const reduce = useReducedMotion()
  const hindi = lang === "hi"
  const [revealed, setRevealed] = useState(blown)
  const [litReady, setLitReady] = useState(false)
  const [unlitReady, setUnlitReady] = useState(false)

  useEffect(() => {
    if (!blown || revealed) return
    const timer = window.setTimeout(() => setRevealed(true), reduce ? 180 : 1100)
    return () => window.clearTimeout(timer)
  }, [blown, revealed, reduce])

  const buttonClass = `enter-button pointer-events-auto max-w-[92vw] cursor-pointer rounded-full px-5 py-3 text-center leading-snug text-ivory focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0d2b4] sm:px-7 ${
    hindi ? "font-hindi text-[0.98rem]" : "font-sans text-[0.92rem] tracking-[0.05em]"
  }`

  return (
    <section data-scene="birthday-cake" className="relative h-dvh w-full overflow-hidden">
      <NightSky tone="rose" />
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[#07010f]"
        initial={{ opacity: reduce ? 0 : 0.55 }}
        animate={{ opacity: 0 }}
        transition={{ duration: reduce ? 0.2 : 1.5, ease: "easeOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,196,140,0.28),transparent_46%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0.2 : 1.8, delay: reduce ? 0 : 0.25 }}
      />

      <SceneControls onBack={onBack} onSkip={onSkip} skipLabel={t.skipCake} />

      <main className="relative z-10 flex h-full flex-col items-center px-4 pt-16 pb-20 text-center">
        <h1
          data-lang={lang}
          className={`relative z-30 opening-title max-w-3xl text-balance text-ivory [text-shadow:0_2px_18px_rgba(0,0,0,0.5)] ${
            hindi ? "font-hindi" : "font-display"
          }`}
        >
          {t.happyBirthday}
        </h1>
        <p
          data-lang={lang}
          className={`relative z-30 opening-message mt-2 max-w-xl text-balance text-ivory/88 ${
            hindi ? "font-hindi" : "font-display"
          }`}
        >
          {t.cakeLine}
        </p>

        <div className="cake-slot relative z-10 mt-2 flex min-h-0 w-full flex-1 items-center justify-center">
          <motion.div
            className="cake-frame relative mx-auto"
            initial={reduce ? false : { opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={
              reduce
                ? { duration: 0.2 }
                : {
                    opacity: { duration: 1.15, delay: 0.2 },
                    y: { duration: 1.25, delay: 0.2, ease: [0.22, 1, 0.36, 1] },
                    scale: { duration: 9, delay: 0.35, ease: "easeOut" },
                  }
            }
          >
            <img
              src={LIT}
              alt={blown ? "" : t.cakeAltLit}
              data-cake="lit"
              data-ready={litReady ? "true" : "false"}
              draggable={false}
              onLoad={() => setLitReady(true)}
              className={`absolute inset-0 h-full w-full object-fill transition-opacity duration-1000 ${
                blown ? "opacity-0" : "cake-flicker opacity-100"
              }`}
            />
            <img
              src={UNLIT}
              alt={blown ? t.cakeAltUnlit : ""}
              data-cake="unlit"
              data-ready={unlitReady ? "true" : "false"}
              draggable={false}
              onLoad={() => setUnlitReady(true)}
              className={`absolute inset-0 h-full w-full object-fill transition-opacity duration-1000 ${
                blown ? "opacity-100" : "opacity-0"
              }`}
            />

            {!reduce
              ? RISING.map((mote) => (
                  <span
                    key={mote.left}
                    aria-hidden="true"
                    className="rose-rise pointer-events-none absolute bottom-[8%] h-1.5 w-1.5 rounded-full bg-[#f0c79a]"
                    style={{
                      left: mote.left,
                      animationDelay: mote.delay,
                      animationDuration: mote.duration,
                    }}
                  />
                ))
              : null}

            {blown
              ? WICKS.map((wick, index) => (
                  <span key={wick.x} className="pointer-events-none absolute" style={{ left: `${wick.x}%`, top: `${wick.y}%` }}>
                    <span
                      data-smoke="wick"
                      className="cake-smoke"
                      style={{ animationDelay: `${index * 0.08}s` }}
                    />
                    <span
                      aria-hidden="true"
                      className="cake-smoke"
                      style={{ animationDelay: `${0.45 + index * 0.08}s`, marginLeft: index % 2 === 0 ? "-4px" : "3px" }}
                    />
                  </span>
                ))
              : null}

            {blown && !reduce ? (
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute top-[18%] left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,220,170,0.7),transparent_70%)]"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: [0, 0.9, 0], scale: [0.4, 1.6, 2] }}
                transition={{ duration: 1.3, ease: "easeOut" }}
              />
            ) : null}
          </motion.div>
        </div>

        {blown && !reduce ? (
          <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden="true">
            {PETALS.map((petal, index) => (
              <span
                key={`petal-${index}`}
                data-petal="true"
                className="petal-fall absolute top-0"
                style={{
                  left: petal.left,
                  width: petal.size,
                  height: petal.size * 0.72,
                  background: petal.color,
                  animationDelay: petal.delay,
                  animationDuration: petal.duration,
                  ["--drift" as string]: petal.drift,
                }}
              />
            ))}
            {CONFETTI.map((piece, index) => (
              <span
                key={`confetti-${index}`}
                data-confetti="true"
                className="confetti-drift absolute top-0 h-1.5 w-2.5 bg-[#f0c79a]"
                style={{
                  left: piece.left,
                  animationDelay: piece.delay,
                  animationDuration: piece.duration,
                  ["--drift" as string]: piece.drift,
                }}
              />
            ))}
          </div>
        ) : null}

        <div className="relative z-30 mt-2 flex min-h-[4.5rem] w-full flex-col items-center justify-end gap-3">
          {revealed ? (
            <>
              <p
                data-lang={lang}
                className={`opening-message max-w-xl text-balance text-ivory ${
                  hindi ? "font-hindi" : "font-display"
                }`}
              >
                {t.afterWish}
              </p>
              <button type="button" onClick={onLetter} className={buttonClass}>
                {t.openLetter}
              </button>
            </>
          ) : (
            <button type="button" onClick={onBlow} disabled={blown} className={buttonClass}>
              {t.blowCandles}
            </button>
          )}
        </div>
      </main>

    </section>
  )
}
