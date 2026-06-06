"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  BarChart3,
  TrendingUp,
  FileSpreadsheet,
  Download,
  Calendar,
  Sparkles,
  PieChart,
  GitPullRequest,
  CheckCircle2,
  DollarSign
} from "lucide-react"

import DashboardLayout from "@/components/layout/DashboardLayout"
import Antigravity from "@/components/ui/Antigravity"
import AnimatedCounter from "@/components/ui/AnimatedCounter"

export default function ExecutiveReportsPage() {
  const [exporting, setExporting] = useState<string | null>(null)

  function triggerExport(type: string) {
    setExporting(type)
    setTimeout(() => {
      setExporting(null)
      alert(`Executive report successfully exported as ${type.toUpperCase()}!`)
    }, 2000)
  }

  return (
    <DashboardLayout>
      <div className="relative space-y-8 pb-16 min-h-screen">
        
        {/* Antigravity background subtle particles */}
        <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden rounded-3xl opacity-35 bg-zinc-950/20">
          <Antigravity
            count={120}
            color="#A78BFA"
            magnetRadius={5}
            ringRadius={8}
            waveSpeed={0.4}
            waveAmplitude={0.8}
            particleSize={1.2}
            autoAnimate={true}
            particleVariance={0.5}
            rotationSpeed={0.05}
            depthFactor={1.5}
            messages={[]}
          />
        </div>

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-6 relative z-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Executive Analytics Room
            </h1>
            <p className="mt-1 text-sm text-zinc-550 dark:text-cyan-400 font-semibold">
              Discover insights hidden in procurement and supplier transactions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => triggerExport("pdf")}
              disabled={!!exporting}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-350 dark:border-zinc-800 px-4 py-2.5 text-xs font-bold hover:bg-zinc-900 transition-colors"
            >
              <Download className="h-4 w-4" /> PDF Report
            </button>
            <button
              onClick={() => triggerExport("excel")}
              disabled={!!exporting}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-350 dark:border-zinc-800 px-4 py-2.5 text-xs font-bold hover:bg-zinc-900 transition-colors"
            >
              <FileSpreadsheet className="h-4 w-4" /> Excel
            </button>
            <button
              onClick={() => triggerExport("csv")}
              disabled={!!exporting}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-350 dark:border-zinc-800 px-4 py-2.5 text-xs font-bold hover:bg-zinc-900 transition-colors"
            >
              <Download className="h-4 w-4" /> CSV
            </button>
          </div>
        </div>

        {/* Export loading spinner */}
        {exporting && (
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 px-4 py-2.5 text-sm font-bold text-indigo-400 animate-pulse">
            Compiling and rendering analytical data into {exporting.toUpperCase()} format...
          </div>
        )}

        {/* Floating Metrics grid */}
        <div className="grid gap-4 sm:grid-cols-4 relative z-10">
          {[
            { label: "Sourcing Savings", value: 420000, prefix: "$", icon: TrendingUp, color: "text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)] border-emerald-500/20" },
            { label: "Vendor Compliance", value: 96, suffix: "%", icon: CheckCircle2, color: "text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)] border-blue-500/20" },
            { label: "Cycle Sourcing Time", value: 14, suffix: " Days", icon: Calendar, color: "text-purple-400 shadow-[0_0_15px_rgba(167,139,250,0.1)] border-purple-500/20" },
            { label: "Approval Throughput", value: 92, suffix: "%", icon: GitPullRequest, color: "text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)] border-cyan-500/20" },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className={`rounded-2xl border bg-zinc-950/40 p-5 backdrop-blur shadow-md ${card.color}`}
            >
              <div className="flex justify-between items-center text-zinc-450 text-[10px] font-bold uppercase tracking-wider">
                <span>{card.label}</span>
                <card.icon className="h-4 w-4" />
              </div>
              <h3 className="mt-3 text-3xl font-black text-white font-mono flex items-center">
                {card.prefix && <span>{card.prefix}</span>}
                <AnimatedCounter value={card.value} />
                {card.suffix && <span className="text-sm font-semibold ml-1">{card.suffix}</span>}
              </h3>
            </motion.div>
          ))}
        </div>

        {/* Analytic Chart visualizations */}
        <div className="grid gap-6 md:grid-cols-2 relative z-10">
          
          {/* Spend Analysis Chart */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/40 p-6 backdrop-blur shadow-md space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">Spend Distribution</h3>
                <p className="text-xs text-zinc-400">Department outlay share</p>
              </div>
              <PieChart className="h-5 w-5 text-indigo-400" />
            </div>

            <div className="space-y-3 pt-4">
              {[
                { name: "IT & Software", percent: 45, width: "w-[45%]", color: "bg-blue-500", total: "$1.2M" },
                { name: "Facilities Management", percent: 25, width: "w-[25%]", color: "bg-purple-500", total: "$620k" },
                { name: "Logistics", percent: 20, width: "w-[20%]", color: "bg-emerald-500", total: "$510k" },
                { name: "Office Stationery", percent: 10, width: "w-[10%]", color: "bg-orange-500", total: "$240k" },
              ].map((row, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between text-zinc-700 dark:text-zinc-300 font-medium">
                    <span>{row.name}</span>
                    <span>{row.total} ({row.percent}%)</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-800/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${row.percent}%` }}
                      transition={{ delay: idx * 0.15, duration: 1 }}
                      className={`h-full rounded-full ${row.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Efficiency Analytics */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/40 p-6 backdrop-blur shadow-md space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">Workflow SLA Efficiency</h3>
                <p className="text-xs text-zinc-400">Audit response rates by roles</p>
              </div>
              <BarChart3 className="h-5 w-5 text-cyan-400" />
            </div>

            <div className="space-y-3 pt-4">
              {[
                { role: "Procurement Officers", compliance: 98, color: "bg-cyan-400", time: "1.2 Days" },
                { role: "Managers / Reviewers", compliance: 88, color: "bg-purple-400", time: "2.4 Days" },
                { role: "Finance Approvers", compliance: 92, color: "bg-emerald-400", time: "1.9 Days" },
                { role: "Directors / Board", compliance: 74, color: "bg-orange-400", time: "4.5 Days" },
              ].map((row, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between text-zinc-700 dark:text-zinc-300 font-medium">
                    <span>{row.role}</span>
                    <span>Avg Time: {row.time}</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-800/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${row.compliance}%` }}
                      transition={{ delay: idx * 0.15, duration: 1 }}
                      className={`h-full rounded-full ${row.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  )
}
