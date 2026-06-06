"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  ArrowLeft,
  XCircle,
  Eye,
  Copy,
  Download,
  FileText,
  Search,
  SlidersHorizontal,
  DollarSign,
  Calendar,
  User,
  AlertTriangle,
  CheckCheck,
  Ban,
  TrendingDown,
  RotateCcw,
  ThumbsDown,
  Clock,
  FileWarning,
} from "lucide-react"
import Link from "next/link"

type CancelReason =
  | "Vendor rejected PO"
  | "Budget exceeded"
  | "Better quotation found"
  | "Approval revoked"
  | "Delivery failure risk"

interface CancelledPo {
  id: string
  vendor: string
  rfqRef: string
  quotationRef: string
  amount: number
  reason: CancelReason
  cancelledBy: string
  cancelledDate: string
  comments: string
  impactAnalysis: string
  timeline: { date: string; event: string }[]
}

const mockCancelled: CancelledPo[] = [
  {
    id: "PO-2025-0046", vendor: "Global Supplies Co.", rfqRef: "RFQ-2025-0012", quotationRef: "QTN-2025-0114",
    amount: 56000, reason: "Vendor rejected PO", cancelledBy: "Global Supplies Co.",
    cancelledDate: "2025-06-04", comments: "Vendor declined due to capacity constraints. They cannot fulfill within the required timeline.",
    impactAnalysis: "Low impact. Alternative vendor OfficeMax Supplies can deliver same items. Potential delay of 5-7 days.",
    timeline: [
      { date: "2025-06-03 08:15", event: "PO sent to vendor" },
      { date: "2025-06-04 09:30", event: "Vendor rejected PO — capacity issue" },
      { date: "2025-06-04 10:00", event: "PO cancelled by Procurement Officer" },
    ],
  },
  {
    id: "PO-2025-0040", vendor: "Global Supplies Co.", rfqRef: "RFQ-2025-0009", quotationRef: "QTN-2025-0114",
    amount: 120000, reason: "Budget exceeded", cancelledBy: "Rajesh Kumar (Finance)",
    cancelledDate: "2025-04-15", comments: "Q2 budget for office supplies was reduced by 15%. This PO exceeds the revised allocation.",
    impactAnalysis: "Medium impact. Department needs to re-forecast Q3 budget or reduce scope by 30% to fit within allocation.",
    timeline: [
      { date: "2025-04-10", event: "PO created and sent for approval" },
      { date: "2025-04-14", event: "Finance flagged budget overrun" },
      { date: "2025-04-15", event: "PO cancelled — budget exceeded" },
    ],
  },
  {
    id: "PO-2025-0049", vendor: "Acme Corp", rfqRef: "RFQ-2025-0015", quotationRef: "QTN-2025-0117",
    amount: 78000, reason: "Better quotation found", cancelledBy: "Priya Sharma (Procurement Officer)",
    cancelledDate: "2025-06-05", comments: "TechSolutions Inc. submitted a revised quotation at $71,000 with faster delivery. Switching vendors saves $7,000.",
    impactAnalysis: "Positive impact. Cost savings of $7,000 (9% reduction). Delivery timeline improves by 10 days. No negative impact.",
    timeline: [
      { date: "2025-06-01", event: "PO generated for Acme Corp" },
      { date: "2025-06-03", event: "TechSolutions Inc. submitted revised quote" },
      { date: "2025-06-04", event: "Comparison review completed" },
      { date: "2025-06-05", event: "PO cancelled — better alternative found" },
    ],
  },
  {
    id: "PO-2025-0050", vendor: "BuildRight Construction", rfqRef: "RFQ-2025-0016", quotationRef: "QTN-2025-0118",
    amount: 320000, reason: "Approval revoked", cancelledBy: "Ananya Gupta (Manager)",
    cancelledDate: "2025-06-03", comments: "Project scope changed. Warehouse expansion postponed to Q4. PO no longer required at this time.",
    impactAnalysis: "Medium impact. Re-engage vendor in Q4. May need to renegotiate pricing due to material cost fluctuations.",
    timeline: [
      { date: "2025-05-28", event: "PO created and approved by manager" },
      { date: "2025-06-01", event: "Project scope change announced" },
      { date: "2025-06-02", event: "Vendor notified of potential cancellation" },
      { date: "2025-06-03", event: "Approval revoked — PO cancelled" },
    ],
  },
  {
    id: "PO-2025-0051", vendor: "ServicePro Ltd.", rfqRef: "RFQ-2025-0017", quotationRef: "QTN-2025-0119",
    amount: 45000, reason: "Delivery failure risk", cancelledBy: "System (Auto)",
    cancelledDate: "2025-06-06", comments: "Vendor failed quality audit during routine check. Non-conformance found in 3 of 5 sample batches. Auto-cancelled per policy.",
    impactAnalysis: "High impact. Urgent replacement needed. Lead time for alternative vendor is 3-4 weeks. Escalation to procurement head.",
    timeline: [
      { date: "2025-06-01", event: "PO sent to ServicePro Ltd." },
      { date: "2025-06-04", event: "Routine quality audit initiated" },
      { date: "2025-06-05", event: "Non-conformance detected — 3/5 samples failed" },
      { date: "2025-06-06", event: "Auto-cancelled — delivery failure risk" },
    ],
  },
]

