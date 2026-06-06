"use client"

import { useEffect, useRef, useState } from "react"

interface Node3D {
  x: number
  y: number
  z: number
  px: number // projected x
  py: number // projected y
  label: string
  color: string
  pulseScale: number
  pulseSpeed: number
}

interface Connection {
  from: number
  to: number
  activity: number // 0 to 1 flow
}

const NODES_DATA = [
  { label: "Procurement HQ", color: "#6EE7FF" },
  { label: "Acme Corp (Vendor)", color: "#FBBF24" },
  { label: "TechSolutions (Vendor)", color: "#FBBF24" },
  { label: "Manager Review Portal", color: "#A78BFA" },
  { label: "Finance Audit Node", color: "#34D399" },
  { label: "Logistics Hub", color: "#60A5FA" },
  { label: "Global Shipping Co", color: "#F87171" },
  { label: "Digital Invoice Vault", color: "#F59E0B" },
]

export default function CommandCenter3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const nodesRef = useRef<Node3D[]>([])
  const connectionsRef = useRef<Connection[]>([])
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })
  const pulseTriggerRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const container = canvas.parentElement!
    let width = container.clientWidth
    let height = container.clientHeight
    canvas.width = width
    canvas.height = height

    // Initialize 3D nodes in a sphere configuration
    const nodes = nodesRef.current
    if (nodes.length === 0) {
      NODES_DATA.forEach((n, idx) => {
        const phi = Math.acos(-1 + (2 * idx) / NODES_DATA.length)
        const theta = Math.sqrt(NODES_DATA.length * Math.PI) * phi
        const radius = 120

        nodes.push({
          x: radius * Math.cos(theta) * Math.sin(phi),
          y: radius * Math.sin(theta) * Math.sin(phi),
          z: radius * Math.cos(phi),
          px: 0,
          py: 0,
          label: n.label,
          color: n.color,
          pulseScale: 1.0,
          pulseSpeed: 0.02 + Math.random() * 0.02,
        })
      })

      // Establish connections
      const connections = connectionsRef.current
      connections.push({ from: 0, to: 1, activity: 0.1 })
      connections.push({ from: 0, to: 2, activity: 0.3 })
      connections.push({ from: 0, to: 3, activity: 0.6 })
      connections.push({ from: 3, to: 4, activity: 0.8 })
      connections.push({ from: 4, to: 5, activity: 0.2 })
      connections.push({ from: 5, to: 6, activity: 0.4 })
      connections.push({ from: 4, to: 7, activity: 0.5 })
      connections.push({ from: 1, to: 7, activity: 0.9 })
    }

    // Set up mouse listeners
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.targetX = (e.clientX - rect.left - width / 2) * 0.05
      mouseRef.current.targetY = (e.clientY - rect.top - height / 2) * 0.05
    }
    window.addEventListener("mousemove", handleMouseMove)

    // Listen to simulated event pulses from demo orchestrator
    const handleEventPulse = () => {
      pulseTriggerRef.current = 1.0
      // Boost the pulse size of random nodes
      nodes.forEach((node) => {
        if (Math.random() > 0.5) {
          node.pulseScale = 2.0
        }
      })
    }
    window.addEventListener("vb-event-pulse", handleEventPulse)

    // 3D rotation angles
    let angleX = 0.003
    let angleY = 0.003

    function rotate3D() {
      // Smoothly interpolate mouse tilt values
      const m = mouseRef.current
      m.x += (m.targetX - m.x) * 0.05
      m.y += (m.targetY - m.y) * 0.05

      // Add mouse movement tilt to basic continuous rotation
      const currentAngleX = angleX + m.y * 0.0003
      const currentAngleY = angleY + m.x * 0.0003

      const cosX = Math.cos(currentAngleX)
      const sinX = Math.sin(currentAngleX)
      const cosY = Math.cos(currentAngleY)
      const sinY = Math.sin(currentAngleY)

      nodes.forEach((node) => {
        // Rotate around Y axis
        let x1 = node.x * cosY - node.z * sinY
        let z1 = node.z * cosY + node.x * sinY

        // Rotate around X axis
        let y2 = node.y * cosX - z1 * sinX
        let z2 = z1 * cosX + node.y * sinX

        node.x = x1
        node.y = y2
        node.z = z2

        // Project onto 2D viewport
        const focalLength = 300
        const perspective = focalLength / (focalLength + node.z)
        node.px = width / 2 + node.x * perspective
        node.py = height / 2 + node.y * perspective
      })
    }

    function draw(t: number) {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)

      // Apply physics/rotation
      rotate3D()

      // Decay pulse trigger
      if (pulseTriggerRef.current > 0.01) {
        pulseTriggerRef.current *= 0.95
      }

      const connections = connectionsRef.current

      // Draw Connections (lines between 3D nodes)
      connections.forEach((conn) => {
        const fromNode = nodes[conn.from]
        const toNode = nodes[conn.to]
        if (!fromNode || !toNode) return

        // Calculate line depth fade
        const avgZ = (fromNode.z + toNode.z) / 2
        const alpha = Math.max(0.05, 1 - (avgZ + 150) / 300)

        // Set line styles
        ctx.beginPath()
        ctx.moveTo(fromNode.px, fromNode.py)
        ctx.lineTo(toNode.px, toNode.py)
        ctx.strokeStyle = `rgba(110, 231, 255, ${alpha * 0.25})`
        ctx.lineWidth = 1
        ctx.stroke()

        // Move connection light signal particle
        conn.activity = (conn.activity + 0.005) % 1.0
        const activeX = fromNode.px + (toNode.px - fromNode.px) * conn.activity
        const activeY = fromNode.py + (toNode.py - fromNode.py) * conn.activity

        ctx.beginPath()
        ctx.arc(activeX, activeY, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = "#6EE7FF"
        ctx.shadowColor = "#6EE7FF"
        ctx.shadowBlur = 10
        ctx.fill()
        ctx.shadowBlur = 0 // reset shadow
      })

      // Sort nodes back-to-front so closer ones render on top
      const sorted = [...nodes].sort((a, b) => b.z - a.z)

      // Draw Nodes
      sorted.forEach((node) => {
        const scale = Math.max(0.3, 1 - (node.z + 150) / 300)
        const radius = 6 * scale

        // Update node local pulse
        if (node.pulseScale > 1.0) {
          node.pulseScale -= 0.04
        } else {
          node.pulseScale = 1.0 + Math.sin(t * 0.005 * node.pulseSpeed) * 0.15
        }

        const size = radius * node.pulseScale

        // Draw node outer glow ring
        ctx.beginPath()
        ctx.arc(node.px, node.py, size * 2.2, 0, Math.PI * 2)
        ctx.strokeStyle = node.color
        ctx.globalAlpha = 0.15 * scale
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Draw node core
        ctx.beginPath()
        ctx.arc(node.px, node.py, size, 0, Math.PI * 2)
        ctx.fillStyle = node.color
        ctx.globalAlpha = 0.85 * scale
        ctx.fill()

        // Draw node label
        ctx.font = `300 ${Math.max(9, 11 * scale)}px system-ui, sans-serif`
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.3, scale)})`
        ctx.textAlign = "center"
        ctx.fillText(node.label, node.px, node.py - size * 2.8)
      })

      ctx.globalAlpha = 1.0
      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)

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
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("vb-event-pulse", handleEventPulse)
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div className="absolute inset-0 z-0 h-full w-full bg-zinc-950/80 overflow-hidden rounded-2xl border border-zinc-800/40 backdrop-blur-sm">
      <div className="absolute left-6 top-6 z-10 flex flex-col gap-1 pointer-events-none">
        <span className="text-[10px] uppercase tracking-widest text-[#6EE7FF] font-semibold bg-[#6EE7FF]/10 border border-[#6EE7FF]/20 px-2.5 py-0.5 rounded-full w-max">
          Procurement Network Twin
        </span>
        <h4 className="text-sm font-bold text-white">Live Operations Ecosystem</h4>
      </div>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-75" />
    </div>
  )
}
