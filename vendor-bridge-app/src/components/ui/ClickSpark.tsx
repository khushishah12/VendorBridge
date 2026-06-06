"use client"

import { useState, useEffect, useRef } from "react"

interface ClickSparkProps {
  sparkColor?: string
  sparkSize?: number
  sparkRadius?: number
  sparkCount?: number
  duration?: number
  extraScale?: number
}

interface Spark {
  angle: number
  radius: number
}

interface SparkGroup {
  id: number
  x: number
  y: number
  sparks: Spark[]
  createdAt: number
}

export default function ClickSpark({
  sparkColor = "#6EE7FF",
  sparkSize = 12,
  sparkRadius = 22,
  sparkCount = 10,
  duration = 500,
  extraScale = 1.2,
}: ClickSparkProps) {
  const [groups, setGroups] = useState<SparkGroup[]>([])
  const nowRef = useRef(0)
  const rafRef = useRef(0)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newGroup: SparkGroup = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
        sparks: Array.from({ length: sparkCount }, () => ({
          angle: Math.random() * Math.PI * 2,
          radius: sparkRadius * (0.8 + Math.random() * 0.4),
        })),
        createdAt: performance.now(),
      }
      setGroups((prev) => [...prev, newGroup])
    }

    document.addEventListener("click", handleClick)

    const animate = () => {
      nowRef.current = performance.now()
      setGroups((prev) =>
        prev.filter((g) => nowRef.current - g.createdAt < duration)
      )
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener("click", handleClick)
      cancelAnimationFrame(rafRef.current)
    }
  }, [sparkCount, sparkRadius, duration])

  return (
    <svg className="pointer-events-none fixed inset-0 z-[9999] h-full w-full">
      {groups.map((group) => {
        const elapsed = nowRef.current - group.createdAt
        const progress = Math.min(elapsed / duration, 1)
        const scale = 1 + (extraScale - 1) * progress
        const lengthFactor = Math.sin(progress * Math.PI)
        const opacity = 1 - progress
        return group.sparks.map((spark, i) => {
          const length = spark.radius * lengthFactor * scale
          const x2 = group.x + Math.cos(spark.angle) * length
          const y2 = group.y + Math.sin(spark.angle) * length
          return (
            <line
              key={`${group.id}-${i}`}
              x1={group.x}
              y1={group.y}
              x2={x2}
              y2={y2}
              stroke={sparkColor}
              strokeWidth={sparkSize}
              strokeLinecap="round"
              opacity={opacity}
            />
          )
        })
      })}
    </svg>
  )
}
