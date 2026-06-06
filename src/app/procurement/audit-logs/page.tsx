"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Star, Calendar, ShieldCheck, User, Compass, Server } from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"

interface LogStar {
  x: number
  y: number
  size: number
  glowColor: string
  label: string
  detail: string
  operator: string
  time: string
  module: string
  ip: string
}

const MOCK_LOGS: LogStar[] = [
  { x: 120, y: 140, size: 6, glowColor: "#6EE7FF", label: "RFQ Created", detail: "GPU Procurement RFQ-2026-9102 broadcasted", operator: "Sarah Chen", time: "12:45 PM", module: "RFQs", ip: "192.168.1.104" },
  { x: 260, y: 100, size: 5, glowColor: "#FBBF24", label: "Quotation Recieved", detail: "Acme Corp submitted bidding of ₹4.8M", operator: "System Port", time: "01:12 PM", module: "Quotations", ip: "10.0.4.15" },
  { x: 380, y: 190, size: 7, glowColor: "#A78BFA", label: "Manager Approved", detail: "Ananya approved quote QTN-2026-0102", operator: "Ananya Gupta", time: "02:30 PM", module: "Approvals", ip: "192.168.1.12" },
  { x: 500, y: 90, size: 6, glowColor: "#34D399", label: "Finance Approved", detail: "Budget allocation cleared for PO dispatch", operator: "Rajesh Kumar", time: "03:10 PM", module: "Approvals", ip: "192.168.1.20" },
  { x: 620, y: 220, size: 8, glowColor: "#60A5FA", label: "PO Generated", detail: "Contract PO-2026-0042 auto-generated", operator: "Auto Broker", time: "03:15 PM", module: "Orders", ip: "127.0.0.1" },
  { x: 740, y: 150, size: 6, glowColor: "#F59E0B", label: "Invoice Sent", detail: "Billing document INV-2026-0101 raised", operator: "TechSolutions", time: "03:40 PM", module: "Invoices", ip: "45.72.18.9" },
]

