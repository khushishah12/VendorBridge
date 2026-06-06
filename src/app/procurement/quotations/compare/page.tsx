"use client"

import { Suspense, useState, useMemo } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Trophy,
  Clock,
  DollarSign,
  Star,
  CheckCircle2,
  Send,
  XCircle,
  Sparkles,
  Zap,
  Shield,
  FileCheck
} from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"

interface QuotationItem {
  name: string
  qty: number
  unit: string
  price: number
}

interface QuotationCompare {
  id: string
  vendor: string
  totalAmount: number
  deliveryTimeline: number // in days
  warranty: string
  rating: number
  compliance: number // percentage
  pastOrders: number
  items: QuotationItem[]
}

const COMPARISON_DATA: QuotationCompare[] = [
  {
    id: "QTN-2026-0101",
    vendor: "TechSolutions Inc.",
    totalAmount: 184500,
    deliveryTimeline: 15,
    warranty: "3 Years Comprehensive",
    rating: 4.9,
    compliance: 98,
    pastOrders: 24,
    items: [{ name: "NVIDIA H100 GPU Nodes", qty: 30, unit: "pcs", price: 6150 }],
  },
  {
    id: "QTN-2026-0102",
    vendor: "Acme Corp",
    totalAmount: 192000,
    deliveryTimeline: 30,
    warranty: "2 Years Standard",
    rating: 4.2,
    compliance: 92,
    pastOrders: 15,
    items: [{ name: "NVIDIA H100 GPU Nodes", qty: 30, unit: "pcs", price: 6400 }],
  },
  {
    id: "QTN-2026-0103",
    vendor: "ServicePro Ltd.",
    totalAmount: 178500,
    deliveryTimeline: 12,
    warranty: "3 Years comprehensive + On-site support",
    rating: 4.7,
    compliance: 96,
    pastOrders: 19,
    items: [{ name: "NVIDIA H100 GPU Nodes", qty: 30, unit: "pcs", price: 5950 }],
  },
]

