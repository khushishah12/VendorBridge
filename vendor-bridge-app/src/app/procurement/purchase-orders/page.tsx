"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  Plus,
  Eye,
  Edit,
  Send,
  Download,
  Truck,
  Search,
  SlidersHorizontal,
  FileText,
  ChevronDown,
  RotateCcw,
  DollarSign,
  Calendar,
  Building2,
} from "lucide-react"
import Link from "next/link"

type PoStatus = "Draft" | "Sent" | "Accepted" | "Delivered" | "Closed" | "Cancelled"

interface PurchaseOrder {
  id: string
  vendor: string
  rfqRef: string
  quotationRef: string
  totalAmount: number
  status: PoStatus
  createdDate: string
  deliveryDeadline: string
  items: number
}

const mockPos: PurchaseOrder[] = [
  { id: "PO-2025-0042", vendor: "TechSolutions Inc.", rfqRef: "RFQ-2025-0004", quotationRef: "QTN-2025-0107", totalAmount: 245000, status: "Delivered", createdDate: "2025-06-02", deliveryDeadline: "2025-06-16", items: 1 },
  { id: "PO-2025-0043", vendor: "TechSolutions Inc.", rfqRef: "RFQ-2025-0001", quotationRef: "QTN-2025-0101", totalAmount: 184500, status: "Sent", createdDate: "2025-06-05", deliveryDeadline: "2025-07-05", items: 1 },
  { id: "PO-2025-0044", vendor: "BuildRight Construction", rfqRef: "RFQ-2025-0002", quotationRef: "QTN-2025-0106", totalAmount: 445000, status: "Draft", createdDate: "2025-06-06", deliveryDeadline: "2025-09-06", items: 4 },
  { id: "PO-2025-0045", vendor: "Acme Corp", rfqRef: "RFQ-2025-0007", quotationRef: "QTN-2025-0105", totalAmount: 82500, status: "Accepted", createdDate: "2025-05-30", deliveryDeadline: "2025-06-29", items: 3 },
  { id: "PO-2025-0041", vendor: "ServicePro Ltd.", rfqRef: "RFQ-2025-0010", quotationRef: "QTN-2025-0113", totalAmount: 67500, status: "Closed", createdDate: "2025-04-20", deliveryDeadline: "2025-05-20", items: 2 },
  { id: "PO-2025-0040", vendor: "Global Supplies Co.", rfqRef: "RFQ-2025-0009", quotationRef: "QTN-2025-0114", totalAmount: 120000, status: "Cancelled", createdDate: "2025-04-10", deliveryDeadline: "2025-05-10", items: 5 },
]

const statusStyles: Record<PoStatus, string> = {
  Draft: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
  Sent: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
  Accepted: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  Delivered: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
  Closed: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
  Cancelled: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800",
}

const statuses: PoStatus[] = ["Draft", "Sent", "Accepted", "Delivered", "Closed", "Cancelled"]
const vendors = [...new Set(mockPos.map((p) => p.vendor))]

