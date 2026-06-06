"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  Search,
  Clock,
  DollarSign,
  User,
  Building2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Zap,
  Calendar,
  Flag,
} from "lucide-react"
import { approvalRequests } from "@/lib/manager-data"

const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
  Urgent: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800",
  Approved: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
  Rejected: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
}

const typeColors: Record<string, string> = {
  RFQ: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Quotation: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "Purchase Order": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  Invoice: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
}

const priorityColors: Record<string, string> = {
  High: "text-red-600 dark:text-red-400",
  Medium: "text-amber-600 dark:text-amber-400",
  Low: "text-blue-600 dark:text-blue-400",
}

const types = ["All", "RFQ", "Quotation", "Purchase Order", "Invoice"] as const

export default function PendingApprovalsPage() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("All")
  const [remarks, setRemarks] = useState<Record<string, string>>({})
  const [actionState, setActionState] = useState<Record<string, "approving" | "rejecting" | "approved" | "rejected" | null>>({})

  const pending = useMemo(() => approvalRequests.filter((r) => r.status === "Pending" || r.status === "Urgent"), [])

  const filtered = useMemo(() => pending.filter((r) => {
    if (search && !r.id.toLowerCase().includes(search.toLowerCase()) && !r.title.toLowerCase().includes(search.toLowerCase())) return false
    if (typeFilter !== "All" && r.type !== typeFilter) return false
    return true
  }), [search, typeFilter, pending])

  const totalPending = pending.filter((r) => r.status === "Pending").length
  const totalUrgent = pending.filter((r) => r.status === "Urgent").length
  const totalValue = pending.reduce((sum, r) => sum + r.amount, 0)

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Pending Approvals</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{filtered.length} requests awaiting your decision</p>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID or title..."
              className="w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {types.map((t) => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  typeFilter === t
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                }`}>{t}</button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-emerald-400" />
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">All caught up!</h3>
              <p className="mt-1 text-sm text-zinc-400">No pending approvals match your filters.</p>
            </div>
          ) : (
            filtered.map((req) => {
              const state = actionState[req.id] || null
              const isActioned = state === "approved" || state === "rejected"
              return (
                <div key={req.id} className={`rounded-xl border bg-white p-5 shadow-sm transition-all dark:bg-zinc-950 ${
                  isActioned ? "border-zinc-200 opacity-60 dark:border-zinc-800" : "border-zinc-200 hover:shadow-md dark:border-zinc-800"
                }`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColors[req.type]}`}>{req.type}</span>
                        {req.status === "Urgent" ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400">
                            <span className="relative flex h-2 w-2">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                            </span>
                            Urgent
                          </span>
                        ) : (
                          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors.Pending}`}>Pending</span>
                        )}
                        {isActioned && (
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            state === "approved"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                          }`}>
                            {state === "approved" ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            {state === "approved" ? "Approved ✓" : "Rejected"}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">{req.title}</h3>
                      <p className="text-xs font-mono text-indigo-600 dark:text-indigo-400">{req.id}</p>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="flex items-center gap-1.5 text-sm text-zinc-500">
                      <User className="h-4 w-4 shrink-0" />
                      <span className="truncate">{req.submittedBy}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-zinc-500">
                      <Building2 className="h-4 w-4 shrink-0" />
                      <span className="truncate">{req.department}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                      <DollarSign className="h-4 w-4 shrink-0 text-zinc-400" />
                      <span>${req.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-zinc-500">
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span>Due {req.deadline}</span>
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${priorityColors[req.priority]}`}>
                      <Zap className="h-3.5 w-3.5" /> {req.priority} Priority
                    </span>
                  </div>

                  {req.riskFlags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {req.riskFlags.map((flag, i) => (
                        <span key={i} className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-600 dark:border-orange-900 dark:bg-orange-950/30 dark:text-orange-400">
                          <Flag className="h-3 w-3" /> {flag}
                        </span>
                      ))}
                    </div>
                  )}

                  {!isActioned && (
                    <div className="mt-4 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                      {state === "approving" || state === "rejecting" ? (
                        <div className="space-y-3">
                          <textarea
                            placeholder={state === "approving" ? "Add approval remarks (optional)..." : "Add rejection reason..."}
                            value={remarks[req.id] || ""}
                            onChange={(e) => setRemarks((prev) => ({ ...prev, [req.id]: e.target.value }))}
                            className="w-full rounded-lg border border-zinc-300 p-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <button onClick={() => state === "approving" ? setActionState((p) => ({ ...p, [req.id]: "approved" })) : setActionState((p) => ({ ...p, [req.id]: "rejected" }))}
                              className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm ${
                                state === "approving" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"
                              }`}>
                              {state === "approving" ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                              Confirm {state === "approving" ? "Approval" : "Rejection"}
                            </button>
                            <button onClick={() => setActionState((p) => ({ ...p, [req.id]: null }))}
                              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button onClick={() => setActionState((p) => ({ ...p, [req.id]: "approving" }))}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700">
                            <CheckCircle2 className="h-4 w-4" /> Approve
                          </button>
                          <button onClick={() => setActionState((p) => ({ ...p, [req.id]: "rejecting" }))}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700">
                            <XCircle className="h-4 w-4" /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <span className="inline-flex items-center gap-1.5 text-zinc-500">
              <Clock className="h-4 w-4 text-amber-500" />
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">{totalPending}</span> pending
            </span>
            <span className="inline-flex items-center gap-1.5 text-zinc-500">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">{totalUrgent}</span> urgent
            </span>
            <span className="inline-flex items-center gap-1.5 text-zinc-500">
              <DollarSign className="h-4 w-4 text-indigo-500" />
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">${totalValue.toLocaleString()}</span> total value
            </span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