function CompareContent() {
  const searchParams = useSearchParams()
  const selectedIds = searchParams.get("ids")?.split(",").filter(Boolean) || []

  const [selectedWinner, setSelectedWinner] = useState<string | null>("ServicePro Ltd.")
  const [sentMsg, setSentMsg] = useState(false)

  const data = useMemo(() => {
    if (selectedIds.length === 0) return COMPARISON_DATA
    return COMPARISON_DATA.filter((q) => selectedIds.includes(q.id))
  }, [selectedIds])

  // Automatically find optimal AI recommendation
  const aiRecommendedVendor = useMemo(() => {
    // Score formula = rating * 30 + compliance - price / 5000 - delivery * 2
    let bestScore = -Infinity
    let bestVendor = ""
    data.forEach((q) => {
      const score = q.rating * 35 + q.compliance - q.totalAmount / 4000 - q.deliveryTimeline * 1.5
      if (score > bestScore) {
        bestScore = score
        bestVendor = q.vendor
      }
    })
    return bestVendor
  }, [data])

  const lowestPrice = useMemo(() => Math.min(...data.map((q) => q.totalAmount)), [data])
  const fastestDelivery = useMemo(() => Math.min(...data.map((q) => q.deliveryTimeline)), [data])
  const topRating = useMemo(() => Math.max(...data.map((q) => q.rating)), [data])

  function handleSendApproval() {
    setSentMsg(true)
    setTimeout(() => {
      setSentMsg(false)
      alert(`Approval workflow initiated for ${selectedWinner}!`)
    }, 1500)
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
          <div>
            <Link href="/procurement/quotations" className="mb-2 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
              <ArrowLeft className="h-4 w-4" /> Back to Quotations
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Bidding Compare Engine
            </h1>
            <p className="mt-1 text-sm text-zinc-550 dark:text-cyan-400 font-semibold">
              Quotation analysis for RFQ-2026-9024 IT Infrastructure
            </p>
          </div>

          <div className="flex items-center gap-3">
            {selectedWinner && (
              <motion.button
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                onClick={handleSendApproval}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:scale-[1.01] transition-all"
              >
                <Send className="h-4 w-4" /> Send Winner for Approval
              </motion.button>
            )}
          </div>
        </div>

        {/* Success message banner */}
        {sentMsg && (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-4 text-sm font-bold text-emerald-400 flex items-center gap-2 animate-pulse">
            <CheckCircle2 className="h-5 w-5" /> Winning proposal routed to Manager Queue.
          </div>
        )}

        {/* Battle Cards Grid */}
        <div className="grid gap-6 md:grid-cols-3 pt-6 items-start">
          {data.map((q) => {
            const isAiRec = q.vendor === aiRecommendedVendor
            const isWinner = selectedWinner === q.vendor

            return (
              <motion.div
                key={q.vendor}
                layout
                animate={{
                  y: isWinner ? -15 : 0,
                  boxShadow: isWinner
                    ? "0 20px 40px rgba(167, 139, 250, 0.2)"
                    : "0 4px 6px rgba(0,0,0,0.05)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`relative rounded-3xl border p-6 flex flex-col justify-between overflow-hidden cursor-pointer ${
                  isWinner
                    ? "border-purple-500/80 bg-zinc-950/80 dark:bg-zinc-950/90 text-white"
                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white"
                }`}
                onClick={() => setSelectedWinner(q.vendor)}
              >
                {/* Light Beam Sweep overlay for winner */}
                {isWinner && (
                  <div className="absolute inset-0 pointer-events-none -z-10">
                    {/* Glowing neon halo backdrop */}
                    <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl" />
                    <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl" />
                    {/* Light Sweep ray animation */}
                    <motion.div
                      animate={{
                        x: ["-100%", "200%"],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 3,
                        ease: "linear",
                      }}
                      className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
                    />
                  </div>
                )}

                {/* AI Rec Badge */}
                {isAiRec && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-[#6EE7FF]/10 border border-[#6EE7FF]/30 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase text-[#6EE7FF] tracking-wider animate-pulse">
                    <Sparkles className="h-3 w-3" /> AI Recommended
                  </div>
                )}

                {/* Card Header */}
                <div className="space-y-1 pb-4 border-b border-zinc-155 dark:border-zinc-850">
                  <span className="text-[10px] text-zinc-400 font-mono tracking-widest font-bold">PROPOSAL CARD</span>
                  <h3 className="text-xl font-extrabold tracking-tight">{q.vendor}</h3>
                  <p className="text-xs text-zinc-500 font-semibold">{q.id}</p>
                </div>

                {/* Main Battle Metrics */}
                <div className="py-6 space-y-4 flex-1">
                  
                  {/* Total Bid Amount */}
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-450 font-bold uppercase tracking-wider">Total Proposed Bid</span>
                    <span className={`text-2xl font-black ${q.totalAmount === lowestPrice ? "text-emerald-400" : ""}`}>
                      ${q.totalAmount.toLocaleString()}
                    </span>
                  </div>

                  {/* Delivery Timeline */}
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-450 font-bold uppercase tracking-wider">Delivery Timeline</span>
                    <span className={`text-sm font-bold flex items-center gap-1 ${q.deliveryTimeline === fastestDelivery ? "text-cyan-400" : ""}`}>
                      <Clock className="h-4 w-4" /> {q.deliveryTimeline} Days
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-450 font-bold uppercase tracking-wider">SLA Trust Rating</span>
                    <span className={`text-sm font-bold flex items-center gap-1 ${q.rating === topRating ? "text-amber-400" : ""}`}>
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {q.rating.toFixed(1)} / 5.0
                    </span>
                  </div>

                  {/* Compliance */}
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-450 font-bold uppercase tracking-wider">Specs Compliance</span>
                    <span className="text-sm font-bold flex items-center gap-1">
                      <FileCheck className="h-4 w-4 text-indigo-400" /> {q.compliance}%
                    </span>
                  </div>

                  {/* Warranty */}
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-450 font-bold uppercase tracking-wider">Warranty Scope</span>
                    <span className="text-xs font-semibold text-right max-w-[140px] truncate" title={q.warranty}>
                      {q.warranty}
                    </span>
                  </div>
                </div>

                {/* BATTLE ADVANTAGE CHECKMARKS */}
                <div className="bg-zinc-800/10 dark:bg-black/20 border border-zinc-200 dark:border-zinc-850 rounded-2xl p-4 space-y-2 text-xs">
                  <p className="text-[10px] font-extrabold uppercase text-zinc-400 tracking-wider">Advantage Analysis</p>
                  
                  <div className="flex items-center gap-2">
                    <span className={q.totalAmount === lowestPrice ? "text-emerald-400" : "text-zinc-600"}>✓</span>
                    <span className={q.totalAmount === lowestPrice ? "font-bold text-zinc-200" : "text-zinc-500"}>
                      Lowest Pricing Option
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={q.deliveryTimeline === fastestDelivery ? "text-cyan-400" : "text-zinc-600"}>✓</span>
                    <span className={q.deliveryTimeline === fastestDelivery ? "font-bold text-zinc-200" : "text-zinc-500"}>
                      Fastest Sourcing Time
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={q.rating === topRating ? "text-amber-400" : "text-zinc-600"}>✓</span>
                    <span className={q.rating === topRating ? "font-bold text-zinc-200" : "text-zinc-500"}>
                      Top Trusted SLA Partner
                    </span>
                  </div>
                </div>

                {/* Card Selection Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedWinner(isWinner ? null : q.vendor)
                  }}
                  className={`mt-6 rounded-xl border py-2.5 text-xs font-bold transition-all w-full ${
                    isWinner
                      ? "border-emerald-400 bg-emerald-500/10 text-emerald-400 shadow-md shadow-emerald-500/10"
                      : "border-zinc-350 dark:border-zinc-800 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  {isWinner ? "Selected Proposal" : "Select Winning Bid"}
                </button>
              </motion.div>
            )
          })}
        </div>

      </div>
    </DashboardLayout>
  )
}

export default function CompareQuotationsPage() {
  return (
    <Suspense fallback={<DashboardLayout><div className="p-8 text-center text-zinc-400">Loading...</div></DashboardLayout>}>
      <CompareContent />
    </Suspense>
  )
}
