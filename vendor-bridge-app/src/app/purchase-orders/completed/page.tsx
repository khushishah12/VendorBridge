"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Eye,
  Archive,
  Copy,
  FileText,
  Search,
  SlidersHorizontal,
  DollarSign,
  Calendar,
  Truck,
  CreditCard,
  BarChart3,
  Receipt,
  XCircle,
} from "lucide-react"
import Link from "next/link"

type DeliveryStatus = "Delivered" | "Fully Completed"

interface CompletedPo {
  id: string
  vendor: string
  rfqRef: string
  quotationRef: string
  finalAmount: number
  deliveryStatus: DeliveryStatus
  completionDate: string
  linkedInvoiceId: string
  paymentStatus: string
  proofOfDelivery: string[]
}

const mockCompleted: CompletedPo[] = [
  {
    id: "PO-2025-0042", vendor: "TechSolutions Inc.", rfqRef: "RFQ-2025-0004", quotationRef: "QTN-2025-0107",
    finalAmount: 245000, deliveryStatus: "Fully Completed", completionDate: "2025-06-16",
    linkedInvoiceId: "INV-2025-0101", paymentStatus: "Paid",
    proofOfDelivery: ["Delivery receipt signed on 2025-06-14", "Service completion certificate uploaded"],
  },
  {
    id: "PO-2025-0041", vendor: "ServicePro Ltd.", rfqRef: "RFQ-2025-0010", quotationRef: "QTN-2025-0113",
    finalAmount: 67500, deliveryStatus: "Delivered", completionDate: "2025-05-18",
    linkedInvoiceId: "INV-2025-0098", paymentStatus: "Pending",
    proofOfDelivery: ["POD signed by warehouse manager on 2025-05-18"],
  },
  {
    id: "PO-2025-0048", vendor: "OfficeMax Supplies", rfqRef: "RFQ-2025-0014", quotationRef: "QTN-2025-0116",
    finalAmount: 28500, deliveryStatus: "Delivered", completionDate: "2025-06-10",
    linkedInvoiceId: "INV-2025-0105", paymentStatus: "Unpaid",
    proofOfDelivery: ["Delivered to floor 4 reception"],
  },
]

const deliveryStyles: Record<DeliveryStatus, string> = {
  Delivered: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
  "Fully Completed": "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
}

const paymentStyles: Record<string, string> = {
  Paid: "text-emerald-600 dark:text-emerald-400",
  Pending: "text-amber-600 dark:text-amber-400",
  Unpaid: "text-red-600 dark:text-red-400",
}

