"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  Eye,
  GitCompareArrows,
  Star,
  XCircle,
  RefreshCw,
  Search,
  SlidersHorizontal,
  ChevronDown,
  MessageSquare,
  Calendar,
  DollarSign,
  Truck,
  FileText,
  Clock,
} from "lucide-react"
import Link from "next/link"

type QStatus = "Received" | "Under Review" | "Shortlisted" | "Rejected"

interface Quotation {
  id: string
  rfqId: string
  rfqTitle: string
  vendor: string
  submittedDate: string
  totalAmount: number
  deliveryTimeline: string
  status: QStatus
  notes: string
  items: { name: string; qty: number; unit: string; price: number }[]
}

const mockQuotations: Quotation[] = [
  { id: "QTN-2025-0101", rfqId: "RFQ-2025-0001", rfqTitle: "Office Laptops Procurement", vendor: "TechSolutions Inc.", submittedDate: "2025-05-20", totalAmount: 184500, deliveryTimeline: "30 days", status: "Shortlisted", notes: "Includes warranty and setup", items: [{ name: "Laptop Pro X1", qty: 30, unit: "pcs", price: 6150 }] },
  { id: "QTN-2025-0102", rfqId: "RFQ-2025-0001", rfqTitle: "Office Laptops Procurement", vendor: "Acme Corp", submittedDate: "2025-05-22", totalAmount: 192000, deliveryTimeline: "45 days", status: "Under Review", notes: "Bulk discount offered", items: [{ name: "Laptop EliteBook", qty: 30, unit: "pcs", price: 6400 }] },
  { id: "QTN-2025-0103", rfqId: "RFQ-2025-0001", rfqTitle: "Office Laptops Procurement", vendor: "Global Supplies Co.", submittedDate: "2025-05-18", totalAmount: 210000, deliveryTimeline: "60 days", status: "Rejected", notes: "Above budget", items: [{ name: "Laptop ThinkPad", qty: 30, unit: "pcs", price: 7000 }] },
  { id: "QTN-2025-0104", rfqId: "RFQ-2025-0007", rfqTitle: "Network Equipment Upgrade", vendor: "TechSolutions Inc.", submittedDate: "2025-05-25", totalAmount: 89000, deliveryTimeline: "21 days", status: "Received", notes: "", items: [{ name: "Switch 48-port", qty: 5, unit: "pcs", price: 17800 }] },
  { id: "QTN-2025-0105", rfqId: "RFQ-2025-0007", rfqTitle: "Network Equipment Upgrade", vendor: "Acme Corp", submittedDate: "2025-05-28", totalAmount: 82500, deliveryTimeline: "30 days", status: "Received", notes: "Early bird discount", items: [{ name: "Switch 48-port", qty: 5, unit: "pcs", price: 16500 }] },
  { id: "QTN-2025-0106", rfqId: "RFQ-2025-0002", rfqTitle: "Construction Materials - Phase 2", vendor: "BuildRight Construction", submittedDate: "2025-05-30", totalAmount: 445000, deliveryTimeline: "90 days", status: "Under Review", notes: "Phased delivery available", items: [{ name: "Steel Beams", qty: 100, unit: "pcs", price: 4450 }] },
  { id: "QTN-2025-0107", rfqId: "RFQ-2025-0004", rfqTitle: "Cloud Infrastructure Services", vendor: "TechSolutions Inc.", submittedDate: "2025-05-10", totalAmount: 245000, deliveryTimeline: "14 days", status: "Shortlisted", notes: "Best value for money", items: [{ name: "Cloud Migration", qty: 1, unit: "set", price: 245000 }] },
]

const vendors = [...new Set(mockQuotations.map((q) => q.vendor))]
const rfqs = [...new Set(mockQuotations.map((q) => q.rfqId + " - " + q.rfqTitle))]
const statuses: QStatus[] = ["Received", "Under Review", "Shortlisted", "Rejected"]

const statusStyles: Record<QStatus, string> = {
  Received: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
  "Under Review": "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
  Shortlisted: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  Rejected: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800",
}

