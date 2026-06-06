"use client"

import { useState } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { vendorNotifications } from "@/lib/vendor-notification-data"
import { CheckCheck, FileText, ExternalLink, Mail, MailOpen, BellOff, FileSignature } from "lucide-react"
import Link from "next/link"

function priorityColor(priority: string) {
  const map: Record<string, string> = {
    high: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
    medium: "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
    low: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  }
  return map[priority] || map.low
}

function formatTimestamp(ts: string) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function QuotationNotificationsPage() {
  const [notifs, setNotifs] = useState(vendorNotifications.filter((n) => n.type === "quotation"))

  function toggleRead(id: string) {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)))
  }

  function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileSignature className="h-6 w-6 text-zinc-900 dark:text-zinc-50" />
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Quotation Notifications</h1>
              <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                {notifs.length} total
              </span>
            </div>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Updates on your submitted quotations
            </p>
          </div>
          {notifs.some((n) => !n.read) && (
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all as read
            </button>
          )}
        </div>

        {notifs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 py-16 dark:border-zinc-700">
            <BellOff className="mb-3 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
            <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400">No quotation notifications</p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifs.map((n) => (
              <div
                key={n.id}
                className={`relative rounded-xl border shadow-sm transition-colors ${
                  n.read
                    ? "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
                    : "border-indigo-200 bg-indigo-50/40 dark:border-indigo-800 dark:bg-indigo-950/20"
                }`}
              >
                {!n.read && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-blue-500" />
                )}
                <div className="flex items-start gap-4 p-5 pl-6">
                  <div className="mt-0.5 shrink-0">
                    {n.read ? (
                      <MailOpen className="h-5 w-5 text-zinc-400" />
                    ) : (
                      <Mail className="h-5 w-5 text-indigo-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className={`text-sm font-semibold ${n.read ? "text-zinc-700 dark:text-zinc-300" : "text-zinc-900 dark:text-zinc-50"}`}>
                          {n.title}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{n.message}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${priorityColor(n.priority)}`}>
                        {n.priority}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                      <span className="font-medium text-zinc-500 dark:text-zinc-500">{n.sender}</span>
                      <span>{formatTimestamp(n.timestamp)}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => toggleRead(n.id)}
                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                          n.read
                            ? "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
                        }`}
                      >
                        {n.read ? "Mark as Unread" : "Mark as Read"}
                      </button>
                      {n.actionUrl && (
                        <Link
                          href={n.actionUrl}
                          className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