export default function AllPurchaseOrdersPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<PoStatus | "All">("All")
  const [vendorFilter, setVendorFilter] = useState("All")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [amountMin, setAmountMin] = useState("")
  const [amountMax, setAmountMax] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [actionMenu, setActionMenu] = useState<string | null>(null)
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return mockPos.filter((po) => {
      if (search && !po.id.toLowerCase().includes(search.toLowerCase()) && !po.vendor.toLowerCase().includes(search.toLowerCase())) return false
      if (statusFilter !== "All" && po.status !== statusFilter) return false
      if (vendorFilter !== "All" && po.vendor !== vendorFilter) return false
      if (dateFrom && po.createdDate < dateFrom) return false
      if (dateTo && po.createdDate > dateTo) return false
      if (amountMin && po.totalAmount < parseFloat(amountMin)) return false
      if (amountMax && po.totalAmount > parseFloat(amountMax)) return false
      return true
    })
  }, [search, statusFilter, vendorFilter, dateFrom, dateTo, amountMin, amountMax])

  function showAction(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(null), 2500)
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Purchase Orders</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{filtered.length} of {mockPos.length} POs</p>
          </div>
          <Link href="/purchase-orders/create"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
            <Plus className="h-4 w-4" /> Generate PO
          </Link>
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
              placeholder="Search by PO ID or vendor..."
              className="w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${
              showFilters ? "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300" : "border-zinc-300 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}>
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="mb-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">Status</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as PoStatus | "All")}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
                  <option value="All">All</option>
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">Vendor</label>
                <select value={vendorFilter} onChange={(e) => setVendorFilter(e.target.value)}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
                  <option value="All">All Vendors</option>
                  {vendors.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">From</label>
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">To</label>
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">Min Amount</label>
                <input type="number" value={amountMin} onChange={(e) => setAmountMin(e.target.value)} placeholder="$0"
                  className="w-24 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">Max Amount</label>
                <input type="number" value={amountMax} onChange={(e) => setAmountMax(e.target.value)} placeholder="$500k"
                  className="w-24 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
              </div>
              <button onClick={() => { setStatusFilter("All"); setVendorFilter("All"); setDateFrom(""); setDateTo(""); setAmountMin(""); setAmountMax("") }}
                className="rounded-lg px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-700">Clear</button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                <th className="px-4 py-3">PO ID</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">RFQ</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Deadline</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-zinc-400">
                    <FileText className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    No purchase orders found
                  </td>
                </tr>
              ) : (
                filtered.map((po) => (
                  <tr key={po.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-indigo-600 dark:text-indigo-400">{po.id}</td>
                    <td className="px-4 py-3 font-medium text-zinc-800 dark:text-zinc-200">{po.vendor}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-zinc-500">{po.rfqRef}</p>
                      <p className="text-[10px] text-zinc-400">{po.quotationRef}</p>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-zinc-900 dark:text-zinc-100">${po.totalAmount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[po.status]}`}>{po.status}</span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{po.createdDate}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
                        <Calendar className="h-3 w-3" /> {po.deliveryDeadline}
                      </span>
                    </td>
                    <td className="relative px-4 py-3 text-right">
                      <button onClick={() => setActionMenu(actionMenu === po.id ? null : po.id)}
                        className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300">
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      {actionMenu === po.id && (
                        <div className="absolute right-4 top-10 z-10 w-48 rounded-xl border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                          <button onClick={() => { setActionMenu(null) }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800">
                            <Eye className="h-4 w-4" /> View PO
                          </button>
                          {po.status === "Draft" && (
                            <button onClick={() => { setActionMenu(null) }}
                              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800">
                              <Edit className="h-4 w-4" /> Edit
                            </button>
                          )}
                          {(po.status === "Draft" || po.status === "Sent") && (
                            <button onClick={() => { setActionMenu(null); showAction(`${po.id} resent to vendor`) }}
                              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-blue-600 hover:bg-zinc-50 dark:text-blue-400 dark:hover:bg-zinc-800">
                              <RotateCcw className="h-4 w-4" /> Resend to Vendor
                            </button>
                          )}
                          <button onClick={() => { setActionMenu(null); showAction(`Downloading ${po.id} PDF...`) }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800">
                            <Download className="h-4 w-4" /> Download PDF
                          </button>
                          {(po.status === "Sent" || po.status === "Accepted") && (
                            <button onClick={() => { setActionMenu(null); showAction(`Tracking delivery for ${po.id}...`) }}
                              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-purple-600 hover:bg-zinc-50 dark:text-purple-400 dark:hover:bg-zinc-800">
                              <Truck className="h-4 w-4" /> Track Delivery
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
          {statuses.map((s) => (
            <span key={s} className="inline-flex items-center gap-1">
              <span className={`h-2 w-2 rounded-full ${
                s === "Draft" ? "bg-zinc-400" : s === "Sent" ? "bg-blue-400" : s === "Accepted" ? "bg-emerald-400" : s === "Delivered" ? "bg-purple-400" : s === "Closed" ? "bg-zinc-500" : "bg-red-400"
              }`} />
              {s}: {mockPos.filter((p) => p.status === s).length}
            </span>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
