"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, MessageSquare } from "lucide-react"

type AIState = "Listening" | "Thinking" | "Analyzing" | "Generating"

const INSIGHTS = [
  "3 vendors have submitted quotations for RFQ-2026-8801.",
  "Potential savings of ₹420K detected in cloud subscriptions.",
  "Approval bottleneck found at Director level for IT contracts.",
  "Vendor TechSolutions performance rating dropped by 12% this week.",
  "Market prices for raw copper are dropping; recommend purchasing soon.",
  "Acme Corp has 98% on-time delivery rate. Shortlisting recommended.",
]

export default function AiAssistantOrb() {
  const [insightIndex, setInsightIndex] = useState(0)
  const [aiState, setAiState] = useState<AIState>("Analyzing")
  const waveCanvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  // Rotate insights
  useEffect(() => {
    const states: AIState[] = ["Listening", "Thinking", "Analyzing", "Generating"]
    const interval = setInterval(() => {
      // Pick random state & move to next insight
      setAiState(states[Math.floor(Math.random() * states.length)])
      setInsightIndex((idx) => (idx + 1) % INSIGHTS.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  // Animate audio-wave canvas ripples behind orb
  useEffect(() => {
    const canvas = waveCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = (canvas.width = 120)
    let height = (canvas.height = 120)
    let phase = 0

    function drawWave() {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)
      phase += 0.08

      const cx = width / 2
      const cy = height / 2

      ctx.strokeStyle = "rgba(110, 231, 255, 0.4)"
      ctx.lineWidth = 1.5

      // Draw three concentric wave rings modulated by sine waves
      for (let ring = 0; ring < 3; ring++) {
        ctx.beginPath()
        const ringRadius = 25 + ring * 14

        for (let angle = 0; angle < Math.PI * 2; angle += 0.05) {
          // Modulate radius based on phase and angle
          const modulation = Math.sin(angle * (4 + ring) + phase) * (3 + ring)
          const r = ringRadius + modulation
          const x = cx + Math.cos(angle) * r
          const y = cy + Math.sin(angle) * r

          if (angle === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        ctx.closePath()
        ctx.stroke()
      }

      animRef.current = requestAnimationFrame(drawWave)
    }

    drawWave()

    return () => {
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white/70 p-4 shadow-lg backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/70 max-w-md w-full relative overflow-hidden group">
      {/* Orb Animation Column */}
      <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
        {/* Canvas Wave ripples */}
        <canvas ref={waveCanvasRef} className="absolute inset-0 h-full w-full pointer-events-none" />

        {/* Breathing Orb */}
        <motion.div
          animate={{
            scale: [1, 1.12, 1],
            boxShadow: [
              "0 0 20px rgba(110, 231, 255, 0.4)",
              "0 0 35px rgba(110, 231, 255, 0.8)",
              "0 0 20px rgba(110, 231, 255, 0.4)",
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="h-12 w-12 rounded-full bg-gradient-to-tr from-[#00D2FF] to-[#00FFF0] relative z-10 flex items-center justify-center cursor-pointer border border-[#6EE7FF]"
          onClick={() => {
            // Click triggers next insight immediately
            setAiState("Generating")
            setInsightIndex((idx) => (idx + 1) % INSIGHTS.length)
          }}
        >
          <div className="absolute inset-1 rounded-full bg-indigo-950/40 blur-[1px] flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white animate-pulse" />
          </div>
        </motion.div>
      </div>

      {/* Text Info Column */}
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#6EE7FF] bg-[#6EE7FF]/10 px-2 py-0.5 rounded-md">
            AI Copilot
          </span>
          <span className="text-[10px] text-zinc-400 font-medium animate-pulse flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
            {aiState}...
          </span>
        </div>

        <div className="mt-2 h-[48px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={insightIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium line-clamp-2"
            >
              &quot;{INSIGHTS[insightIndex]}&quot;
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
