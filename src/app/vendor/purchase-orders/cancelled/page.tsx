"use client"

import { useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { vendorPurchaseOrders } from "@/lib/vendor-po-data"
import {
  Ban,
  Building2,
  DollarSign,
  Calendar,
  XCircle,
  FileText,
  AlertTriangle,
} from "lucide-react"

export default function CancelledPurchaseOrdersPage() {
  const cancelled = useMemo(
    () => vendorPurchaseOrders.filter((p) => p.status === "Cancelled" || p.status === "Rejected"),
    [],
  )

  function statusBadge(status: string) {
    if (status === "Cancelled") {
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
    }
    return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
  }

  function ReasonIcon({ status }: { status: string }) {
    if (status === "Cancelled") return <Ban className="h-4 w-4 text-red-500" />
    return <XCircle className="h-4 w-4 text-zinc-500" />
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Cancelled & Rejected POs</h1>
            <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {cancelled.length} total
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Purchase orders that were cancelled or rejected
          </p>
        </div>

        {/* Cards */}
        {cancelled.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 py-16 dark:border-zinc-700">
            <Ban className="mb-3 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
            <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400">No cancelled or rejected POs</p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500">This list will contain any POs that were cancelled or rejected</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cancelled.map((po) => (
              <div
                key={po.id}
                className={`rounded-xl border shadow-sm ${
                  po.status === "Cancelled"
                    ? "border-red-200 bg-white dark:border-red-900/40 dark:bg-zinc-950"
                    : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-medium text-indigo-600 dark:text-indigo-400">{po.id}</span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadge(po.status)}`}
                        >
                          <ReasonIcon status={po.status} />
                          {po.status}
                        </span>
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
                      </div>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="mt-4 rounded-lg border border-red-100 bg-red-50/50 p-3 dark:border-red-900/30 dark:bg-red-950/10">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className={`mt-0.5 h-4 w-4 shrink-0 ${
                        po.status === "Cancelled" ? "text-red-500" : "text-zinc-400"
                      }`} />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                          {po.status === "Cancelled" ? "Cancellation Reason" : "Rejection Reason"}
                        </p>
                        <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{po.notes}</p>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="inline-flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5" />
                      {po.items.length} item{po.items.length !== 1 && "s"}
                    </span>
                    {po.deliveryDate && (
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        Original delivery: {po.deliveryDate}
                      </span>
                    )}
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
