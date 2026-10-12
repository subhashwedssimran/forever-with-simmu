import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { copy, type Lang } from "../i18n/copy"

type LanguageContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (typeof copy)[Lang]
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en")

  useEffect(() => {
    document.documentElement.lang = lang === "hi" ? "hi" : "en"
    document.title = copy[lang].title
  }, [lang])

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: copy[lang],
    }),
    [lang],
  )

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const value = useContext(LanguageContext)
  if (!value) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return value
}
