"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  ArrowLeft,
  AlertTriangle,
  Eye,
  Send,
  RotateCcw,
  XCircle,
  CreditCard,
  Search,
  FileText,
  Calendar,
  DollarSign,
  Building2,
  Clock,
  TrendingUp,
  CheckCircle2,
} from "lucide-react"
import Link from "next/link"

type UnpaidStatus = "Overdue" | "Due Soon" | "Pending"

interface UnpaidInvoice {
  id: string
  vendor: string
  poRef: string
  amount: number
  status: UnpaidStatus
  invoiceDate: string
  dueDate: string
  daysOverdue: number
  vendorEmail: string
  notes: string
}

const mockUnpaid: UnpaidInvoice[] = [
  {
    id: "INV-2025-0104", vendor: "Global Supplies Co.", poRef: "PO-2025-0046", amount: 56000,
    status: "Overdue", invoiceDate: "2025-05-01", dueDate: "2025-05-31",
    daysOverdue: 6, vendorEmail: "billing@globalsupplies.com",
    notes: "Second reminder sent. Escalate to collections if unpaid by 2025-06-15.",
  },
  {
    id: "INV-2025-0102", vendor: "ServicePro Ltd.", poRef: "PO-2025-0041", amount: 67500,
    status: "Due Soon", invoiceDate: "2025-06-05", dueDate: "2025-07-05",
    daysOverdue: 0, vendorEmail: "finance@servicepro.com",
    notes: "Payment due in 29 days. No reminders sent yet.",
  },
  {
    id: "INV-2025-0107", vendor: "TechSolutions Inc.", poRef: "PO-2025-0043", amount: 184500,
    status: "Pending", invoiceDate: "2025-06-04", dueDate: "2025-07-04",
    daysOverdue: 0, vendorEmail: "accounts@techsolutions.com",
    notes: "Invoice sent. Awaiting payment processing.",
  },
]

const statusStyles: Record<UnpaidStatus, string> = {
  Overdue: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800",
  "Due Soon": "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
  Pending: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
}

const statusIcons: Record<UnpaidStatus, typeof AlertTriangle> = {
  Overdue: AlertTriangle,
  "Due Soon": Clock,
  Pending: Clock,
}

const statuses: UnpaidStatus[] = ["Overdue", "Due Soon", "Pending"]

