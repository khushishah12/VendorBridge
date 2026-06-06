'use client'

import { useEffect, useRef, useState } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
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
    }, 3000)
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
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5 - 0.2,
        })
      }
    }

    const centerX = width / 2
    const centerY = height / 2
    const targetDist = ringRadius * 12

    function drawCapsule(x: number, y: number, size: number) {
      const w = size * 2.5
      const h = size
      const r = h / 2
      ctx.beginPath()
      ctx.roundRect(x - w / 2, y - h / 2, w, h, r)
      ctx.fill()
    }

    function animate(t: number) {
      timeRef.current = t
      ctx.clearRect(0, 0, width, height)

      for (const p of particles) {
        p.vy -= 0.03
        p.vx += Math.sin(t * 0.001 * waveSpeed + p.y * 0.01) * waveAmplitude * 0.005

        const dx = centerX - p.x
        const dy = centerY - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > 0.1) {
          const offset = dist - targetDist
          const force = offset * magnetRadius * 0.0005
          p.vx += (dx / dist) * force * lerpSpeed * 10
          p.vy += (dy / dist) * force * lerpSpeed * 10
        }

        p.vx *= 0.99
        p.vy *= 0.99
        p.x += p.vx
        p.y += p.vy

        if (p.y < -10) {
          p.y = height + 10
          p.x = Math.random() * width
          p.vx = (Math.random() - 0.5) * 0.5
          p.vy = 0
        }
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10
      }

      ctx.fillStyle = color
      ctx.globalAlpha = 0.6
      for (const p of particles) {
        if (particleShape === 'circle') {
          ctx.beginPath()
          ctx.arc(p.x, p.y, particleSize, 0, Math.PI * 2)
          ctx.fill()
        } else {
          drawCapsule(p.x, p.y, particleSize)
        }
      }
      ctx.globalAlpha = 1

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
  }, [count, magnetRadius, ringRadius, waveSpeed, waveAmplitude, particleSize, lerpSpeed, color, particleShape])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.85)', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      <div style={{ position: 'relative', zIndex: 1, color: '#fff', fontSize: '1.5rem', fontFamily: 'system-ui, sans-serif', fontWeight: 300, letterSpacing: '0.05em' }}>
        {messages[msgIndex]}
      </div>
    </div>
  )
}
