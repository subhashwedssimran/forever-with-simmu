import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { useLanguage } from "../context/LanguageContext"
import { NightSky } from "./NightSky"
import { SceneControls } from "./SceneControls"

const HEART =
  "M100 34 C82 12 48 14 38 40 C26 70 52 104 100 136 C148 104 174 70 162 40 C152 14 118 12 100 34 Z"

const DUST = [
  [100, 30],
  [62, 22],
  [40, 48],
  [54, 92],
  [138, 22],
  [160, 48],
  [146, 92],
  [100, 118],
]

const BURST = Array.from({ length: 12 }, (_, index) => {
  const angle = (index / 12) * Math.PI * 2
  const distance = 36 + (index % 3) * 18
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    delay: index * 0.03,
  }
})

const FOREGROUND = [
  { left: "12%", bottom: "18%", delay: "0s", size: 3 },
  { left: "24%", bottom: "12%", delay: "1.4s", size: 2 },
  { left: "70%", bottom: "16%", delay: "0.6s", size: 3 },
  { left: "82%", bottom: "10%", delay: "2s", size: 2 },
  { left: "48%", bottom: "8%", delay: "1s", size: 2 },
  { left: "36%", bottom: "22%", delay: "2.4s", size: 2 },
]

type Point = { x: number; y: number }

type ShootingStarSceneProps = {
  caught: boolean
  onCaught: () => void
  onBack: () => void
  onSkip: () => void
  onContinue: () => void
}

function drawStar(context: CanvasRenderingContext2D, x: number, y: number, outer: number) {
  context.beginPath()
  for (let point = 0; point < 8; point += 1) {
    const radius = point % 2 === 0 ? outer : outer * 0.38
    const angle = -Math.PI / 2 + (point * Math.PI) / 4
    const px = x + Math.cos(angle) * radius
    const py = y + Math.sin(angle) * radius
    if (point === 0) context.moveTo(px, py)
    else context.lineTo(px, py)
  }
  context.closePath()
  context.fillStyle = "#fffaf3"
  context.fill()
}

