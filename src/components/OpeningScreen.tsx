import { motion, useReducedMotion } from "motion/react"
import { GalaxyBackground } from "./GalaxyBackground"
import { CrystalHeart } from "./CrystalHeart"
import { LanguageToggle } from "./LanguageToggle"
import { MusicToggle } from "./MusicToggle"
import { useLanguage } from "../context/LanguageContext"
import { useParallax } from "../hooks/useParallax"

export function OpeningScreen() {
  const { lang, t } = useLanguage()
  const reduce = useReducedMotion()
  const parallax = useParallax({ driftOnCoarsePointer: false })
  const hindi = lang === "hi"

  return (
    <section className="relative h-svh w-full max-w-full overflow-hidden">
      <GalaxyBackground x={parallax.x} y={parallax.y} />

      <header className="absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 px-4 pt-[max(0.85rem,env(safe-area-inset-top))] sm:px-8">
        <MusicToggle />
        <LanguageToggle />
      </header>

      <main className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col items-center px-5 pt-[4.6rem] pb-[max(1.15rem,env(safe-area-inset-bottom))] text-center">
        <h1
          data-lang={lang}
          className={`opening-title max-w-3xl shrink-0 text-balance text-ivory [text-shadow:0_2px_18px_rgba(0,0,0,0.45)] ${
            hindi ? "font-hindi" : "font-display"
          }`}
        >
          {t.title}
        </h1>

        <div className="flex min-h-0 w-full flex-1 items-center justify-center py-2">
          <CrystalHeart x={parallax.x} y={parallax.y} />
        </div>

        <div className="opening-stack flex w-full shrink-0 flex-col items-center gap-4">
          <div className="relative">
            <span
              aria-hidden="true"
              className="absolute inset-x-[6%] top-1/2 -z-10 h-[70%] -translate-y-1/2 rounded-full bg-[#f3c7a4]/30 blur-2xl"
            />
            <p
              data-lang={lang}
              className={`opening-name bg-gradient-to-b from-[#fffaf3] via-[#f6d0ae] to-[#e7a4c4] bg-clip-text text-transparent ${
                hindi ? "font-hindi italic" : "font-script"
              }`}
            >
              {t.name}
            </p>
          </div>

          <div className="flex items-center gap-3 text-[#e7c4a4]/80" aria-hidden="true">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-current sm:w-14" />
            <span className="h-1 w-1 rotate-45 bg-current" />
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-current sm:w-14" />
          </div>

          <p
            data-lang={lang}
            className={`opening-message max-w-2xl text-balance text-ivory/92 [text-shadow:0_2px_16px_rgba(0,0,0,0.55)] ${
              hindi ? "font-hindi" : "font-display"
            }`}
          >
            {t.message}
          </p>

          <div className="relative mt-1">
            <motion.span
              aria-hidden="true"
              className="absolute -inset-2 -z-10 rounded-full bg-[radial-gradient(circle,rgba(236,190,160,0.4),transparent_70%)] blur-md"
              animate={reduce ? undefined : { opacity: [0.35, 0.7, 0.35] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.button
              type="button"
              whileHover={reduce ? undefined : { y: -1 }}
              whileTap={reduce ? undefined : { scale: 0.985 }}
              className={`enter-button relative max-w-[92vw] cursor-pointer overflow-hidden rounded-full px-7 py-3.5 text-ivory backdrop-blur-md transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0d2b4] sm:px-9 ${
                hindi ? "font-hindi text-[1.05rem] tracking-normal" : "font-sans text-[0.98rem] tracking-[0.14em]"
              }`}
            >
              <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/75 to-transparent" />
              <span className="enter-spark" aria-hidden="true" />
              {t.enter}
            </motion.button>
          </div>
        </div>
      </main>
    </section>
  )
}
