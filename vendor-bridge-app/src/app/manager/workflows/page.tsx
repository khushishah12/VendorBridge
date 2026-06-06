"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  Search, AlertTriangle, AlertCircle, CheckCircle, XCircle,
  Clock, Activity, ChevronRight, Zap, FileText, Receipt,
  ShoppingCart, BarChart3, Calendar
} from "lucide-react"
import { approvalRequests, workflowItems } from "@/lib/manager-data"

function formatAmount(amount: number) {
  return "$" + amount.toLocaleString()
}

function statusBadgeColor(status: string) {
  const s = status.toLowerCase()
  if (["draft", "sent", "none", "not required"].includes(s)) return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
  if (["open", "received", "under review"].includes(s)) return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
  if (["shortlisted"].includes(s)) return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
  if (["accepted", "approved", "completed", "generated"].includes(s)) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
  if (["rejected", "cancelled"].includes(s)) return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
  if (["pending"].includes(s)) return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
  return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
}

function displayStatus(status: string, type: string) {
  if (type === "quotation" && status.toLowerCase() === "none") return "—"
  return status
}

function approvalTypeIcon(type: string) {
  switch (type) {
    case "RFQ": return FileText
    case "Quotation": return Receipt
    case "Purchase Order": return ShoppingCart
    case "Invoice": return Clock
    default: return FileText
  }
}

const departments = ["IT", "Facilities", "Medical", "Admin"]

export default function ManagerWorkflowsPage() {
  const [search, setSearch] = useState("")
  const [deptFilter, setDeptFilter] = useState("All")

  const filtered = useMemo(() => {
    return workflowItems.filter((w) => {
      if (search && !w.title.toLowerCase().includes(search.toLowerCase())) return false
      if (deptFilter !== "All" && w.department !== deptFilter) return false
      return true
    })
  }, [search, deptFilter])

  const bottleneckCount = useMemo(() => workflowItems.filter((w) => w.bottleneck).length, [])

  const historyItems = useMemo(
    () => approvalRequests
      .filter((r) => r.status === "Approved" || r.status === "Rejected")
      .sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())
      .slice(0, 3),
    [],
  )

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Workflow Pipeline</h1>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {workflowItems.length} active workflows
                {bottleneckCount > 0 && (
                  <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-950/40 dark:text-red-400">
                    <AlertTriangle className="h-3 w-3" /> {bottleneckCount} bottleneck{bottleneckCount > 1 ? "s" : ""}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title..."
              className="w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
          >
            <option value="All">All Departments</option>
            {departments.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          {(search || deptFilter !== "All") && (
            <button onClick={() => { setSearch(""); setDeptFilter("All") }}
              className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300">
              Clear filters
            </button>
          )}
        </div>

        {/* Pipeline Table */}
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3 text-right">Value</th>
                <th className="px-4 py-3 text-center">RFQ</th>
                <th className="px-4 py-3 text-center">Quotation</th>
                <th className="px-4 py-3 text-center">Approval</th>
                <th className="px-4 py-3 text-center">PO</th>
                <th className="px-4 py-3 text-center">Days</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-zinc-400">
                    <Activity className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    No workflows found
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className={`transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900 ${item.bottleneck ? "border-l-2 border-l-red-500" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {item.bottleneck && (
                          <span title={item.bottleneckReason} className="shrink-0">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          </span>
                        )}
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">{item.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{item.department}</td>
                    <td className="px-4 py-3 text-right font-medium text-zinc-900 dark:text-zinc-100">{formatAmount(item.value)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeColor(item.rfqStatus)}`}>
                        {item.rfqStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeColor(item.quotationStatus)}`}>
                        {displayStatus(item.quotationStatus, "quotation")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeColor(item.approvalStatus)}`}>
                        {item.approvalStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeColor(item.poStatus)}`}>
                        {item.poStatus === "None" ? "—" : item.poStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-zinc-500">{item.daysInStage > 0 ? `${item.daysInStage}d` : "—"}</td>
                    <td className="px-4 py-3 text-center">
                      {item.bottleneck ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400" title={item.bottleneckReason}>
                          <AlertCircle className="h-3.5 w-3.5" /> Bottleneck
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-400">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Approval History Timeline */}
        <div className="mt-6 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Approval History Timeline</h2>
          </div>
          <div className="px-5 py-4">
            {historyItems.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-zinc-400">
                <Clock className="mb-2 h-8 w-8" />
                <p className="text-sm">No approval history</p>
              </div>
            ) : (
              <div className="relative ml-2">
                {historyItems.map((item, idx) => {
                  const Icon = approvalTypeIcon(item.type)
                  const isApproved = item.status === "Approved"
                  return (
                    <div key={item.id} className="relative flex gap-4 pb-6 last:pb-0">
                      {/* Vertical line */}
                      {idx < historyItems.length - 1 && (
                        <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-zinc-200 dark:bg-zinc-700" />
                      )}
                      {/* Icon circle */}
                      <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        isApproved
                          ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                      }`}>
                        {isApproved ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                                isApproved
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              }`}>{item.status}</span>
                              <span className="text-xs text-zinc-400">{item.submittedDate}</span>
                            </div>
                            <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">{item.title}</p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">by {item.submittedBy} · {item.department}</p>
                            {item.remarks && (
                              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 italic">
                                "{item.remarks}"
                              </p>
                            )}
                          </div>
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                            item.type === "RFQ" ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" :
                            item.type === "Quotation" ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" :
                            item.type === "Purchase Order" ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" :
                            "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                          }`}>
                            <Icon className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
