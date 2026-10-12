import { useLanguage } from "../context/LanguageContext"
import type { Lang } from "../i18n/copy"

const options: { id: Lang; label: string }[] = [
  { id: "en", label: "English" },
  { id: "hi", label: "हिन्दी" },
]

export function LanguageToggle() {
  const { lang, setLang, t } = useLanguage()

  return (
    <div
      role="group"
      aria-label={t.language}
      className="flex rounded-full border border-white/15 bg-black/30 p-1 backdrop-blur-md"
    >
      {options.map((option) => {
        const active = lang === option.id
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => setLang(option.id)}
            className={`min-h-9 cursor-pointer rounded-full px-3 py-1.5 font-sans text-[0.78rem] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f0d2b4] ${
              active
                ? "bg-gradient-to-b from-[#f6dcc4] to-[#e2b48f] text-[#3a2418] shadow-[0_4px_16px_rgba(226,180,143,0.28)]"
                : "text-ivory/75 hover:text-ivory"
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
