import { useEffect, useState } from "react"
import { useLanguage } from "../context/LanguageContext"
import { useMusic } from "../context/MusicContext"

function NoteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
      <path d="M6.2 2.1v7.05a2.35 2.35 0 1 0 1.15 2.02V5.55l5.3-1.22v4.55a2.35 2.35 0 1 0 1.15 2.02V2.55L6.2 4.05V2.1Z" />
    </svg>
  )
}

export function MusicToggle() {
  const { t } = useLanguage()
  const { playing, available, toggle } = useMusic()
  const [hint, setHint] = useState(false)

  useEffect(() => {
    if (!hint) return
    const timer = window.setTimeout(() => setHint(false), 4200)
    return () => window.clearTimeout(timer)
  }, [hint])

  const onClick = () => {
    if (available === false && !playing) {
      setHint(true)
      return
    }
    void toggle()
  }

  const pending = available === false && !playing
  const label = playing ? t.musicOn : pending ? t.musicHint : t.musicOff

  return (
    <div className="relative">
      <button
        type="button"
        data-music-toggle="true"
        onClick={onClick}
        aria-pressed={playing}
        aria-label={pending || hint ? t.musicMissing : label}
        className={`flex min-h-11 max-w-[46vw] cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-[0.78rem] backdrop-blur-md transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f0d2b4] sm:max-w-none ${
          playing
            ? "border-[#f0d2b4]/70 bg-[#f0d2b4]/15 text-[#f8e7d4]"
            : "border-white/15 bg-black/30 text-ivory/85 hover:border-white/30"
        }`}
      >
        <NoteIcon />
        <span className="truncate font-sans tracking-wide">{label}</span>
      </button>
      <p className="sr-only" role="status">
        {hint && !playing ? t.musicMissing : ""}
      </p>
    </div>
  )
}
