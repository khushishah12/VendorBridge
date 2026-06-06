"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText,
  Receipt,
  CheckCircle,
  ShoppingCart,
  Building2,
  Bell,
  Sparkles,
  TrendingUp,
  AlertCircle
} from "lucide-react"

import DashboardLayout from "@/components/layout/DashboardLayout"
import AnimatedCounter from "@/components/ui/AnimatedCounter"
import GlassIcons from "@/components/ui/GlassIcons"
import CommandCenter3D from "@/components/ui/CommandCenter3D"
import AiAssistantOrb from "@/components/ui/AiAssistantOrb"
import { subscribeToDemoEvents, startDemoSimulation, stopDemoSimulation, isDemoActive, SimulatedEvent } from "@/lib/demo-orchestrator"

const STATS_INIT = [
  { label: "Active RFQs", value: 24, icon: FileText, change: "+12%", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  { label: "Quotations Pending", value: 18, icon: Receipt, change: "+5%", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  { label: "Pending Approvals", value: 9, icon: CheckCircle, change: "-3%", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  { label: "Active POs", value: 42, icon: ShoppingCart, change: "+8%", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { label: "Total Vendors", value: 156, icon: Building2, change: "+2%", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
]

const INITIAL_ACTIVITIES = [
  { action: "New RFQ created", detail: "Office Supplies - Q3 2025", time: "5 min ago", type: "rfq" },
  { action: "Quotation received", detail: "Acme Corp - Server Hardware", time: "12 min ago", type: "quotation" },
  { action: "PO approved", detail: "PO-2025-0042 - IT Equipment", time: "1 hour ago", type: "approval" },
  { action: "Invoice paid", detail: "INV-2025-0089 - Azure Services", time: "2 hours ago", type: "invoice" },
  { action: "Vendor rating updated", detail: "TechSolutions Inc. - 4.8 ★", time: "3 hours ago", type: "vendor" },
]

export default function ProcurementDashboard() {
  const [demoActive, setDemoActive] = useState(false)
  const [stats, setStats] = useState(STATS_INIT)
  const [activities, setActivities] = useState<any[]>(INITIAL_ACTIVITIES)
  const [toasts, setToasts] = useState<SimulatedEvent[]>([])

  // Load demo status
  useEffect(() => {
    setDemoActive(isDemoActive())
    if (isDemoActive()) {
      startDemoSimulation()
    }

    // Load logs if present
    const saved = localStorage.getItem("vb_activity_logs")
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((l: any) => ({
          action: l.title,
          detail: l.message,
          time: l.timestamp || "Just now",
          type: l.type
        }))
        setActivities(prev => [...parsed.slice(0, 5), ...prev.slice(0, 5 - parsed.length)])
      } catch (e) {}
    }
  }, [])

  // Subscribe to simulated events
  useEffect(() => {
    const unsubscribe = subscribeToDemoEvents((event) => {
      // Add a Toast popup
      setToasts((prev) => [...prev, event])

      // Push activity to listing
      setActivities((prev) => [
        {
          action: event.title,
          detail: event.message,
          time: event.timestamp || "Just now",
          type: event.type,
        },
        ...prev.slice(0, 9),
      ])

      // Increment stats randomly to make it look alive
      setStats((prevStats) =>
        prevStats.map((s) => {
          if (Math.random() > 0.4) {
            const add = Math.floor(Math.random() * 2) + 1
            return { ...s, value: s.value + add }
          }
          return s
        })
      )

      // Auto dismiss toasts
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t !== event))
      }, 4500)
    })

    return () => unsubscribe()
  }, [])

  function toggleDemo() {
    if (demoActive) {
      stopDemoSimulation()
      setDemoActive(false)
    } else {
      startDemoSimulation()
      setDemoActive(true)
    }
  }

  const iconMap: Record<string, typeof FileText> = {
    rfq: FileText,
    quotation: Receipt,
    approval: CheckCircle,
    invoice: ShoppingCart,
    vendor: Building2,
  }

  return (
    <DashboardLayout>
      <div className="relative space-y-8 pb-16">
        
        {/* Toast Popup Overlay */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
          <AnimatePresence>
            {toasts.map((toast, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, x: 50 }}
                className="bg-zinc-950/90 text-white rounded-xl border border-cyan-500/40 p-4 shadow-xl flex items-start gap-3 backdrop-blur pointer-events-auto"
              >
                <div className="mt-0.5 rounded bg-cyan-500/10 p-1.5 text-cyan-400">
                  <Bell className="h-4 w-4 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wide text-cyan-400">
                    {toast.title}
                  </h4>
                  <p className="text-xs text-zinc-300 mt-1 leading-relaxed">{toast.message}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Dashboard Title & Demo Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Procurement Command Center
            </h1>
            <p className="mt-1.5 text-sm text-zinc-500 dark:text-cyan-400 font-medium">
              Transforming procurement into strategic advantage.
            </p>
          </div>

          {/* Hackathon Demo toggle */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
              Demo Simulation Mode
            </span>
            <button
              onClick={toggleDemo}
              className={`relative h-6 w-11 rounded-full p-0.5 transition-colors duration-300 ${
                demoActive ? "bg-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.4)]" : "bg-zinc-300 dark:bg-zinc-800"
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
                  demoActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* 3D Visual Hero Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* 3D Network Twin (Takes 2 Columns) */}
          <div className="relative h-72 rounded-2xl overflow-hidden lg:col-span-2 shadow-lg">
            <CommandCenter3D />
          </div>

          {/* AI Assistant Column */}
          <div className="flex flex-col h-72 justify-between">
            <div className="rounded-2xl border border-zinc-200 bg-white/40 p-5 shadow-md dark:border-zinc-850 dark:bg-zinc-950/20 backdrop-blur-xl h-full flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#6EE7FF]" /> Sourcing Assistant
                </h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Real-time cognitive parsing of RFQ responses and supplier performance ratings.
                </p>
              </div>

              {/* Glowing Orb component */}
              <div className="mt-4 flex justify-center">
                <AiAssistantOrb />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Metric Counter Widgets */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-md dark:border-zinc-800 dark:bg-zinc-950/40 backdrop-blur-sm transition-all"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-xl p-2 border ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  {stat.change}
                </span>
              </div>
              <p className="mt-4 text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                <AnimatedCounter value={stat.value} />
              </p>
              <p className="mt-1 text-xs font-bold text-zinc-400 uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Dashboard Quick Action GlassIcons */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-400">
            Operations Launchpad
          </h3>
          <GlassIcons />
        </div>

        {/* Charts and Activity Logs Split Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Animated Charts (2 columns) */}
          <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-950/40 backdrop-blur-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Spending Trends</h3>
              <p className="text-xs text-zinc-400">Comparison of procurement invoices by departments</p>
            </div>

            {/* Custom SVG Bar Chart with entry hover animations */}
            <div className="relative h-44 flex items-end gap-6 justify-around pt-6 border-b border-zinc-800/80 border-dashed">
              {[
                { name: "IT Assets", val: 82, color: "bg-blue-500", spend: "$820k" },
                { name: "Raw Goods", val: 95, color: "bg-purple-500", spend: "$950k" },
                { name: "Services", val: 40, color: "bg-cyan-500", spend: "$400k" },
                { name: "Office Assets", val: 24, color: "bg-orange-500", spend: "$240k" },
                { name: "Logistics", val: 56, color: "bg-emerald-500", spend: "$560k" },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center group relative">
                  {/* Tooltip */}
                  <div className="absolute -top-8 bg-zinc-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {bar.spend}
                  </div>
                  
                  {/* Visual animated bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${bar.val}%` }}
                    transition={{ delay: i * 0.1, duration: 0.8 }}
                    className={`w-full max-w-[32px] rounded-t-lg ${bar.color} opacity-80 group-hover:opacity-100 shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all`}
                  />
                  <span className="text-[10px] text-zinc-400 font-bold mt-2 truncate w-full text-center">
                    {bar.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Logs (1 column) */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-950/40 backdrop-blur-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Recent Activity</h3>
              <p className="text-xs text-zinc-400 mb-4">Operations audit records</p>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto max-h-60 pr-1 scrollbar-thin">
              <AnimatePresence initial={false}>
                {activities.map((activity, i) => {
                  const Icon = iconMap[activity.type] ?? AlertCircle
                  return (
                    <motion.div
                      key={activity.action + i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-start gap-3 border-b border-zinc-100 dark:border-zinc-800/80 pb-3 last:border-0"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800/40 text-zinc-400 border border-zinc-800">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">{activity.action}</p>
                        <p className="text-[10px] text-zinc-400 truncate mt-0.5">{activity.detail}</p>
                      </div>
                      <span className="text-[9px] text-zinc-500 font-medium shrink-0">{activity.time}</span>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  )
}
