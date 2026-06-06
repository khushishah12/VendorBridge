"use client"

import { useState } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  ArrowLeft,
  FileText,
  Clock,
  Eye,
  CheckCheck,
  Trash2,
  Check,
  AlertTriangle,
  MessageSquare,
  Bell,
} from "lucide-react"
import Link from "next/link"

const mockRfqNotifications = [
  { id: "N-001", title: "New RFQ Created", message: "RFQ-2025-0018 — Marketing Materials has been created and is pending vendor selection.", timestamp: "2 min ago", read: false, priority: "medium" },
  { id: "N-007", title: "RFQ Closing Soon", message: "RFQ-2025-0012 — Logistics Services closes in 2 days. 3 quotations received.", timestamp: "4 hours ago", read: true, priority: "medium" },
  { id: "N-011", title: "RFQ Vendor Response", message: "BuildRight Construction has declined to quote on RFQ-2025-0002.", timestamp: "1 day ago", read: true, priority: "low" },
  { id: "N-012", title: "RFQ Draft Saved", message: "RFQ-2025-0019 — IT Equipment draft has been auto-saved.", timestamp: "2 days ago", read: true, priority: "low" },
]

export default function RfqNotificationsPage() {
  const [notifications, setNotifications] = useState(mockRfqNotifications)
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  function showAction(msg: string) { setActionMsg(msg); setTimeout(() => setActionMsg(null), 2500) }
  function markRead(id: string) { setNotifications(notifications.map((n) => n.id === id ? { ...n, read: true } : n)) }
  function deleteNotification(id: string) { setNotifications(notifications.filter((n) => n.id !== id)) }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <Link href="/notifications" className="mb-2 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
            <ArrowLeft className="h-4 w-4" /> Back to Notifications
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">RFQ Updates</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{notifications.filter((n) => !n.read).length} unread</p>
        </div>

        {actionMsg && <div className="mb-4 rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{actionMsg}</div>}

        <div className="space-y-2">
          {notifications.map((n) => (
            <div key={n.id} className={`group relative rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-zinc-950 ${
              n.read ? "border-zinc-200 dark:border-zinc-800" : "border-indigo-200 bg-indigo-50/30 dark:border-indigo-800 dark:bg-indigo-950/20"
            }`}>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-semibold ${n.read ? "text-zinc-700 dark:text-zinc-300" : "text-zinc-900 dark:text-zinc-50"}`}>{n.title}</h3>
                    {!n.read && <span className="h-2 w-2 rounded-full bg-indigo-500" />}
                  </div>
                  <p className="mt-0.5 text-sm text-zinc-500">{n.message}</p>
                  <p className="mt-1 text-xs text-zinc-400">{n.timestamp}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  {!n.read && <button onClick={() => markRead(n.id)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40"><Check className="h-4 w-4" /></button>}
                  <button onClick={() => deleteNotification(n.id)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
