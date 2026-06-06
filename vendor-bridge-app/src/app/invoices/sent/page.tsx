"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  ArrowLeft,
  Send,
  Eye,
  Download,
  RotateCcw,
  XCircle,
  CreditCard,
  Clock,
  CheckCheck,
  Mail,
  Search,
  FileText,
  Calendar,
  AlertTriangle,
  Building2,
} from "lucide-react"
import Link from "next/link"

interface SentInvoice {
  id: string
  vendor: string
  poRef: string
  amount: number
  sentTimestamp: string
  dueDate: string
  viewedAt: string | null
  downloaded: boolean
  emailLogs: { subject: string; sentAt: string; opened: boolean }[]
}

const mockSent: SentInvoice[] = [
  {
    id: "INV-2025-0102", vendor: "ServicePro Ltd.", poRef: "PO-2025-0041", amount: 67500,
    sentTimestamp: "2025-06-05 10:30", dueDate: "2025-07-05",
    viewedAt: "2025-06-05 14:22", downloaded: true,
    emailLogs: [
      { subject: "Invoice INV-2025-0102 — ServicePro Ltd.", sentAt: "2025-06-05 10:31", opened: true },
    ],
  },
  {
    id: "INV-2025-0107", vendor: "TechSolutions Inc.", poRef: "PO-2025-0043", amount: 184500,
    sentTimestamp: "2025-06-04 09:00", dueDate: "2025-07-04",
    viewedAt: null, downloaded: false,
    emailLogs: [
      { subject: "Invoice INV-2025-0107 — TechSolutions Inc.", sentAt: "2025-06-04 09:01", opened: false },
      { subject: "Reminder: Invoice INV-2025-0107 Due Soon", sentAt: "2025-06-06 09:00", opened: true },
    ],
  },
]

export default function SentInvoicesPage() {
  const [search, setSearch] = useState("")
  const [detailId, setDetailId] = useState<string | null>(null)
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return mockSent.filter((inv) => {
      if (search && !inv.id.toLowerCase().includes(search.toLowerCase()) && !inv.vendor.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [search])

  function showAction(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(null), 2500)
  }

  const detail = mockSent.find((i) => i.id === detailId)

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <Link href="/invoices" className="mb-2 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
            <ArrowLeft className="h-4 w-4" /> Back to All Invoices
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Sent Invoices</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{mockSent.length} invoices sent to vendors</p>
        </div>

        {actionMsg && (
          <div className="mb-4 rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{actionMsg}</div>
        )}

        <div className="mb-4 relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by invoice ID or vendor..."
            className="w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
        </div>

        <div className="space-y-3">
          {filtered.map((inv) => (
            <div key={inv.id} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-medium text-indigo-600 dark:text-indigo-400">{inv.id}</span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
                      <Send className="h-3 w-3" /> Sent
                    </span>
                  </div>
                  <h3 className="mt-1 text-base font-semibold text-zinc-900 dark:text-zinc-50">{inv.vendor}</h3>
                  <p className="text-sm text-zinc-500">{inv.poRef} &middot; ${inv.amount.toLocaleString()}</p>
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-zinc-400">
                    <span className="inline-flex items-center gap-1"><Send className="h-3 w-3" /> Sent: {inv.sentTimestamp}</span>
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> Due: {inv.dueDate}</span>
                    {inv.viewedAt && <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" /> Viewed: {inv.viewedAt}</span>}
                    {inv.downloaded && <span className="inline-flex items-center gap-1"><Download className="h-3 w-3" /> Downloaded</span>}
                    <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {inv.emailLogs.length} email(s)</span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button onClick={() => setDetailId(inv.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                    <Eye className="h-4 w-4" /> Details
                  </button>
                  <button onClick={() => showAction(`${inv.id} resent`)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                    <RotateCcw className="h-4 w-4" /> Resend
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            <div className="sticky top-0 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-700 dark:bg-zinc-900">
              <div><h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Invoice Communication</h2><p className="text-sm text-zinc-400">{detail.id}</p></div>
              <button onClick={() => setDetailId(null)} className="rounded-lg p-1 text-zinc-400 hover:text-zinc-600"><XCircle className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><p className="text-xs text-zinc-400">Vendor</p><p className="font-medium text-zinc-800 dark:text-zinc-200">{detail.vendor}</p></div>
                <div><p className="text-xs text-zinc-400">Amount</p><p className="font-medium text-zinc-800 dark:text-zinc-200">${detail.amount.toLocaleString()}</p></div>
                <div><p className="text-xs text-zinc-400">Sent</p><p className="text-zinc-600 dark:text-zinc-400">{detail.sentTimestamp}</p></div>
                <div><p className="text-xs text-zinc-400">Due Date</p><p className="text-zinc-600 dark:text-zinc-400">{detail.dueDate}</p></div>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300"><Mail className="inline h-4 w-4 mr-1" /> Email Communication Log</h4>
                <div className="space-y-2">
                  {detail.emailLogs.map((log, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900">
                      <div>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300">{log.subject}</p>
                        <p className="text-xs text-zinc-400">{log.sentAt}</p>
                      </div>
                      {log.opened ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600"><CheckCheck className="h-3 w-3" /> Opened</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-600"><Clock className="h-3 w-3" /> Pending</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300"><Download className="inline h-4 w-4 mr-1" /> Document Status</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900">
                    <p className="text-xs text-zinc-400">Downloaded</p>
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{detail.downloaded ? "Yes" : "No"}</p>
                  </div>
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900">
                    <p className="text-xs text-zinc-400">Viewed</p>
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{detail.viewedAt ?? "Not yet"}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-700">
                <button onClick={() => { setDetailId(null); showAction(`${detail.id} resent`) }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                  <RotateCcw className="h-4 w-4" /> Resend Invoice
                </button>
                <button onClick={() => { setDetailId(null); showAction(`${detail.id} marked as paid`) }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-950/40">
                  <CreditCard className="h-4 w-4" /> Mark as Paid
                </button>
                <button onClick={() => { setDetailId(null); showAction(`${detail.id} cancelled`) }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/40">
                  <XCircle className="h-4 w-4" /> Cancel Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