export default function CompletedPurchaseOrdersPage() {
  const [search, setSearch] = useState("")
  const [deliveryFilter, setDeliveryFilter] = useState<DeliveryStatus | "All">("All")
  const [showFilters, setShowFilters] = useState(false)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return mockCompleted.filter((po) => {
      if (search && !po.id.toLowerCase().includes(search.toLowerCase()) && !po.vendor.toLowerCase().includes(search.toLowerCase())) return false
      if (deliveryFilter !== "All" && po.deliveryStatus !== deliveryFilter) return false
      return true
    })
  }, [search, deliveryFilter])

  function showAction(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(null), 2500)
  }

  const detail = mockCompleted.find((p) => p.id === detailId)

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <Link href="/purchase-orders" className="mb-2 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
            <ArrowLeft className="h-4 w-4" /> Back to All POs
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Completed Purchase Orders</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{mockCompleted.length} POs completed</p>
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
          <select value={deliveryFilter} onChange={(e) => setDeliveryFilter(e.target.value as DeliveryStatus | "All")}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
            <option value="All">All Status</option>
            <option value="Delivered">Delivered</option>
            <option value="Fully Completed">Fully Completed</option>
          </select>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                <th className="px-4 py-3">PO ID</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3 text-right">Final Amount</th>
                <th className="px-4 py-3">Delivery Status</th>
                <th className="px-4 py-3">Completion Date</th>
                <th className="px-4 py-3">Linked Invoice ⭐</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-zinc-400"><Truck className="mx-auto mb-2 h-8 w-8 opacity-50" />No completed POs</td></tr>
              ) : (
                filtered.map((po) => (
                  <tr key={po.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-indigo-600 dark:text-indigo-400">{po.id}</td>
                    <td className="px-4 py-3 font-medium text-zinc-800 dark:text-zinc-200">{po.vendor}</td>
                    <td className="px-4 py-3 text-right font-semibold text-zinc-900 dark:text-zinc-100">${po.finalAmount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${deliveryStyles[po.deliveryStatus]}`}>
                        {po.deliveryStatus === "Fully Completed" ? <CheckCircle2 className="h-3 w-3" /> : <Truck className="h-3 w-3" />}
                        {po.deliveryStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{po.completionDate}</td>
                    <td className="px-4 py-3">
                      <Link href={`/invoices`} className="font-mono text-xs font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 underline underline-offset-2">
                        {po.linkedInvoiceId} →
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${paymentStyles[po.paymentStatus]}`}>
                        <CreditCard className="h-3 w-3" /> {po.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setDetailId(po.id)}
                        className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            <div className="sticky top-0 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-700 dark:bg-zinc-900">
              <div><h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Completed PO Details</h2><p className="text-sm text-zinc-400">{detail.id}</p></div>
              <button onClick={() => setDetailId(null)} className="rounded-lg p-1 text-zinc-400 hover:text-zinc-600"><XCircle className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><p className="text-xs text-zinc-400">Vendor</p><p className="font-medium text-zinc-800 dark:text-zinc-200">{detail.vendor}</p></div>
                <div><p className="text-xs text-zinc-400">Final Amount</p><p className="font-bold text-lg text-zinc-900 dark:text-zinc-50">${detail.finalAmount.toLocaleString()}</p></div>
                <div><p className="text-xs text-zinc-400">RFQ</p><p className="text-sm text-zinc-600 dark:text-zinc-400">{detail.rfqRef}</p></div>
                <div><p className="text-xs text-zinc-400">Approved Quotation</p><p className="text-sm text-zinc-600 dark:text-zinc-400">{detail.quotationRef}</p></div>
                <div>
                  <p className="text-xs text-zinc-400">Delivery Status</p>
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium mt-0.5 ${deliveryStyles[detail.deliveryStatus]}`}>{detail.deliveryStatus}</span>
                </div>
                <div><p className="text-xs text-zinc-400">Completion Date</p><p className="text-zinc-600 dark:text-zinc-400">{detail.completionDate}</p></div>
                <div>
                  <p className="text-xs text-zinc-400">Linked Invoice ⭐</p>
                  <p className="font-mono font-medium text-indigo-600 dark:text-indigo-400">{detail.linkedInvoiceId}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Payment Status</p>
                  <span className={`inline-flex items-center gap-1 text-sm font-medium ${paymentStyles[detail.paymentStatus]}`}>
                    <CreditCard className="h-4 w-4" /> {detail.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Delivery Proof */}
              <div>
                <h4 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300"><Truck className="inline h-4 w-4 mr-1" /> Delivery Proof / Status Timeline</h4>
                <div className="space-y-2">
                  {detail.proofOfDelivery.map((proof, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                      {proof}
                    </div>
                  ))}
                </div>
              </div>

              {/* Invoice Generated Status */}
              <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-900 dark:bg-indigo-950/40">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                   <Receipt className="h-4 w-4" /> Invoice Generated
                </h4>
                <p className="mt-1 text-sm text-indigo-600 dark:text-indigo-400">
                  Invoice <span className="font-mono font-medium">{detail.linkedInvoiceId}</span> has been generated.
                  Payment is <span className={`font-medium ${paymentStyles[detail.paymentStatus]}`}>{detail.paymentStatus}</span>.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-700">
                <button onClick={() => showAction(`Downloading ${detail.id} PDF...`)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  <Download className="h-4 w-4" /> Download PO PDF
                </button>
                <button onClick={() => showAction(`Viewing invoice ${detail.linkedInvoiceId}...`)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                   <Receipt className="h-4 w-4" /> View Linked Invoice ⭐
                </button>
                <button onClick={() => showAction(`${detail.id} archived`)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  <Archive className="h-4 w-4" /> Archive PO
                </button>
                <button onClick={() => showAction(`Report generated for ${detail.id}`)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  <BarChart3 className="h-4 w-4" /> Generate Report
                </button>
                <button onClick={() => showAction(`${detail.id} cloned as new PO`)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-purple-300 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-950/40">
                  <Copy className="h-4 w-4" /> Clone PO ⭐
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
