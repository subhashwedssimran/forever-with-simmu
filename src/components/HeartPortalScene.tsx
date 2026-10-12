import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion, useTransform } from "motion/react"
import { useLanguage } from "../context/LanguageContext"
import { useParallax } from "../hooks/useParallax"
import { NightSky } from "./NightSky"
import { SceneControls } from "./SceneControls"
import { asset } from "../lib/asset"

const PORTAL_SRC = asset("images/heart-portal.webp")

const DRIFT = Array.from({ length: 12 }, (_, index) => {
  const angle = (index / 12) * Math.PI * 2
  return {
    x: Math.cos(angle) * 150,
    y: Math.sin(angle) * 120,
    delay: index * 0.28,
  }
})

type HeartPortalSceneProps = {
  onBack: () => void
  onSkip: () => void
  onComplete: () => void
}

export function HeartPortalScene({ onBack, onSkip, onComplete }: HeartPortalSceneProps) {
  const { lang, t } = useLanguage()
  const reduce = useReducedMotion()
  const parallax = useParallax()
  const shiftX = useTransform(parallax.x, (value) => value * 16)
  const shiftY = useTransform(parallax.y, (value) => value * 10)
  const [entering, setEntering] = useState(false)
  const [failed, setFailed] = useState(false)
  const completeRef = useRef(onComplete)
  const hindi = lang === "hi"
  completeRef.current = onComplete

  useEffect(() => {
    if (!entering) return
    const timer = window.setTimeout(() => completeRef.current(), reduce ? 420 : 1650)
    return () => window.clearTimeout(timer)
  }, [entering, reduce])

  return (
    <section className="relative h-dvh w-full overflow-hidden">
      <NightSky tone="rose" />
      <SceneControls onBack={onBack} onSkip={onSkip} skipLabel={t.skipChapter} />

      <motion.main
        className="relative z-10 mx-auto flex h-full w-full max-w-5xl flex-col items-center px-4 pt-[4.4rem] pb-20 text-center"
        animate={
          entering
            ? { scale: reduce ? 1.04 : 1.42, opacity: reduce ? 0.15 : 0 }
            : { scale: 1, opacity: 1 }
        }
        transition={{ duration: reduce ? 0.35 : 1.55, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformOrigin: "50% 42%" }}
      >
        <p
          className={`text-[0.72rem] tracking-[0.28em] text-[#f0d2b4]/80 uppercase ${
            hindi ? "font-hindi tracking-normal text-sm" : "font-sans"
          }`}
        >
          {t.portalKicker}
        </p>

        <div className="flex min-h-0 w-full flex-1 items-center justify-center py-2">
          <motion.div
            className="relative w-[min(90vw,46vh,460px)]"
            style={{ x: shiftX, y: shiftY }}
          >
            <motion.div
              aria-hidden="true"
              className="absolute inset-[8%] rounded-full bg-[#f0b7c8]/25 blur-3xl"
              animate={
                entering
                  ? { opacity: 0.95, scale: 1.15 }
                  : reduce
                    ? { opacity: 0.7, scale: 1 }
                    : { opacity: [0.45, 0.8, 0.45], scale: 1 }
              }
              transition={entering ? { duration: 0.6 } : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.svg
              viewBox="0 0 100 100"
              className="pointer-events-none absolute inset-[-8%] h-[116%] w-[116%]"
              aria-hidden="true"
              animate={reduce ? undefined : { rotate: 360 }}
              transition={{ duration: 72, repeat: Infinity, ease: "linear" }}
            >
              <ellipse cx="50" cy="48" rx="40" ry="36" fill="none" stroke="rgba(240,210,180,0.35)" strokeWidth="0.35" />
              <ellipse cx="50" cy="48" rx="34" ry="30" fill="none" stroke="rgba(232,170,200,0.28)" strokeWidth="0.25" />
            </motion.svg>
            <motion.svg
              viewBox="0 0 100 100"
              className="pointer-events-none absolute inset-[-4%] h-[108%] w-[108%]"
              aria-hidden="true"
              animate={reduce ? undefined : { rotate: -360 }}
              transition={{ duration: 96, repeat: Infinity, ease: "linear" }}
            >
              <ellipse cx="50" cy="50" rx="44" ry="39" fill="none" stroke="rgba(255,236,214,0.22)" strokeWidth="0.3" strokeDasharray="1.2 2.4" />
            </motion.svg>

            {failed ? null : (
              <motion.img
                src={PORTAL_SRC}
                alt="A rose-gold heart-shaped portal framed by red and blush roses, opening onto a violet galaxy"
                draggable={false}
                className="relative z-10 h-auto w-full select-none [filter:drop-shadow(0_18px_28px_rgba(0,0,0,0.45))_drop-shadow(0_0_22px_rgba(232,150,180,0.28))]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7 }}
                onError={() => setFailed(true)}
              />
            )}

            {!reduce &&
              DRIFT.map((mote, index) => (
              <motion.span
                key={index}
                aria-hidden="true"
                className="pointer-events-none absolute top-[46%] left-1/2 z-20 h-1 w-1 rounded-full bg-[#ffe6c4]"
                style={{ boxShadow: "0 0 8px 2px rgba(255,214,160,0.75)" }}
                animate={
                  reduce
                    ? { opacity: 0.4 }
                    : {
                        x: [mote.x, 0],
                        y: [mote.y, 0],
                        opacity: [0, 0.9, 0],
                      }
                }
                transition={{
                  duration: entering ? 0.9 : 5.2,
                  repeat: Infinity,
                  delay: mote.delay,
                  ease: "easeIn",
                }}
              />
            ))}

            {entering && !reduce ? (
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute z-20 rounded-full border border-[#f8e7d0]/80"
                style={{ left: "50%", top: "44%" }}
                initial={{ width: 28, height: 28, x: "-50%", y: "-50%", opacity: 0.85 }}
                animate={{ width: 680, height: 680, x: "-50%", y: "-50%", opacity: 0 }}
                transition={{ duration: 1.25, ease: "easeOut" }}
              />
            ) : null}
          </motion.div>
        </div>

        <p
          data-lang={lang}
          className={`opening-message max-w-2xl text-balance text-ivory/92 [text-shadow:0_2px_16px_rgba(0,0,0,0.55)] ${
            hindi ? "font-hindi" : "font-display"
          }`}
        >
          {t.portalQuote}
        </p>
        <button
          type="button"
          disabled={entering}
          onClick={() => setEntering(true)}
          className={`enter-button mt-4 max-w-[92vw] cursor-pointer rounded-full px-6 py-3.5 text-ivory focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0d2b4] disabled:cursor-default sm:px-8 ${
            hindi ? "font-hindi text-base" : "font-sans text-[0.95rem] tracking-[0.12em]"
          }`}
        >
          <span className="enter-spark" aria-hidden="true" />
          {t.stepForever}
        </button>
      </motion.main>
    </section>
  )
}