export default function UnpaidInvoicesPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<UnpaidStatus | "All">("All")
  const [detailId, setDetailId] = useState<string | null>(null)
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  const totalUnpaid = mockUnpaid.reduce((s, i) => s + i.amount, 0)
  const overdueTotal = mockUnpaid.filter((i) => i.status === "Overdue").reduce((s, i) => s + i.amount, 0)

  const filtered = useMemo(() => {
    return mockUnpaid.filter((inv) => {
      if (search && !inv.id.toLowerCase().includes(search.toLowerCase()) && !inv.vendor.toLowerCase().includes(search.toLowerCase())) return false
      if (statusFilter !== "All" && inv.status !== statusFilter) return false
      return true
    })
  }, [search, statusFilter])

  function showAction(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(null), 2500)
  }

  const detail = mockUnpaid.find((i) => i.id === detailId)

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <Link href="/invoices" className="mb-2 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
            <ArrowLeft className="h-4 w-4" /> Back to All Invoices
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Unpaid Invoices</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{mockUnpaid.length} unpaid invoices</p>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-xs text-zinc-500">Total Unpaid</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">${totalUnpaid.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm dark:border-red-900 dark:bg-red-950/30">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <AlertTriangle className="h-4 w-4" />
              <p className="text-xs font-medium">Overdue Amount</p>
            </div>
            <p className="mt-1 text-2xl font-bold text-red-700 dark:text-red-300">${overdueTotal.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm dark:border-amber-900 dark:bg-amber-950/30">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <TrendingUp className="h-4 w-4" />
              <p className="text-xs font-medium">At Risk</p>
            </div>
            <p className="mt-1 text-2xl font-bold text-amber-700 dark:text-amber-300">{mockUnpaid.filter((i) => i.status === "Due Soon").length} invoices</p>
          </div>
        </div>

        {actionMsg && (
          <div className="mb-4 rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{actionMsg}</div>
        )}

        {/* Status Summary */}
        <div className="mb-4 flex flex-wrap gap-2">
          {statuses.map((s) => {
            const count = mockUnpaid.filter((i) => i.status === s).length
            const Icon = statusIcons[s]
            return (
              <span key={s} className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[s]}`}>
                <Icon className="h-3 w-3" /> {s} ({count})
              </span>
            )
          })}
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by invoice ID or vendor..."
              className="w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as UnpaidStatus | "All")}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
            <option value="All">All Status</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                <th className="px-4 py-3">Invoice ID</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">PO Ref</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-zinc-400"><CreditCard className="mx-auto mb-2 h-8 w-8 opacity-50" />No unpaid invoices</td></tr>
              ) : (
                filtered.map((inv) => {
                  const StatusIcon = statusIcons[inv.status]
                  return (
                    <tr key={inv.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900">
                      <td className="px-4 py-3 font-mono text-xs font-medium text-indigo-600 dark:text-indigo-400">{inv.id}</td>
                      <td className="px-4 py-3 font-medium text-zinc-800 dark:text-zinc-200">{inv.vendor}</td>
                      <td className="px-4 py-3 text-xs text-zinc-500">{inv.poRef}</td>
                      <td className="px-4 py-3 text-right font-medium text-zinc-900 dark:text-zinc-100">${inv.amount.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[inv.status]}`}>
                          <StatusIcon className="h-3 w-3" /> {inv.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs ${inv.status === "Overdue" ? "text-red-500 font-medium" : "text-zinc-500"}`}>
                          <Calendar className="h-3 w-3" /> {inv.dueDate}
                          {inv.daysOverdue > 0 && <span className="text-red-500">({inv.daysOverdue}d overdue)</span>}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => setDetailId(inv.id)}
                          className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400">
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            <div className="sticky top-0 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-700 dark:bg-zinc-900">
              <div><h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Unpaid Invoice Details</h2><p className="text-sm text-zinc-400">{detail.id}</p></div>
              <button onClick={() => setDetailId(null)} className="rounded-lg p-1 text-zinc-400 hover:text-zinc-600"><XCircle className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              {detail.status === "Overdue" && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-semibold">Overdue by {detail.daysOverdue} days</span>
                  </div>
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">Immediate action required. Consider sending a payment reminder.</p>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div><p className="text-xs text-zinc-400">Vendor</p><p className="font-medium text-zinc-800 dark:text-zinc-200">{detail.vendor}</p></div>
                <div><p className="text-xs text-zinc-400">Amount</p><p className="font-bold text-lg text-zinc-900 dark:text-zinc-50">${detail.amount.toLocaleString()}</p></div>
                <div><p className="text-xs text-zinc-400">PO Reference</p><p className="text-sm text-zinc-600 dark:text-zinc-400">{detail.poRef}</p></div>
                <div><p className="text-xs text-zinc-400">Invoice Date</p><p className="text-sm text-zinc-600 dark:text-zinc-400">{detail.invoiceDate}</p></div>
                <div><p className="text-xs text-zinc-400">Due Date</p><p className="text-sm text-zinc-600 dark:text-zinc-400">{detail.dueDate}</p></div>
                <div><p className="text-xs text-zinc-400">Vendor Email</p><p className="text-sm text-zinc-600 dark:text-zinc-400">{detail.vendorEmail}</p></div>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300"><FileText className="inline h-4 w-4 mr-1" /> Notes</h4>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                  {detail.notes}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-700">
                <button onClick={() => { setDetailId(null); showAction(`Reminder sent to ${detail.vendorEmail}`) }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                  <Send className="h-4 w-4" /> Send Payment Reminder
                </button>
                <button onClick={() => { setDetailId(null); showAction(`${detail.id} marked as paid`) }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-950/40">
                  <CreditCard className="h-4 w-4" /> Mark as Paid
                </button>
                <button onClick={() => { setDetailId(null); showAction(`${detail.id} resent`) }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  <RotateCcw className="h-4 w-4" /> Resend Invoice
                </button>
                {detail.status === "Overdue" && (
                  <button onClick={() => { setDetailId(null); showAction(`Escalation initiated for ${detail.id}`) }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/40">
                    <TrendingUp className="h-4 w-4" /> Escalate
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
