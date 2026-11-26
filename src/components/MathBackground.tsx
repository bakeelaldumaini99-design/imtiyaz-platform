import { useMemo } from "react";

const SYMBOLS = ["∫", "π", "√", "∞", "Σ", "Δ", "θ", "λ", "∂", "≈", "±", "x²", "f′(x)", "eⁱ", "φ", "Ω", "z=a+bi", "n!", "sin", "cos"];

export default function MathBackground({ count = 22, dim = false }: { count?: number; dim?: boolean }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        sym: SYMBOLS[i % SYMBOLS.length],
        right: Math.random() * 100,
        delay: Math.random() * 24,
        dur: 18 + Math.random() * 22,
        size: 14 + Math.random() * 34,
        dx: -60 + Math.random() * 120,
        op: dim ? 0.06 + Math.random() * 0.08 : 0.1 + Math.random() * 0.16,
      })),
    [count, dim]
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {/* aurora glows */}
      <div
        className="absolute -top-40 right-[10%] h-[34rem] w-[34rem] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, #1e3472, transparent 65%)", animation: "aurora 16s ease-in-out infinite" }}
      />
      <div
        className="absolute bottom-[-10rem] left-[5%] h-[30rem] w-[30rem] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #b9862a, transparent 60%)", animation: "aurora 20s ease-in-out infinite reverse" }}
      />
      {items.map((it, i) => (
        <span
          key={i}
          className="absolute font-tajawal font-bold text-[#eec65f]"
          style={
            {
              right: `${it.right}%`,
              bottom: "-8vh",
              fontSize: it.size,
              opacity: 0,
              "--dx": `${it.dx}px`,
              "--op": it.op,
              animation: `drift ${it.dur}s linear ${it.delay}s infinite`,
            } as React.CSSProperties
          }
        >
          {it.sym}
        </span>
      ))}
    </div>
  );
}
