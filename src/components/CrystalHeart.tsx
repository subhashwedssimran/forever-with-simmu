import { useEffect, useId, useState } from "react"
import { motion, useReducedMotion, useTransform, type MotionValue } from "motion/react"
import { asset } from "../lib/asset"

const HEART_SRC = asset("images/crystal-heart.webp")

const ORBIT_PATH =
  "M50,16 C70,16 84,30 84,47 C84,64 70,80 50,80 C30,80 16,64 16,47 C16,30 30,16 50,16 Z"
const OUTER_PATH =
  "M50,10 C74,10 90,28 90,47 C90,67 74,86 50,86 C26,86 10,67 10,47 C10,28 26,10 50,10 Z"

const MOTES = [
  { path: ORBIT_PATH, duration: 28, begin: "0s", radius: 0.95, cx: 50, cy: 16 },
  { path: ORBIT_PATH, duration: 28, begin: "-9s", radius: 0.7, cx: 84, cy: 47 },
  { path: ORBIT_PATH, duration: 28, begin: "-18s", radius: 0.85, cx: 50, cy: 80 },
  { path: OUTER_PATH, duration: 36, begin: "-4s", radius: 0.75, cx: 16, cy: 47 },
  { path: OUTER_PATH, duration: 36, begin: "-16s", radius: 1.05, cx: 74, cy: 24 },
  { path: OUTER_PATH, duration: 36, begin: "-27s", radius: 0.65, cx: 28, cy: 74 },
]

type CrystalHeartProps = {
  x: MotionValue<number>
  y: MotionValue<number>
}

export function CrystalHeart({ x, y }: CrystalHeartProps) {
  const reduce = useReducedMotion()
  const glowId = useId().replace(/:/g, "")
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const [finePointer, setFinePointer] = useState(false)
  const shiftX = useTransform(x, (value) => value * 28)
  const shiftY = useTransform(y, (value) => value * 16)
  const tiltX = useTransform(y, (value) => value * -6)
  const tiltY = useTransform(x, (value) => value * 8)

  useEffect(() => {
    const image = new Image()
    image.src = HEART_SRC
    if (image.complete && image.naturalWidth > 0) setLoaded(true)
  }, [])

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)")
    const sync = () => setFinePointer(query.matches)
    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])

  return (
    <div className="flex h-full min-h-0 w-full items-center justify-center">
      <div
        className="relative h-full max-h-[min(42svh,460px)] w-full max-w-[520px]"
        style={finePointer ? { perspective: 1200 } : undefined}
      >
        <motion.div
          className="relative h-full w-full"
          style={
            finePointer
              ? { x: shiftX, y: shiftY, rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }
              : undefined
          }
        >
          <motion.div
            className="relative h-full w-full"
            animate={reduce ? undefined : { y: [0, -9, 0] }}
            transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div
              aria-hidden="true"
              className="absolute top-[16%] left-1/2 h-[70%] w-[74%] -translate-x-1/2 rounded-full blur-xl sm:blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,206,164,0.55) 0%, rgba(232,126,176,0.28) 34%, rgba(92,36,120,0.08) 58%, transparent 74%)",
              }}
              animate={reduce ? undefined : { opacity: [0.62, 0.95, 0.62] }}
              transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <div
              aria-hidden="true"
              className="absolute top-[22%] left-1/2 h-[48%] w-[48%] -translate-x-1/2 rounded-full bg-[#ffd7b0]/20 blur-2xl"
            />
            <div className="absolute bottom-[7%] left-1/2 h-7 w-[42%] -translate-x-1/2 rounded-full bg-black/45 blur-xl" />

            {failed ? null : (
              <>
                <motion.img
                  src={HEART_SRC}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  className="pointer-events-none absolute inset-0 hidden h-full w-full scale-105 object-contain opacity-0 blur-xl sm:block sm:blur-2xl"
                  animate={{ opacity: loaded ? 0.28 : 0 }}
                  transition={{ duration: 1.1, ease: "easeOut" }}
                />
                <motion.img
                  src={HEART_SRC}
                  alt="A faceted rose-quartz and amethyst crystal heart framed by crimson, blush, and ivory roses"
                  draggable={false}
                  className="heart-img relative z-10 h-full w-full object-contain select-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: loaded ? 1 : 0 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  onLoad={() => setLoaded(true)}
                  onError={() => setFailed(true)}
                />
              </>
            )}

            {loaded && !reduce ? (
              <div
                className="pointer-events-none absolute inset-0 z-20"
                style={{
                  maskImage: `url(${HEART_SRC})`,
                  WebkitMaskImage: `url(${HEART_SRC})`,
                  maskSize: "contain",
                  WebkitMaskSize: "contain",
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat",
                  maskPosition: "center",
                  WebkitMaskPosition: "center",
                }}
              >
                <motion.div
                  className="absolute inset-y-[10%] w-1/3"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,236,214,0.42), transparent)",
                    mixBlendMode: "screen",
                  }}
                  animate={{ x: ["-140%", "300%"] }}
                  transition={{ duration: 7.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 2.4 }}
                />
                <motion.div
                  className="absolute inset-y-[18%] w-1/4"
                  style={{
                    background:
                      "linear-gradient(100deg, transparent, rgba(255,196,214,0.28), transparent)",
                    mixBlendMode: "screen",
                  }}
                  animate={{ x: ["280%", "-120%"] }}
                  transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.6 }}
                />
              </div>
            ) : null}

            <svg
              className="pointer-events-none absolute inset-0 z-30 h-full w-full overflow-visible"
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              <defs>
                <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="0.45" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {MOTES.map((mote) =>
                reduce ? (
                  <circle
                    key={`${mote.cx}-${mote.cy}`}
                    cx={mote.cx}
                    cy={mote.cy}
                    r={mote.radius}
                    fill="#ffe4bc"
                    filter={`url(#${glowId})`}
                  />
                ) : (
                  <circle key={`${mote.path}-${mote.begin}`} r={mote.radius} fill="#ffe4bc" filter={`url(#${glowId})`}>
                    <animateMotion
                      dur={`${mote.duration}s`}
                      begin={mote.begin}
                      repeatCount="indefinite"
                      path={mote.path}
                      rotate="0"
                    />
                  </circle>
                ),
              )}
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
