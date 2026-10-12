import { useEffect, useRef } from "react"
import { useReducedMotion } from "motion/react"
import { asset } from "../lib/asset"

type NightSkyProps = {
  tone: "indigo" | "rose"
}

type Spark = {
  x: number
  y: number
  r: number
  a: number
  v: number
  p: number
}

function makeSparks(width: number, height: number): Spark[] {
  const count = Math.max(28, Math.round((width * height) / 28000))
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 1.15 + 0.25,
    a: Math.random() * 0.45 + 0.2,
    v: Math.random() * 0.9 + 0.25,
    p: Math.random() * Math.PI * 2,
  }))
}

export function NightSky({ tone }: NightSkyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()
  const rose = tone === "rose"

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext("2d")
    if (!context) return
    let sparks: Spark[] = []
    let frame = 0
    let running = true
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      sparks = makeSparks(width, height)
    }

    const draw = (now: number) => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      context.clearRect(0, 0, width, height)
      if (width < 1 || height < 1) {
        if (running && !still) frame = requestAnimationFrame(draw)
        return
      }
      const t = now / 1000
      for (const spark of sparks) {
        const y = still ? spark.y : (spark.y - t * spark.v * 4 + height) % height
        const alpha = spark.a * (still ? 0.8 : 0.55 + 0.45 * Math.abs(Math.sin(t * spark.v + spark.p)))
        context.fillStyle = `rgba(255, 244, 232, ${alpha})`
        context.beginPath()
        context.arc(spark.x, y, spark.r, 0, Math.PI * 2)
        context.fill()
      }
      if (running && !still) frame = requestAnimationFrame(draw)
    }

    const observer = new ResizeObserver(() => {
      resize()
      if (still) draw(0)
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

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#070814]" aria-hidden="true">
      <div
        className={`absolute inset-0 ${
          rose
            ? "bg-[radial-gradient(ellipse_at_center,#5c2448_0%,#1a1030_46%,#070814_78%)]"
            : "bg-[radial-gradient(ellipse_at_center,#24305f_0%,#14102c_48%,#070814_80%)]"
        }`}
      />
      <img
        src={asset("images/galaxy-nebula.jpg")}
        alt=""
        draggable={false}
        className={`absolute inset-[-6%] h-[112%] w-[112%] object-cover ${rose ? "opacity-80" : "opacity-55"}`}
      />
      <div
        className={`absolute inset-0 ${
          rose
            ? "bg-[radial-gradient(ellipse_at_center,rgba(255,170,190,0.16),transparent_58%)]"
            : "bg-[radial-gradient(ellipse_at_center,rgba(120,140,255,0.16),transparent_55%)]"
        }`}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_46%,rgba(7,8,20,0.72)_100%)]" />
      {reduce ? null : (
        <div className="pointer-events-none absolute top-[18%] left-1/2 h-[36vh] w-[36vh] -translate-x-1/2 rounded-full bg-[#e7b48a]/10 blur-3xl" />
      )}
    </div>
  )
}
