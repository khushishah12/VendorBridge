"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  Plus,
  Eye,
  Send,
  Download,
  Search,
  SlidersHorizontal,
  FileText,
  ChevronDown,
  CreditCard,
  Calendar,
  Building2,
  AlertTriangle,
  XCircle,
  RotateCcw,
  DollarSign,
} from "lucide-react"
import Link from "next/link"

type InvStatus = "Draft" | "Sent" | "Paid" | "Overdue" | "Cancelled"

interface Invoice {
  id: string
  vendor: string
  poRef: string
  amount: number
  status: InvStatus
  invoiceDate: string
  dueDate: string
  paidDate: string | null
}

const mockInvoices: Invoice[] = [
  { id: "INV-2025-0101", vendor: "TechSolutions Inc.", poRef: "PO-2025-0042", amount: 245000, status: "Paid", invoiceDate: "2025-06-01", dueDate: "2025-07-01", paidDate: "2025-06-15" },
  { id: "INV-2025-0102", vendor: "ServicePro Ltd.", poRef: "PO-2025-0041", amount: 67500, status: "Sent", invoiceDate: "2025-06-05", dueDate: "2025-07-05", paidDate: null },
  { id: "INV-2025-0103", vendor: "OfficeMax Supplies", poRef: "PO-2025-0048", amount: 28500, status: "Draft", invoiceDate: "2025-06-06", dueDate: "2025-07-06", paidDate: null },
  { id: "INV-2025-0104", vendor: "Global Supplies Co.", poRef: "PO-2025-0046", amount: 56000, status: "Overdue", invoiceDate: "2025-05-01", dueDate: "2025-05-31", paidDate: null },
  { id: "INV-2025-0105", vendor: "Acme Corp", poRef: "PO-2025-0045", amount: 82500, status: "Paid", invoiceDate: "2025-05-15", dueDate: "2025-06-14", paidDate: "2025-06-10" },
  { id: "INV-2025-0106", vendor: "BuildRight Construction", poRef: "PO-2025-0044", amount: 445000, status: "Cancelled", invoiceDate: "2025-06-03", dueDate: "2025-07-03", paidDate: null },
  { id: "INV-2025-0107", vendor: "TechSolutions Inc.", poRef: "PO-2025-0043", amount: 184500, status: "Sent", invoiceDate: "2025-06-04", dueDate: "2025-07-04", paidDate: null },
]

const statusStyles: Record<InvStatus, string> = {
  Draft: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
  Sent: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
  Paid: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  Overdue: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800",
  Cancelled: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
}

const statuses: InvStatus[] = ["Draft", "Sent", "Paid", "Overdue", "Cancelled"]
const vendors = [...new Set(mockInvoices.map((i) => i.vendor))]

export default function AllInvoicesPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<InvStatus | "All">("All")
  const [vendorFilter, setVendorFilter] = useState("All")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [amountMin, setAmountMin] = useState("")
  const [amountMax, setAmountMax] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [actionMenu, setActionMenu] = useState<string | null>(null)
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return mockInvoices.filter((inv) => {
      if (search && !inv.id.toLowerCase().includes(search.toLowerCase()) && !inv.vendor.toLowerCase().includes(search.toLowerCase())) return false
      if (statusFilter !== "All" && inv.status !== statusFilter) return false
      if (vendorFilter !== "All" && inv.vendor !== vendorFilter) return false
      if (dateFrom && inv.invoiceDate < dateFrom) return false
      if (dateTo && inv.invoiceDate > dateTo) return false
      if (amountMin && inv.amount < parseFloat(amountMin)) return false
      if (amountMax && inv.amount > parseFloat(amountMax)) return false
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
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Invoices</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{filtered.length} of {mockInvoices.length} invoices</p>
          </div>
          <Link href="/invoices/create"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
            <Plus className="h-4 w-4" /> Generate Invoice
          </Link>
        </div>

        {actionMsg && (
          <div className="mb-4 rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{actionMsg}</div>
        )}

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by invoice ID or vendor..."
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
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as InvStatus | "All")}
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

        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                <th className="px-4 py-3">Invoice ID</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">PO Reference</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Invoice Date</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-zinc-400">
                    <FileText className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    No invoices found
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => (
                  <tr key={inv.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-indigo-600 dark:text-indigo-400">{inv.id}</td>
                    <td className="px-4 py-3 font-medium text-zinc-800 dark:text-zinc-200">{inv.vendor}</td>
                    <td className="px-4 py-3 text-xs text-zinc-500">{inv.poRef}</td>
                    <td className="px-4 py-3 text-right font-medium text-zinc-900 dark:text-zinc-100">${inv.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[inv.status]}`}>{inv.status}</span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{inv.invoiceDate}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs ${inv.status === "Overdue" ? "text-red-500 font-medium" : "text-zinc-500"}`}>
                        <Calendar className="h-3 w-3" /> {inv.dueDate}
                        {inv.status === "Overdue" && <AlertTriangle className="h-3 w-3" />}
                      </span>
                    </td>
                    <td className="relative px-4 py-3 text-right">
                      <button onClick={() => setActionMenu(actionMenu === inv.id ? null : inv.id)}
                        className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300">
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      {actionMenu === inv.id && (
                        <div className="absolute right-4 top-10 z-10 w-48 rounded-xl border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                          <button onClick={() => { setActionMenu(null) }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800">
                            <Eye className="h-4 w-4" /> View Invoice
                          </button>
                          {inv.status === "Draft" && (
                            <button onClick={() => { setActionMenu(null); showAction(`${inv.id} sent to vendor`) }}
                              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-blue-600 hover:bg-zinc-50 dark:text-blue-400 dark:hover:bg-zinc-800">
                              <Send className="h-4 w-4" /> Send to Vendor
                            </button>
                          )}
                          {inv.status === "Sent" && (
                            <button onClick={() => { setActionMenu(null); showAction(`${inv.id} resent`) }}
                              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800">
                              <RotateCcw className="h-4 w-4" /> Resend
                            </button>
                          )}
                          <button onClick={() => { setActionMenu(null); showAction(`Downloading ${inv.id} PDF...`) }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800">
                            <Download className="h-4 w-4" /> Download PDF
                          </button>
                          {inv.status !== "Paid" && inv.status !== "Cancelled" && (
                            <button onClick={() => { setActionMenu(null); showAction(`${inv.id} marked as paid`) }}
                              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-emerald-600 hover:bg-zinc-50 dark:text-emerald-400 dark:hover:bg-zinc-800">
                              <CreditCard className="h-4 w-4" /> Mark as Paid
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

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
          {statuses.map((s) => (
            <span key={s} className="inline-flex items-center gap-1">
              <span className={`h-2 w-2 rounded-full ${
                s === "Draft" ? "bg-zinc-400" : s === "Sent" ? "bg-blue-400" : s === "Paid" ? "bg-emerald-400" : s === "Overdue" ? "bg-red-400" : "bg-zinc-500"
              }`} />
              {s}: {mockInvoices.filter((i) => i.status === s).length}
            </span>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
