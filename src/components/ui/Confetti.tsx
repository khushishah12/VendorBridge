"use client"

import { useEffect, useRef } from "react"

interface ConfettiItem {
  x: number
  y: number
  color: string
  size: number
  rotation: number
  rotationSpeed: number
  vx: number
  vy: number
}

const COLORS = ["#FFC107", "#03A9F4", "#4CAF50", "#E91E63", "#9C27B0", "#FF5722", "#00BCD4"]

export default function Confetti({ active = true }: { active?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const particlesRef = useRef<ConfettiItem[]>([])

  useEffect(() => {
    if (!active) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener("resize", handleResize)

    // Generate confetti burst
    const particles = particlesRef.current
    if (particles.length === 0) {
      for (let i = 0; i < 120; i++) {
        particles.push({
          x: width / 2,
          y: height / 2 - 50,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          size: 6 + Math.random() * 8,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 5,
          vx: (Math.random() - 0.5) * 12,
          vy: -8 - Math.random() * 12,
        })
      }
    }

    function animate() {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)

      // Filter out off-screen particles
      particlesRef.current = particles.filter(
        (p) => p.y < height + 20 && p.x > -20 && p.x < width + 20
      )

      for (const p of particlesRef.current) {
        // Gravity
        p.vy += 0.3
        p.vx *= 0.98

        // Move
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotationSpeed

        // Draw rectangle particle
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5)
        ctx.restore()
      }

      if (particlesRef.current.length > 0) {
        animRef.current = requestAnimationFrame(animate)
      }
    }

    animate()

    // Automatic termination timer
    const timer = setTimeout(() => {
      cancelAnimationFrame(animRef.current)
      particlesRef.current = []
      ctx.clearRect(0, 0, width, height)
    }, 4500)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener("resize", handleResize)
      clearTimeout(timer)
    }
  }, [active])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[10000] h-full w-full"
    />
  )
}
