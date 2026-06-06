"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  Clock, AlertTriangle, DollarSign, Activity, CheckCircle, XCircle,
  Bell, Calendar, AlertCircle, ChevronRight, Zap
} from "lucide-react"
import { approvalRequests, workflowItems, managerNotifications } from "@/lib/manager-data"
import type { ApprovalRequest } from "@/lib/manager-data"
import AnimatedCounter from "@/components/ui/AnimatedCounter"

function typeBadgeColor(type: ApprovalRequest["type"]) {
  switch (type) {
    case "RFQ": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
    case "Quotation": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
    case "Purchase Order": return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
    case "Invoice": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
  }
}

function deadlineUrgency(deadline: string): { color: string; label: string } {
  const diff = new Date(deadline).getTime() - Date.now()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (diff <= 0) return { color: "text-red-600 dark:text-red-400 font-semibold", label: "Expired" }
  if (days <= 2) return { color: "text-red-600 dark:text-red-400 font-semibold", label: `${days}d left` }
  if (days <= 5) return { color: "text-amber-600 dark:text-amber-400 font-medium", label: `${days}d left` }
  return { color: "text-zinc-500 dark:text-zinc-400", label: `${days}d left` }
}

function formatAmount(amount: number) {
  return "$" + amount.toLocaleString()
}

function formatTimestamp(ts: string) {
  const d = new Date(ts)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " " +
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
}

