import { asset } from "../lib/asset"

const BACK = [
  { left: "6%", size: 34, delay: "0s", duration: "12s", drift: "18px", spin: "210deg" },
  { left: "18%", size: 22, delay: "1.4s", duration: "13.5s", drift: "-14px", spin: "-160deg" },
  { left: "72%", size: 30, delay: "0.6s", duration: "11.5s", drift: "16px", spin: "180deg" },
  { left: "84%", size: 24, delay: "2s", duration: "14s", drift: "-20px", spin: "-200deg" },
  { left: "40%", size: 18, delay: "0.3s", duration: "15s", drift: "10px", spin: "140deg" },
  { left: "58%", size: 20, delay: "1.8s", duration: "12.8s", drift: "-12px", spin: "-150deg" },
  { left: "30%", size: 26, delay: "2.6s", duration: "13s", drift: "22px", spin: "240deg" },
  { left: "90%", size: 28, delay: "0.9s", duration: "12.2s", drift: "-8px", spin: "-190deg" },
]

const FRONT = [
  { left: "1%", size: 32, delay: "0.2s", duration: "11s", drift: "12px", spin: "200deg" },
  { left: "8%", size: 20, delay: "1.6s", duration: "13s", drift: "-10px", spin: "-170deg" },
  { left: "88%", size: 30, delay: "0.5s", duration: "12.4s", drift: "-14px", spin: "220deg" },
  { left: "94%", size: 22, delay: "2.1s", duration: "14.2s", drift: "8px", spin: "-180deg" },
  { left: "-2%", size: 18, delay: "3s", duration: "12s", drift: "16px", spin: "160deg" },
]

type RosePetalsProps = {
  layer: "back" | "front"
}

export function RosePetals({ layer }: RosePetalsProps) {
  const petals = layer === "back" ? BACK : FRONT

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${layer === "front" ? "z-20" : "z-0"}`}
      aria-hidden="true"
    >
      {petals.map((petal) => (
        <img
          key={`${layer}-${petal.left}-${petal.delay}`}
          src={asset("images/rose-petal.webp")}
          alt=""
          draggable={false}
          data-rose-petal={layer}
          className="petal-photo"
          style={{
            left: petal.left,
            width: petal.size,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            ["--drift" as string]: petal.drift,
            ["--spin" as string]: petal.spin,
          }}
        />
      ))}
    </div>
  )
}
