import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { useLanguage } from "../context/LanguageContext"
import { NightSky } from "./NightSky"
import { RosePetals } from "./RosePetals"
import { SceneControls } from "./SceneControls"
import { asset } from "../lib/asset"

type LetterSceneProps = {
  opened: boolean
  onOpen: () => void
  onBack: () => void
  onSkip: () => void
  onPromise: () => void
}

function WaxSeal() {
  return (
    <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden="true">
      <path
        d="M32 50s-14-8.2-14-17.2a8.2 8.2 0 0 1 14-5.6 8.2 8.2 0 0 1 14 5.6C46 41.8 32 50 32 50z"
        fill="none"
        stroke="#f6d7c4"
        strokeWidth="1.6"
      />
    </svg>
  )
}

export function LetterScene({ opened, onOpen, onBack, onSkip, onPromise }: LetterSceneProps) {
  const { lang, t } = useLanguage()
  const reduce = useReducedMotion()
  const hindi = lang === "hi"
  const [presented, setPresented] = useState(opened)

  useEffect(() => {
    if (!opened || presented) return
    const timer = window.setTimeout(() => setPresented(true), reduce ? 80 : 1200)
    return () => window.clearTimeout(timer)
  }, [opened, presented, reduce])

  const buttonClass = `enter-button pointer-events-auto max-w-[92vw] cursor-pointer rounded-full px-5 py-3 text-center leading-snug text-ivory focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0d2b4] sm:px-7 ${
    hindi ? "font-hindi text-[0.98rem]" : "font-sans text-[0.92rem] tracking-[0.06em]"
  }`
  const display = hindi ? "font-hindi" : "font-display"

  return (
    <section data-scene="letter" className="relative h-dvh w-full overflow-hidden">
      <NightSky tone="rose" />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,186,140,0.16),transparent_46%)]"
        aria-hidden="true"
      />
      <img
        src={asset("images/rose-spray.webp")}
        alt=""
        draggable={false}
        className="pointer-events-none absolute -bottom-28 -left-14 z-0 h-[16vh] w-auto max-w-[34vw] object-contain opacity-90 sm:-bottom-20 sm:-left-10 sm:h-[24vh] sm:max-w-[42vw]"
      />
      <img
        src={asset("images/rose-spray.webp")}
        alt=""
        draggable={false}
        className="pointer-events-none absolute -right-16 -bottom-32 z-0 h-[15vh] w-auto max-w-[30vw] -scale-x-100 object-contain opacity-80 sm:-right-14 sm:-bottom-24 sm:h-[22vh] sm:max-w-[38vw]"
      />
      {opened && !reduce ? <RosePetals layer="back" /> : null}

      <SceneControls onBack={onBack} onSkip={onSkip} skipLabel={t.skipLetter} />

      <main className="relative z-10 flex h-full min-h-0 flex-col px-4 pt-16 pb-20">
        {presented ? (
          <div className="letter-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <motion.article
              initial={reduce ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0.2 : 1.05, ease: [0.22, 1, 0.36, 1] }}
              className="letter-sheet mx-auto my-2 w-full max-w-xl px-5 py-7 sm:px-9 sm:py-10"
            >
              <h1 data-lang={lang} className={`opening-title text-balance text-[#4a2b22] ${display}`}>
                {t.letterTitle}
              </h1>
              <p data-lang={lang} className={`mt-3 text-balance text-[1.05rem] leading-relaxed text-[#6a4634] ${display}`}>
                {t.letterLead}
              </p>
              <p data-lang={lang} className={`mt-6 text-[1.2rem] text-[#3d261c] ${display}`}>
                {t.letterGreeting}
              </p>
              <div className={`mt-4 space-y-4 text-[1.05rem] leading-[1.75] text-[#3f2a20] ${display}`}>
                {t.letterBody.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} data-lang={lang}>
                    {paragraph}
                  </p>
                ))}
              </div>
              <p data-lang={lang} className={`mt-6 text-[1.05rem] text-[#3f2a20] ${display}`}>
                {t.letterSignLead}
              </p>
              <p className="mt-1 font-script text-[2.2rem] leading-none text-[#7a4a32]">{t.letterSignName}</p>
              <div className="mt-8 flex justify-center">
                <button type="button" onClick={onPromise} className={buttonClass}>
                  {t.oneLast}
                </button>
              </div>
            </motion.article>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <h1
              data-lang={lang}
              className={`opening-title max-w-xl text-balance text-ivory [text-shadow:0_2px_18px_rgba(0,0,0,0.45)] ${display}`}
            >
              {t.letterTitle}
            </h1>
            <p
              data-lang={lang}
              className={`opening-message mt-3 max-w-md text-balance text-ivory/88 ${display}`}
            >
              {t.letterLead}
            </p>
            <div className={`love-envelope mt-6 ${opened ? "is-open" : ""}`}>
              <div className="love-envelope-pocket">
                <span className="love-envelope-light" />
              </div>
              <div className="love-envelope-flap" />
              <span className="love-envelope-seal">
                <WaxSeal />
              </span>
            </div>
            {opened ? null : (
              <button type="button" onClick={onOpen} className={`mt-6 ${buttonClass}`}>
                {t.openHeart}
              </button>
            )}
          </div>
        )}
      </main>

      {opened && !reduce ? <RosePetals layer="front" /> : null}
    </section>
  )
}
