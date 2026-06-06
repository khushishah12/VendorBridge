"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  ArrowLeft,
  XCircle,
  Eye,
  RotateCcw,
  Copy,
  RefreshCw,
  Search,
  SlidersHorizontal,
  User,
  Calendar,
  DollarSign,
  FileText,
  MessageSquare,
  Lightbulb,
  ThumbsDown,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"
import Link from "next/link"

type RejectionStage = "Manager" | "Finance" | "System"

interface RejectedApproval {
  id: string
  rfqRef: string
  title: string
  vendor: string
  quotationRef: string
  amount: number
  rejectedBy: string
  stage: RejectionStage
  reason: string
  dateRejected: string
  workflowHistory: { step: string; status: "Completed" | "Rejected" | "Skipped"; date: string }[]
  comments: string
  alternativeSuggestions: string
}

const mockRejected: RejectedApproval[] = [
  {
    id: "APR-2025-006", rfqRef: "RFQ-2025-0002", title: "Construction Materials - Phase 2",
    vendor: "BuildRight Construction", quotationRef: "QTN-2025-0106", amount: 445000,
    rejectedBy: "Ananya Gupta", stage: "Manager",
    reason: "Budget overrun — This quarter's construction budget has been frozen. CFO requested all non-critical spend be deferred.",
    dateRejected: "2025-06-04",
    workflowHistory: [
      { step: "RFQ Created", status: "Completed", date: "2025-05-05" },
      { step: "Quotation Received", status: "Completed", date: "2025-05-30" },
      { step: "Shortlisted", status: "Completed", date: "2025-06-01" },
      { step: "Sent for Approval", status: "Completed", date: "2025-06-03" },
      { step: "Manager Approval", status: "Rejected", date: "2025-06-04" },
      { step: "Finance Approval", status: "Skipped", date: "—" },
    ],
    comments: "The project scope needs to be re-evaluated. We may need to split this into smaller phases or source alternative materials that fit the reduced budget.",
    alternativeSuggestions: "Consider splitting into 2 phases ($222,500 each) or sourcing from a lower-tier supplier. Global Supplies Co. may offer competitive rates for bulk steel.",
  },
  {
    id: "APR-2025-007", rfqRef: "RFQ-2025-0005", title: "Medical Equipment Supply",
    vendor: "MedEquip Distributors", quotationRef: "QTN-2025-0110", amount: 89000,
    rejectedBy: "System (Auto)", stage: "System",
    reason: "Auto-rejected due to incomplete documentation — Required FDA certification was not attached. Vendor compliance score dropped below minimum threshold.",
    dateRejected: "2025-04-22",
    workflowHistory: [
      { step: "RFQ Created", status: "Completed", date: "2025-04-01" },
      { step: "Quotation Received", status: "Completed", date: "2025-04-20" },
      { step: "Shortlisted", status: "Completed", date: "2025-04-21" },
      { step: "Sent for Approval", status: "Completed", date: "2025-04-21" },
      { step: "Manager Approval", status: "Skipped", date: "—" },
      { step: "System Validation", status: "Rejected", date: "2025-04-22" },
    ],
    comments: "System flagged missing FDA certifications. Vendor was notified but did not respond within the 48-hour window. Auto-rejection triggered per policy.",
    alternativeSuggestions: "Request vendor to resubmit with complete documentation. Alternatively, re-issue RFQ to include only FDA-approved vendors as a pre-qualification criterion.",
  },
  {
    id: "APR-2025-008", rfqRef: "RFQ-2025-0008", title: "Office Supplies - Q3",
    vendor: "OfficeMax Supplies", quotationRef: "QTN-2025-0112", amount: 28500,
    rejectedBy: "Rajesh Kumar", stage: "Finance",
    reason: "Duplicate request — This office supply PO overlaps with existing quarterly contract with StaplesDirect. Please route through the existing contract.",
    dateRejected: "2025-06-02",
    workflowHistory: [
      { step: "RFQ Created", status: "Completed", date: "2025-06-01" },
      { step: "Quotation Received", status: "Completed", date: "2025-06-01" },
      { step: "Shortlisted", status: "Completed", date: "2025-06-01" },
      { step: "Sent for Approval", status: "Completed", date: "2025-06-02" },
      { step: "Manager Approval", status: "Completed", date: "2025-06-02" },
      { step: "Finance Approval", status: "Rejected", date: "2025-06-02" },
    ],
    comments: "Finance team has confirmed an existing contract (CT-2025-0012) covers office supplies for Q3. New vendor onboarding would create duplicate billing.",
    alternativeSuggestions: "Cancel this RFQ and route the requirement through the existing StaplesDirect contract. If OfficeMax offers better pricing, flag for contract renewal discussion in Q4.",
  },
]

