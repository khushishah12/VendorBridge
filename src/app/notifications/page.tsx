"use client"

import { useState } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  Bell,
  FileText,
  Receipt,
  CheckCircle,
  ShoppingCart,
  XCircle,
  Eye,
  Clock,
  CheckCheck,
  AlertTriangle,
  MessageSquare,
  Filter,
  ChevronDown,
  Building2,
  Calendar,
  Trash2,
  Check,
} from "lucide-react"
import Link from "next/link"

interface Notification {
  id: string
  type: "rfq" | "quotation" | "approval" | "invoice" | "po" | "vendor"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl: string
  priority: "high" | "medium" | "low"
}

const mockNotifications: Notification[] = [
  { id: "N-001", type: "rfq", title: "New RFQ Created", message: "RFQ-2025-0018 — Marketing Materials has been created and is pending vendor selection.", timestamp: "2 min ago", read: false, actionUrl: "/rfqs", priority: "medium" },
  { id: "N-002", type: "quotation", title: "Quotation Received", message: "TechSolutions Inc. has submitted a quotation for RFQ-2025-0004 — Server Hardware.", timestamp: "12 min ago", read: false, actionUrl: "/quotations", priority: "high" },
  { id: "N-003", type: "approval", title: "Approval Request", message: "Quotation QTN-2025-0108 requires your approval. Acme Corp — $82,500.", timestamp: "25 min ago", read: false, actionUrl: "/approvals", priority: "high" },
  { id: "N-004", type: "invoice", title: "Invoice Overdue", message: "INV-2025-0104 — Global Supplies Co. ($56,000) is 6 days overdue.", timestamp: "1 hour ago", read: false, actionUrl: "/invoices/unpaid", priority: "high" },
  { id: "N-005", type: "po", title: "PO Acknowledged", message: "PO-2025-0045 has been accepted by Acme Corp.", timestamp: "2 hours ago", read: true, actionUrl: "/purchase-orders/sent", priority: "medium" },
  { id: "N-006", type: "vendor", title: "Vendor Performance Alert", message: "ServicePro Ltd. rating has dropped to 3.5 ★. Review recommended.", timestamp: "3 hours ago", read: true, actionUrl: "/vendors/performance", priority: "low" },
  { id: "N-007", type: "rfq", title: "RFQ Closing Soon", message: "RFQ-2025-0012 — Logistics Services closes in 2 days. 3 quotations received.", timestamp: "4 hours ago", read: true, actionUrl: "/rfqs", priority: "medium" },
  { id: "N-008", type: "approval", title: "Approval Granted", message: "Finance approved PO-2025-0047 — ServicePro Ltd. ($92,000).", timestamp: "5 hours ago", read: true, actionUrl: "/approvals/approved", priority: "medium" },
  { id: "N-009", type: "invoice", title: "Payment Received", message: "INV-2025-0105 — Acme Corp ($82,500) has been paid.", timestamp: "1 day ago", read: true, actionUrl: "/invoices/paid", priority: "low" },
  { id: "N-010", type: "quotation", title: "Quotation Rejected", message: "Quotation from Global Supplies Co. for RFQ-2025-0012 has been rejected — High price.", timestamp: "1 day ago", read: true, actionUrl: "/quotations/rejected", priority: "medium" },
]

const typeStyles: Record<string, string> = {
  rfq: "bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
  quotation: "bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400",
  approval: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
  invoice: "bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
  po: "bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400",
  vendor: "bg-cyan-100 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400",
}

const typeIcons: Record<string, typeof Bell> = {
  rfq: FileText,
  quotation: Receipt,
  approval: CheckCircle,
  invoice: ShoppingCart,
  po: ShoppingCart,
  vendor: Building2,
}

const priorityStyles: Record<string, string> = {
  high: "bg-red-100 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800",
  medium: "bg-amber-100 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
  low: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
}

const types = ["rfq", "quotation", "approval", "invoice", "po", "vendor"]

