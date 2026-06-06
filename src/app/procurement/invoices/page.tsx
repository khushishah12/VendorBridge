"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Eye,
  Send,
  Download,
  Search,
  SlidersHorizontal,
  FileText,
  ChevronDown,
  CreditCard,
  Calendar,
  Building2,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Mail,
  Sparkles
} from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import AnimatedCounter from "@/components/ui/AnimatedCounter"

type InvStatus = "Draft" | "Sent" | "Paid" | "Overdue" | "Cancelled"

interface Invoice {
  id: string
  vendor: string
  poRef: string
  amount: number
  status: InvStatus
  invoiceDate: string
  dueDate: string
  paidDate: string | null
}

const MOCK_INVOICES: Invoice[] = [
  { id: "INV-2026-0101", vendor: "TechSolutions Inc.", poRef: "PO-2026-0042", amount: 245000, status: "Paid", invoiceDate: "2026-06-01", dueDate: "2026-07-01", paidDate: "2026-06-15" },
  { id: "INV-2026-0102", vendor: "ServicePro Ltd.", poRef: "PO-2026-0043", amount: 184500, status: "Sent", invoiceDate: "2026-06-05", dueDate: "2026-07-05", paidDate: null },
  { id: "INV-2026-0103", vendor: "OfficeMax Supplies", poRef: "PO-2026-0048", amount: 28500, status: "Draft", invoiceDate: "2026-06-06", dueDate: "2026-07-06", paidDate: null },
  { id: "INV-2026-0104", vendor: "Global Supplies Co.", poRef: "PO-2026-0046", amount: 56000, status: "Overdue", invoiceDate: "2026-05-01", dueDate: "2026-05-31", paidDate: null },
]

const STATUS_STYLES: Record<InvStatus, string> = {
  Draft: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  Sent: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Overdue: "bg-red-500/10 text-red-400 border-red-500/20",
  Cancelled: "bg-zinc-500/10 text-zinc-455 border-zinc-500/20",
}

