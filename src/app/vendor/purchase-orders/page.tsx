"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { vendorPurchaseOrders } from "@/lib/vendor-po-data"
import {
  Package,
  Building2,
  DollarSign,
  Calendar,
  ChevronDown,
  ChevronUp,
  Truck,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react"

function statusBadge(status: string) {
  const map: Record<string, string> = {
    Incoming: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    Accepted: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    "In Progress": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    Delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    Cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    Rejected: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  }
  return map[status] || ""
}

export default function IncomingPurchaseOrdersPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [acceptModalId, setAcceptModalId] = useState<string | null>(null)
  const [acceptedIds, setAcceptedIds] = useState<Set<string>>(new Set())

  const incoming = useMemo(
    () => vendorPurchaseOrders.filter((p) => p.status === "Incoming"),
    [],
  )

  function handleAccept(id: string) {
    setAcceptedIds((prev) => new Set(prev).add(id))
    setAcceptModalId(null)
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Incoming Purchase Orders</h1>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                {incoming.length} pending
              </span>
            </div>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Review and accept incoming POs from buyers
            </p>
          </div>
        </div>

        {/* PO Cards */}
        <div className="space-y-4">
          {incoming.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 py-16 dark:border-zinc-700">
              <Package className="mb-3 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
              <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400">No incoming purchase orders</p>
              <p className="text-sm text-zinc-400 dark:text-zinc-500">
                When a buyer issues a PO, it will appear here
              </p>
            </div>
          ) : (
            incoming.map((po) => {
              const isExpanded = expandedId === po.id
              const isAccepted = acceptedIds.has(po.id)

              return (
                <div
                  key={po.id}
                  className={`rounded-xl border shadow-sm transition-all duration-200 hover:shadow-md ${
                    isAccepted
                      ? "border-emerald-300 bg-emerald-50/50 dark:border-emerald-700 dark:bg-emerald-950/20"
                      : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
                  }`}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-medium text-indigo-600 dark:text-indigo-400">{po.id}</span>
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadge(po.status)}`}
                          >
                            {po.status}
                          </span>
                          {isAccepted && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                              <CheckCircle className="h-3 w-3" /> Accepted
                            </span>
                          )}
                        </div>
                        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{po.rfqTitle}</h2>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                          <span className="inline-flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5" />
                            {po.company}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <DollarSign className="h-3.5 w-3.5" />
                            ${po.amount.toLocaleString()}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            Issued: {po.issuedDate}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Truck className="h-3.5 w-3.5" />
                            {po.shippingMethod}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {po.paymentTerms}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Items Summary */}
                    <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                      <Package className="h-3.5 w-3.5" />
                      <span>{po.items.length} item{po.items.length !== 1 && "s"}</span>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {!isAccepted && (
                        <button
                          onClick={() => setAcceptModalId(po.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-700"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          Accept PO
                        </button>
                      )}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : po.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
                      >
                        {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        {isExpanded ? "Hide Details" : "Review Details"}
                      </button>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-4 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                              Payment Terms
                            </h4>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300">{po.paymentTerms}</p>
                          </div>
                          <div>
                            <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                              Shipping Method
                            </h4>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300">{po.shippingMethod}</p>
                          </div>
                        </div>
                        {po.notes && (
                          <div className="mt-3">
                            <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                              Notes
                            </h4>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300">{po.notes}</p>
                          </div>
                        )}
                        {/* Line Items Table */}
                        <div className="mt-3 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="bg-zinc-50 text-left font-semibold text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                                <th className="px-3 py-2">Item</th>
                                <th className="px-3 py-2">Qty</th>
                                <th className="px-3 py-2">Unit Price</th>
                                <th className="px-3 py-2">Total</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                              {po.items.map((item, i) => (
                                <tr key={i} className="text-zinc-700 dark:text-zinc-300">
                                  <td className="px-3 py-1.5">{item.name}</td>
                                  <td className="px-3 py-1.5">{item.quantity}</td>
                                  <td className="px-3 py-1.5">${item.unitPrice.toLocaleString()}</td>
                                  <td className="px-3 py-1.5">${item.total.toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Accept Confirmation Modal */}
      {acceptModalId && (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="mx-4 w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Accept Purchase Order</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    You are about to accept {acceptModalId}
                  </p>
                </div>
              </div>
              <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
                By accepting this PO, you agree to fulfill all line items according to the specified terms, delivery schedule, and pricing.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setAcceptModalId(null)}
                  className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAccept(acceptModalId)}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                >
                  Confirm Accept
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}