const stageColors: Record<RejectionStage, string> = {
  Manager: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800",
  Finance: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800",
  System: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
}

const stageIcons: Record<RejectionStage, typeof User> = {
  Manager: User,
  Finance: DollarSign,
  System: AlertTriangle,
}

const statusIcons: Record<string, typeof CheckCircle2> = {
  Completed: CheckCircle2,
  Rejected: XCircle,
  Skipped: Clock,
}

const statusColors: Record<string, string> = {
  Completed: "text-emerald-600 dark:text-emerald-400",
  Rejected: "text-red-600 dark:text-red-400",
  Skipped: "text-zinc-400 dark:text-zinc-500",
}

export default function RejectedApprovalsPage() {
  const [search, setSearch] = useState("")
  const [stageFilter, setStageFilter] = useState<RejectionStage | "All">("All")
  const [showFilters, setShowFilters] = useState(false)
  const [detailItem, setDetailItem] = useState<RejectedApproval | null>(null)
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return mockRejected.filter((r) => {
      if (search && !r.id.toLowerCase().includes(search.toLowerCase()) && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.vendor.toLowerCase().includes(search.toLowerCase())) return false
      if (stageFilter !== "All" && r.stage !== stageFilter) return false
      return true
    })
  }, [search, stageFilter])

  function showAction(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(null), 2500)
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <Link href="/approvals" className="mb-2 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
            <ArrowLeft className="h-4 w-4" /> Back to Approvals
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Rejected Approvals</h1>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {mockRejected.length} rejected &middot; Audit trail available
              </p>
            </div>
          </div>
        </div>

        {/* Toast */}
        {actionMsg && (
          <div className="mb-4 rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{actionMsg}</div>
        )}

        {/* Search + Filter */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, title, or vendor..."
              className="w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${
              showFilters ? "border-indigo-200 bg-indigo-50 text-indigo-700" : "border-zinc-300 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}>
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="mb-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">Rejection Stage</label>
                <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value as RejectionStage | "All")}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
                  <option value="All">All Stages</option>
                  {(["Manager", "Finance", "System"] as RejectionStage[]).map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <button onClick={() => setStageFilter("All")} className="rounded-lg px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-700">Clear</button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                <th className="px-4 py-3">Approval ID</th>
                <th className="px-4 py-3">RFQ / Title</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3">Rejected At</th>
                <th className="px-4 py-3">Rejection Reason</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-zinc-400">
                    <ThumbsDown className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    No rejected approvals match your filter
                  </td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const StageIcon = stageIcons[r.stage]
                  return (
                    <tr key={r.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900">
                      <td className="px-4 py-3 font-mono text-xs font-medium text-indigo-600 dark:text-indigo-400">{r.id}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-zinc-800 dark:text-zinc-200">{r.title}</p>
                        <p className="text-xs text-zinc-400">{r.rfqRef}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-zinc-700 dark:text-zinc-300">{r.vendor}</p>
                        <p className="text-xs text-zinc-400">{r.quotationRef}</p>
                      </td>
                      <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-400">${r.amount.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${stageColors[r.stage]}`}>
                          <StageIcon className="h-3 w-3" /> {r.stage}
                        </span>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">{r.reason}</p>
                      </td>
                      <td className="px-4 py-3 text-zinc-500">{r.dateRejected}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => setDetailItem(r)}
                          className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400" title="View details">
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

        <p className="mt-3 text-xs text-zinc-400">Rejected approvals serve as an audit trail. Use &quot;Revise&quot; or &quot;Clone&quot; to quickly re-submit.</p>
      </div>

      {/* Detail Modal */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            <div className="sticky top-0 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-700 dark:bg-zinc-900">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Rejected Approval — Audit View</h2>
                <p className="text-sm text-zinc-400">{detailItem.id}</p>
              </div>
              <button onClick={() => setDetailItem(null)} className="rounded-lg p-1 text-zinc-400 hover:text-zinc-600"><XCircle className="h-5 w-5" /></button>
            </div>

            <div className="p-6 space-y-6">
              {/* Summary */}
              <div className="flex flex-wrap items-center gap-3">
                <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${stageColors[detailItem.stage]}`}>
                  Rejected at {detailItem.stage} stage
                </span>
                <span className="text-xs text-zinc-400">{detailItem.rfqRef} &middot; {detailItem.quotationRef}</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-zinc-400">RFQ / Title</p>
                  <p className="font-medium text-zinc-800 dark:text-zinc-200">{detailItem.title}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Vendor</p>
                  <p className="font-medium text-zinc-700 dark:text-zinc-300">{detailItem.vendor}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Amount</p>
                  <p className="font-medium text-zinc-800 dark:text-zinc-200">${detailItem.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Rejected By</p>
                  <p className="font-medium text-zinc-700 dark:text-zinc-300">{detailItem.rejectedBy}</p>
                </div>
              </div>

              {/* Rejection Reason */}
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
                <h4 className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-red-700 dark:text-red-400">
                  <XCircle className="h-4 w-4" /> Rejection Reason ⭐
                </h4>
                <p className="text-sm text-red-600 dark:text-red-300">{detailItem.reason}</p>
              </div>

              {/* Full Workflow History */}
              <div>
                <h4 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  <Clock className="inline h-4 w-4 mr-1" /> Full Workflow History
                </h4>
                <div className="relative pl-8">
                  {detailItem.workflowHistory.map((step, i) => {
                    const StatusIcon = statusIcons[step.status]
                    return (
                      <div key={i} className="relative pb-5 last:pb-0">
                        <div className={`absolute left-0 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white dark:bg-zinc-900 ${
                          step.status === "Completed" ? "text-emerald-500" : step.status === "Rejected" ? "text-red-500" : "text-zinc-300"
                        }`}>
                          <StatusIcon className="h-5 w-5" />
                        </div>
                        {i < detailItem.workflowHistory.length - 1 && (
                          <div className={`absolute left-[9.5px] top-7 h-full w-0.5 ${
                            step.status === "Rejected" ? "bg-red-200 dark:bg-red-900" : "bg-zinc-200 dark:bg-zinc-700"
                          }`} />
                        )}
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-medium ${statusColors[step.status]}`}>{step.step}</p>
                          <span className={`text-xs ${statusColors[step.status]}`}>
                            {step.status === "Completed" && "✔"}
                            {step.status === "Rejected" && "❌"}
                            {step.status === "Skipped" && "—"}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400">{step.date}</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Comments from Approver */}
              <div>
                <h4 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  <MessageSquare className="inline h-4 w-4 mr-1" /> Comments from Approver
                </h4>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 italic">&ldquo;{detailItem.comments}&rdquo;</p>
                  <p className="mt-1 text-xs text-zinc-400">— {detailItem.rejectedBy}</p>
                </div>
              </div>

              {/* Alternative Suggestions */}
              <div>
                <h4 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  <Lightbulb className="inline h-4 w-4 mr-1" /> Alternative Suggestions
                </h4>
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900 dark:bg-amber-950/30">
                  <p className="text-sm text-amber-700 dark:text-amber-300">{detailItem.alternativeSuggestions}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-700">
                <button onClick={() => showAction(`Revising RFQ ${detailItem.rfqRef}...`)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                  <RefreshCw className="h-4 w-4" /> Revise RFQ / Quotation
                </button>
                <button onClick={() => showAction(`${detailItem.id} resubmitted for approval`)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-300 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-950/40">
                  <RotateCcw className="h-4 w-4" /> Resubmit for Approval
                </button>
                <button onClick={() => showAction(`RFQ ${detailItem.rfqRef} cloned`)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  <Copy className="h-4 w-4" /> Clone RFQ ⭐
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

