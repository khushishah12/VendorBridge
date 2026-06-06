"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  DollarSign,
  User,
  Calendar,
  MessageSquare,
  FileText,
  Inbox,
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

export default function ApprovedRequestsPage() {
  const [search, setSearch] = useState("")
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const approved = useMemo(() => approvalRequests.filter((r) => r.status === "Approved"), [])

  const filtered = useMemo(() => approved.filter((r) => {
    if (search && !r.id.toLowerCase().includes(search.toLowerCase()) && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.submittedBy.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [search, approved])

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Approved Requests</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{approved.length} approved requests</p>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, title, or requester..."
              className="w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <Inbox className="mx-auto mb-3 h-10 w-10 text-zinc-300 dark:text-zinc-600" />
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">No approved requests</h3>
            <p className="mt-1 text-sm text-zinc-400">Approved requests will appear here once approvals are granted.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                  <th className="px-4 py-3 w-8"></th>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Submitted By</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3">Approved Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filtered.map((req) => (
                  <>
                    <tr key={req.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer"
                      onClick={() => setExpanded((prev) => ({ ...prev, [req.id]: !prev[req.id] }))}>
                      <td className="px-4 py-3">
                        <button className="text-zinc-400 hover:text-zinc-600">
                          {expanded[req.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </button>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs font-medium text-indigo-600 dark:text-indigo-400">{req.id}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-zinc-800 dark:text-zinc-200">{req.title}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColors[req.type]}`}>{req.type}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                          <User className="h-3.5 w-3.5" /> {req.submittedBy}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-zinc-800 dark:text-zinc-200">
                        <span className="inline-flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5 text-zinc-400" /> {req.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-500">{req.submittedDate}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors.Approved}`}>
                          <CheckCircle2 className="h-3 w-3" /> Approved
                        </span>
                      </td>
                    </tr>
                    {expanded[req.id] && (
                      <tr key={`${req.id}-expanded`}>
                        <td colSpan={8} className="px-4 py-4 bg-zinc-50/50 dark:bg-zinc-900/50">
                          <div className="ml-6 flex items-start gap-3">
                            <MessageSquare className="h-4 w-4 mt-0.5 text-zinc-400 shrink-0" />
                            <div>
                              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Remarks</p>
                              <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300 italic">
                                {req.remarks || "No remarks provided."}
                              </p>
                            </div>
                          </div>
                          <div className="ml-6 mt-3 flex items-center gap-1.5 text-xs text-zinc-400">
                            <Calendar className="h-3.5 w-3.5" />
                            Approved on {req.submittedDate} &middot; Due by {req.deadline}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
