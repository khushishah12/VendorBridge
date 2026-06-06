"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  ArrowLeft,
  XCircle,
  Eye,
  RotateCcw,
  FileText,
  Search,
  SlidersHorizontal,
  Download,
  DollarSign,
  Clock,
  AlertTriangle,
  Ban,
} from "lucide-react"
import Link from "next/link"

type RejectionReason =
  | "High price"
  | "Late delivery timeline"
  | "Non-compliance with specs"
  | "Better alternative available"
  | "Incomplete documentation"
  | "Vendor not approved"

interface RejectedQuotation {
  id: string
  vendor: string
  rfqId: string
  rfqTitle: string
  amount: number
  reason: RejectionReason
  detail: string
  rejectedDate: string
}

const mockRejected: RejectedQuotation[] = [
  {
    id: "QTN-2025-0103", vendor: "Global Supplies Co.", rfqId: "RFQ-2025-0001",
    rfqTitle: "Office Laptops Procurement", amount: 210000,
    reason: "High price", detail: "Quote was $25,500 above the next competitor and exceeded budget by 14%",
    rejectedDate: "2025-05-25",
  },
  {
    id: "QTN-2025-0106", vendor: "BuildRight Construction", rfqId: "RFQ-2025-0011",
    rfqTitle: "Warehouse Renovation", amount: 445000,
    reason: "Non-compliance with specs", detail: "Proposed materials did not meet fire safety specification Section 4.2",
    rejectedDate: "2025-04-05",
  },
  {
    id: "QTN-2025-0108", vendor: "AutoParts Direct", rfqId: "RFQ-2025-0001",
    rfqTitle: "Office Laptops Procurement", amount: 198000,
    reason: "Late delivery timeline", detail: "Estimated delivery of 75 days exceeded the 45-day maximum requirement",
    rejectedDate: "2025-05-26",
  },
  {
    id: "QTN-2025-0109", vendor: "OfficeMax Supplies", rfqId: "RFQ-2025-0001",
    rfqTitle: "Office Laptops Procurement", amount: 195000,
    reason: "Better alternative available", detail: "TechSolutions Inc. offered better pricing ($184,500) with superior warranty terms",
    rejectedDate: "2025-05-27",
  },
  {
    id: "QTN-2025-0110", vendor: "MedEquip Distributors", rfqId: "RFQ-2025-0005",
    rfqTitle: "Medical Equipment Supply", amount: 89000,
    reason: "Incomplete documentation", detail: "Missing FDA certification documents and warranty terms were not provided",
    rejectedDate: "2025-04-22",
  },
  {
    id: "QTN-2025-0111", vendor: "ServicePro Ltd.", rfqId: "RFQ-2025-0006",
    rfqTitle: "Annual Maintenance Services", amount: 67500,
    reason: "Vendor not approved", detail: "ServicePro Ltd. has not completed the vendor onboarding process",
    rejectedDate: "2025-04-15",
  },
]

const reasonColors: Record<RejectionReason, string> = {
  "High price": "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800",
  "Late delivery timeline": "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800",
  "Non-compliance with specs": "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
  "Better alternative available": "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
  "Incomplete documentation": "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
  "Vendor not approved": "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
}

const reasonIcons: Record<RejectionReason, typeof DollarSign> = {
  "High price": DollarSign,
  "Late delivery timeline": Clock,
  "Non-compliance with specs": AlertTriangle,
  "Better alternative available": Ban,
  "Incomplete documentation": FileText,
  "Vendor not approved": XCircle,
}

const allReasons = Object.keys(reasonColors) as RejectionReason[]

