"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { vendorQuotations, type VendorQuoteStatus } from "@/lib/vendor-quotation-data"
import {
  Search,
  FileText,
  Building2,
  DollarSign,
  Calendar,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ListFilter,
} from "lucide-react"

const statuses: VendorQuoteStatus[] = ["Draft", "Submitted", "Under Review", "Shortlisted", "Accepted", "Rejected"]

function statusBadge(status: VendorQuoteStatus) {
  const map: Record<VendorQuoteStatus, string> = {
    Draft: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
    Submitted: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "Under Review": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    Shortlisted: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    Accepted: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    Rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  }
  return map[status]
}

function priorityBadge(priority: string) {
  const map: Record<string, string> = {
    High: "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400",
    Medium: "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
    Low: "bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400",
  }
  return map[priority] || ""
}

export default function VendorQuotationsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return vendorQuotations.filter((q) => {
      if (search && !q.id.toLowerCase().includes(search.toLowerCase()) && !q.rfqTitle.toLowerCase().includes(search.toLowerCase()))
        return false
      if (statusFilter !== "All" && q.status !== statusFilter) return false
      return true
    })
  }, [search, statusFilter])

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: vendorQuotations.length }
    statuses.forEach((s) => (c[s] = vendorQuotations.filter((q) => q.status === s).length))
    return c
  }, [])

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">My Quotations</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {filtered.length} quotation{filtered.length !== 1 && "s"} — manage all your submissions
          </p>
        </div>

        {/* Search + Filter */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID or RFQ title..."
              className="w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-3 text-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
          <div className="relative">
            <ListFilter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none rounded-lg border border-zinc-300 py-2 pl-9 pr-8 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
            >
              <option value="All">All Statuses</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 py-16 dark:border-zinc-700">
            <FileText className="mb-3 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
            <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400">No quotations found</p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">RFQ Title</th>
                    <th className="px-4 py-3">Company</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Submitted</th>
                    <th className="px-4 py-3">Expiry</th>
                    <th className="px-4 py-3">Notes</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filtered.map((q) => (
                    <>
                      <tr
                        key={q.id}
                        className="group cursor-pointer transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                        onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                      >
                        <td className="px-4 py-3 font-mono text-xs font-medium text-indigo-600 dark:text-indigo-400">
                          {q.id}
                        </td>
                        <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{q.rfqTitle}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                            <Building2 className="h-3.5 w-3.5" />
                            {q.company}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                          ${q.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadge(q.status)}`}
                          >
                            {q.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${priorityBadge(q.priority)}`}
                          >
                            {q.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400">{q.submittedDate}</td>
                        <td className="px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400">{q.expiryDate}</td>
                        <td className="max-w-[180px] truncate px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400">
                          {q.notes}
                        </td>
                        <td className="px-4 py-3">
                          {expandedId === q.id ? (
                            <ChevronUp className="h-4 w-4 text-zinc-400" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-zinc-400" />
                          )}
                        </td>
                      </tr>
                      {expandedId === q.id && (
                        <tr key={`${q.id}-items`} className="bg-zinc-50/50 dark:bg-zinc-900/30">
                          <td colSpan={10} className="px-4 py-3">
                            <div className="text-xs text-zinc-500 dark:text-zinc-400">
                              <p className="mb-2 font-medium text-zinc-700 dark:text-zinc-300">Line Items</p>
                              {q.items.length === 0 ? (
                                <span className="italic">No items listed</span>
                              ) : (
                                <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
                                  <table className="w-full text-xs">
                                    <thead>
                                      <tr className="bg-zinc-100 text-left font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                                        <th className="px-3 py-2">Item</th>
                                        <th className="px-3 py-2">Qty</th>
                                        <th className="px-3 py-2">Unit Price</th>
                                        <th className="px-3 py-2">Total</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                                      {q.items.map((item, i) => (
                                        <tr key={i} className="text-zinc-700 dark:text-zinc-300">
                                          <td className="px-3 py-1.5">{item.name}</td>
                                          <td className="px-3 py-1.5">{item.quantity}</td>
                                          <td className="px-3 py-1.5">${item.unitPrice.toLocaleString()}</td>
                                          <td className="px-3 py-1.5">${item.total.toLocaleString()}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-zinc-500" /> Total: {counts.All}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-blue-500" /> Draft: {counts["Draft"]}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-blue-500" /> Submitted: {counts["Submitted"]}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-indigo-500" /> Under Review: {counts["Under Review"]}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-500" /> Shortlisted: {counts["Shortlisted"]}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Accepted: {counts["Accepted"]}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-red-500" /> Rejected: {counts["Rejected"]}
          </span>
        </div>
      </div>
    </DashboardLayout>
  )
}
