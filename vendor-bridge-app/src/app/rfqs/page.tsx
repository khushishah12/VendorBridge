"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  Search,
  Filter,
  Eye,
  Edit,
  Send,
  XCircle,
  ChevronDown,
  SlidersHorizontal,
  Plus,
  FileText,
  Users,
  MessageSquare,
  Clock,
  RotateCcw,
} from "lucide-react"
import Link from "next/link"

type RfqStatus = "Draft" | "Sent" | "Open" | "Closed" | "Expired"
type Priority = "Low" | "Medium" | "High"

interface Rfq {
  id: string
  title: string
  createdDate: string
  deadline: string
  status: RfqStatus
  priority: Priority
  department: string
  vendorsInvited: number
  quotationsReceived: number
}

const mockRfqs: Rfq[] = [
  { id: "RFQ-2025-0001", title: "Office Laptops Procurement", createdDate: "2025-05-01", deadline: "2025-06-15", status: "Open", priority: "High", department: "IT", vendorsInvited: 8, quotationsReceived: 3 },
  { id: "RFQ-2025-0002", title: "Construction Materials - Phase 2", createdDate: "2025-05-05", deadline: "2025-06-20", status: "Sent", priority: "Medium", department: "Construction", vendorsInvited: 5, quotationsReceived: 0 },
  { id: "RFQ-2025-0003", title: "Office Furniture & Workstations", createdDate: "2025-04-20", deadline: "2025-06-01", status: "Draft", priority: "Low", department: "Admin", vendorsInvited: 0, quotationsReceived: 0 },
  { id: "RFQ-2025-0004", title: "Cloud Infrastructure Services", createdDate: "2025-04-10", deadline: "2025-05-25", status: "Closed", priority: "High", department: "IT", vendorsInvited: 6, quotationsReceived: 4 },
  { id: "RFQ-2025-0005", title: "Medical Equipment Supply", createdDate: "2025-04-01", deadline: "2025-05-01", status: "Expired", priority: "Medium", department: "Medical", vendorsInvited: 4, quotationsReceived: 2 },
  { id: "RFQ-2025-0006", title: "Annual Maintenance Services", createdDate: "2025-05-15", deadline: "2025-07-01", status: "Draft", priority: "Low", department: "Services", vendorsInvited: 0, quotationsReceived: 0 },
  { id: "RFQ-2025-0007", title: "Network Equipment Upgrade", createdDate: "2025-05-12", deadline: "2025-06-28", status: "Open", priority: "High", department: "IT", vendorsInvited: 10, quotationsReceived: 5 },
  { id: "RFQ-2025-0008", title: "Office Supplies - Q3", createdDate: "2025-06-01", deadline: "2025-07-15", status: "Sent", priority: "Low", department: "Admin", vendorsInvited: 12, quotationsReceived: 0 },
]

const departments = ["IT", "Construction", "Admin", "Medical", "Services"]
const priorities: Priority[] = ["Low", "Medium", "High"]
const statuses: RfqStatus[] = ["Draft", "Sent", "Open", "Closed", "Expired"]

const statusStyles: Record<RfqStatus, string> = {
  Draft: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
  Sent: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
  Open: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  Closed: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
  Expired: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800",
}

const priorityStyles: Record<Priority, string> = {
  Low: "text-blue-600 dark:text-blue-400",
  Medium: "text-amber-600 dark:text-amber-400",
  High: "text-red-600 dark:text-red-400",
}

