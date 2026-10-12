import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { asset } from "../lib/asset"

const PIANO_SRC = asset("audio/piano.mp3")
const TARGET_VOLUME = 0.25

type MusicContextValue = {
  playing: boolean
  available: boolean | null
  toggle: () => Promise<void>
}

const MusicContext = createContext<MusicContextValue | null>(null)

function clampVolume(value: number) {
  if (!Number.isFinite(value)) return 0
  return Math.min(1, Math.max(0, value))
}

async function fadeVolume(audio: HTMLAudioElement, target: number, duration: number) {
  const start = clampVolume(audio.volume)
  const end = clampVolume(target)
  const began = performance.now()
  await new Promise<void>((resolve) => {
    const step = (now: number) => {
      const progress = Math.min(1, Math.max(0, (now - began) / Math.max(duration, 1)))
      try {
        audio.volume = clampVolume(start + (end - start) * progress)
      } catch {
        resolve()
        return
      }
      if (progress < 1) requestAnimationFrame(step)
      else resolve()
    }
    requestAnimationFrame(step)
  })
}

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const playingRef = useRef(false)
  const startingRef = useRef(false)
  const dismissedRef = useRef(false)
  const availableRef = useRef<boolean | null>(null)
  const [playing, setPlaying] = useState(false)
  const [available, setAvailable] = useState<boolean | null>(null)

  const markAvailable = (ready: boolean) => {
    availableRef.current = ready
    setAvailable(ready)
  }

  const start = async (audio: HTMLAudioElement) => {
    if (playingRef.current || startingRef.current) return
    startingRef.current = true
    try {
      await audio.play()
      playingRef.current = true
      setPlaying(true)
      markAvailable(true)
      await fadeVolume(audio, TARGET_VOLUME, 700)
    } catch {
      playingRef.current = false
      setPlaying(false)
      markAvailable(false)
    } finally {
      startingRef.current = false
    }
  }

  useEffect(() => {
    const audio = new Audio(PIANO_SRC)
    audio.loop = true
    audio.preload = "none"
    audio.volume = 0
    audioRef.current = audio

    let cancelled = false
    const probe = async () => {
      try {
        const response = await fetch(PIANO_SRC, { method: "HEAD" })
        const type = response.headers.get("content-type") ?? ""
        const ready = response.ok && !type.includes("text/html")
        if (!cancelled && !playingRef.current) markAvailable(ready)
      } catch {
        if (!cancelled && !playingRef.current) markAvailable(false)
      }
    }
    void probe()

    const onGesture = (event: Event) => {
      if (dismissedRef.current || playingRef.current || startingRef.current) return
      if (availableRef.current === false) return
      const target = event.target
      if (target instanceof Element && target.closest("[data-music-toggle]")) return
      void start(audio)
    }

    document.addEventListener("pointerdown", onGesture, true)
    return () => {
      cancelled = true
      document.removeEventListener("pointerdown", onGesture, true)
      audio.pause()
      audioRef.current = null
      playingRef.current = false
    }
  }, [])

  const toggle = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (playingRef.current) {
      dismissedRef.current = true
      await fadeVolume(audio, 0, 450)
      audio.pause()
      playingRef.current = false
      setPlaying(false)
      return
    }

    if (availableRef.current === false) return

    dismissedRef.current = false
    await start(audio)
  }

  return (
    <MusicContext.Provider value={{ playing, available, toggle }}>{children}</MusicContext.Provider>
  )
}

export function useMusic() {
  const value = useContext(MusicContext)
  if (!value) throw new Error("useMusic must be used within MusicProvider")
  return value
}