export default function NotificationsPage() {
  const [typeFilter, setTypeFilter] = useState<string>("All")
  const [readFilter, setReadFilter] = useState<"All" | "read" | "unread">("All")
  const [notifications, setNotifications] = useState(mockNotifications)
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  const filtered = notifications.filter((n) => {
    if (typeFilter !== "All" && n.type !== typeFilter) return false
    if (readFilter === "read" && !n.read) return false
    if (readFilter === "unread" && n.read) return false
    return true
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  function showAction(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(null), 2500)
  }

  function markRead(id: string) {
    setNotifications(notifications.map((n) => n.id === id ? { ...n, read: true } : n))
  }

  function markAllRead() {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
    showAction("All notifications marked as read")
  }

  function deleteNotification(id: string) {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Notifications</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : "No unread notifications"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button onClick={markAllRead}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                <CheckCheck className="h-4 w-4" /> Mark All Read
              </button>
            )}
          </div>
        </div>

        {actionMsg && (
          <div className="mb-4 rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{actionMsg}</div>
        )}

        {/* Filter Bar */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => setTypeFilter("All")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${typeFilter === "All" ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"}`}>
              All
            </button>
            {types.map((t) => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${typeFilter === t ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"}`}>
                {t === "po" ? "PO" : t}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <select value={readFilter} onChange={(e) => setReadFilter(e.target.value as "All" | "read" | "unread")}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
              <option value="All">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>
        </div>

        {/* Notification List */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <Bell className="mx-auto mb-3 h-10 w-10 text-zinc-300 dark:text-zinc-600" />
              <p className="text-zinc-500 dark:text-zinc-400">No notifications found</p>
            </div>
          ) : (
            filtered.map((n) => {
              const Icon = typeIcons[n.type]
              const PriorityIcon = n.priority === "high" ? AlertTriangle : n.priority === "medium" ? Clock : MessageSquare
              return (
                <div key={n.id}
                  className={`group relative rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-zinc-950 ${
                    n.read ? "border-zinc-200 dark:border-zinc-800" : "border-indigo-200 bg-indigo-50/30 dark:border-indigo-800 dark:bg-indigo-950/20"
                  }`}>
                  <div className="flex items-start gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${typeStyles[n.type]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className={`text-sm font-semibold ${n.read ? "text-zinc-700 dark:text-zinc-300" : "text-zinc-900 dark:text-zinc-50"}`}>
                              {n.title}
                            </h3>
                            {!n.read && <span className="h-2 w-2 rounded-full bg-indigo-500" />}
                          </div>
                          <p className="mt-0.5 text-sm text-zinc-500">{n.message}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1.5">
                          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${priorityStyles[n.priority]}`}>
                            <PriorityIcon className="h-2.5 w-2.5" /> {n.priority}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-xs text-zinc-400">
                        <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {n.timestamp}</span>
                        <span className={`inline-flex items-center gap-1 capitalize ${typeStyles[n.type]}`}>
                          <Icon className="h-3 w-3" /> {n.type === "po" ? "PO" : n.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      {!n.read && (
                        <button onClick={() => markRead(n.id)}
                          className="rounded-lg p-1.5 text-zinc-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400" title="Mark as read">
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button onClick={() => deleteNotification(n.id)}
                        className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 dark:hover:text-red-400" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <Link href={n.actionUrl}
                    className="absolute inset-0 rounded-xl ring-0 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
              )
            })
          )}
        </div>

        {/* Summary */}
        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
          <span className="inline-flex items-center gap-1"><Bell className="h-3 w-3" /> Total: {notifications.length}</span>
          <span className="inline-flex items-center gap-1"><CheckCheck className="h-3 w-3" /> Read: {notifications.filter((n) => n.read).length}</span>
          <span className="inline-flex items-center gap-1 text-indigo-500"><Clock className="h-3 w-3" /> Unread: {unreadCount}</span>
        </div>
      </div>
    </DashboardLayout>
  )
}
