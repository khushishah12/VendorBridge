"use client"

import { useState } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Send,
  Download,
  Eye,
  FileText,
  DollarSign,
  Percent,
  Receipt,
  Calendar,
  Building2,
  User,
  Hash,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Truck,
} from "lucide-react"
import Link from "next/link"

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

function generateInvoiceId(): string {
  const year = new Date().getFullYear()
  const num = String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")
  return `INV-${year}-${num}`
}

export default function GenerateInvoicePage() {
  const [invId] = useState(generateInvoiceId)
  const [poRef, setPoRef] = useState("PO-2025-0042")
  const [vendor, setVendor] = useState("TechSolutions Inc.")
  const [billTo, setBillTo] = useState("VendorBridge Procurement\n123 Business Park, Floor 5\nNew York, NY 10001")
  const [dueDate, setDueDate] = useState("")
  const invoiceDate = new Date().toISOString().split("T")[0]

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: crypto.randomUUID(), description: "Laptop Pro X1 — 30 units @ $6,150", quantity: 1, unitPrice: 184500 },
  ])

  const [discountPercent, setDiscountPercent] = useState(0)
  const [taxPercent, setTaxPercent] = useState(18)
  const [shippingCost, setShippingCost] = useState(0)

  const [paymentTerms, setPaymentTerms] = useState("Net 30")
  const [notes, setNotes] = useState("Payment to be made via bank transfer within 30 days of invoice date.")

  const [status, setStatus] = useState<"editing" | "draft" | "sent">("editing")
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)
  const discount = subtotal * (discountPercent / 100)
  const afterDiscount = subtotal - discount
  const tax = afterDiscount * (taxPercent / 100)
  const finalTotal = afterDiscount + tax + shippingCost

  function showAction(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(null), 2500)
  }

  function addItem() {
    setItems([...items, { id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0 }])
  }

  function removeItem(id: string) {
    if (items.length > 1) setItems(items.filter((i) => i.id !== id))
  }

  function updateItem(id: string, field: keyof InvoiceItem, value: string | number) {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)))
  }

  if (status === "sent") {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-2xl py-16 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50">
            <Send className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Invoice Sent to Vendor</h2>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">{invId} has been sent to {vendor}.</p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/invoices"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
              <ArrowLeft className="h-4 w-4" /> Back to All Invoices
            </Link>
            <button onClick={() => { setStatus("editing"); showAction("") }}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              <Plus className="h-4 w-4" /> Create Another
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const formContent = (
    <div className="mx-auto max-w-4xl space-y-8 pb-16">
      <div>
        <Link href="/invoices" className="mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
          <ArrowLeft className="h-4 w-4" /> Back to Invoices
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Generate Invoice</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Create a new invoice from a completed PO</p>
          </div>
          <span className="font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400">{invId}</span>
        </div>
      </div>

      {actionMsg && (
        <div className="rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{actionMsg}</div>
      )}

      {/* 1. Invoice Header */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          <FileText className="h-5 w-5 text-zinc-400" /> Invoice Header
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Invoice ID (Auto)</label>
            <input type="text" value={invId} readOnly className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-mono text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Linked PO *</label>
            <select value={poRef} onChange={(e) => setPoRef(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
              <option>PO-2025-0042 — TechSolutions Inc.</option>
              <option>PO-2025-0041 — ServicePro Ltd.</option>
              <option>PO-2025-0048 — OfficeMax Supplies</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Vendor Name *</label>
            <input type="text" value={vendor} onChange={(e) => setVendor(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Invoice Date</label>
            <input type="text" value={invoiceDate} readOnly className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Due Date *</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Payment Terms</label>
            <select value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
              <option>Net 15</option>
              <option>Net 30</option>
              <option>Net 45</option>
              <option>Net 60</option>
              <option>Due on Receipt</option>
              <option>Milestone-based</option>
            </select>
          </div>
        </div>
      </section>

      {/* 2. Bill To */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          <Building2 className="h-5 w-5 text-zinc-400" /> Bill To
        </h2>
        <textarea value={billTo} onChange={(e) => setBillTo(e.target.value)} rows={3}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
      </section>

      {/* 3. Line Items */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Line Items</h2>
          <button type="button" onClick={addItem}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700">
            <Plus className="h-4 w-4" /> Add Item
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-xs font-medium uppercase text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                <th className="pb-2 pr-2">Description</th>
                <th className="pb-2 pr-2 w-20">Qty</th>
                <th className="pb-2 pr-2 w-28">Unit Price</th>
                <th className="pb-2 pr-2 w-28 text-right">Total</th>
                <th className="pb-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="py-2 pr-2">
                    <input type="text" value={item.description} onChange={(e) => updateItem(item.id, "description", e.target.value)}
                      placeholder="Item description"
                      className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
                  </td>
                  <td className="py-2 pr-2">
                    <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
                  </td>
                  <td className="py-2 pr-2">
                    <input type="number" min="0" step="0.01" value={item.unitPrice} onChange={(e) => updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                      className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
                  </td>
                  <td className="py-2 pr-2 text-right font-medium text-zinc-800 dark:text-zinc-200">
                    ${(item.quantity * item.unitPrice).toLocaleString()}
                  </td>
                  <td className="py-2">
                    <button type="button" onClick={() => removeItem(item.id)} disabled={items.length === 1}
                      className="rounded p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-30 dark:hover:bg-red-950/30">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Financial Section */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          <DollarSign className="h-5 w-5 text-zinc-400" /> Financial Summary
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3 text-sm dark:bg-zinc-900">
            <span className="text-zinc-500">Subtotal</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">${subtotal.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3 text-sm dark:bg-zinc-900">
            <span className="flex items-center gap-2 text-zinc-500"><Percent className="h-4 w-4" /> Discount</span>
            <div className="flex items-center gap-2">
              <input type="number" min="0" max="100" value={discountPercent} onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                className="w-16 rounded border border-zinc-300 px-2 py-1 text-right text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
              <span className="text-zinc-400">%</span>
              <span className="w-24 text-right font-medium text-red-500">-${discount.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3 text-sm dark:bg-zinc-900">
            <span className="flex items-center gap-2 text-zinc-500"><Receipt className="h-4 w-4" /> GST / Tax</span>
            <div className="flex items-center gap-2">
              <input type="number" min="0" max="100" value={taxPercent} onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
                className="w-16 rounded border border-zinc-300 px-2 py-1 text-right text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
              <span className="text-zinc-400">%</span>
              <span className="w-24 text-right font-medium text-zinc-800 dark:text-zinc-200">+${tax.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3 text-sm dark:bg-zinc-900">
            <span className="flex items-center gap-2 text-zinc-500"><Truck className="h-4 w-4" /> Shipping</span>
            <input type="number" min="0" value={shippingCost} onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)}
              className="w-28 rounded border border-zinc-300 px-2 py-1 text-right text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          </div>
          <div className="flex items-center justify-between rounded-lg border-2 border-indigo-200 bg-indigo-50 px-4 py-3 text-sm dark:border-indigo-800 dark:bg-indigo-950/40">
            <span className="text-base font-bold text-indigo-700 dark:text-indigo-300">Final Total ⭐</span>
            <span className="text-xl font-bold text-indigo-700 dark:text-indigo-300">${finalTotal.toLocaleString()}</span>
          </div>
        </div>
      </section>

      {/* 5. Notes */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          <AlertTriangle className="h-5 w-5 text-zinc-400" /> Notes & Terms
        </h2>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
      </section>

      {/* 6. Actions */}
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => { showAction("Invoice saved as draft"); setStatus("draft") }}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
            <Save className="h-4 w-4" /> Save as Draft
          </button>
          <button onClick={() => { showAction("Invoice generated"); setStatus("draft") }}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
            <FileText className="h-4 w-4" /> Generate Invoice
          </button>
          <button onClick={() => setStatus("sent")}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700">
            <Send className="h-4 w-4" /> Send to Vendor
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
            <Download className="h-4 w-4" /> Export PDF
          </button>
        </div>
      </section>
    </div>
  )

  return <DashboardLayout>{formContent}</DashboardLayout>
}
