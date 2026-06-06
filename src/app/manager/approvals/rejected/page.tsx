"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  Search,
  XCircle,
  RotateCcw,
  DollarSign,
  User,
  Building2,
  MessageSquare,
  ThumbsDown,
  FileText,
  Calendar,
  AlertTriangle,
} from "lucide-react"
import { approvalRequests } from "@/lib/manager-data"

const typeColors: Record<string, string> = {
  RFQ: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Quotation: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "Purchase Order": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  Invoice: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
}

const types = ["All", "RFQ", "Quotation", "Purchase Order", "Invoice"] as const

export default function RejectedRequestsPage() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("All")
  const [resubmitted, setResubmitted] = useState<Record<string, boolean>>({})

  const rejected = useMemo(() => approvalRequests.filter((r) => r.status === "Rejected"), [])

  const filtered = useMemo(() => rejected.filter((r) => {
    if (search && !r.id.toLowerCase().includes(search.toLowerCase()) && !r.title.toLowerCase().includes(search.toLowerCase())) return false
    if (typeFilter !== "All" && r.type !== typeFilter) return false
    return true
  }), [search, typeFilter, rejected])

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Rejected Requests</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{rejected.length} rejected requests</p>
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

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <ThumbsDown className="mx-auto mb-3 h-10 w-10 text-zinc-300 dark:text-zinc-600" />
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">No rejected requests</h3>
            <p className="mt-1 text-sm text-zinc-400">No rejected requests match your search or filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((req) => (
              <div key={req.id} className="rounded-xl border border-red-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-red-900/50 dark:bg-zinc-950">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColors[req.type]}`}>{req.type}</span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400">
                        <XCircle className="h-3 w-3" /> Rejected
                      </span>
                      {resubmitted[req.id] && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-400">
                          <RotateCcw className="h-3 w-3" /> Re-submitted
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">{req.title}</h3>
                    <p className="text-xs font-mono text-indigo-600 dark:text-indigo-400">{req.id}</p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                </div>

                {req.remarks && (
                  <div className="mt-3 rounded-lg border border-red-100 bg-red-50 p-3 dark:border-red-900/50 dark:bg-red-950/20">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 mt-0.5 shrink-0 text-red-400" />
                      <div>
                        <p className="text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wider">Rejection Reason</p>
                        <p className="mt-0.5 text-sm text-red-700 dark:text-red-300">{req.remarks}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> Submitted {req.submittedDate}
                  </span>
                  {req.riskFlags.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-amber-500">
                      <AlertTriangle className="h-3.5 w-3.5" /> {req.riskFlags.length} risk flag{req.riskFlags.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                <div className="mt-4 border-t border-red-100 pt-4 dark:border-red-900/30">
                  <button onClick={() => setResubmitted((prev) => ({ ...prev, [req.id]: true }))}
                    disabled={!!resubmitted[req.id]}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium shadow-sm ${
                      resubmitted[req.id]
                        ? "bg-zinc-100 text-zinc-400 cursor-not-allowed dark:bg-zinc-800"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}>
                    <RotateCcw className="h-4 w-4" />
                    {resubmitted[req.id] ? "Re-submitted" : "Re-submit for Approval"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
