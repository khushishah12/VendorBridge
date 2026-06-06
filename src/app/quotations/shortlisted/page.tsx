"use client"

import { useState } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  ArrowLeft,
  Star,
  Send,
  ShoppingCart,
  XCircle,
  Eye,
  CheckCircle2,
  TrendingDown,
  Zap,
  Clock,
  DollarSign,
  FileText,
} from "lucide-react"
import Link from "next/link"

interface ShortlistedItem {
  id: string
  vendor: string
  rfqId: string
  rfqTitle: string
  finalPrice: number
  deliveryTimeline: string
  comparedAgainst: string[]
  whyShortlisted: string
  notes: string
  status: "Shortlisted" | "Pending Approval"
}

const mockShortlisted: ShortlistedItem[] = [
  {
    id: "QTN-2025-0101", vendor: "TechSolutions Inc.", rfqId: "RFQ-2025-0001",
    rfqTitle: "Office Laptops Procurement", finalPrice: 184500,
    deliveryTimeline: "30 days", comparedAgainst: ["Acme Corp ($192,000)", "Global Supplies Co. ($210,000)"],
    whyShortlisted: "Lowest price, best warranty (3 yrs comprehensive), highest vendor rating (4.8)",
    notes: "Strong past performance — 24 successful orders. On-site support included.",
    status: "Pending Approval",
  },
  {
    id: "QTN-2025-0107", vendor: "TechSolutions Inc.", rfqId: "RFQ-2025-0004",
    rfqTitle: "Cloud Infrastructure Services", finalPrice: 245000,
    deliveryTimeline: "14 days", comparedAgainst: ["ServicePro Ltd. ($232,000)"],
    whyShortlisted: "Fastest delivery (14 days), best value for money, comprehensive scope",
    notes: "Recommended by IT team. ServicePro was cheaper but scope was limited.",
    status: "Shortlisted",
  },
  {
    id: "QTN-2025-0100", vendor: "BuildRight Construction", rfqId: "RFQ-2025-0002",
    rfqTitle: "Construction Materials - Phase 2", finalPrice: 445000,
    deliveryTimeline: "90 days", comparedAgainst: [],
    whyShortlisted: "Only qualified vendor for this category. Competitive pricing.",
    notes: "Awaiting final budget approval from finance.",
    status: "Pending Approval",
  },
]

export default function ShortlistedQuotationsPage() {
  const [detailItem, setDetailItem] = useState<ShortlistedItem | null>(null)
  const [actionMsg, setActionMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  function showAction(text: string, type: "success" | "error" = "success") {
    setActionMsg({ type, text })
    setTimeout(() => setActionMsg(null), 2500)
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <Link href="/quotations" className="mb-2 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
            <ArrowLeft className="h-4 w-4" /> Back to Quotations
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Shortlisted Quotations</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{mockShortlisted.length} quotations shortlisted</p>
        </div>

        {/* Toast */}
        {actionMsg && (
          <div className={`mb-4 rounded-lg px-4 py-2 text-sm font-medium ${
            actionMsg.type === "success" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"
          }`}>{actionMsg.text}</div>
        )}

        {/* Cards */}
        <div className="space-y-4">
          {mockShortlisted.map((item) => (
            <div key={item.id} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                      item.status === "Pending Approval"
                        ? "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                        : "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                    }`}>
                      <Star className="h-3 w-3" /> {item.status}
                    </span>
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">{item.vendor}</h3>
                  <p className="text-sm text-zinc-500">{item.id} &middot; {item.rfqTitle} ({item.rfqId})</p>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                    <span className="inline-flex items-center gap-1 font-semibold text-zinc-800 dark:text-zinc-200">
                      <DollarSign className="h-4 w-4 text-zinc-400" /> ${item.finalPrice.toLocaleString()}
                    </span>
                    <span className="inline-flex items-center gap-1 text-zinc-500">
                      <Clock className="h-3.5 w-3.5" /> {item.deliveryTimeline}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button onClick={() => setDetailItem(item)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                    <Eye className="h-4 w-4" /> View Details
                  </button>
                  <button onClick={() => showAction(`${item.id} sent for approval`)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                    <Send className="h-4 w-4" /> Approve
                  </button>
                  <button onClick={() => showAction(`${item.id} removed from shortlist`, "error")}
                    className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 dark:hover:text-red-400">
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            <div className="sticky top-0 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-700 dark:bg-zinc-900">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Shortlist Details</h2>
              <button onClick={() => setDetailItem(null)} className="rounded-lg p-1 text-zinc-400 hover:text-zinc-600"><XCircle className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-zinc-400">Quotation ID</p>
                  <p className="font-mono font-medium text-indigo-600">{detailItem.id}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Status</p>
                  <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium mt-0.5 ${
                    detailItem.status === "Pending Approval"
                      ? "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                      : "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                  }`}>{detailItem.status}</span>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Vendor</p>
                  <p className="font-medium text-zinc-800 dark:text-zinc-200">{detailItem.vendor}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">RFQ</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{detailItem.rfqTitle}</p>
                  <p className="text-xs text-zinc-400">{detailItem.rfqId}</p>
                </div>
              </div>

              {/* Price & Delivery */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/40">
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">Final Price</p>
                  <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">${detailItem.finalPrice.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/40">
                  <p className="text-xs text-blue-600 dark:text-blue-400">Delivery Timeline</p>
                  <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{detailItem.deliveryTimeline}</p>
                </div>
              </div>

              {/* Comparison snapshot */}
              {detailItem.comparedAgainst.length > 0 && (
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    <TrendingDown className="inline h-4 w-4 mr-1" /> Comparison Snapshot
                  </h4>
                  <div className="space-y-1.5">
                    {detailItem.comparedAgainst.map((cmp, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-bold text-zinc-500 dark:bg-zinc-700 dark:text-zinc-300">{i + 1}</span>
                        {cmp}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Why shortlisted */}
              <div>
                <h4 className="mb-1 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  <CheckCircle2 className="inline h-4 w-4 mr-1" /> Why Shortlisted
                </h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{detailItem.whyShortlisted}</p>
              </div>

              {/* Notes */}
              <div>
                <h4 className="mb-1 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  <FileText className="inline h-4 w-4 mr-1" /> Notes from Procurement Officer
                </h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{detailItem.notes}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-700">
                <button onClick={() => { setDetailItem(null); showAction(`${detailItem.id} sent for approval`) }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                  <Send className="h-4 w-4" /> Send for Approval
                </button>
                <button onClick={() => { setDetailItem(null); showAction(`PO created from ${detailItem.id}`) }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-950/40">
                  <ShoppingCart className="h-4 w-4" /> Convert to PO
                </button>
                <button onClick={() => { setDetailItem(null); showAction(`${detailItem.id} removed from shortlist`, "error") }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/40">
                  <XCircle className="h-4 w-4" /> Remove from Shortlist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
