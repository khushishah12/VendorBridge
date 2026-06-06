"use client"

import { useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { vendorRfqs } from "@/lib/vendor-rfq-data"
import { vendorQuotations } from "@/lib/vendor-quotation-data"
import { vendorPurchaseOrders } from "@/lib/vendor-po-data"
import { vendorNotifications } from "@/lib/vendor-notification-data"
import {
  FileText,
  Receipt,
  ShoppingCart,
  Bell,
  Clock,
  ArrowRight,
  Building2,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Eye,
  Send,
  List,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import AnimatedCounter from "@/components/ui/AnimatedCounter"

function getTimeLeft(deadline: string): { text: string; urgent: boolean } {
  const diff = new Date(deadline).getTime() - Date.now()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  if (diff <= 0) return { text: "Expired", urgent: true }
  if (days > 0) return { text: `${days}d ${hours}h left`, urgent: days <= 3 }
  if (hours > 0) return { text: `${hours}h left`, urgent: true }
  return { text: "Closing soon", urgent: true }
}

function notifIcon(type: string) {
  switch (type) {
    case "rfq": return FileText
    case "quotation": return Receipt
    case "po": return ShoppingCart
    default: return Bell
  }
}

function notifIconColor(type: string) {
  switch (type) {
    case "rfq": return "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
    case "quotation": return "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400"
    case "po": return "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400"
    default: return "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400"
  }
}

export default function VendorDashboardPage() {
  const stats = useMemo(() => ({
    openRfqs: vendorRfqs.filter((r) => r.status === "Open" || r.status === "Active").length,
    activeQuotations: vendorQuotations.filter((q) => q.status === "Under Review" || q.status === "Shortlisted").length,
    incomingPos: vendorPurchaseOrders.filter((p) => p.status === "Incoming").length,
    unreadNotifs: vendorNotifications.filter((n) => !n.read).length,
  }), [])

  const recentNotifications = useMemo(
    () => [...vendorNotifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5),
    [],
  )

  const upcomingDeadlines = useMemo(
    () => vendorRfqs
      .filter((r) => r.status === "Open" || r.status === "Active" || r.status === "Closing Soon")
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 5),
    [],
  )

  const statCards = [
    {
      label: "Open RFQs",
      value: stats.openRfqs,
      icon: FileText,
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
      link: "/vendor/rfqs",
    },
    {
      label: "Active Quotations",
      value: stats.activeQuotations,
      icon: TrendingUp,
      color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400",
      link: "/vendor/quotations",
    },
    {
      label: "Incoming POs",
      value: stats.incomingPos,
      icon: ShoppingCart,
      color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400",
      link: "/vendor/purchase-orders",
    },
    {
      label: "Unread Notifications",
      value: stats.unreadNotifs,
      icon: Bell,
      color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400",
      link: "/vendor/notifications/rfq",
    },
  ]

  const quickActions = [
    { label: "Browse RFQs", icon: Eye, href: "/vendor/rfqs", color: "bg-blue-600 hover:bg-blue-700" },
    { label: "Submit Quotation", icon: Send, href: "/vendor/quotations", color: "bg-indigo-600 hover:bg-indigo-700" },
    { label: "View POs", icon: List, href: "/vendor/purchase-orders", color: "bg-emerald-600 hover:bg-emerald-700" },
    { label: "Notifications", icon: Bell, href: "/vendor/notifications/rfq", color: "bg-amber-600 hover:bg-amber-700" },
  ]

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Vendor Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Overview of your opportunities, activities, and upcoming deadlines
          </p>
        </div>

        {/* Stat Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon
            return (
              <Link
                key={card.label}
                href={card.link}
                className="group rounded-xl border border-zinc-200 bg-white p-4 shadow-sm card-hover dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-zinc-300 transition-colors group-hover:text-zinc-500 dark:text-zinc-600 dark:group-hover:text-zinc-400" />
                </div>
                <p className="mt-3 text-2xl font-bold text-zinc-900 dark:text-zinc-50"><AnimatedCounter value={card.value} /></p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{card.label}</p>
              </Link>
            )
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Activity */}
          <div className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">My Recent Activity</h2>
                <Link href="/vendor/notifications/rfq" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
                  View all
                </Link>
              </div>
            </div>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {recentNotifications.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-zinc-400">
                  <Bell className="mb-2 h-8 w-8" />
                  <p className="text-sm">No recent activity</p>
                </div>
              ) : (
                recentNotifications.map((n) => {
                  const Icon = notifIcon(n.type)
                  return (
                    <div key={n.id} className="flex items-start gap-3 px-5 py-3.5 row-hover">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${notifIconColor(n.type)}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm ${n.read ? "text-zinc-600 dark:text-zinc-400" : "font-medium text-zinc-900 dark:text-zinc-50"}`}>
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="h-2 w-2 rounded-full bg-indigo-500" />
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">{n.message}</p>
                        <p className="mt-1 text-[10px] text-zinc-400 dark:text-zinc-500">{n.sender} · {n.timestamp}</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Right Column: Quick Actions + Upcoming Deadlines */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Quick Actions</h2>
              </div>
              <div className="p-4 space-y-2">
                {quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <Link
                      key={action.label}
                      href={action.href}
                      className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors ${action.color}`}
                    >
                      <Icon className="h-4 w-4" />
                      {action.label}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Upcoming Deadlines</h2>
              </div>
              {upcomingDeadlines.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-zinc-400">
                  <Calendar className="mb-2 h-8 w-8" />
                  <p className="text-sm">No upcoming deadlines</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {upcomingDeadlines.map((rfq) => {
                    const timeLeft = getTimeLeft(rfq.deadline)
                    return (
                      <Link
                        key={rfq.id}
                        href={`/vendor/rfqs/${rfq.id}`}
                        className="block px-5 py-3.5 row-hover"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-zinc-900 truncate dark:text-zinc-50">{rfq.title}</p>
                            <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                              <Building2 className="h-3 w-3" />
                              {rfq.company}
                            </div>
                          </div>
                          <div className={`shrink-0 flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-semibold ${
                            timeLeft.urgent ? "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                          }`}>
                            <Clock className="h-3 w-3" />
                            {timeLeft.text}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Stats Bar */}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <BarChart3 className="h-3.5 w-3.5" />
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> Open RFQs: {stats.openRfqs}</span>
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-indigo-500" /> Active Quotations: {stats.activeQuotations}</span>
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Incoming POs: {stats.incomingPos}</span>
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Unread: {stats.unreadNotifs}</span>
        </div>
      </div>
    </DashboardLayout>
  )
}
