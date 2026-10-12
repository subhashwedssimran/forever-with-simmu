import type { ReactNode } from "react"
import { LanguageToggle } from "./LanguageToggle"
import { MusicToggle } from "./MusicToggle"
import { useLanguage } from "../context/LanguageContext"

type SceneControlsProps = {
  onBack: () => void
  onSkip?: () => void
  skipLabel?: string
}

function GlassButton({
  children,
  onClick,
  label,
}: {
  children: ReactNode
  onClick: () => void
  label?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="min-h-11 cursor-pointer rounded-full border border-[#f0d2b4]/35 bg-black/40 px-3.5 font-sans text-[0.78rem] tracking-wide text-ivory backdrop-blur-md transition hover:border-[#f0d2b4]/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f0d2b4]"
    >
      {children}
    </button>
  )
}

export function SceneControls({ onBack, onSkip, skipLabel }: SceneControlsProps) {
  const { t } = useLanguage()

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-40 flex items-start justify-between gap-3 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6">
        <MusicToggle />
        <LanguageToggle />
      </header>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 flex items-end justify-between gap-3 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6">
        <div className="pointer-events-auto">
          <GlassButton onClick={onBack}>{t.back}</GlassButton>
        </div>
        {onSkip ? (
          <div className="pointer-events-auto">
            <GlassButton onClick={onSkip} label={skipLabel}>
              {t.skip}
            </GlassButton>
          </div>
        ) : (
          <span />
        )}
      </div>
    </>
  )
}
