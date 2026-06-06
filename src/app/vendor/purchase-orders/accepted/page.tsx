"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { vendorPurchaseOrders } from "@/lib/vendor-po-data"
import {
  Search,
  FileText,
  Building2,
  DollarSign,
  Calendar,
  ChevronDown,
  ChevronUp,
  ListFilter,
} from "lucide-react"

const statusFilters = ["All", "Accepted", "In Progress"] as const

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

export default function AcceptedPurchaseOrdersPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const accepted = useMemo(
    () => vendorPurchaseOrders.filter((p) => p.status === "Accepted" || p.status === "In Progress"),
    [],
  )

  const filtered = useMemo(() => {
    return accepted.filter((po) => {
      if (search && !po.id.toLowerCase().includes(search.toLowerCase()) && !po.rfqTitle.toLowerCase().includes(search.toLowerCase()))
        return false
      if (statusFilter !== "All" && po.status !== statusFilter) return false
      return true
    })
  }, [search, statusFilter, accepted])

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Accepted & In Progress POs</h1>
            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
              {accepted.length} active
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {filtered.length} of {accepted.length} purchase order{accepted.length !== 1 && "s"} — track fulfillment
          </p>
        </div>

        {/* Search + Filter */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by PO ID or RFQ title..."
              className="w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-3 text-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
          <div className="relative">
            <ListFilter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none rounded-lg border border-zinc-300 py-2 pl-9 pr-8 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
            >
              {statusFilters.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 py-16 dark:border-zinc-700">
            <FileText className="mb-3 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
            <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400">No accepted POs found</p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                    <th className="px-4 py-3">PO ID</th>
                    <th className="px-4 py-3">RFQ Title</th>
                    <th className="px-4 py-3">Company</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Delivery Date</th>
                    <th className="px-4 py-3">Payment Terms</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filtered.map((po) => (
                    <>
                      <tr
                        key={po.id}
                        className="group cursor-pointer transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                        onClick={() => setExpandedId(expandedId === po.id ? null : po.id)}
                      >
                        <td className="px-4 py-3 font-mono text-xs font-medium text-indigo-600 dark:text-indigo-400">{po.id}</td>
                        <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{po.rfqTitle}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                            <Building2 className="h-3.5 w-3.5" />
                            {po.company}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">${po.amount.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadge(po.status)}`}>
                            {po.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400">{po.deliveryDate}</td>
                        <td className="max-w-[200px] truncate px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400">{po.paymentTerms}</td>
                        <td className="px-4 py-3">
                          {expandedId === po.id ? (
                            <ChevronUp className="h-4 w-4 text-zinc-400" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-zinc-400" />
                          )}
                        </td>
                      </tr>
                      {expandedId === po.id && (
                        <tr key={`${po.id}-items`} className="bg-zinc-50/50 dark:bg-zinc-900/30">
                          <td colSpan={8} className="px-4 py-3">
                            <div className="text-xs text-zinc-500 dark:text-zinc-400">
                              <p className="mb-2 font-medium text-zinc-700 dark:text-zinc-300">
                                Line Items ({po.items.length})
                              </p>
                              <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
                                <table className="w-full text-xs">
                                  <thead>
                                    <tr className="bg-zinc-100 text-left font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                                      <th className="px-3 py-2">Item</th>
                                      <th className="px-3 py-2">Qty</th>
                                      <th className="px-3 py-2">Unit Price</th>
                                      <th className="px-3 py-2">Total</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
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
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