export default function RejectedQuotationsPage() {
  const [search, setSearch] = useState("")
  const [reasonFilter, setReasonFilter] = useState<RejectionReason | "All">("All")
  const [detailItem, setDetailItem] = useState<RejectedQuotation | null>(null)
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return mockRejected.filter((q) => {
      if (search && !q.id.toLowerCase().includes(search.toLowerCase()) && !q.vendor.toLowerCase().includes(search.toLowerCase())) return false
      if (reasonFilter !== "All" && q.reason !== reasonFilter) return false
      return true
    })
  }, [search, reasonFilter])

  function showAction(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(null), 2500)
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/quotations" className="mb-2 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
              <ArrowLeft className="h-4 w-4" /> Back to Quotations
            </Link>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Rejected Quotations</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{mockRejected.length} quotations rejected</p>
          </div>
          <button onClick={() => showAction("Rejection report exported")}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
            <Download className="h-4 w-4" /> Export Report
          </button>
        </div>

        {/* Toast */}
        {actionMsg && (
          <div className="mb-4 rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{actionMsg}</div>
        )}

        {/* Search + Filter */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID or vendor..."
              className="w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          </div>
          <select value={reasonFilter} onChange={(e) => setReasonFilter(e.target.value as RejectionReason | "All")}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
            <option value="All">All Reasons</option>
            {allReasons.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* Summary cards */}
        <div className="mb-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {allReasons.map((reason) => {
            const count = mockRejected.filter((q) => q.reason === reason).length
            const Icon = reasonIcons[reason]
            return (
              <div key={reason} className={`rounded-lg border px-3 py-2 text-center text-sm ${reasonColors[reason]}`}>
                <Icon className="inline h-4 w-4 mr-1" />
                {reason}
                <span className="ml-1.5 font-bold">{count}</span>
              </div>
            )
          })}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                <th className="px-4 py-3">Quotation ID</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">RFQ</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3">Rejection Reason</th>
                <th className="px-4 py-3">Rejected Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-zinc-400">
                    <XCircle className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    No rejected quotations match your filter
                  </td>
                </tr>
              ) : (
                filtered.map((q) => {
                  const ReasonIcon = reasonIcons[q.reason]
                  return (
                    <tr key={q.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900">
                      <td className="px-4 py-3 font-mono text-xs font-medium text-indigo-600 dark:text-indigo-400">{q.id}</td>
                      <td className="px-4 py-3 font-medium text-zinc-800 dark:text-zinc-200">{q.vendor}</td>
                      <td className="px-4 py-3">
                        <p className="text-zinc-700 dark:text-zinc-300">{q.rfqTitle}</p>
                        <p className="text-xs text-zinc-400">{q.rfqId}</p>
                      </td>
                      <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-400">${q.amount.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium w-fit ${reasonColors[q.reason]}`}>
                            <ReasonIcon className="h-3 w-3" /> {q.reason}
                          </span>
                          <span className="text-xs text-zinc-400 max-w-[200px] truncate">{q.detail}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-zinc-500">{q.rejectedDate}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button onClick={() => setDetailItem(q)}
                            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400" title="View details">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button onClick={() => showAction(`${q.id} restored to received quotations`)}
                            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400" title="Restore">
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Rejected Quotation</h3>
                <p className="text-sm text-zinc-400">{detailItem.id}</p>
              </div>
              <button onClick={() => setDetailItem(null)} className="rounded-lg p-1 text-zinc-400 hover:text-zinc-600"><XCircle className="h-5 w-5" /></button>
            </div>

            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-zinc-400">Vendor</p>
                  <p className="font-medium text-zinc-800 dark:text-zinc-200">{detailItem.vendor}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Amount</p>
                  <p className="font-medium text-zinc-800 dark:text-zinc-200">${detailItem.amount.toLocaleString()}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-zinc-400">RFQ</p>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">{detailItem.rfqTitle}</p>
                  <p className="text-xs text-zinc-400">{detailItem.rfqId}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-zinc-400">Rejection Reason</p>
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium mt-1 ${reasonColors[detailItem.reason]}`}>
                    {detailItem.reason}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-zinc-400">Detail</p>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{detailItem.detail}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Rejected Date</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{detailItem.rejectedDate}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-700">
              <button onClick={() => { setDetailItem(null); showAction(`${detailItem.id} restored to received quotations`) }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-950/40">
                <RotateCcw className="h-4 w-4" /> Restore Quotation
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
