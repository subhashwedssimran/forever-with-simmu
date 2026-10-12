import { useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { LanguageProvider } from "./context/LanguageContext"
import { MusicProvider } from "./context/MusicContext"
import { OpeningScreen } from "./components/OpeningScreen"
import { ConstellationScene } from "./components/ConstellationScene"
import { HeartPortalScene } from "./components/HeartPortalScene"
import { ShootingStarScene } from "./components/ShootingStarScene"
import { BirthdayCakeScene } from "./components/BirthdayCakeScene"
import { LetterScene } from "./components/LetterScene"
import { FinaleScene } from "./components/FinaleScene"
import type { StarId } from "./i18n/copy"

type Scene = "opening" | "constellation" | "portal" | "star" | "cake" | "letter" | "finale"

export default function App() {
  const reduce = useReducedMotion()
  const [scene, setScene] = useState<Scene>("opening")
  const [opened, setOpened] = useState<StarId[]>([])
  const [starCaught, setStarCaught] = useState(false)
  const [candlesBlown, setCandlesBlown] = useState(false)
  const [letterOpen, setLetterOpen] = useState(false)

  const replay = () => {
    setOpened([])
    setStarCaught(false)
    setCandlesBlown(false)
    setLetterOpen(false)
    setScene("opening")
  }

  const remember = (id: StarId) => {
    setOpened((current) => (current.includes(id) ? current : [...current, id]))
  }

  return (
    <LanguageProvider>
      <MusicProvider>
      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          className="h-dvh"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0.2 : 0.55, ease: "easeInOut" }}
        >
          {scene === "opening" ? (
            <div
              className="h-full"
              onClick={(event) => {
                const target = event.target
                if (target instanceof Element && target.closest("main button")) {
                  setScene("constellation")
                }
              }}
            >
              <OpeningScreen />
            </div>
          ) : null}

          {scene === "constellation" ? (
            <ConstellationScene
              opened={opened}
              onOpen={remember}
              onBack={() => setScene("opening")}
              onSkip={() => setScene("portal")}
              onContinue={() => setScene("portal")}
            />
          ) : null}

          {scene === "portal" ? (
            <HeartPortalScene
              onBack={() => setScene("constellation")}
              onSkip={() => setScene("star")}
              onComplete={() => setScene("star")}
            />
          ) : null}

          {scene === "star" ? (
            <ShootingStarScene
              caught={starCaught}
              onCaught={() => setStarCaught(true)}
              onBack={() => setScene("portal")}
              onSkip={() => setScene("cake")}
              onContinue={() => setScene("cake")}
            />
          ) : null}

          {scene === "cake" ? (
            <BirthdayCakeScene
              blown={candlesBlown}
              onBlow={() => setCandlesBlown(true)}
              onBack={() => setScene("star")}
              onSkip={() => setScene("letter")}
              onLetter={() => setScene("letter")}
            />
          ) : null}

          {scene === "letter" ? (
            <LetterScene
              opened={letterOpen}
              onOpen={() => setLetterOpen(true)}
              onBack={() => setScene("cake")}
              onSkip={() => setScene("finale")}
              onPromise={() => setScene("finale")}
            />
          ) : null}

          {scene === "finale" ? <FinaleScene onBack={() => setScene("letter")} onReplay={replay} /> : null}
        </motion.div>
      </AnimatePresence>
      </MusicProvider>
    </LanguageProvider>
  )
}
