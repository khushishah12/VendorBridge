"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  Search, LogIn, FileText, CheckCircle, ShoppingCart,
  Receipt, User, Building2, Download, X, Filter,
} from "lucide-react"
import { systemLogs } from "@/lib/admin-data"
import type { SystemLog } from "@/lib/admin-data"

const typeColors: Record<string, string> = {
  auth: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  rfq: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  approval: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  po: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  invoice: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  user: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  vendor: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
}

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  auth: LogIn,
  rfq: FileText,
  approval: CheckCircle,
  po: ShoppingCart,
  invoice: Receipt,
  user: User,
  vendor: Building2,
}

const typeLabels = ["All", "Auth", "RFQ", "Approval", "PO", "Invoice", "User", "Vendor"] as const
const typeMap: Record<string, SystemLog["type"]> = {
  Auth: "auth", RFQ: "rfq", Approval: "approval", PO: "po",
  Invoice: "invoice", User: "user", Vendor: "vendor",
}

function formatTimestamp(ts: string) {
  const d = new Date(ts)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + " " +
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
}

export default function AdminLogsPage() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("All")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(() => systemLogs.filter((log) => {
    if (search) {
      const q = search.toLowerCase()
      if (!log.user.toLowerCase().includes(q) && !log.action.toLowerCase().includes(q) && !log.details.toLowerCase().includes(q)) return false
    }
    if (typeFilter !== "All") {
      const mapped = typeMap[typeFilter]
      if (log.type !== mapped) return false
    }
    if (dateFrom && new Date(log.timestamp) < new Date(dateFrom)) return false
    if (dateTo) {
      const end = new Date(dateTo)
      end.setHours(23, 59, 59, 999)
      if (new Date(log.timestamp) > end) return false
    }
    return true
  }), [search, typeFilter, dateFrom, dateTo])

  const hasActiveFilters = search || typeFilter !== "All" || dateFrom || dateTo

  function resetFilters() {
    setSearch("")
    setTypeFilter("All")
    setDateFrom("")
    setDateTo("")
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">System Logs</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{systemLogs.length} total entries</p>
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-600 shadow-sm hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>

        <div className="mb-4 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by user, action, or details..."
                className="w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
            </div>
            <div className="flex items-center gap-1.5">
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
              <span className="text-xs text-zinc-400">to</span>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
            </div>
            {hasActiveFilters && (
              <button onClick={resetFilters}
                className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-500 hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-800">
                <X className="h-3.5 w-3.5" /> Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {typeLabels.map((t) => (
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
            <Filter className="mx-auto mb-3 h-10 w-10 text-zinc-300 dark:text-zinc-600" />
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">No logs found</h3>
            <p className="mt-1 text-sm text-zinc-400">
              {hasActiveFilters ? "Try adjusting your search or filter criteria." : "No system logs available yet."}
            </p>
            {hasActiveFilters && (
              <button onClick={resetFilters}
                className="mt-4 inline-flex items-center gap-1 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800">
                <X className="h-4 w-4" /> Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                    <th className="px-4 py-3">Timestamp</th>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Details</th>
                    <th className="px-4 py-3">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filtered.map((log) => {
                    const Icon = typeIcons[log.type]
                    const isExpanded = expandedId === log.id
                    return (
                      <tr key={log.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900">
                        <td className="whitespace-nowrap px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400">
                          {formatTimestamp(log.timestamp)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                              {log.user.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-zinc-800 dark:text-zinc-200">{log.user}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-50">
                          {log.action}
                        </td>
                        <td className="max-w-xs px-4 py-3">
                          <button onClick={() => setExpandedId(isExpanded ? null : log.id)}
                            className="text-left text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200">
                            <span className={isExpanded ? "" : "line-clamp-1"}>{log.details}</span>
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <Icon className="h-3.5 w-3.5" />
                            <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColors[log.type]}`}>
                              {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="border-t border-zinc-200 px-4 py-3 text-center text-xs text-zinc-400 dark:border-zinc-800">
              Showing {filtered.length} of {systemLogs.length} entries
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
