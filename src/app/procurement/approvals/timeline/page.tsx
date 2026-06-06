"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  FileText,
  UserCheck,
  CreditCard,
  Building2,
  ShoppingCart,
  Play,
  CheckCircle,
  AlertTriangle,
  RotateCcw
} from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"

interface RailStage {
  label: string
  sub: string
  icon: any
  state: "completed" | "active" | "pending" | "rejected"
}

interface WorkflowItem {
  id: string
  title: string
  stages: RailStage[]
}

const WORKFLOWS: WorkflowItem[] = [
  {
    id: "RFQ-2026-9102",
    title: "GPU Infrastructure Sourcing",
    stages: [
      { label: "RFQ Created", sub: "Sarah Chen", icon: FileText, state: "completed" },
      { label: "Manager Review", sub: "Ananya Gupta", icon: UserCheck, state: "completed" },
      { label: "Finance Approval", sub: "Rajesh Kumar", icon: CreditCard, state: "active" },
      { label: "Director Approval", sub: "VP Sourcing", icon: Building2, state: "pending" },
      { label: "PO Generated", sub: "Auto Dispatch", icon: ShoppingCart, state: "pending" },
    ],
  },
  {
    id: "RFQ-2026-0042",
    title: "Cloud Subscriptions Renewal",
    stages: [
      { label: "RFQ Created", sub: "System Auto", icon: FileText, state: "completed" },
      { label: "Manager Review", sub: "Ananya Gupta", icon: UserCheck, state: "completed" },
      { label: "Finance Approval", sub: "Rajesh Kumar", icon: CreditCard, state: "completed" },
      { label: "Director Approval", sub: "VP Sourcing", icon: Building2, state: "completed" },
      { label: "PO Generated", sub: "PO-2026-0819", icon: ShoppingCart, state: "completed" },
    ],
  },
  {
    id: "RFQ-2026-3042",
    title: "Corporate Hub Furniture",
    stages: [
      { label: "RFQ Created", sub: "Priya Sharma", icon: FileText, state: "completed" },
      { label: "Manager Review", sub: "Ananya Gupta", icon: UserCheck, state: "rejected" },
      { label: "Finance Approval", sub: "—", icon: CreditCard, state: "pending" },
      { label: "Director Approval", sub: "—", icon: Building2, state: "pending" },
      { label: "PO Generated", sub: "—", icon: ShoppingCart, state: "pending" },
    ],
  },
]

