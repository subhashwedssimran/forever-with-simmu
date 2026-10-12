import { useEffect } from "react"
import { useMotionValue, useSpring, type MotionValue } from "motion/react"

type Parallax = {
  x: MotionValue<number>
  y: MotionValue<number>
}

type ParallaxOptions = {
  /** Touch screens have no hover pointer. A stand-in sine wave was shaking the opening heart. */
  driftOnCoarsePointer?: boolean
}

export function useParallax(options?: ParallaxOptions): Parallax {
  const driftOnCoarsePointer = options?.driftOnCoarsePointer ?? true
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 28, damping: 20, mass: 0.7 })
  const springY = useSpring(y, { stiffness: 28, damping: 20, mass: 0.7 })

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) return

    const fine = window.matchMedia("(pointer: fine)").matches
    if (fine) {
      const onMove = (event: PointerEvent) => {
        x.set(event.clientX / window.innerWidth - 0.5)
        y.set(event.clientY / window.innerHeight - 0.5)
      }
      window.addEventListener("pointermove", onMove, { passive: true })
      return () => window.removeEventListener("pointermove", onMove)
    }

    if (!driftOnCoarsePointer) return

    let frame = 0
    const start = performance.now()
    const loop = (now: number) => {
      const t = (now - start) / 1000
      x.set(Math.sin(t * 0.18) * 0.28)
      y.set(Math.cos(t * 0.14) * 0.18)
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [driftOnCoarsePointer, x, y])

  return { x: springX, y: springY }
}
