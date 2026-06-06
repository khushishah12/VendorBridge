"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"
import RouteGuard from "./RouteGuard"
import ClickSpark from "@/components/ui/ClickSpark"
import Antigravity from "@/components/ui/Antigravity"
import PageTransition from "@/components/ui/PageTransition"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [role, setRole] = useState<string>("procurement")
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    setRole(localStorage.getItem("vb_role") || "procurement")
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <Antigravity
        count={500}
        magnetRadius={8}
        ringRadius={10}
        waveSpeed={0.6}
        waveAmplitude={1.5}
        particleSize={1.8}
        lerpSpeed={0.08}
        color="#6EE7FF"
        particleShape="capsule"
      />
    )
  }

  return (
    <RouteGuard>
      <ClickSpark
        sparkColor="#6EE7FF"
        sparkSize={12}
        sparkRadius={22}
        sparkCount={10}
        duration={500}
        extraScale={1.2}
      />
      <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-900 relative">
        {/* Ambient background glow */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
          <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
          <div className="absolute left-1/2 top-1/3 h-[300px] w-[300px] rounded-full bg-purple-500/5 blur-3xl animate-blob" style={{ animationDelay: "4s" }} />
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar role={role} />
        </div>

        {/* Mobile Sidebar Drawer */}
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              <Sidebar role={role} />
            </motion.div>
          </>
        )}

        {/* Main Content */}
        <div className="flex flex-1 flex-col lg:ml-64">
          <Topbar onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} role={role} />
          <main className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              <PageTransition key={pathname}>
                {children}
              </PageTransition>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </RouteGuard>
  )
}
