import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { useLanguage } from "../context/LanguageContext"
import { NightSky } from "./NightSky"
import { SceneControls } from "./SceneControls"
import { asset } from "../lib/asset"

const HEART =
  "M100 34 C82 12 48 14 38 40 C26 70 52 104 100 136 C148 104 174 70 162 40 C152 14 118 12 100 34 Z"

type FinaleSceneProps = {
  onBack: () => void
  onReplay: () => void
}

export function FinaleScene({ onBack, onReplay }: FinaleSceneProps) {
  const { lang, t } = useLanguage()
  const reduce = useReducedMotion()
  const hindi = lang === "hi"
  const [step, setStep] = useState(reduce ? 6 : 0)
  const display = hindi ? "font-hindi" : "font-display"

  useEffect(() => {
    if (reduce || step >= 6) return
    const delay = step === 0 ? 500 : step === 5 ? 3200 : 1500
    const timer = window.setTimeout(() => setStep((current) => current + 1), delay)
    return () => window.clearTimeout(timer)
  }, [reduce, step])

  return (
    <section data-scene="finale" className="relative h-dvh w-full overflow-hidden">
      <NightSky tone="indigo" />
      <div
        className="pointer-events-none absolute top-16 right-3 h-14 w-14 rounded-full bg-[radial-gradient(circle_at_35%_35%,#fff8ea,#f0d7b0_38%,rgba(240,215,176,0.15)_62%,transparent_74%)] opacity-80 sm:top-[8%] sm:right-[10%] sm:h-28 sm:w-28"
        aria-hidden="true"
      />
      <img
        src={asset("images/rose-spray.webp")}
        alt=""
        draggable={false}
        className="pointer-events-none absolute -bottom-16 -left-16 z-0 w-[min(40vw,220px)] opacity-85 sm:-bottom-10 sm:-left-14 sm:w-[min(48vw,380px)]"
      />
      <img
        src={asset("images/rose-spray.webp")}
        alt=""
        draggable={false}
        className="pointer-events-none absolute -right-14 -bottom-16 z-0 w-[min(38vw,210px)] -scale-x-100 opacity-75 sm:-right-16 sm:bottom-[-8%] sm:w-[min(42vw,340px)]"
      />

      <SceneControls onBack={onBack} />

      <main className="relative z-10 flex h-full flex-col items-center overflow-y-auto px-5 pt-16 pb-20 text-center">
        <svg viewBox="0 0 200 160" className="mt-2 w-[min(46vw,210px)] overflow-visible" aria-hidden="true">
          <motion.path
            d={HEART}
            fill="none"
            stroke="#f8e2c0"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: reduce ? 1 : 0, opacity: 0.3 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: reduce ? 0.2 : 1.8, ease: "easeInOut" }}
            style={{ filter: "drop-shadow(0 0 8px rgba(255, 214, 160, 0.8))" }}
          />
        </svg>

        <div className="mt-4 flex w-full max-w-xl flex-col items-center gap-3">
          {t.finaleLines.map((line, index) =>
            step > index ? (
              <motion.p
                key={line}
                data-lang={lang}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduce ? 0.2 : 0.8 }}
                className={`opening-message text-balance text-ivory [text-shadow:0_2px_16px_rgba(0,0,0,0.45)] ${display}`}
              >
                {line}
              </motion.p>
            ) : (
              <span key={line} className="sr-only">
                {line}
              </span>
            ),
          )}
        </div>

        {step >= 5 ? (
          <div className="mt-6 flex flex-col items-center">
            <div className="flex items-end justify-center gap-2">
              <svg viewBox="0 0 520 150" className="w-[min(78vw,440px)] overflow-visible" role="img" aria-label="S K Verma">
                <defs>
                  <linearGradient id="signature-gold" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#fff6e6" />
                    <stop offset="48%" stopColor="#e8c48a" />
                    <stop offset="100%" stopColor="#fff1d6" />
                  </linearGradient>
                </defs>
                <motion.text
                  x="16"
                  y="112"
                  fill="url(#signature-gold)"
                  stroke="url(#signature-gold)"
                  strokeWidth="0.8"
                  fontFamily="Pinyon Script, cursive"
                  fontSize="86"
                  strokeDasharray="980"
                  initial={reduce ? { strokeDashoffset: 0, fillOpacity: 1 } : { strokeDashoffset: 980, fillOpacity: 0 }}
                  animate={{ strokeDashoffset: 0, fillOpacity: 1 }}
                  transition={{
                    duration: reduce ? 0.2 : 3.1,
                    ease: "easeInOut",
                    fillOpacity: { delay: reduce ? 0 : 1.5, duration: 1.3 },
                  }}
                  style={{ filter: "drop-shadow(0 0 10px rgba(232, 196, 138, 0.55))" }}
                >
                  S K Verma
                </motion.text>
              </svg>
              <motion.svg
                viewBox="0 0 24 24"
                className="mb-4 h-5 w-5 shrink-0"
                aria-hidden="true"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: reduce ? 0 : 2.5, duration: 0.6 }}
              >
                <path
                  d="M12 20s-6.5-4-6.5-8.4a3.7 3.7 0 0 1 6.5-2.4 3.7 3.7 0 0 1 6.5 2.4C18.5 16 12 20 12 20z"
                  fill="#f4c9d6"
                  style={{ filter: "drop-shadow(0 0 6px rgba(244, 201, 214, 0.8))" }}
                />
              </motion.svg>
            </div>
            <p data-lang={lang} className={`mt-1 text-[1.05rem] tracking-wide text-[#f6e2c4] ${display}`}>
              {t.foreverYours}
            </p>
          </div>
        ) : null}

        {step >= 6 ? (
          <motion.button
            type="button"
            onClick={onReplay}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`enter-button mt-6 max-w-[92vw] cursor-pointer rounded-full px-5 py-3 text-ivory focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0d2b4] sm:px-7 ${
              hindi ? "font-hindi text-[0.98rem]" : "font-sans text-[0.92rem] tracking-[0.06em]"
            }`}
          >
            {t.relive}
          </motion.button>
        ) : null}
      </main>
    </section>
  )
}
