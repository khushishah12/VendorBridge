"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Eye,
  Send,
  Download,
  Truck,
  Search,
  SlidersHorizontal,
  FileText,
  ChevronDown,
  RotateCcw,
  Calendar,
  XCircle,
  Building2,
  CheckCircle,
  Sparkles,
  CreditCard
} from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import AnimatedCounter from "@/components/ui/AnimatedCounter"

type PoStatus = "Draft" | "Sent" | "Accepted" | "Delivered" | "Closed" | "Cancelled"

interface PurchaseOrder {
  id: string
  vendor: string
  rfqRef: string
  quotationRef: string
  totalAmount: number
  status: PoStatus
  createdDate: string
  deliveryDeadline: string
  items: number
}

const MOCK_POS: PurchaseOrder[] = [
  { id: "PO-2026-0042", vendor: "TechSolutions Inc.", rfqRef: "RFQ-2026-9042", quotationRef: "QTN-2026-0102", totalAmount: 245000, status: "Delivered", createdDate: "2026-06-02", deliveryDeadline: "2026-06-16", items: 1 },
  { id: "PO-2026-0043", vendor: "ServicePro Ltd.", rfqRef: "RFQ-2026-3042", quotationRef: "QTN-2026-0103", totalAmount: 184500, status: "Sent", createdDate: "2026-06-05", deliveryDeadline: "2026-07-05", items: 1 },
  { id: "PO-2026-0044", vendor: "BuildRight Construction", rfqRef: "RFQ-2026-0002", quotationRef: "QTN-2026-0106", totalAmount: 445000, status: "Draft", createdDate: "2026-06-06", deliveryDeadline: "2026-09-06", items: 4 },
  { id: "PO-2026-0045", vendor: "Acme Corp", rfqRef: "RFQ-2026-0007", quotationRef: "QTN-2026-0105", totalAmount: 82500, status: "Accepted", createdDate: "2026-05-30", deliveryDeadline: "2026-06-29", items: 3 },
]

const STATUS_STYLES: Record<PoStatus, string> = {
  Draft: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  Sent: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Accepted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Delivered: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Closed: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  Cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
}

// Staggered typing hook for PO number
function TypewriterTitle({ text, delay = 50 }: { text: string; delay?: number }) {
  const [displayText, setDisplayText] = useState("")

  useEffect(() => {
    setDisplayText("")
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayText((prev) => prev + text.charAt(i))
        i++
      } else {
        clearInterval(interval)
      }
    }, delay)
    return () => clearInterval(interval)
  }, [text, delay])

  return <span>{displayText}</span>
}