export default function AuditLogsGalaxyPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const [hoveredStar, setHoveredStar] = useState<LogStar | null>(null)
  const [selectedStar, setSelectedStar] = useState<LogStar | null>(MOCK_LOGS[0])
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const container = canvas.parentElement!
    let width = (canvas.width = container.clientWidth)
    let height = (canvas.height = 360)

    let particles: { x: number; y: number; size: number; alpha: number }[] = []
    // Ambient stars background
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5,
        alpha: 0.1 + Math.random() * 0.5,
      })
    }

    function draw(t: number) {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)

      // Draw ambient backdrop stars
      ctx.fillStyle = "#ffffff"
      particles.forEach((p) => {
        ctx.globalAlpha = p.alpha + Math.sin(t * 0.002 + p.x) * 0.1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1.0

      // Draw horizontal orbital guide lines connecting the logs galaxy
      ctx.beginPath()
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)"
      ctx.lineWidth = 1
      MOCK_LOGS.forEach((log, idx) => {
        if (idx < MOCK_LOGS.length - 1) {
          const next = MOCK_LOGS[idx + 1]
          ctx.moveTo(log.x, log.y)
          ctx.lineTo(next.x, next.y)
        }
      })
      ctx.stroke()

      // Draw major event stars
      MOCK_LOGS.forEach((log) => {
        const isHovered = hoveredStar?.label === log.label
        const isSelected = selectedStar?.label === log.label
        const sizeMultiplier = isHovered || isSelected ? 1.5 : 1.0
        const radius = log.size * sizeMultiplier

        // Outer glow
        ctx.beginPath()
        ctx.arc(log.x, log.y, radius * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = log.glowColor
        ctx.globalAlpha = isHovered || isSelected ? 0.3 : 0.1
        ctx.fill()
        ctx.globalAlpha = 1.0

        // Core star
        ctx.beginPath()
        ctx.arc(log.x, log.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = "#ffffff"
        ctx.shadowColor = log.glowColor
        ctx.shadowBlur = 10
        ctx.fill()
        ctx.shadowBlur = 0 // reset

        // Label above star
        ctx.font = "bold 9px system-ui, sans-serif"
        ctx.fillStyle = isSelected ? "#6EE7FF" : "rgba(255,255,255,0.6)"
        ctx.textAlign = "center"
        ctx.fillText(log.label, log.x, log.y - radius * 2.2)
      })

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)

    // Handle resize
    const handleResize = () => {
      width = canvas.width = container.clientWidth
    }
    window.addEventListener("resize", handleResize)

    // Handle canvas click to select logs
    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const clickY = e.clientY - rect.top

      // Check if clicked near any mock star
      MOCK_LOGS.forEach((log) => {
        const dx = clickX - log.x
        const dy = clickY - log.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 15) {
          setSelectedStar(log)
        }
      })
    }
    canvas.addEventListener("click", handleCanvasClick)

    // Handle canvas mouse move to set hover states
    const handleCanvasMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      let found: LogStar | null = null

      MOCK_LOGS.forEach((log) => {
        const dx = mx - log.x
        const dy = my - log.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 15) {
          found = log
        }
      })
      setHoveredStar(found)
    }
    canvas.addEventListener("mousemove", handleCanvasMouseMove)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener("resize", handleResize)
      canvas.removeEventListener("click", handleCanvasClick)
      canvas.removeEventListener("mousemove", handleCanvasMouseMove)
    }
  }, [hoveredStar, selectedStar])

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-8 pb-16">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Activity timeline Galaxy
            </h1>
            <p className="mt-1 text-sm text-zinc-550 dark:text-cyan-400 font-semibold">
              Observe connected system events mapped as stars across the procurement journey.
            </p>
          </div>
        </div>

        {/* Galaxy Canvas Board */}
        <div className="rounded-3xl border border-zinc-800 bg-[#070707] p-4 relative overflow-hidden shadow-xl">
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-zinc-900/60 border border-zinc-800 px-3 py-1 rounded-full text-[9px] font-bold text-zinc-400">
            <Compass className="h-3.5 w-3.5 text-cyan-400" /> Click a star coordinate to inspect journey logs
          </div>
          
          <div className="h-96 w-full flex items-center justify-center">
            <canvas ref={canvasRef} className="h-full w-full cursor-crosshair" />
          </div>
        </div>

        {/* Detailed Inspector Card */}
        <AnimatePresence mode="wait">
          {selectedStar && (
            <motion.div
              key={selectedStar.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-md grid gap-6 md:grid-cols-2"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full animate-ping"
                    style={{ backgroundColor: selectedStar.glowColor }}
                  />
                  <h3 className="text-lg font-bold">{selectedStar.label}</h3>
                  <span className="text-[9px] font-black uppercase text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    {selectedStar.module}
                  </span>
                </div>
                <p className="text-sm font-semibold text-zinc-850 dark:text-zinc-350">
                  {selectedStar.detail}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 p-3 border border-zinc-200 dark:border-zinc-850">
                  <User className="h-4 w-4 text-zinc-400" />
                  <div>
                    <p className="text-[9px] uppercase font-bold text-zinc-500">Operator</p>
                    <p className="font-bold">{selectedStar.operator}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 p-3 border border-zinc-200 dark:border-zinc-850">
                  <Calendar className="h-4 w-4 text-zinc-400" />
                  <div>
                    <p className="text-[9px] uppercase font-bold text-zinc-500">Timestamp</p>
                    <p className="font-bold">{selectedStar.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 p-3 border border-zinc-200 dark:border-zinc-850 col-span-2">
                  <Server className="h-4 w-4 text-zinc-400" />
                  <div>
                    <p className="text-[9px] uppercase font-bold text-zinc-500">Audit IP Origin</p>
                    <p className="font-mono font-bold text-cyan-400">{selectedStar.ip}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </DashboardLayout>
  )
}
