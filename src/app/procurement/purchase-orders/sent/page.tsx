"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  ArrowLeft,
  Send,
  XCircle,
  CheckCircle2,
  RotateCcw,
  Eye,
  Clock,
  CheckCheck,
  Mail,
  Download,
  Search,
  SlidersHorizontal,
  FileText,
  Building2,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"

type AckStatus = "Pending" | "Accepted" | "Rejected"

interface SentPo {
  id: string
  vendor: string
  rfqRef: string
  totalAmount: number
  sentTimestamp: string
  ackStatus: AckStatus
  ackDate: string | null
  emailLogs: { subject: string; sentAt: string; opened: boolean }[]
  downloaded: boolean
  viewedAt: string | null
}

const mockSent: SentPo[] = [
  {
    id: "PO-2025-0043", vendor: "TechSolutions Inc.", rfqRef: "RFQ-2025-0001", totalAmount: 184500,
    sentTimestamp: "2025-06-05 10:30", ackStatus: "Pending", ackDate: null,
    emailLogs: [
      { subject: "Purchase Order PO-2025-0043 — Office Laptops Procurement", sentAt: "2025-06-05 10:31", opened: true },
      { subject: "Reminder: PO-2025-0043 Awaiting Acknowledgment", sentAt: "2025-06-06 09:00", opened: true },
    ],
    downloaded: true, viewedAt: "2025-06-05 14:22",
  },
  {
    id: "PO-2025-0045", vendor: "Acme Corp", rfqRef: "RFQ-2025-0007", totalAmount: 82500,
    sentTimestamp: "2025-05-30 14:00", ackStatus: "Accepted", ackDate: "2025-06-01 11:15",
    emailLogs: [
      { subject: "Purchase Order PO-2025-0045 — Network Equipment", sentAt: "2025-05-30 14:01", opened: true },
    ],
    downloaded: true, viewedAt: "2025-05-30 16:45",
  },
  {
    id: "PO-2025-0046", vendor: "Global Supplies Co.", rfqRef: "RFQ-2025-0012", totalAmount: 56000,
    sentTimestamp: "2025-06-03 08:15", ackStatus: "Rejected", ackDate: "2025-06-04 09:30",
    emailLogs: [
      { subject: "Purchase Order PO-2025-0046 — Office Stationery", sentAt: "2025-06-03 08:16", opened: true },
    ],
    downloaded: true, viewedAt: "2025-06-03 10:00",
  },
]

const ackStyles: Record<AckStatus, string> = {
  Pending: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
  Accepted: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  Rejected: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800",
}

const ackIcons: Record<AckStatus, typeof Clock> = {
  Pending: Clock,
  Accepted: CheckCircle2,
  Rejected: XCircle,
}

export default function SentPurchaseOrdersPage() {
  const [search, setSearch] = useState("")
  const [ackFilter, setAckFilter] = useState<AckStatus | "All">("All")
  const [showFilters, setShowFilters] = useState(false)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return mockSent.filter((po) => {
      if (search && !po.id.toLowerCase().includes(search.toLowerCase()) && !po.vendor.toLowerCase().includes(search.toLowerCase())) return false
      if (ackFilter !== "All" && po.ackStatus !== ackFilter) return false
      return true
    })
  }, [search, ackFilter])

  function showAction(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(null), 2500)
  }

  const detail = mockSent.find((p) => p.id === detailId)

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <Link href="/purchase-orders" className="mb-2 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
            <ArrowLeft className="h-4 w-4" /> Back to All POs
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Sent Purchase Orders</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{mockSent.length} POs sent to vendors</p>
        </div>

        {actionMsg && (
          <div className="mb-4 rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{actionMsg}</div>
        )}

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by PO ID or vendor..."
              className="w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          </div>
          <select value={ackFilter} onChange={(e) => setAckFilter(e.target.value as AckStatus | "All")}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
            <option value="All">All Acknowledgment</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="space-y-3">
          {filtered.map((po) => {
            const AckIcon = ackIcons[po.ackStatus]
            return (
              <div key={po.id} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-medium text-indigo-600 dark:text-indigo-400">{po.id}</span>
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${ackStyles[po.ackStatus]}`}>
                        <AckIcon className="h-3 w-3" /> {po.ackStatus}
                      </span>
                    </div>
                    <h3 className="mt-1 text-base font-semibold text-zinc-900 dark:text-zinc-50">{po.vendor}</h3>
                    <p className="text-sm text-zinc-500">{po.rfqRef} &middot; ${po.totalAmount.toLocaleString()}</p>
                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-zinc-400">
                      <span className="inline-flex items-center gap-1"><Send className="h-3 w-3" /> Sent: {po.sentTimestamp}</span>
                      {po.viewedAt && <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" /> Viewed: {po.viewedAt}</span>}
                      {po.downloaded && <span className="inline-flex items-center gap-1"><Download className="h-3 w-3" /> Downloaded</span>}
                      <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {po.emailLogs.length} email(s)</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button onClick={() => setDetailId(po.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                      <Eye className="h-4 w-4" /> Details
                    </button>
                    <button onClick={() => showAction(`${po.id} resent`)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                      <RotateCcw className="h-4 w-4" /> Resend
                    </button>
                    {po.ackStatus === "Pending" && (
                      <button onClick={() => showAction(`${po.id} cancelled`)}
                        className="rounded-lg p-2 text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 dark:hover:text-red-400" title="Cancel PO">
                        <XCircle className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            <div className="sticky top-0 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-700 dark:bg-zinc-900">
              <div><h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">PO Communication</h2><p className="text-sm text-zinc-400">{detail.id}</p></div>
              <button onClick={() => setDetailId(null)} className="rounded-lg p-1 text-zinc-400 hover:text-zinc-600"><XCircle className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><p className="text-xs text-zinc-400">Vendor</p><p className="font-medium text-zinc-800 dark:text-zinc-200">{detail.vendor}</p></div>
                <div><p className="text-xs text-zinc-400">Acknowledgment</p>
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${ackStyles[detail.ackStatus]}`}>
                    {detail.ackStatus}
                  </span>
                </div>
                <div><p className="text-xs text-zinc-400">Sent</p><p className="text-zinc-600 dark:text-zinc-400">{detail.sentTimestamp}</p></div>
                <div><p className="text-xs text-zinc-400">Amount</p><p className="font-medium text-zinc-800 dark:text-zinc-200">${detail.totalAmount.toLocaleString()}</p></div>
                {detail.ackDate && <div className="sm:col-span-2"><p className="text-xs text-zinc-400">Acknowledged At</p><p className="text-zinc-600 dark:text-zinc-400">{detail.ackDate}</p></div>}
              </div>

              {/* Email Logs */}
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

              {/* Download / View Status */}
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

              {/* Actions */}
              <div className="flex flex-wrap gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-700">
                <button onClick={() => { setDetailId(null); showAction(`${detail.id} resent`) }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                  <RotateCcw className="h-4 w-4" /> Resend PO
                </button>
                {detail.ackStatus === "Pending" && (
                  <button onClick={() => { setDetailId(null); showAction(`${detail.id} cancelled`) }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/40">
                    <XCircle className="h-4 w-4" /> Cancel PO
                  </button>
                )}
                <button onClick={() => { setDetailId(null); showAction(`${detail.id} marked as acknowledged`) }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-950/40">
                  <CheckCheck className="h-4 w-4" /> Mark as Acknowledged
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