export default function ApprovalTimelinePage() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowItem>(WORKFLOWS[0])
  const [timelineStages, setTimelineStages] = useState<RailStage[]>(WORKFLOWS[0].stages)
  
  // Animation play simulation
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeStepIndex, setActiveStepIndex] = useState(0)

  useEffect(() => {
    setTimelineStages(selectedWorkflow.stages)
    setIsPlaying(false)
  }, [selectedWorkflow])

  function triggerSimulation() {
    setIsPlaying(true)
    setActiveStepIndex(0)

    // Sequence stages completion
    const length = selectedWorkflow.stages.length
    let current = 0

    const interval = setInterval(() => {
      if (current >= length - 1) {
        clearInterval(interval)
        setIsPlaying(false)
      } else {
        current++
        setActiveStepIndex(current)
      }
    }, 1200)
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
          <div>
            <Link href="/procurement/approvals" className="mb-2 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
              <ArrowLeft className="h-4 w-4" /> Back to Approvals
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Railway Approval Timelines
            </h1>
            <p className="mt-1 text-sm text-zinc-550 dark:text-cyan-400 font-semibold">
              Trace active procurement routes and milestones in real-time.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={triggerSimulation}
              disabled={isPlaying}
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-xs font-bold text-white shadow-md disabled:opacity-40"
            >
              <Play className="h-4 w-4" /> Trace Workflow Pathway
            </button>
            <button
              onClick={() => setTimelineStages(selectedWorkflow.stages)}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-350 dark:border-zinc-800 px-4 py-2.5 text-xs font-bold hover:bg-zinc-900"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </div>
        </div>

        {/* Workflow Switch Selector */}
        <div className="flex flex-wrap gap-2">
          {WORKFLOWS.map((wf) => (
            <button
              key={wf.id}
              onClick={() => setSelectedWorkflow(wf)}
              className={`rounded-xl border px-4 py-2.5 text-xs font-bold transition-all ${
                selectedWorkflow.id === wf.id
                  ? "border-cyan-500 bg-cyan-950/20 text-cyan-400 shadow-sm"
                  : "border-zinc-300 dark:border-zinc-850 text-zinc-500"
              }`}
            >
              {wf.title} ({wf.id})
            </button>
          ))}
        </div>

        {/* FUTURISTIC RAILWAY timeline BOARD */}
        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 shadow-md relative overflow-hidden">
          
          {/* Subtle neon grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

          <div className="relative flex flex-col md:flex-row justify-between items-center w-full min-h-[160px] gap-8 md:gap-0">
            
            {timelineStages.map((stage, idx) => {
              const StageIcon = stage.icon
              const isLast = idx === timelineStages.length - 1
              
              // Handle active states from play simulator or original states
              let currentState = stage.state
              if (isPlaying) {
                currentState = idx === activeStepIndex ? "active" : idx < activeStepIndex ? "completed" : "pending"
              }

              // Apply color variables
              const glowClass =
                currentState === "completed"
                  ? "border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-emerald-950/20"
                  : currentState === "active"
                  ? "border-cyan-400 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)] bg-cyan-950/40 animate-pulse"
                  : currentState === "rejected"
                  ? "border-red-500 text-red-500 shadow-[0_0_25px_rgba(239,68,68,0.5)] bg-red-950/30 animate-shake"
                  : "border-zinc-800 text-zinc-650 bg-zinc-900/40"

              return (
                <div key={idx} className="flex-1 flex flex-col items-center relative w-full">
                  
                  {/* Railway track lines between stages */}
                  {!isLast && (
                    <div className="absolute top-7 left-[55%] right-[-45%] h-1 bg-zinc-800 -z-10 rounded-full overflow-hidden hidden md:block">
                      {/* Flowing Energy Pulse animation */}
                      {currentState === "completed" && (
                        <motion.div
                          animate={{ x: ["-100%", "200%"] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                          className="h-full w-24 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
                        />
                      )}
                      {currentState === "active" && (
                        <motion.div
                          animate={{ x: ["-100%", "200%"] }}
                          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                          className="h-full w-24 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                        />
                      )}
                    </div>
                  )}

                  {/* Stage Node */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl border-2 transition-all duration-300 z-10 ${glowClass}`}
                  >
                    <StageIcon className="h-6 w-6" />
                  </motion.div>

                  {/* Text descriptions */}
                  <div className="text-center mt-4 space-y-0.5">
                    <p className={`text-sm font-bold ${currentState === "rejected" ? "text-red-400" : "text-white"}`}>
                      {stage.label}
                    </p>
                    <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">{stage.sub}</p>
                    <span className={`inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mt-1.5 ${
                      currentState === "completed" ? "bg-emerald-500/10 text-emerald-400" :
                      currentState === "active" ? "bg-cyan-500/10 text-cyan-400" :
                      currentState === "rejected" ? "bg-red-500/10 text-red-400" : "bg-zinc-800 text-zinc-500"
                    }`}>
                      {currentState}
                    </span>
                  </div>

                  {/* Red Fracture Transition Indicator on reject */}
                  {currentState === "rejected" && (
                    <div className="absolute top-20 text-[10px] text-red-500 font-extrabold tracking-wider bg-red-950/30 border border-red-500/20 px-2 py-0.5 rounded mt-1">
                      ! CRITICAL STOPPAGE
                    </div>
                  )}

                </div>
              )
            })}

          </div>

        </div>

      </div>
    </DashboardLayout>
  )
}
