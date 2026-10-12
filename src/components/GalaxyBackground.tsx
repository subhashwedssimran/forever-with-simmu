import { useEffect, useRef } from "react"
import { motion, useReducedMotion, useTransform, type MotionValue } from "motion/react"
import { asset } from "../lib/asset"

type Star = {
  x: number
  y: number
  r: number
  base: number
  layer: number
  tw: number
  phase: number
  speed: number
  gold: boolean
  pink: boolean
}

type Meteor = {
  x: number
  y: number
  vx: number
  vy: number
  born: number
  life: number
}

type GalaxyBackgroundProps = {
  x: MotionValue<number>
  y: MotionValue<number>
}

function makeStars(width: number, height: number): Star[] {
  const compact = width < 720
  const area = width * height
  const starCount = compact ? 16 : Math.max(24, Math.round(area / 32000))
  const goldCount = compact ? 5 : Math.max(10, Math.round(area / 78000))
  const stars: Star[] = []

  for (let index = 0; index < starCount; index += 1) {
    const near = Math.random() > 0.72
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: near ? Math.random() * 1.15 + 0.55 : Math.random() * 0.8 + 0.25,
      base: Math.random() * 0.4 + 0.2,
      layer: near ? 2 : 1,
      tw: Math.random() * 1.1 + 0.35,
      phase: Math.random() * Math.PI * 2,
      speed: 0,
      gold: false,
      pink: Math.random() < 0.22,
    })
  }

  for (let index = 0; index < goldCount; index += 1) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.7,
      base: Math.random() * 0.35 + 0.4,
      layer: 3,
      tw: Math.random() * 0.7 + 0.25,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 12 + 6,
      gold: true,
      pink: false,
    })
  }

  return stars
}

function wrap(value: number, size: number) {
  return ((value % size) + size) % size
}

export function GalaxyBackground({ x, y }: GalaxyBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()
  const nebulaX = useTransform(x, (value) => value * -34)
  const nebulaY = useTransform(y, (value) => value * -20)
  const mistX = useTransform(x, (value) => value * 18)
  const mistY = useTransform(y, (value) => value * 12)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext("2d")
    if (!context) return

    let stars: Star[] = []
    let meteor: Meteor | null = null
    let nextMeteor = 3.2
    let frame = 0
    let running = true
    let compact = false
    let lastWidth = 0
    let lastHeight = 0
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const resize = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      if (lastWidth > 0 && Math.abs(width - lastWidth) < 8 && Math.abs(height - lastHeight) < 8) return
      lastWidth = width
      lastHeight = height
      compact = width < 720
      const dpr = Math.min(window.devicePixelRatio || 1, compact ? 1.25 : 1.5)
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      stars = makeStars(width, height)
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
      const px = x.get()
      const py = y.get()

      for (const star of stars) {
        const drawX = wrap(star.x + px * star.layer * 24, width)
        const drawY = wrap(
          star.y + py * star.layer * 14 - (star.gold && !still ? t * star.speed : 0),
          height,
        )
        const nx = (drawX / width - 0.5) / 0.2
        const ny = (drawY / height - 0.46) / 0.18
        if (star.gold && nx * nx + ny * ny < 1) continue

        const alpha =
          star.base *
          (still ? 0.85 : 0.45 + 0.55 * Math.abs(Math.sin(t * star.tw + star.phase)))

        if (star.gold && !compact) {
          const radius = star.r * 7
          const glow = context.createRadialGradient(drawX, drawY, 0, drawX, drawY, radius)
          glow.addColorStop(0, `rgba(255, 214, 160, ${alpha})`)
          glow.addColorStop(1, "rgba(255, 214, 160, 0)")
          context.fillStyle = glow
          context.beginPath()
          context.arc(drawX, drawY, radius, 0, Math.PI * 2)
          context.fill()
        }

        context.fillStyle = star.gold
          ? `rgba(255, 228, 186, ${Math.min(1, alpha + 0.2)})`
          : star.pink
            ? `rgba(255, 206, 224, ${alpha})`
            : `rgba(255, 248, 252, ${alpha})`
        context.beginPath()
        context.arc(drawX, drawY, star.r, 0, Math.PI * 2)
        context.fill()
      }

      if (!still && !meteor && t > nextMeteor) {
        const fromLeft = Math.random() < 0.5
        meteor = {
          x: fromLeft ? width * (0.04 + Math.random() * 0.18) : width * (0.68 + Math.random() * 0.22),
          y: height * (0.03 + Math.random() * 0.1),
          vx: (fromLeft ? 1 : -1) * width * 0.46,
          vy: height * 0.14,
          born: t,
          life: 0.78 + Math.random() * 0.22,
        }
      }

      if (meteor) {
        const age = t - meteor.born
        if (age > meteor.life) {
          meteor = null
          nextMeteor = t + (compact ? 16 : 8) + Math.random() * 7
        } else {
          const fade = 1 - age / meteor.life
          const headX = meteor.x + meteor.vx * age
          const headY = meteor.y + meteor.vy * age
          const tail = 0.14
          const tailX = headX - meteor.vx * tail
          const tailY = headY - meteor.vy * tail
          const trail = context.createLinearGradient(tailX, tailY, headX, headY)
          trail.addColorStop(0, "rgba(255, 214, 170, 0)")
          trail.addColorStop(1, `rgba(255, 246, 232, ${0.75 * fade})`)
          context.strokeStyle = trail
          context.lineWidth = 1.35
          context.lineCap = "round"
          context.beginPath()
          context.moveTo(tailX, tailY)
          context.lineTo(headX, headY)
          context.stroke()
          context.fillStyle = `rgba(255, 250, 244, ${0.9 * fade})`
          context.beginPath()
          context.arc(headX, headY, 1.15, 0, Math.PI * 2)
          context.fill()
        }
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
  }, [x, y])

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#07010f]" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#6a2a62_0%,#2a1028_42%,#07010f_78%)]" />
      <motion.div
        className="absolute top-[12%] -left-[8%] h-[42svh] w-[42svh] rounded-full bg-[#e15b92]/30 blur-xl sm:h-[48vh] sm:w-[48vh] sm:blur-3xl"
        style={{ x: mistX, y: mistY }}
        animate={reduce ? undefined : { opacity: [0.45, 0.8, 0.45] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-6%] bottom-[6%] h-[36svh] w-[36svh] rounded-full bg-[#7d4dff]/25 blur-xl sm:h-[42vh] sm:w-[42vh] sm:blur-3xl"
        style={{ x: nebulaX, y: nebulaY }}
        animate={reduce ? undefined : { opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[40%] left-1/2 h-[40svh] w-[40svh] -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl sm:h-[46vh] sm:w-[46vh] sm:blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(255,186,206,0.28) 0%, rgba(176,84,140,0.12) 46%, transparent 72%)",
        }}
        animate={reduce ? undefined : { opacity: [0.55, 0.9, 0.55] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div className="absolute inset-[-8%]" style={{ x: nebulaX, y: nebulaY }}>
        <motion.img
          src={asset("images/galaxy-nebula.jpg")}
          alt=""
          draggable={false}
          className="h-full w-full object-cover opacity-90"
          animate={reduce ? undefined : { scale: [1.05, 1.1, 1.05] }}
          transition={{ duration: 36, repeat: Infinity, ease: "easeInOut" }}
          onError={(event) => {
            event.currentTarget.style.display = "none"
          }}
        />
      </motion.div>

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(7,1,15,0.62)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/45 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#07010f]/75 via-[#07010f]/20 to-transparent" />
      <div
        className="absolute inset-0 opacity-[0.045] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  )
}
