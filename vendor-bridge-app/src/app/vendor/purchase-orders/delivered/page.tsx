"use client"

import { useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { vendorPurchaseOrders } from "@/lib/vendor-po-data"
import {
  Package,
  Building2,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Truck,
} from "lucide-react"

export default function DeliveredPurchaseOrdersPage() {
  const delivered = useMemo(
    () => vendorPurchaseOrders.filter((p) => p.status === "Delivered"),
    [],
  )

  function paymentStatusIndicator(po: (typeof delivered)[number]) {
    const isPaid = po.paymentTerms.toLowerCase().includes("net 30") || po.paymentTerms.toLowerCase().includes("net 45")
    if (isPaid) {
      return {
        label: "Awaiting Payment",
        color: "text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400",
        icon: Clock,
      }
    }
    return {
      label: "Paid",
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400",
      icon: CreditCard,
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Delivered Purchase Orders</h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              {delivered.length} completed
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Completed deliveries awaiting confirmation and payment
          </p>
        </div>

        {/* Cards */}
        {delivered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 py-16 dark:border-zinc-700">
            <Truck className="mb-3 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
            <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400">No delivered POs yet</p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500">
              Completed deliveries will appear here once marked as delivered
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {delivered.map((po) => {
              const payment = paymentStatusIndicator(po)
              const PaymentIcon = payment.icon

              return (
                <div
                  key={po.id}
                  className="rounded-xl border border-emerald-200 bg-white shadow-sm dark:border-emerald-800 dark:bg-zinc-950"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-medium text-indigo-600 dark:text-indigo-400">{po.id}</span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" /> Delivered
                          </span>
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${payment.color}`}>
                            <PaymentIcon className="h-3 w-3" />
                            {payment.label}
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
                            Delivered: {po.deliveryDate}
                          </span>
                        </div>
                      </div>

                      {/* Delivery Confirmation Checkmark */}
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                        <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    </div>

                    {/* Items Delivered Summary */}
                    <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50/50 p-3 dark:border-emerald-900/30 dark:bg-emerald-950/10">
                      <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        <Package className="h-3.5 w-3.5" />
                        Items Delivered ({po.items.length})
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {po.items.map((item, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                          >
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                            {item.name} x{item.quantity}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Delivery info */}
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                      <span className="inline-flex items-center gap-1">
                        <Truck className="h-3 w-3" />
                        {po.shippingMethod}
                      </span>
                      {po.notes && (
                        <span className="italic">{po.notes}</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