const reasonStyles: Record<CancelReason, string> = {
  "Vendor rejected PO": "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800",
  "Budget exceeded": "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800",
  "Better quotation found": "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
  "Approval revoked": "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
  "Delivery failure risk": "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800",
}

const reasonIcons: Record<CancelReason, typeof Ban> = {
  "Vendor rejected PO": ThumbsDown,
  "Budget exceeded": DollarSign,
  "Better quotation found": TrendingDown,
  "Approval revoked": RotateCcw,
  "Delivery failure risk": AlertTriangle,
}

const reasons = Object.keys(reasonStyles) as CancelReason[]

export default function CancelledPurchaseOrdersPage() {
  const [search, setSearch] = useState("")
  const [reasonFilter, setReasonFilter] = useState<CancelReason | "All">("All")
  const [showFilters, setShowFilters] = useState(false)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return mockCancelled.filter((po) => {
      if (search && !po.id.toLowerCase().includes(search.toLowerCase()) && !po.vendor.toLowerCase().includes(search.toLowerCase())) return false
      if (reasonFilter !== "All" && po.reason !== reasonFilter) return false
      return true
    })
  }, [search, reasonFilter])

  function showAction(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(null), 2500)
  }

  const detail = mockCancelled.find((p) => p.id === detailId)

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <Link href="/purchase-orders" className="mb-2 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
            <ArrowLeft className="h-4 w-4" /> Back to All POs
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Cancelled Purchase Orders</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{mockCancelled.length} POs cancelled</p>
        </div>

        {actionMsg && (
          <div className="mb-4 rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{actionMsg}</div>
        )}

        {/* Reason Summary */}
        <div className="mb-4 flex flex-wrap gap-2">
          {reasons.map((reason) => {
            const count = mockCancelled.filter((p) => p.reason === reason).length
            const Icon = reasonIcons[reason]
            return (
              <span key={reason} className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${reasonStyles[reason]}`}>
                <Icon className="h-3 w-3" /> {reason} ({count})
              </span>
            )
          })}
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by PO ID or vendor..."
              className="w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          </div>
          <select value={reasonFilter} onChange={(e) => setReasonFilter(e.target.value as CancelReason | "All")}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
            <option value="All">All Reasons</option>
            {reasons.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                <th className="px-4 py-3">PO ID</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">RFQ / Quotation</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3">Cancellation Reason ⭐</th>
                <th className="px-4 py-3">Cancelled By</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-zinc-400"><Ban className="mx-auto mb-2 h-8 w-8 opacity-50" />No cancelled POs</td></tr>
              ) : (
                filtered.map((po) => {
                  const ReasonIcon = reasonIcons[po.reason]
                  return (
                    <tr key={po.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900">
                      <td className="px-4 py-3 font-mono text-xs font-medium text-indigo-600 dark:text-indigo-400">{po.id}</td>
                      <td className="px-4 py-3 font-medium text-zinc-800 dark:text-zinc-200">{po.vendor}</td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-zinc-500">{po.rfqRef}</p>
                        <p className="text-[10px] text-zinc-400">{po.quotationRef}</p>
                      </td>
                      <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-400">${po.amount.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${reasonStyles[po.reason]}`}>
                          <ReasonIcon className="h-3 w-3" /> {po.reason}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{po.cancelledBy}</td>
                      <td className="px-4 py-3 text-zinc-500">{po.cancelledDate}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => setDetailId(po.id)}
                          className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400">
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            <div className="sticky top-0 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-700 dark:bg-zinc-900">
              <div><h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Cancelled PO — Audit View</h2><p className="text-sm text-zinc-400">{detail.id}</p></div>
              <button onClick={() => setDetailId(null)} className="rounded-lg p-1 text-zinc-400 hover:text-zinc-600"><XCircle className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><p className="text-xs text-zinc-400">Vendor</p><p className="font-medium text-zinc-800 dark:text-zinc-200">{detail.vendor}</p></div>
                <div><p className="text-xs text-zinc-400">Amount</p><p className="font-medium text-zinc-800 dark:text-zinc-200">${detail.amount.toLocaleString()}</p></div>
                <div><p className="text-xs text-zinc-400">RFQ</p><p className="text-sm text-zinc-600 dark:text-zinc-400">{detail.rfqRef}</p></div>
                <div><p className="text-xs text-zinc-400">Quotation</p><p className="text-sm text-zinc-600 dark:text-zinc-400">{detail.quotationRef}</p></div>
                <div><p className="text-xs text-zinc-400">Cancelled By</p><p className="text-sm text-zinc-600 dark:text-zinc-400">{detail.cancelledBy}</p></div>
                <div><p className="text-xs text-zinc-400">Cancelled Date</p><p className="text-sm text-zinc-600 dark:text-zinc-400">{detail.cancelledDate}</p></div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-zinc-400">Cancellation Reason ⭐</p>
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium mt-0.5 ${reasonStyles[detail.reason]}`}>{detail.reason}</span>
                </div>
              </div>

              {/* Cancellation Timeline */}
              <div>
                <h4 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300"><Clock className="inline h-4 w-4 mr-1" /> Cancellation Timeline</h4>
                <div className="relative pl-6">
                  {detail.timeline.map((event, i) => (
                    <div key={i} className="relative pb-4 last:pb-0">
                      <div className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-red-400 bg-white dark:bg-zinc-900" />
                      {i < detail.timeline.length - 1 && <div className="absolute left-[4.5px] top-4 h-full w-0.5 bg-zinc-200 dark:bg-zinc-700" />}
                      <p className="text-sm text-zinc-800 dark:text-zinc-200">{event.event}</p>
                      <p className="text-xs text-zinc-400">{event.date}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div>
                <h4 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300"><FileText className="inline h-4 w-4 mr-1" /> Comments / Remarks</h4>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                  {detail.comments}
                </div>
              </div>

              {/* Impact Analysis */}
              <div>
                <h4 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  <AlertTriangle className="inline h-4 w-4 mr-1" /> Impact Analysis
                </h4>
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
                  {detail.impactAnalysis}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-700">
                <button onClick={() => showAction(`Viewing history for ${detail.id}...`)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  <FileWarning className="h-4 w-4" /> View PO History
                </button>
                <button onClick={() => showAction(`${detail.id} cloned as new PO`)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                  <Copy className="h-4 w-4" /> Clone PO ⭐
                </button>
                <button onClick={() => showAction(`Cancellation report exported for ${detail.id}`)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  <Download className="h-4 w-4" /> Export Cancellation Report
                </button>
                <button onClick={() => showAction(`${detail.id} marked as reviewed`)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-950/40">
                  <CheckCheck className="h-4 w-4" /> Mark as Reviewed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
