"use client"

import { useState } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  Bell,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Clock,
  CheckCheck,
  MessageSquare,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import { managerNotifications as initialNotifications, type ManagerNotification } from "@/lib/manager-data"

type FilterTab = "all" | "approval" | "alert" | "urgent" | "warning"

const filterTabs: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "approval", label: "Approval Requests" },
  { key: "alert", label: "Alerts" },
  { key: "urgent", label: "Urgent" },
  { key: "warning", label: "Warnings" },
]

const typeConfig: Record<string, { icon: typeof Bell; bg: string; iconColor: string }> = {
  approval: {
    icon: ShieldCheck,
    bg: "bg-blue-100 dark:bg-blue-950/40",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  alert: {
    icon: AlertTriangle,
    bg: "bg-amber-100 dark:bg-amber-950/40",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  urgent: {
    icon: Bell,
    bg: "bg-red-100 dark:bg-red-950/40",
    iconColor: "text-red-600 dark:text-red-400",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-orange-100 dark:bg-orange-950/40",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
}

export default function ManagerNotificationsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all")
  const [notifications, setNotifications] = useState<ManagerNotification[]>(initialNotifications)
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  const filtered = activeTab === "all"
    ? notifications
    : notifications.filter((n) => n.type === activeTab)

  const unreadCount = notifications.filter((n) => !n.read).length

  function showAction(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(null), 2500)
  }

  function toggleRead(id: string) {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    )
  }

  function markAllRead() {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
    showAction("All notifications marked as read")
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Notifications</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {notifications.length} total{unreadCount > 0 ? `, ${unreadCount} unread` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button onClick={markAllRead}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                <CheckCheck className="h-4 w-4" /> Mark All as Read
              </button>
            )}
          </div>
        </div>

        {/* Toast */}
        {actionMsg && (
          <div className="mb-4 rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{actionMsg}</div>
        )}

        {/* Filter Tabs */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {filterTabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <Bell className="mx-auto mb-3 h-10 w-10 text-zinc-300 dark:text-zinc-600" />
              <p className="text-zinc-500 dark:text-zinc-400">
                {activeTab === "all" ? "No notifications yet" : `No ${activeTab} notifications`}
              </p>
            </div>
          ) : (
            filtered.map((n) => {
              const cfg = typeConfig[n.type]
              const Icon = cfg.icon
              const formattedDate = new Date(n.timestamp).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
              return (
                <div key={n.id}
                  className={`relative rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-zinc-950 ${
                    n.read
                      ? "border-zinc-200 dark:border-zinc-800"
                      : "border-indigo-200 bg-indigo-50/30 dark:border-indigo-800 dark:bg-indigo-950/20"
                  }`}>
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${cfg.bg}`}>
                      <Icon className={`h-5 w-5 ${n.type === "urgent" ? "animate-pulse" : ""} ${cfg.iconColor}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h3 className={`text-sm font-semibold ${n.read ? "text-zinc-700 dark:text-zinc-300" : "text-zinc-900 dark:text-zinc-50"}`}>
                            {n.title}
                          </h3>
                          {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-500" />}
                        </div>
                      </div>
                      <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{n.message}</p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-zinc-400">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {formattedDate}
                        </span>
                        <span className={`inline-flex items-center gap-1 capitalize ${cfg.iconColor}`}>
                          <MessageSquare className="h-3 w-3" /> {n.type}
                        </span>
                      </div>

                      {/* Action + Toggle */}
                      <div className="mt-3 flex items-center gap-2">
                        {n.actionUrl && (
                          <Link href={n.actionUrl}
                            className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors">
                            <Eye className="h-3 w-3" /> View <ExternalLink className="h-2.5 w-2.5" />
                          </Link>
                        )}
                        <button onClick={() => toggleRead(n.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors">
                          {n.read ? (
                            <><CheckCheck className="h-3 w-3" /> Mark as Unread</>
                          ) : (
                            <><CheckCircle2 className="h-3 w-3" /> Mark as Read</>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