export function ShootingStarScene({
  caught,
  onCaught,
  onBack,
  onSkip,
  onContinue,
}: ShootingStarSceneProps) {
  const { lang, t } = useLanguage()
  const reduce = useReducedMotion()
  const hindi = lang === "hi"
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hitRef = useRef<HTMLButtonElement>(null)
  const fieldRef = useRef<HTMLDivElement>(null)
  const caughtRef = useRef(caught)
  const live = useRef<Point>({ x: 0, y: 0 })
  const hold = useRef<Point | null>(null)
  const [burst, setBurst] = useState<Point | null>(null)
  caughtRef.current = caught

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext("2d")
    if (!context) return

    let frame = 0
    let running = true
    const history: Point[] = []
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let frozen: Point | null = null

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth * dpr))
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight * dpr))
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const band = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      const field = fieldRef.current?.getBoundingClientRect()
      const canvasBox = canvas.getBoundingClientRect()
      const top = field ? field.top - canvasBox.top + 36 : height * 0.36
      const bottom = field ? field.bottom - canvasBox.top - 36 : height * 0.62
      return { width, height, top, span: Math.max(48, bottom - top) }
    }

    const draw = (now: number) => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      context.clearRect(0, 0, width, height)
      if (width < 2 || height < 2) {
        if (running && !still && !frozen) frame = requestAnimationFrame(draw)
        return
      }

      const { top, span } = band()
      if (hold.current) frozen = hold.current
      else if ((still || caughtRef.current) && !frozen) {
        frozen = { x: width * 0.5, y: top + span * 0.42 }
      }

      const next = frozen ?? {
        x: width * (-0.18 + ((now % 16000) / 16000) * 1.36),
        y: top + span * (0.62 - Math.sin(((now % 16000) / 16000) * Math.PI) * 0.46),
      }
      if (!frozen && history.length > 0 && next.x < history[history.length - 1].x - 40) {
        history.length = 0
      }
      const previous = history[history.length - 1]
      if (!previous || Math.hypot(next.x - previous.x, next.y - previous.y) > 7) {
        history.push(next)
      }
      while (history.length > 2 && next.x - history[0].x > width * 0.58) history.shift()
      if (history.length > 140) history.splice(0, history.length - 140)

      live.current = next
      if (caughtRef.current && !frozen) frozen = next
      const head = frozen ?? next

      if (hitRef.current && !caughtRef.current) {
        hitRef.current.style.left = `${head.x}px`
        hitRef.current.style.top = `${head.y}px`
      }

      if (history.length > 1) {
        const tail = history[0]
        const glow = context.createLinearGradient(tail.x, tail.y, head.x, head.y)
        glow.addColorStop(0, "rgba(255, 196, 120, 0)")
        glow.addColorStop(0.55, "rgba(255, 214, 156, 0.28)")
        glow.addColorStop(1, "rgba(255, 248, 236, 0.95)")
        context.lineCap = "round"
        context.lineJoin = "round"
        context.beginPath()
        context.moveTo(history[0].x, history[0].y)
        for (let index = 1; index < history.length; index += 1) {
          context.lineTo(history[index].x, history[index].y)
        }
        context.strokeStyle = "rgba(255, 196, 120, 0.22)"
        context.lineWidth = 18
        context.stroke()
        context.strokeStyle = "rgba(255, 226, 176, 0.5)"
        context.lineWidth = 6
        context.stroke()
        context.strokeStyle = glow
        context.lineWidth = 2.4
        context.stroke()
      }

      const halo = context.createRadialGradient(head.x, head.y, 0, head.x, head.y, 34)
      halo.addColorStop(0, "rgba(255, 250, 240, 0.95)")
      halo.addColorStop(0.35, "rgba(255, 206, 140, 0.45)")
      halo.addColorStop(1, "rgba(255, 186, 90, 0)")
      context.fillStyle = halo
      context.beginPath()
      context.arc(head.x, head.y, 34, 0, Math.PI * 2)
      context.fill()
      drawStar(context, head.x, head.y, 11)
      drawStar(context, head.x, head.y, 5)

      if (running && !still && !frozen) frame = requestAnimationFrame(draw)
    }

    const observer = new ResizeObserver(() => {
      resize()
      if (still || caughtRef.current) draw(0)
    })
    observer.observe(canvas)
    resize()
    frame = requestAnimationFrame(draw)

    return () => {
      running = false
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [])

  const catchStar = () => {
    if (caughtRef.current) return
    const point = { x: live.current.x, y: live.current.y }
    hold.current = point
    setBurst(point)
    onCaught()
  }

  const buttonClass = `enter-button pointer-events-auto max-w-[92vw] cursor-pointer rounded-full px-5 py-3 text-center leading-snug text-ivory focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0d2b4] sm:px-7 ${
    hindi ? "font-hindi text-[0.98rem]" : "font-sans text-[0.92rem] tracking-[0.06em]"
  }`

  return (
    <section data-scene="shooting-star" className="relative h-dvh w-full overflow-hidden">
      <NightSky tone="indigo" />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_24%,rgba(96,64,170,0.34),transparent_42%),radial-gradient(ellipse_at_82%_68%,rgba(132,58,104,0.28),transparent_40%)]"
        aria-hidden="true"
      />
      <div className="star-rays pointer-events-none absolute inset-0" aria-hidden="true" />
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />

      {caught ? (
        <motion.div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,214,160,0.22),rgba(110,70,170,0.12)_46%,transparent_70%)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduce ? 0.2 : 1.2 }}
        />
      ) : null}

      {!caught ? (
        <button
          ref={hitRef}
          type="button"
          onClick={catchStar}
          aria-label={t.catchStar}
          data-catch="star"
          className="absolute top-[46%] left-1/2 z-20 h-24 w-24 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f0d2b4]"
        />
      ) : null}

      {burst && !reduce
        ? BURST.map((mote, index) => (
            <motion.span
              key={index}
              aria-hidden="true"
              className="pointer-events-none absolute z-20 h-1.5 w-1.5 rounded-full bg-[#ffe7c2]"
              style={{ left: burst.x, top: burst.y }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
              animate={{ x: mote.x, y: mote.y, opacity: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: mote.delay, ease: "easeOut" }}
            />
          ))
        : null}

      {FOREGROUND.map((dust) => (
        <span
          key={dust.left}
          aria-hidden="true"
          className="fg-dust pointer-events-none absolute z-10 rounded-full bg-[#f6e2c4]/80"
          style={{
            left: dust.left,
            bottom: dust.bottom,
            width: dust.size,
            height: dust.size,
            animationDelay: dust.delay,
          }}
        />
      ))}

      <SceneControls onBack={onBack} onSkip={onSkip} skipLabel={t.skipStar} />

      <main className="pointer-events-none relative z-10 flex h-full flex-col items-center px-5 pt-16 pb-20 text-center">
        <p
          data-lang={lang}
          className={`opening-title max-w-2xl text-balance text-ivory [text-shadow:0_2px_18px_rgba(0,0,0,0.45)] ${
            hindi ? "font-hindi" : "font-display"
          }`}
        >
          {t.starLine1}
        </p>
        <p
          data-lang={lang}
          className={`opening-message mt-3 max-w-xl text-balance text-ivory/88 ${
            hindi ? "font-hindi" : "font-display"
          }`}
        >
          {t.starLine2}
        </p>

        <div ref={fieldRef} className="relative min-h-0 w-full flex-1">
          {caught ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 200 160" className="w-[min(72vw,280px)] overflow-visible" aria-hidden="true">
                <motion.path
                  d={HEART}
                  fill="none"
                  stroke="#f8e2c0"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  initial={{ pathLength: burst && !reduce ? 0 : 1, opacity: burst && !reduce ? 0.25 : 1 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: burst && !reduce ? 1.7 : 0.2, ease: "easeInOut" }}
                  style={{ filter: "drop-shadow(0 0 8px rgba(255, 214, 160, 0.85))" }}
                />
                {DUST.map(([cx, cy], index) => (
                  <motion.circle
                    key={index}
                    cx={cx}
                    cy={cy}
                    r="1.7"
                    fill="#fff4e2"
                    initial={{ opacity: burst && !reduce ? 0 : 1 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: burst && !reduce ? 0.35 + index * 0.08 : 0 }}
                  />
                ))}
              </svg>
            </div>
          ) : null}
        </div>

        <div className="flex min-h-[4.5rem] w-full flex-col items-center justify-end gap-3">
          {caught ? (
            <>
              <motion.p
                data-lang={lang}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduce ? 0 : 0.45 }}
                className={`opening-message max-w-xl text-balance text-ivory ${
                  hindi ? "font-hindi" : "font-display"
                }`}
              >
                {t.wishGranted}
              </motion.p>
              <motion.button
                type="button"
                onClick={onContinue}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduce ? 0 : 0.7 }}
                className={buttonClass}
              >
                {t.birthdaySurprise}
              </motion.button>
            </>
          ) : (
            <button type="button" onClick={catchStar} className={buttonClass}>
              {t.catchStar}
            </button>
          )}
        </div>
      </main>
    </section>
  )
}