export default function AllPurchaseOrdersPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<PoStatus | "All">("All")
  const [selectedPoId, setSelectedPoId] = useState<string | null>(null)
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return MOCK_POS.filter((po) => {
      const matchSearch = po.id.toLowerCase().includes(search.toLowerCase()) || po.vendor.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === "All" || po.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [search, statusFilter])

  function showAction(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(null), 2500)
  }

  const activePoDetail = useMemo(() => {
    return MOCK_POS.find((p) => p.id === selectedPoId)
  }, [selectedPoId])

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Purchase Orders
            </h1>
            <p className="mt-1.5 text-sm text-zinc-500 dark:text-cyan-400 font-medium">
              Create and dispatch legally binding purchase contracts.
            </p>
          </div>
          <button
            onClick={() => showAction("PO Generator form initialized from Approved Quotation")}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:scale-[1.01] transition-all"
          >
            <Plus className="h-4 w-4" /> Generate PO
          </button>
        </div>

        {/* Action toast */}
        {actionMsg && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 px-4 py-2.5 text-sm font-bold text-emerald-400">
            {actionMsg}
          </div>
        )}

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by PO number or vendor..."
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 py-2.5 pl-10 pr-4 text-sm focus:border-cyan-500 outline-none dark:bg-zinc-900/60 dark:text-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PoStatus | "All")}
            className="rounded-xl border border-zinc-300 dark:border-zinc-800 px-4 py-2.5 bg-transparent text-sm dark:text-white"
          >
            <option value="All">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Sent">Sent</option>
            <option value="Accepted">Accepted</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* List Table */}
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-md dark:border-zinc-800 dark:bg-zinc-950/40 backdrop-blur-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-left text-xs font-bold uppercase tracking-wider text-zinc-400">
                <th className="px-5 py-4">PO Code</th>
                <th className="px-5 py-4">Vendor</th>
                <th className="px-5 py-4">Linked RFQ / Quote</th>
                <th className="px-5 py-4 text-right">Order Amount</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Created Date</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {filtered.map((po) => (
                <tr
                  key={po.id}
                  onClick={() => setSelectedPoId(po.id)}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer"
                >
                  <td className="px-5 py-4 text-xs font-mono font-bold text-cyan-400">{po.id}</td>
                  <td className="px-5 py-4 font-bold text-zinc-800 dark:text-zinc-100">{po.vendor}</td>
                  <td className="px-5 py-4">
                    <p className="text-xs text-zinc-450">{po.rfqRef}</p>
                    <p className="text-[10px] text-zinc-500">{po.quotationRef}</p>
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-zinc-950 dark:text-white">
                    ${po.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${STATUS_STYLES[po.status]}`}>
                      {po.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-zinc-500">{po.createdDate}</td>
                  <td className="px-5 py-4">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedPoId(po.id) }}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" /> View PO
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* PO REVEAL ANIMATION MODAL */}
      <AnimatePresence>
        {activePoDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-zinc-800 bg-[#0c0c0c] text-white p-8 shadow-2xl relative">
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedPoId(null)}
                className="absolute right-6 top-6 rounded-xl border border-zinc-800 p-2 text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>

              {/* Animated Document Reveal Sheet container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ duration: 0.4 }}
                className="border border-zinc-850 rounded-2xl p-6 bg-black relative overflow-hidden"
              >
                {/* Holographic grid particles overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

                {/* Staggered header info */}
                <div className="flex flex-wrap justify-between items-start border-b border-zinc-900 pb-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-1"
                  >
                    <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      LEGAL AGREEMENT CONTRACT
                    </span>
                    <h2 className="text-2xl font-black font-mono tracking-tight mt-2 text-white">
                      <TypewriterTitle text={activePoDetail.id} />
                    </h2>
                    <p className="text-xs text-zinc-500">Broadcasting: Sourcing VendorBridge Systems</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-right"
                  >
                    <span className={`inline-block rounded border px-2.5 py-0.5 text-[10px] font-bold uppercase ${STATUS_STYLES[activePoDetail.status]}`}>
                      {activePoDetail.status}
                    </span>
                    <p className="text-xs text-zinc-500 mt-2">Created: {activePoDetail.createdDate}</p>
                  </motion.div>
                </div>

                {/* Staggered Vendor Info */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-2 gap-6 py-6 border-b border-zinc-900 text-xs"
                >
                  <div className="space-y-2">
                    <p className="font-extrabold text-zinc-500 uppercase tracking-wider">Contracting Vendor</p>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-cyan-400" />
                      <strong className="text-zinc-200 text-sm">{activePoDetail.vendor}</strong>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="font-extrabold text-zinc-500 uppercase tracking-wider">Workflow Sourcing references</p>
                    <p className="text-zinc-400">RFQ: <strong className="text-white font-mono">{activePoDetail.rfqRef}</strong></p>
                    <p className="text-zinc-400">Quote: <strong className="text-white font-mono">{activePoDetail.quotationRef}</strong></p>
                  </div>
                </motion.div>

                {/* Item Line Detail */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="py-6 border-b border-zinc-900"
                >
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Allocated Line Products</p>
                  <div className="rounded-xl bg-zinc-950 border border-zinc-850 p-4 space-y-3">
                    <div className="flex justify-between items-center text-xs border-b border-zinc-900 pb-2 text-zinc-550">
                      <span>Product Details</span>
                      <span>Line Total</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-zinc-200">High-Performance Compute Nodes (GPU H100)</p>
                        <p className="text-[10px] text-zinc-500">Qty: {activePoDetail.items} &middot; Warranty: {activePoDetail.id.includes("42") ? "3 years comp" : "3 years comp + onsite"}</p>
                      </div>
                      <strong className="text-white">${activePoDetail.totalAmount.toLocaleString()}</strong>
                    </div>
                  </div>
                </motion.div>

                {/* Financial Animate Count Up Total */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 }}
                  className="pt-6 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Total Contractual Outlay</h3>
                    <p className="text-[10px] text-zinc-650">Includes standard GST corporate tax rates.</p>
                  </div>
                  
                  {/* Price Counter digits */}
                  <div className="text-3xl font-black text-emerald-400 font-mono flex items-center">
                    <span>$</span>
                    <AnimatedCounter value={activePoDetail.totalAmount} />
                  </div>
                </motion.div>

              </motion.div>

              {/* Legal Dispatch buttons */}
              <div className="mt-6 flex justify-end gap-3 text-xs font-bold">
                <button
                  onClick={() => alert("Downloading digital PO contract PDF...")}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-transparent px-5 py-3 hover:bg-zinc-900"
                >
                  <Download className="h-4 w-4" /> Download PDF Agreement
                </button>
                {activePoDetail.status === "Sent" && (
                  <button
                    onClick={() => { setSelectedPoId(null); alert("PO confirmation reminder sent to vendor.") }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-650 to-cyan-600 px-5 py-3 text-white shadow-md"
                  >
                    <Send className="h-4 w-4" /> Resend Confirmation Reminder
                  </button>
                )}
              </div>

            </div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}
