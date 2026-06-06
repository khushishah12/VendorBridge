"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useRoleGuard, getHomeForRole } from "@/lib/route-guard"
import Antigravity from "@/components/ui/Antigravity"

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { authorized, loading } = useRoleGuard()

  useEffect(() => {
    if (!loading && !authorized) {
      const role = localStorage.getItem("vb_role") || "procurement"
      router.replace(getHomeForRole(role))
    }
  }, [authorized, loading, router])

  if (loading) {
    return (
      <Antigravity
        count={300}
        magnetRadius={6}
        ringRadius={8}
        waveSpeed={0.5}
        waveAmplitude={1.2}
        particleSize={1.5}
        lerpSpeed={0.06}
        color="#6EE7FF"
        particleShape="capsule"
        messages={["Verifying access...", "Checking permissions...", "Loading your workspace..."]}
      />
    )
  }

  if (!authorized) {
    return (
      <Antigravity
        count={300}
        magnetRadius={6}
        ringRadius={8}
        waveSpeed={0.5}
        waveAmplitude={1.2}
        particleSize={1.5}
        lerpSpeed={0.06}
        color="#F87171"
        particleShape="capsule"
        messages={["Redirecting...", "Taking you to your dashboard...", "One moment..."]}
      />
    )
  }

  return <>{children}</>
}
