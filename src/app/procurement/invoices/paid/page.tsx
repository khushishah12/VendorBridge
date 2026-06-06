"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Eye,
  Search,
  FileText,
  CreditCard,
  Calendar,
  DollarSign,
  Building2,
  XCircle,
  CheckCheck,
  Receipt,
} from "lucide-react"
import Link from "next/link"

interface PaidInvoice {
  id: string
  vendor: string
  poRef: string
  amount: number
  paidDate: string
  paymentMethod: string
  transactionRef: string
  invoiceDate: string
  dueDate: string
}

const mockPaid: PaidInvoice[] = [
  {
    id: "INV-2025-0101", vendor: "TechSolutions Inc.", poRef: "PO-2025-0042", amount: 245000,
    paidDate: "2025-06-15", paymentMethod: "Bank Transfer", transactionRef: "TRX-2025-8842",
    invoiceDate: "2025-06-01", dueDate: "2025-07-01",
  },
  {
    id: "INV-2025-0105", vendor: "Acme Corp", poRef: "PO-2025-0045", amount: 82500,
    paidDate: "2025-06-10", paymentMethod: "Credit Card", transactionRef: "TRX-2025-8791",
    invoiceDate: "2025-05-15", dueDate: "2025-06-14",
  },
]

export default function PaidInvoicesPage() {
  const [search, setSearch] = useState("")
  const [detailId, setDetailId] = useState<string | null>(null)
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return mockPaid.filter((inv) => {
      if (search && !inv.id.toLowerCase().includes(search.toLowerCase()) && !inv.vendor.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [search])

  function showAction(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(null), 2500)
  }

  const detail = mockPaid.find((i) => i.id === detailId)

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <Link href="/invoices" className="mb-2 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
            <ArrowLeft className="h-4 w-4" /> Back to All Invoices
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Paid Invoices</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{mockPaid.length} invoices paid &middot; Total: ${mockPaid.reduce((s, i) => s + i.amount, 0).toLocaleString()}</p>
        </div>

        {actionMsg && (
          <div className="mb-4 rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{actionMsg}</div>
        )}

        <div className="mb-4 relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by invoice ID or vendor..."
            className="w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
        </div>

        <div className="space-y-3">
          {filtered.map((inv) => (
            <div key={inv.id} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-medium text-indigo-600 dark:text-indigo-400">{inv.id}</span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                      <CheckCircle2 className="h-3 w-3" /> Paid
                    </span>
                  </div>
                  <h3 className="mt-1 text-base font-semibold text-zinc-900 dark:text-zinc-50">{inv.vendor}</h3>
                  <p className="text-sm text-zinc-500">{inv.poRef} &middot; ${inv.amount.toLocaleString()}</p>
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-zinc-400">
                    <span className="inline-flex items-center gap-1"><CreditCard className="h-3 w-3" /> Paid: {inv.paidDate}</span>
                    <span className="inline-flex items-center gap-1"><DollarSign className="h-3 w-3" /> {inv.paymentMethod}</span>
                    <span className="inline-flex items-center gap-1 font-mono">{inv.transactionRef}</span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button onClick={() => setDetailId(inv.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                    <Eye className="h-4 w-4" /> Details
                  </button>
                  <button onClick={() => showAction(`Downloading ${inv.id} receipt...`)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                    <Download className="h-4 w-4" /> Receipt
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            <div className="sticky top-0 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-700 dark:bg-zinc-900">
              <div><h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Paid Invoice Details</h2><p className="text-sm text-zinc-400">{detail.id}</p></div>
              <button onClick={() => setDetailId(null)} className="rounded-lg p-1 text-zinc-400 hover:text-zinc-600"><XCircle className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                  <CheckCheck className="h-5 w-5" />
                  <span className="font-semibold">Payment Completed</span>
                </div>
                <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">
                  Paid on {detail.paidDate} via {detail.paymentMethod} &mdash; Ref: {detail.transactionRef}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div><p className="text-xs text-zinc-400">Vendor</p><p className="font-medium text-zinc-800 dark:text-zinc-200">{detail.vendor}</p></div>
                <div><p className="text-xs text-zinc-400">Amount</p><p className="font-bold text-lg text-zinc-900 dark:text-zinc-50">${detail.amount.toLocaleString()}</p></div>
                <div><p className="text-xs text-zinc-400">PO Reference</p><p className="text-sm text-zinc-600 dark:text-zinc-400">{detail.poRef}</p></div>
                <div><p className="text-xs text-zinc-400">Invoice Date</p><p className="text-sm text-zinc-600 dark:text-zinc-400">{detail.invoiceDate}</p></div>
                <div><p className="text-xs text-zinc-400">Due Date</p><p className="text-sm text-zinc-600 dark:text-zinc-400">{detail.dueDate}</p></div>
                <div><p className="text-xs text-zinc-400">Paid Date</p><p className="text-sm text-zinc-600 dark:text-zinc-400">{detail.paidDate}</p></div>
                <div><p className="text-xs text-zinc-400">Payment Method</p><p className="text-sm text-zinc-600 dark:text-zinc-400">{detail.paymentMethod}</p></div>
                <div><p className="text-xs text-zinc-400">Transaction Ref</p><p className="font-mono text-sm text-zinc-600 dark:text-zinc-400">{detail.transactionRef}</p></div>
              </div>

              <div className="flex flex-wrap gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-700">
                <button onClick={() => showAction(`Downloading receipt for ${detail.id}...`)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                  <Download className="h-4 w-4" /> Download Paid Receipt
                </button>
                <button onClick={() => showAction(`Viewing invoice ${detail.id}...`)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  <Receipt className="h-4 w-4" /> View Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