export default function AllInvoicesPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<InvStatus | "All">("All")
  const [selectedInvId, setSelectedInvId] = useState<string | null>(null)
  
  // Custom states for modal transitions
  const [invStatus, setInvStatus] = useState<InvStatus>("Sent")
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [emailSentSuccess, setEmailSentSuccess] = useState(false)
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return MOCK_INVOICES.filter((inv) => {
      const matchSearch = inv.id.toLowerCase().includes(search.toLowerCase()) || inv.vendor.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === "All" || inv.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [search, statusFilter])

  const activeInvDetail = useMemo(() => {
    const found = MOCK_INVOICES.find((i) => i.id === selectedInvId)
    if (found) {
      // Sync local interactive status state with the selected invoice
      return found
    }
    return null
  }, [selectedInvId])

  // Sync state on modal open
  useEffect(() => {
    if (activeInvDetail) {
      setInvStatus(activeInvDetail.status)
      setEmailSentSuccess(false)
    }
  }, [activeInvDetail])

  function showAction(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(null), 2500)
  }

  // Invoice calculations
  const netAmount = activeInvDetail ? Math.round(activeInvDetail.amount / 1.18) : 0
  const gstAmount = activeInvDetail ? activeInvDetail.amount - netAmount : 0

  function triggerEmailAnimation() {
    setIsSendingEmail(true)
    setTimeout(() => {
      setIsSendingEmail(false)
      setEmailSentSuccess(true)
      setTimeout(() => setEmailSentSuccess(false), 2000)
    }, 1800)
  }

  function handleMarkPaid() {
    setInvStatus("Paid")
    showAction(`${selectedInvId} status updated to Paid`)
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Invoices
            </h1>
            <p className="mt-1.5 text-sm text-zinc-500 dark:text-cyan-400 font-medium">
              Convert purchase clearances into validated billing events.
            </p>
          </div>
          <button
            onClick={() => showAction("Invoice editor initialized from Dispatch Order")}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-650 to-cyan-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:scale-[1.01] transition-all"
          >
            <Plus className="h-4 w-4" /> Generate Invoice
          </button>
        </div>

        {actionMsg && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 px-4 py-2.5 text-sm font-bold text-emerald-400">
            {actionMsg}
          </div>
        )}

        {/* Search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by invoice ID or vendor..."
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 py-2.5 pl-10 pr-4 text-sm focus:border-cyan-500 outline-none dark:bg-zinc-900/60 dark:text-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as InvStatus | "All")}
            className="rounded-xl border border-zinc-300 dark:border-zinc-800 px-4 py-2.5 bg-transparent text-sm dark:text-white"
          >
            <option value="All">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Sent">Sent</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        {/* Table list */}
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-md dark:border-zinc-800 dark:bg-zinc-950/40 backdrop-blur-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-left text-xs font-bold uppercase tracking-wider text-zinc-400">
                <th className="px-5 py-4">Invoice ID</th>
                <th className="px-5 py-4">Vendor / Supplier</th>
                <th className="px-5 py-4">Purchase Ref</th>
                <th className="px-5 py-4 text-right">Billing Amount</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Due Date</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {filtered.map((inv) => (
                <tr
                  key={inv.id}
                  onClick={() => setSelectedInvId(inv.id)}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer"
                >
                  <td className="px-5 py-4 text-xs font-mono font-bold text-cyan-400">{inv.id}</td>
                  <td className="px-5 py-4 font-bold text-zinc-800 dark:text-zinc-100">{inv.vendor}</td>
                  <td className="px-5 py-4 text-zinc-500 font-mono text-xs">{inv.poRef}</td>
                  <td className="px-5 py-4 text-right font-bold text-zinc-900 dark:text-white">
                    ${inv.amount.toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${STATUS_STYLES[inv.status]}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-zinc-500">
                    <span className={`inline-flex items-center gap-1 ${inv.status === "Overdue" ? "text-red-400" : ""}`}>
                      {inv.dueDate} {inv.status === "Overdue" && <AlertTriangle className="h-3.5 w-3.5 text-red-500" />}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedInvId(inv.id) }}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
                    >
                      Audit Invoice &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* DETAIL MODAL PANEL WITH ENVELOPE ANIMATION */}
      <AnimatePresence>
        {activeInvDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl max-h-[95vh] overflow-y-auto rounded-3xl border border-zinc-850 bg-[#0d0d0d] text-white p-6 md:p-8 shadow-2xl relative">
              
              {/* Close */}
              <button
                onClick={() => setSelectedInvId(null)}
                className="absolute right-6 top-6 rounded-xl border border-zinc-800 p-2 text-zinc-500 hover:text-white hover:bg-zinc-900"
              >
                <XCircle className="h-5 w-5" />
              </button>

              {/* Envelope flying animation channel overlay */}
              {isSendingEmail && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 rounded-3xl overflow-hidden">
                  <div className="flex flex-col items-center gap-4">
                    <motion.div
                      animate={{
                        x: [-200, 200],
                        y: [0, -30, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        ease: "easeInOut",
                      }}
                      className="text-cyan-400"
                    >
                      <Mail className="h-16 w-16" />
                    </motion.div>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest animate-pulse">
                      Dispatching Encrypted Invoice PDF...
                    </p>
                  </div>
                </div>
              )}

              {/* Success Notification overlay */}
              {emailSentSuccess && (
                <div className="absolute inset-x-6 top-6 z-45">
                  <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex items-center gap-2 rounded-xl bg-emerald-950/50 border border-emerald-500/20 px-4 py-3 text-xs text-emerald-400 font-bold"
                  >
                    <CheckCircle className="h-4 w-4" /> Secure invoice dispatch complete.
                  </motion.div>
                </div>
              )}

              {/* Billing document frame */}
              <div className="border border-zinc-850 rounded-2xl p-6 bg-black relative">
                <div className="flex justify-between items-start border-b border-zinc-900 pb-4">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-extrabold">TAX INVOICE STATEMENT</span>
                    <h3 className="text-xl font-bold font-mono text-cyan-400 mt-1">{activeInvDetail.id}</h3>
                    <p className="text-xs text-zinc-500 mt-1">PO Reference: {activeInvDetail.poRef}</p>
                  </div>

                  <div className="text-right space-y-1.5">
                    {/* Interactive State transitions indicator */}
                    <motion.span
                      key={invStatus}
                      initial={{ scale: 0.9, opacity: 0.8 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`inline-block rounded border px-3 py-0.5 text-[10px] font-black uppercase tracking-wide ${STATUS_STYLES[invStatus]}`}
                    >
                      {invStatus}
                    </motion.span>
                    <p className="text-xs text-zinc-500">Issued: {activeInvDetail.invoiceDate}</p>
                  </div>
                </div>

                {/* Vendor details */}
                <div className="py-4 border-b border-zinc-900 grid grid-cols-2 gap-4 text-xs text-zinc-400">
                  <div>
                    <span className="font-extrabold text-zinc-500 uppercase tracking-wider">Supplier Source</span>
                    <p className="font-bold text-white mt-1">{activeInvDetail.vendor}</p>
                    <p className="text-[10px] mt-0.5">Verified Partner Account</p>
                  </div>
                  <div>
                    <span className="font-extrabold text-zinc-500 uppercase tracking-wider">Due Timeline</span>
                    <p className="font-bold text-white mt-1">{activeInvDetail.dueDate}</p>
                    <p className="text-[10px] mt-0.5 text-zinc-500">Payment term: Net 30</p>
                  </div>
                </div>

                {/* GST Tax Calculation values */}
                <div className="py-4 border-b border-zinc-900 space-y-3 text-xs text-zinc-400">
                  <span className="font-extrabold text-zinc-500 uppercase tracking-wider">Tax Auditing breakdown</span>
                  
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span>Net Subtotal Amount</span>
                      <strong className="text-zinc-200">${netAmount.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                      <span>Corporate GST (18%)</span>
                      <strong className="text-zinc-200">${gstAmount.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>

                {/* Animated counter totals */}
                <div className="pt-4 flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-400 uppercase tracking-wide">Total Invoice Outlay</span>
                  <div className="text-2xl font-black text-white font-mono flex items-center">
                    <span>$</span>
                    <AnimatedCounter value={activeInvDetail.amount} />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end gap-2 text-xs font-bold">
                <button
                  onClick={triggerEmailAnimation}
                  disabled={isSendingEmail}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-transparent px-4 py-2.5 text-white hover:bg-zinc-900"
                >
                  <Mail className="h-4 w-4" /> Email Invoice
                </button>
                {invStatus !== "Paid" && (
                  <button
                    onClick={handleMarkPaid}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-650 to-cyan-600 px-4 py-2.5 text-white shadow-md"
                  >
                    <CreditCard className="h-4 w-4" /> Mark as Paid (Confirm Transaction)
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
