"use client"

import { useState } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  Download,
  CheckCircle2,
  Plus,
  Trash2,
  FileText,
  DollarSign,
  Percent,
  Receipt,
  Shield,
  AlertTriangle,
  XCircle,
  Lock,
  Edit,
} from "lucide-react"
import Link from "next/link"

interface PoItem {
  id: string
  name: string
  quantity: number
  unitPrice: number
}

function generatePoId(): string {
  const year = new Date().getFullYear()
  const num = String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")
  return `PO-${year}-${num}`
}

export default function GeneratePoPage() {
  const [poId] = useState(generatePoId)
  const [linkedRfq, setLinkedRfq] = useState("RFQ-2025-0001")
  const [linkedQuotation, setLinkedQuotation] = useState("QTN-2025-0101")
  const [vendor, setVendor] = useState("TechSolutions Inc.")
  const [deliveryDeadline, setDeliveryDeadline] = useState("")
  const createdDate = new Date().toISOString().split("T")[0]

  const [items, setItems] = useState<PoItem[]>([
    { id: crypto.randomUUID(), name: "Laptop Pro X1", quantity: 30, unitPrice: 6150 },
  ])

  const [discountPercent, setDiscountPercent] = useState(0)
  const [taxPercent, setTaxPercent] = useState(18)

  const [paymentTerms, setPaymentTerms] = useState("Net 30")
  const [deliveryTerms, setDeliveryTerms] = useState("FOB — Free on Board")
  const [warrantyTerms, setWarrantyTerms] = useState("3 years comprehensive warranty")
  const [penaltyClauses, setPenaltyClauses] = useState("1% per week delay, max 10% of total value")

  const [status, setStatus] = useState<"editing" | "draft" | "finalized" | "sent">("editing")
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)
  const discount = subtotal * (discountPercent / 100)
  const afterDiscount = subtotal - discount
  const tax = afterDiscount * (taxPercent / 100)
  const finalTotal = afterDiscount + tax

  function showAction(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(null), 2500)
  }

  function addItem() {
    setItems([...items, { id: crypto.randomUUID(), name: "", quantity: 1, unitPrice: 0 }])
  }

  function removeItem(id: string) {
    if (items.length > 1) setItems(items.filter((i) => i.id !== id))
  }

  function updateItem(id: string, field: keyof PoItem, value: string | number) {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: typeof value === "string" ? value : value } : i)))
  }

  if (status === "sent" || status === "finalized") {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-2xl py-16 text-center">
          <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${
            status === "sent" ? "bg-emerald-100 dark:bg-emerald-950/50" : "bg-indigo-100 dark:bg-indigo-950/50"
          }`}>
            {status === "sent" ? (
              <Send className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Lock className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            PO {status === "sent" ? "Sent to Vendor" : "Approved & Locked"}
          </h2>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            {poId} has been {status === "sent" ? "sent to" : "locked and approved for"} {vendor}.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/purchase-orders"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
              <ArrowLeft className="h-4 w-4" /> Back to All POs
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
      {/* Header */}
      <div>
        <Link href="/purchase-orders" className="mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
          <ArrowLeft className="h-4 w-4" /> Back to Purchase Orders
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Generate Purchase Order</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Create a new PO from an approved quotation</p>
          </div>
          <span className="font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400">{poId}</span>
        </div>
      </div>

      {/* Toast */}
      {actionMsg && (
        <div className="rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{actionMsg}</div>
      )}

      {/* 1. PO Header Info */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          <FileText className="h-5 w-5 text-zinc-400" /> PO Header Info
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">PO ID (Auto-generated)</label>
            <input type="text" value={poId} readOnly className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-mono text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Linked RFQ ID *</label>
            <select value={linkedRfq} onChange={(e) => setLinkedRfq(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
              <option>RFQ-2025-0001</option>
              <option>RFQ-2025-0004</option>
              <option>RFQ-2025-0002</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Linked Approved Quotation ID ⭐</label>
            <select value={linkedQuotation} onChange={(e) => setLinkedQuotation(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
              <option>QTN-2025-0101 — TechSolutions Inc.</option>
              <option>QTN-2025-0107 — TechSolutions Inc.</option>
              <option>QTN-2025-0100 — BuildRight Construction</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Vendor Name *</label>
            <input type="text" value={vendor} onChange={(e) => setVendor(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Date of Creation</label>
            <input type="text" value={createdDate} readOnly className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Delivery Deadline *</label>
            <input type="date" value={deliveryDeadline} onChange={(e) => setDeliveryDeadline(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          </div>
        </div>
      </section>

      {/* 2. Item Details */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Item Details</h2>
          <button type="button" onClick={addItem}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700">
            <Plus className="h-4 w-4" /> Add Item
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-xs font-medium uppercase text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                <th className="pb-2 pr-2">Item Name</th>
                <th className="pb-2 pr-2 w-20">Quantity</th>
                <th className="pb-2 pr-2 w-28">Unit Price</th>
                <th className="pb-2 pr-2 w-28 text-right">Total</th>
                <th className="pb-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="py-2 pr-2">
                    <input type="text" value={item.name} onChange={(e) => updateItem(item.id, "name", e.target.value)}
                      placeholder="Item name"
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

      {/* 3. Financial Section */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          <DollarSign className="h-5 w-5 text-zinc-400" /> Financial Section
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3 text-sm dark:bg-zinc-900">
            <span className="text-zinc-500">Subtotal</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">${subtotal.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3 text-sm dark:bg-zinc-900">
            <span className="flex items-center gap-2 text-zinc-500">
              <Percent className="h-4 w-4" /> Discount
            </span>
            <div className="flex items-center gap-2">
              <input type="number" min="0" max="100" value={discountPercent} onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                className="w-16 rounded border border-zinc-300 px-2 py-1 text-right text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
              <span className="text-zinc-400">%</span>
              <span className="w-24 text-right font-medium text-red-500">-${discount.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3 text-sm dark:bg-zinc-900">
            <span className="flex items-center gap-2 text-zinc-500">
              <Receipt className="h-4 w-4" /> GST / Tax
            </span>
            <div className="flex items-center gap-2">
              <input type="number" min="0" max="100" value={taxPercent} onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
                className="w-16 rounded border border-zinc-300 px-2 py-1 text-right text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
              <span className="text-zinc-400">%</span>
              <span className="w-24 text-right font-medium text-zinc-800 dark:text-zinc-200">+${tax.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border-2 border-indigo-200 bg-indigo-50 px-4 py-3 text-sm dark:border-indigo-800 dark:bg-indigo-950/40">
            <span className="text-base font-bold text-indigo-700 dark:text-indigo-300">Final Total Amount ⭐</span>
            <span className="text-xl font-bold text-indigo-700 dark:text-indigo-300">${finalTotal.toLocaleString()}</span>
          </div>
        </div>
      </section>

      {/* 4. Terms Section */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          <Shield className="h-5 w-5 text-zinc-400" /> Terms Section
        </h2>
        <div className="grid gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Payment Terms</label>
            <select value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
              <option>Net 15</option>
              <option>Net 30</option>
              <option>Net 45</option>
              <option>Net 60</option>
              <option>50% advance, 50% on delivery</option>
              <option>Milestone-based</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Delivery Terms</label>
            <select value={deliveryTerms} onChange={(e) => setDeliveryTerms(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
              <option>FOB — Free on Board</option>
              <option>CIF — Cost, Insurance & Freight</option>
              <option>EXW — Ex Works</option>
              <option>DDP — Delivered Duty Paid</option>
              <option>DAP — Delivered at Place</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Warranty Terms</label>
            <textarea value={warrantyTerms} onChange={(e) => setWarrantyTerms(e.target.value)} rows={2}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              <AlertTriangle className="h-4 w-4 text-amber-500" /> Penalty Clauses
              <span className="text-xs text-zinc-400">(optional but pro-level)</span>
            </label>
            <textarea value={penaltyClauses} onChange={(e) => setPenaltyClauses(e.target.value)} rows={2}
              placeholder="e.g. 1% per week delay, max 10% of total value"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          </div>
        </div>
      </section>

      {/* 5. Actions */}
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => { showAction("PO saved as draft"); setStatus("draft") }}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
            <Save className="h-4 w-4" /> Save as Draft
          </button>
          <button onClick={() => { showAction("PO generated successfully"); setStatus("draft") }}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
            <FileText className="h-4 w-4" /> Generate PO
          </button>
          <button onClick={() => setStatus("finalized")}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700">
            <Lock className="h-4 w-4" /> Approve & Lock PO ⭐
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
            <Download className="h-4 w-4" /> Export PDF
          </button>
          <button onClick={() => setStatus("sent")}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
            <Send className="h-4 w-4" /> Send to Vendor
          </button>
        </div>
      </section>
    </div>
  )

  return <DashboardLayout>{formContent}</DashboardLayout>
}
