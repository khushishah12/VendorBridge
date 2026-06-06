"use client"

import { useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  Users, Building2, FileText, ShoppingCart, Receipt, DollarSign,
  TrendingUp, AlertTriangle, Activity, Clock, UserX, AlertCircle, CheckCircle
} from "lucide-react"
import { adminUsers, systemLogs, analyticsSummary } from "@/lib/admin-data"

function formatTimestamp(ts: string) {
  const d = new Date(ts)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " " +
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
}

function formatAmount(amount: number) {
  if (amount >= 1_000_000) return "$" + (amount / 1_000_000).toFixed(1) + "M"
  if (amount >= 1_000) return "$" + (amount / 1_000).toFixed(1) + "K"
  return "$" + amount.toLocaleString()
}

const typeIconMap: Record<string, React.ElementType> = {
  auth: Activity,
  rfq: FileText,
  approval: TrendingUp,
  po: ShoppingCart,
  invoice: Receipt,
  user: Users,
  vendor: Building2,
}

const typeColorMap: Record<string, string> = {
  auth: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  rfq: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  approval: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  po: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
  invoice: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  user: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  vendor: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
}

export default function AdminDashboardPage() {
  const roleBreakdown = useMemo(() => ({
    procurement: adminUsers.filter((u) => u.role === "procurement").length,
    vendor: adminUsers.filter((u) => u.role === "vendor").length,
    manager: adminUsers.filter((u) => u.role === "manager").length,
    admin: adminUsers.filter((u) => u.role === "admin").length,
  }), [])

  const alerts = useMemo(
    () => adminUsers.filter((u) => u.status === "Inactive" || u.status === "Suspended"),
    [],
  )

  const recentActivity = useMemo(
    () => systemLogs.slice(0, 5),
    [],
  )

  const statCards = [
    {
      label: "Total Users",
      value: analyticsSummary.totalUsers,
      icon: Users,
      color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400",
      sub: `Proc: ${roleBreakdown.procurement} · Ven: ${roleBreakdown.vendor} · Mgr: ${roleBreakdown.manager} · Adm: ${roleBreakdown.admin}`,
    },
    {
      label: "Total Vendors",
      value: analyticsSummary.totalVendors,
      icon: Building2,
      color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
    {
      label: "RFQs / POs / Invoices",
      value: analyticsSummary.totalRfqs,
      icon: FileText,
      color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400",
      sub: `${analyticsSummary.totalPos} POs · ${analyticsSummary.totalInvoices} Invoices`,
    },
    {
      label: "Total Spend",
      value: formatAmount(analyticsSummary.totalSpend),
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
    {
      label: "Conversion Rate",
      value: analyticsSummary.conversionRate + "%",
      icon: TrendingUp,
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      label: "Pending Payments",
      value: formatAmount(analyticsSummary.pendingPayments),
      icon: AlertTriangle,
      color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400",
    },
  ]

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">System Health Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Key metrics, alerts, and recent activity across the platform
          </p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {statCards.map((card) => {
            const Icon = card.icon
            return (
              <div key={card.label} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{card.value}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{card.label}</p>
                {card.sub && (
                  <p className="mt-1 text-[10px] leading-tight text-zinc-400 dark:text-zinc-500">{card.sub}</p>
                )}
              </div>
            )
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Alerts Section */}
          <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center gap-2 border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Alerts & Attention Needed</h2>
            </div>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {alerts.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-zinc-400">
                  <CheckCircle className="mb-2 h-8 w-8 opacity-50" />
                  <p className="text-sm">No alerts — all clear</p>
                </div>
              ) : (
                alerts.map((u) => (
                  <div key={u.id} className={`px-5 py-3.5 border-l-2 ${u.status === "Suspended" ? "border-l-red-400" : "border-l-amber-400"}`}>
                    <div className="flex items-start gap-3">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${u.status === "Suspended" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"}`}>
                        <UserX className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{u.name}</p>
                          <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${u.status === "Suspended" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}>
                            {u.status}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{u.email} · {u.department}</p>
                        <p className="mt-0.5 text-[10px] text-zinc-400 dark:text-zinc-500">
                          Last active: {formatTimestamp(u.lastActive)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center gap-2 border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
              <Activity className="h-4 w-4 text-indigo-500" />
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Recent Activity</h2>
            </div>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {recentActivity.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-zinc-400">
                  <Clock className="mb-2 h-8 w-8 opacity-50" />
                  <p className="text-sm">No recent activity</p>
                </div>
              ) : (
                recentActivity.map((log) => {
                  const Icon = typeIconMap[log.type] || Activity
                  const color = typeColorMap[log.type] || "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  return (
                    <div key={log.id} className="px-5 py-3.5">
                      <div className="flex items-start gap-3">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{log.user}</p>
                            <span className="text-xs text-zinc-400">·</span>
                            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{log.action}</p>
                          </div>
                          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">{log.details}</p>
                          <p className="mt-0.5 text-[10px] text-zinc-400 dark:text-zinc-500">{formatTimestamp(log.timestamp)}</p>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