export default function ReceivedQuotationsPage() {
  const [search, setSearch] = useState("")
  const [rfqFilter, setRfqFilter] = useState("All")
  const [vendorFilter, setVendorFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState<QStatus | "All">("All")
  const [priceMin, setPriceMin] = useState("")
  const [priceMax, setPriceMax] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [detailModal, setDetailModal] = useState<Quotation | null>(null)
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([])
  const [actionMsg, setActionMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const filtered = useMemo(() => {
    return mockQuotations.filter((q) => {
      if (search && !q.id.toLowerCase().includes(search.toLowerCase()) && !q.vendor.toLowerCase().includes(search.toLowerCase()) && !q.rfqTitle.toLowerCase().includes(search.toLowerCase())) return false
      if (rfqFilter !== "All" && q.rfqId !== rfqFilter.split(" - ")[0]) return false
      if (vendorFilter !== "All" && q.vendor !== vendorFilter) return false
      if (statusFilter !== "All" && q.status !== statusFilter) return false
      if (priceMin && q.totalAmount < parseFloat(priceMin)) return false
      if (priceMax && q.totalAmount > parseFloat(priceMax)) return false
      if (dateFrom && q.submittedDate < dateFrom) return false
      if (dateTo && q.submittedDate > dateTo) return false
      return true
    })
  }, [search, rfqFilter, vendorFilter, statusFilter, priceMin, priceMax, dateFrom, dateTo])

  function toggleCompare(id: string) {
    setSelectedForCompare((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  function showAction(msg: string, type: "success" | "error" = "success") {
    setActionMsg({ type, text: msg })
    setTimeout(() => setActionMsg(null), 2500)
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Received Quotations</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{filtered.length} quotations</p>
          </div>
          <div className="flex items-center gap-2">
            {selectedForCompare.length >= 2 && (
              <Link
                href={`/quotations/compare?ids=${selectedForCompare.join(",")}`}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                <GitCompareArrows className="h-4 w-4" /> Compare ({selectedForCompare.length})
              </Link>
            )}
            <Link href="/quotations/compare" className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
              <GitCompareArrows className="h-4 w-4" /> Compare
            </Link>
          </div>
        </div>

        {/* Toast */}
        {actionMsg && (
          <div className={`mb-4 rounded-lg px-4 py-2 text-sm font-medium ${
            actionMsg.type === "success" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"
          }`}>
            {actionMsg.text}
          </div>
        )}

        {/* Search + Filter Toggle */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, vendor, or RFQ..."
              className="w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${
              showFilters ? "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300" : "border-zinc-300 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}>
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mb-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">RFQ</label>
                <select value={rfqFilter} onChange={(e) => setRfqFilter(e.target.value)}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
                  <option value="All">All RFQs</option>
                  {rfqs.map((r) => <option key={r} value={r}>{r}</option>)}
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
                <label className="mb-1 block text-xs font-medium text-zinc-500">Status</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as QStatus | "All")}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
                  <option value="All">All</option>
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">Min Price</label>
                <input type="number" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} placeholder="$0"
                  className="w-24 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">Max Price</label>
                <input type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} placeholder="$999k"
                  className="w-24 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
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
              <button onClick={() => { setRfqFilter("All"); setVendorFilter("All"); setStatusFilter("All"); setPriceMin(""); setPriceMax(""); setDateFrom(""); setDateTo("") }}
                className="rounded-lg px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-700">Clear</button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                <th className="px-4 py-3 w-10"></th>
                <th className="px-4 py-3">Quotation ID</th>
                <th className="px-4 py-3">RFQ</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3">Delivery</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-zinc-400">
                    <FileText className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    No quotations found
                  </td>
                </tr>
              ) : (
                filtered.map((q) => (
                  <tr key={q.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedForCompare.includes(q.id)}
                        onChange={() => toggleCompare(q.id)}
                        className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-4 py-3 font-mono text-xs font-medium text-indigo-600 dark:text-indigo-400">{q.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">{q.rfqTitle}</p>
                      <p className="text-xs text-zinc-400">{q.rfqId}</p>
                    </td>
                    <td className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">{q.vendor}</td>
                    <td className="px-4 py-3 text-zinc-500">{q.submittedDate}</td>
                    <td className="px-4 py-3 text-right font-medium text-zinc-900 dark:text-zinc-100">${q.totalAmount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-sm text-zinc-500">
                        <Truck className="h-3 w-3" /> {q.deliveryTimeline}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[q.status]}`}>{q.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button onClick={() => setDetailModal(q)}
                          className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400" title="View full quotation">
                          <Eye className="h-4 w-4" />
                        </button>
                        {q.status === "Received" && (
                          <button onClick={() => { showAction(`${q.id} moved to Under Review`); }}
                            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950/40 dark:hover:text-amber-400" title="Mark as Under Review">
                            <Clock className="h-4 w-4" />
                          </button>
                        )}
                        {(q.status === "Received" || q.status === "Under Review") && (
                          <>
                            <button onClick={() => { showAction(`${q.id} shortlisted`); }}
                              className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400" title="Shortlist">
                              <Star className="h-4 w-4" />
                            </button>
                            <button onClick={() => { showAction(`${q.id} rejected`); }}
                              className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400" title="Reject">
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <button onClick={() => { showAction(`Revision requested from ${q.vendor}`); }}
                          className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 dark:hover:text-blue-400" title="Request Revision">
                          <RefreshCw className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs text-zinc-400">Select multiple quotations and click &quot;Compare&quot; to view side-by-side.</p>
      </div>

      {/* Detail Modal */}
      {detailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            <div className="sticky top-0 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-700 dark:bg-zinc-900">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Quotation Details</h2>
              <button onClick={() => setDetailModal(null)} className="rounded-lg p-1 text-zinc-400 hover:text-zinc-600"><XCircle className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-zinc-400">Quotation ID</p>
                  <p className="font-mono font-medium text-indigo-600">{detailModal.id}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Status</p>
                  <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium mt-0.5 ${statusStyles[detailModal.status]}`}>{detailModal.status}</span>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">RFQ</p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{detailModal.rfqTitle}</p>
                  <p className="text-xs text-zinc-400">{detailModal.rfqId}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Vendor</p>
                  <p className="font-medium text-zinc-700 dark:text-zinc-300">{detailModal.vendor}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Submitted</p>
                  <p className="text-zinc-600 dark:text-zinc-400">{detailModal.submittedDate}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Delivery Timeline</p>
                  <p className="text-zinc-600 dark:text-zinc-400">{detailModal.deliveryTimeline}</p>
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Line Items</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 text-left text-xs text-zinc-500 dark:border-zinc-700">
                      <th className="pb-1 pr-2">Item</th>
                      <th className="pb-1 pr-2">Qty</th>
                      <th className="pb-1 pr-2">Unit</th>
                      <th className="pb-1 text-right">Unit Price</th>
                      <th className="pb-1 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailModal.items.map((item, i) => (
                      <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800">
                        <td className="py-1.5 pr-2 font-medium text-zinc-800 dark:text-zinc-200">{item.name}</td>
                        <td className="py-1.5 pr-2 text-zinc-600">{item.qty}</td>
                        <td className="py-1.5 pr-2 text-zinc-600">{item.unit}</td>
                        <td className="py-1.5 pr-2 text-right text-zinc-600">${item.price.toLocaleString()}</td>
                        <td className="py-1.5 text-right font-medium text-zinc-900 dark:text-zinc-100">${(item.qty * item.price).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={4} className="pt-2 text-right text-sm font-semibold text-zinc-700 dark:text-zinc-300">Total</td>
                      <td className="pt-2 text-right text-sm font-bold text-zinc-900 dark:text-zinc-50">${detailModal.totalAmount.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {detailModal.notes && (
                <div>
                  <p className="text-xs text-zinc-400 mb-1">Notes</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{detailModal.notes}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-700">
                <button className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"><Eye className="h-4 w-4" /> View Full Quotation</button>
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"><GitCompareArrows className="h-4 w-4" /> Compare</button>
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-950/40"><Star className="h-4 w-4" /> Shortlist</button>
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/40"><XCircle className="h-4 w-4" /> Reject</button>
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-blue-300 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950/40"><RefreshCw className="h-4 w-4" /> Request Revision</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
