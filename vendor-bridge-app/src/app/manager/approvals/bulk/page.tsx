"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  CheckSquare,
  Square,
  CheckCircle2,
  XCircle,
  DollarSign,
  User,
  Building2,
  Zap,
  AlertTriangle,
  Clock,
  Inbox,
} from "lucide-react"
import { approvalRequests } from "@/lib/manager-data"

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

export default function BulkApprovalsPage() {
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [showConfirm, setShowConfirm] = useState<"approve" | "reject" | null>(null)
  const [actionDone, setActionDone] = useState(false)

  const pending = useMemo(() => approvalRequests.filter((r) => r.status === "Pending" || r.status === "Urgent"), [])

  const allSelected = pending.length > 0 && pending.every((r) => selected[r.id])
  const selectedCount = Object.values(selected).filter(Boolean).length

  function toggleAll() {
    if (allSelected) {
      setSelected({})
    } else {
      const all: Record<string, boolean> = {}
      pending.forEach((r) => { all[r.id] = true })
      setSelected(all)
    }
  }

  function toggleOne(id: string) {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function handleBulkAction(action: "approve" | "reject") {
    setShowConfirm(action)
  }

  function confirmAction() {
    setShowConfirm(null)
    setActionDone(true)
    setTimeout(() => setActionDone(false), 3000)
    setSelected({})
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Bulk Approvals</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{pending.length} requests pending &middot; {selectedCount} selected</p>
        </div>

        {actionDone && (
          <div className="mb-4 rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            Selected requests have been processed successfully.
          </div>
        )}

        {selectedCount > 0 && (
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-indigo-200 bg-indigo-50 p-4 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40">
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">{selectedCount} request{selectedCount > 1 ? "s" : ""} selected</span>
            <button onClick={() => handleBulkAction("approve")}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700">
              <CheckCircle2 className="h-4 w-4" /> Approve Selected
            </button>
            <button onClick={() => handleBulkAction("reject")}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700">
              <XCircle className="h-4 w-4" /> Reject Selected
            </button>
          </div>
        )}

        {pending.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <Inbox className="mx-auto mb-3 h-10 w-10 text-zinc-300 dark:text-zinc-600" />
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">No pending items</h3>
            <p className="mt-1 text-sm text-zinc-400">All approval requests have been processed.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                  <th className="px-4 py-3 w-10">
                    <button onClick={toggleAll} className="text-zinc-400 hover:text-indigo-600">
                      {allSelected ? <CheckSquare className="h-5 w-5 text-indigo-600" /> : <Square className="h-5 w-5" />}
                    </button>
                  </th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {pending.map((req) => (
                  <tr key={req.id} className={`transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900 ${
                    selected[req.id] ? "bg-indigo-50/50 dark:bg-indigo-950/20" : ""
                  }`}>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleOne(req.id)} className="text-zinc-400 hover:text-indigo-600">
                        {selected[req.id] ? <CheckSquare className="h-5 w-5 text-indigo-600" /> : <Square className="h-5 w-5" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColors[req.type]}`}>{req.type}</span>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="font-medium text-zinc-800 dark:text-zinc-200 truncate">{req.title}</p>
                      <p className="text-xs font-mono text-zinc-400">{req.id}</p>
                    </td>
                    <td className="px-4 py-3 font-medium text-zinc-800 dark:text-zinc-200">
                      <span className="inline-flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5 text-zinc-400" /> {req.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                        <Building2 className="h-3.5 w-3.5" /> {req.department}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${priorityColors[req.priority]}`}>
                        <Zap className="h-3.5 w-3.5" /> {req.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {req.status === "Urgent" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
                          <AlertTriangle className="h-3.5 w-3.5" /> Urgent
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                          <Clock className="h-3.5 w-3.5" /> Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="mx-4 w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
              <div className="flex items-center gap-3 mb-4">
                {showConfirm === "approve" ? (
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-500" />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {showConfirm === "approve" ? "Approve" : "Reject"} {selectedCount} Request{selectedCount > 1 ? "s" : ""}?
                  </h3>
                  <p className="text-sm text-zinc-500">This action cannot be undone.</p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowConfirm(null)}
                  className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  Cancel
                </button>
                <button onClick={confirmAction}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm ${
                    showConfirm === "approve" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"
                  }`}>
                  {showConfirm === "approve" ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  Confirm {showConfirm === "approve" ? "Approval" : "Rejection"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