export default function AllRfqsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<RfqStatus | "All">("All")
  const [deptFilter, setDeptFilter] = useState<string>("All")
  const [priorityFilter, setPriorityFilter] = useState<Priority | "All">("All")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [actionMenuRfq, setActionMenuRfq] = useState<string | null>(null)
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: string } | null>(null)

  const filtered = useMemo(() => {
    return mockRfqs.filter((rfq) => {
      if (search && !rfq.title.toLowerCase().includes(search.toLowerCase()) && !rfq.id.toLowerCase().includes(search.toLowerCase())) return false
      if (statusFilter !== "All" && rfq.status !== statusFilter) return false
      if (deptFilter !== "All" && rfq.department !== deptFilter) return false
      if (priorityFilter !== "All" && rfq.priority !== priorityFilter) return false
      if (dateFrom && rfq.createdDate < dateFrom) return false
      if (dateTo && rfq.createdDate > dateTo) return false
      return true
    })
  }, [search, statusFilter, deptFilter, priorityFilter, dateFrom, dateTo])

  function handleAction(rfqId: string, action: string) {
    setActionMenuRfq(null)
    if (action === "close" || action === "resend") {
      setConfirmAction({ id: rfqId, action })
    }
  }

  function executeConfirmedAction() {
    setConfirmAction(null)
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">All RFQs</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {filtered.length} of {mockRfqs.length} RFQs
            </p>
          </div>
          <Link
            href="/rfqs/create"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Create RFQ
          </Link>
        </div>

        {/* Search + Filter Toggle */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or ID..."
              className="w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-3 text-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
              showFilters
                ? "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300"
                : "border-zinc-300 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {(statusFilter !== "All" || deptFilter !== "All" || priorityFilter !== "All" || dateFrom || dateTo) && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">!</span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mb-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">Status</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as RfqStatus | "All")}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
                  <option value="All">All</option>
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">Department</label>
                <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
                  <option value="All">All</option>
                  {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">Priority</label>
                <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as Priority | "All")}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
                  <option value="All">All</option>
                  {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">From</label>
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">To</label>
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
              </div>
              <button onClick={() => { setStatusFilter("All"); setDeptFilter("All"); setPriorityFilter("All"); setDateFrom(""); setDateTo("") }}
                className="rounded-lg px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                <th className="px-4 py-3">RFQ ID</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Deadline</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3 text-center">Vendors</th>
                <th className="px-4 py-3 text-center">Quotations</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-zinc-400">
                    <FileText className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    No RFQs found matching your filters
                  </td>
                </tr>
              ) : (
                filtered.map((rfq) => (
                  <tr key={rfq.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-indigo-600 dark:text-indigo-400">
                      {rfq.id}
                    </td>
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                      {rfq.title}
                      <span className="ml-2 text-xs text-zinc-400">{rfq.department}</span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{rfq.createdDate}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-zinc-500">
                        <Clock className="h-3 w-3" />
                        {rfq.deadline}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[rfq.status]}`}>
                        {rfq.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${priorityStyles[rfq.priority]}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${rfq.priority === "High" ? "bg-red-500" : rfq.priority === "Medium" ? "bg-amber-500" : "bg-blue-500"}`} />
                        {rfq.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
                        <Users className="h-3 w-3" />
                        {rfq.vendorsInvited}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
                        <MessageSquare className="h-3 w-3" />
                        {rfq.quotationsReceived}
                      </span>
                    </td>
                    <td className="relative px-4 py-3 text-right">
                      <button
                        onClick={() => setActionMenuRfq(actionMenuRfq === rfq.id ? null : rfq.id)}
                        className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      {actionMenuRfq === rfq.id && (
                        <div className="absolute right-4 top-10 z-10 w-48 rounded-xl border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                          <button onClick={() => { setActionMenuRfq(null) }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800">
                            <Eye className="h-4 w-4" /> View Details
                          </button>
                          {rfq.status === "Draft" && (
                            <button onClick={() => { setActionMenuRfq(null) }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800">
                              <Edit className="h-4 w-4" /> Edit
                            </button>
                          )}
                          {rfq.status !== "Draft" && rfq.status !== "Expired" && (
                            <button onClick={() => handleAction(rfq.id, "resend")} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-blue-600 transition-colors hover:bg-zinc-50 dark:text-blue-400 dark:hover:bg-zinc-800">
                              <RotateCcw className="h-4 w-4" /> Resend RFQ
                            </button>
                          )}
                          {(rfq.status === "Open" || rfq.status === "Sent") && (
                            <button onClick={() => handleAction(rfq.id, "close")} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-zinc-50 dark:text-red-400 dark:hover:bg-zinc-800">
                              <XCircle className="h-4 w-4" /> Close RFQ
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Stats footer */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Open: {mockRfqs.filter(r => r.status === "Open").length}</span>
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> Sent: {mockRfqs.filter(r => r.status === "Sent").length}</span>
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-zinc-400" /> Draft: {mockRfqs.filter(r => r.status === "Draft").length}</span>
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-purple-500" /> Closed: {mockRfqs.filter(r => r.status === "Closed").length}</span>
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" /> Expired: {mockRfqs.filter(r => r.status === "Expired").length}</span>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {confirmAction.action === "close" ? "Close RFQ" : "Resend RFQ"}
            </h3>
            <p className="mt-2 text-sm text-zinc-500">
              {confirmAction.action === "close"
                ? `Are you sure you want to close ${confirmAction.id}? Vendors will no longer be able to submit quotations.`
                : `Resend ${confirmAction.id} to vendors? This will send a new invitation.`}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setConfirmAction(null)}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                Cancel
              </button>
              <button onClick={executeConfirmedAction}
                className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${
                  confirmAction.action === "close"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}>
                {confirmAction.action === "close" ? "Close RFQ" : "Resend"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