export default function ManagerDashboardPage() {
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: "approve" | "reject" } | null>(null)
  const [remark, setRemark] = useState("")
  const [actionDone, setActionDone] = useState<string[]>([])

  const stats = useMemo(() => ({
    pendingApprovals: approvalRequests.filter((r) => r.status === "Pending" || r.status === "Urgent").length,
    highPriority: approvalRequests.filter((r) => r.priority === "High").length,
    totalValue: approvalRequests.filter((r) => r.status === "Pending").reduce((sum, r) => sum + r.amount, 0),
    bottlenecks: workflowItems.filter((w) => w.bottleneck).length,
  }), [])

  const pendingItems = useMemo(
    () => approvalRequests.filter((r) => r.status === "Pending" || r.status === "Urgent").slice(0, 5),
    [],
  )

  const recentNotifications = useMemo(
    () => managerNotifications.filter((n) => n.read).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 3),
    [],
  )

  const bottleneckItems = useMemo(
    () => workflowItems.filter((w) => w.bottleneck),
    [],
  )

  function handleConfirm(id: string) {
    setActionDone((prev) => [...prev, id])
    setConfirmAction(null)
    setRemark("")
  }

  const statCards = [
    { label: "Pending Approvals", value: stats.pendingApprovals, icon: Clock, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400" },
    { label: "High Priority", value: stats.highPriority, icon: AlertTriangle, color: "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400" },
    { label: "Total Value", value: formatAmount(stats.totalValue), icon: DollarSign, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400" },
    { label: "Bottlenecks", value: stats.bottlenecks, icon: Activity, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400" },
  ]

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Decision Overview Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Pending approvals, bottlenecks, and recent activity at a glance
          </p>
        </div>

        {/* Stat Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon
            return (
              <div key={card.label} className="card-hover rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold text-zinc-900 dark:text-zinc-50"><AnimatedCounter value={card.value} /></p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{card.label}</p>
              </div>
            )
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Pending Approvals Table */}
          <div className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Pending Approvals</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Submitted By</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Deadline</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {pendingItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-zinc-400">
                        <CheckCircle className="mx-auto mb-2 h-8 w-8 opacity-50" />
                        No pending approvals
                      </td>
                    </tr>
                  ) : (
                    pendingItems.map((req) => {
                      const urg = deadlineUrgency(req.deadline)
                      const isUrgent = req.status === "Urgent"
                      const done = actionDone.includes(req.id)
                      const confirming = confirmAction?.id === req.id
                      return (
                        <tr key={req.id} className={`row-hover ${isUrgent ? "border-l-2 border-l-red-500" : ""}`}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${typeBadgeColor(req.type)}`}>
                                {req.type === "Purchase Order" ? "PO" : req.type === "Quotation" ? "Quote" : req.type}
                              </span>
                              {isUrgent && (
                                <span className="inline-flex items-center gap-0.5 rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-950/40 dark:text-red-400">
                                  <Zap className="h-2.5 w-2.5" /> URGENT
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium text-zinc-800 dark:text-zinc-200">{req.title}</td>
                          <td className="px-4 py-3 text-zinc-500">{req.submittedBy}</td>
                          <td className="px-4 py-3 text-right font-medium text-zinc-900 dark:text-zinc-100">{formatAmount(req.amount)}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                              req.priority === "High" ? "text-red-600 dark:text-red-400" :
                              req.priority === "Medium" ? "text-amber-600 dark:text-amber-400" :
                              "text-blue-600 dark:text-blue-400"
                            }`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${
                                req.priority === "High" ? "bg-red-500" :
                                req.priority === "Medium" ? "bg-amber-500" : "bg-blue-500"
                              }`} />
                              {req.priority}
                            </span>
                          </td>
                          <td className={`px-4 py-3 text-xs ${urg.color}`}>{urg.label}</td>
                          <td className="px-4 py-3 text-right">
                            {done ? (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                <CheckCircle className="h-4 w-4" /> Done
                              </span>
                            ) : confirming ? (
                              <div className="flex flex-col items-end gap-1.5">
                                <textarea
                                  value={remark}
                                  onChange={(e) => setRemark(e.target.value)}
                                  placeholder="Add remark (optional)..."
                                  rows={2}
                                  className="w-48 rounded border border-zinc-300 px-2 py-1 text-xs focus:border-indigo-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200"
                                />
                                <div className="flex gap-1">
                                  <button onClick={() => handleConfirm(req.id)}
                                    className="rounded bg-emerald-600 px-2 py-1 text-xs font-medium text-white hover:bg-emerald-700">
                                    <CheckCircle className="inline h-3 w-3 mr-0.5" /> Confirm
                                  </button>
                                  <button onClick={() => { setConfirmAction(null); setRemark("") }}
                                    className="rounded border border-zinc-300 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400">
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1">
                                <button onClick={() => setConfirmAction({ id: req.id, action: "approve" })}
                                  className="rounded bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-700">
                                  Approve
                                </button>
                                <button onClick={() => setConfirmAction({ id: req.id, action: "reject" })}
                                  className="rounded bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700">
                                  Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Recent Activity</h2>
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {recentNotifications.length === 0 ? (
                  <div className="flex flex-col items-center py-8 text-zinc-400">
                    <Bell className="mb-2 h-8 w-8" />
                    <p className="text-sm">No recent activity</p>
                  </div>
                ) : (
                  recentNotifications.map((n) => (
                    <div key={n.id} className="px-5 py-3.5">
                      <div className="flex items-start gap-3">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          n.type === "approval" ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" :
                          n.type === "alert" ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" :
                          n.type === "urgent" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
                          "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                        }`}>
                          <Bell className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{n.title}</p>
                          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">{n.message}</p>
                          <p className="mt-1 text-[10px] text-zinc-400 dark:text-zinc-500">{formatTimestamp(n.timestamp)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Bottleneck Alerts */}
            <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Bottleneck Alerts</h2>
                </div>
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {bottleneckItems.length === 0 ? (
                  <div className="flex flex-col items-center py-8 text-zinc-400">
                    <Activity className="mb-2 h-8 w-8" />
                    <p className="text-sm">No bottlenecks detected</p>
                  </div>
                ) : (
                  bottleneckItems.map((item) => (
                    <div key={item.id} className="px-5 py-3.5 border-l-2 border-l-red-400">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{item.title}</p>
                          </div>
                          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                            {item.department} · {formatAmount(item.value)}
                          </p>
                          <p className="mt-0.5 text-xs text-red-600 dark:text-red-400">
                            {item.bottleneckReason} ({item.daysInStage} days in stage)
                          </p>
                        </div>
                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-zinc-300 dark:text-zinc-600" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
