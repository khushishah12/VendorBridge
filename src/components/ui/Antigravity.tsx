'use client'

import { useEffect, useRef, useState } from 'react'

interface Particle {
  x: number
  y: number
  z: number // 3D depth coordinate
  vx: number
  vy: number
  baseSize: number
  speedFactor: number
}

interface AntigravityProps {
  count?: number
  magnetRadius?: number
  ringRadius?: number
  waveSpeed?: number
  waveAmplitude?: number
  particleSize?: number
  lerpSpeed?: number
  color?: string
  autoAnimate?: boolean
  particleShape?: 'circle' | 'capsule'
  messages?: string[]
  particleVariance?: number
  rotationSpeed?: number
  depthFactor?: number
  pulseSpeed?: number
  fieldStrength?: number
}

const DEFAULT_MESSAGES = [
  'Loading VendorBridge...',
  'Syncing Procurement Data...',
  'Preparing Workspace...',
]

export default function Antigravity({
  count = 500,
  magnetRadius = 8,
  ringRadius = 10,
  waveSpeed = 0.6,
  waveAmplitude = 1.5,
  particleSize = 1.8,
  lerpSpeed = 0.08,
  color = '#6EE7FF',
  autoAnimate = true,
  particleShape = 'capsule',
  messages = DEFAULT_MESSAGES,
  particleVariance = 1,
  rotationSpeed = 0.15,
  depthFactor = 1.2,
  pulseSpeed = 4,
  fieldStrength = 12,
}: AntigravityProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])
  const timeRef = useRef<number>(0)
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    if (!autoAnimate) return
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % messages.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [autoAnimate, messages.length])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const container = canvas.parentElement!
    let width = container.clientWidth
    let height = container.clientHeight
    canvas.width = width
    canvas.height = height

    const particles = particlesRef.current
    if (particles.length === 0) {
      for (let i = 0; i < count; i++) {
        const sizeVar = (Math.random() - 0.5) * particleVariance * 0.8
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: Math.random() * depthFactor + 0.5,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5 - 0.2,
          baseSize: Math.max(0.5, particleSize + sizeVar),
          speedFactor: 0.5 + Math.random() * 0.8,
        })
      }
    }

    function drawCapsule(x: number, y: number, size: number, alpha: number) {
      if (!ctx) return
      const w = size * 2.8
      const h = size
      const r = h / 2
      ctx.beginPath()
      ctx.roundRect(x - w / 2, y - h / 2, w, h, r)
      ctx.fillStyle = color
      ctx.globalAlpha = alpha
      ctx.fill()
    }

    function animate(t: number) {
      if (!ctx) return
      timeRef.current = t
      ctx.clearRect(0, 0, width, height)

      const centerX = width / 2
      const centerY = height / 2

      // Modulate the ring distance periodically using pulseSpeed and fieldStrength
      const currentRingRadius = ringRadius * 12 + Math.sin(t * 0.001 * pulseSpeed) * fieldStrength

      for (const p of particles) {
        // Slow float upwards
        p.vy -= 0.015 * p.speedFactor
        p.vx += Math.sin(t * 0.001 * waveSpeed + p.y * 0.008) * waveAmplitude * 0.003

        // Calculate distance from target orbit center
        let dx = centerX - p.x
        let dy = centerY - p.y
        let dist = Math.sqrt(dx * dx + dy * dy)

        if (dist > 0.1) {
          // Orbit force / Swirling orbital effect using fieldStrength and rotationSpeed
          const swirlX = -dy / dist
          const swirlY = dx / dist

          const swirlForce = rotationSpeed * 0.25
          p.vx += swirlX * swirlForce
          p.vy += swirlY * swirlForce

          // Magnet force pull
          const offset = dist - currentRingRadius
          const pullForce = offset * magnetRadius * 0.0004
          p.vx += (dx / dist) * pullForce * lerpSpeed
          p.vy += (dy / dist) * pullForce * lerpSpeed
        }

        // Apply friction
        p.vx *= 0.985
        p.vy *= 0.985

        // Move particle
        p.x += p.vx
        p.y += p.vy

        // Wrap around boundaries
        if (p.y < -20) {
          p.y = height + 20
          p.x = Math.random() * width
          p.vx = (Math.random() - 0.5) * 0.5
          p.vy = 0
        }
        if (p.x < -20) p.x = width + 20
        if (p.x > width + 20) p.x = -20
      }

      // Render particles sorted by depth z for proper depth cueing
      const sorted = [...particles].sort((a, b) => b.z - a.z)

      for (const p of sorted) {
        // Calculate rendering dimensions based on depth factor
        const renderSize = p.baseSize / p.z
        const alpha = Math.min(0.85, (0.55 / p.z) * 1.2)

        if (particleShape === 'circle') {
          ctx.beginPath()
          ctx.arc(p.x, p.y, renderSize, 0, Math.PI * 2)
          ctx.fillStyle = color
          ctx.globalAlpha = alpha
          ctx.fill()
        } else {
          drawCapsule(p.x, p.y, renderSize, alpha)
        }
      }

      ctx.globalAlpha = 1.0
      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = entry.contentRect.width
        height = entry.contentRect.height
        canvas.width = width
        canvas.height = height
      }
    })
    resizeObserver.observe(container)

    return () => {
      cancelAnimationFrame(animRef.current)
      resizeObserver.disconnect()
    }
  }, [
    count,
    magnetRadius,
    ringRadius,
    waveSpeed,
    waveAmplitude,
    particleSize,
    lerpSpeed,
    color,
    particleShape,
    particleVariance,
    rotationSpeed,
    depthFactor,
    pulseSpeed,
    fieldStrength,
  ])

  return (
    <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden bg-transparent pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-60" />
      {messages && messages.length > 0 && (
        <div className="relative z-10 text-center select-none pointer-events-none">
          <div className="text-xl font-light tracking-widest text-[#6EE7FF] drop-shadow-[0_0_10px_rgba(110,231,255,0.4)] transition-all duration-500 ease-in-out">
            {messages[msgIndex]}
          </div>
        </div>
      )}
    </div>
  )
}
