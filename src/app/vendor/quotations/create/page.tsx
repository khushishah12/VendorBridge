"use client"

import { useState } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  Plus,
  Trash2,
  Send,
  Calculator,
  FileText,
  Calendar,
} from "lucide-react"

const rfqOptions = [
  { id: "RFQ-2025-0042", title: "Laptop Procurement – 50 Units" },
  { id: "RFQ-2025-0043", title: "Office Renovation – Floor 4 & 5" },
  { id: "RFQ-2025-0044", title: "Cloud Infrastructure – AWS Migration" },
  { id: "RFQ-2025-0045", title: "Office Supplies – Q3 Bulk Order" },
  { id: "RFQ-2025-0046", title: "Medical Equipment – ICU Monitors" },
  { id: "RFQ-2025-0047", title: "Annual IT Support Services" },
]

interface LineItem {
  name: string
  quantity: number
  unitPrice: number
}

function emptyItem(): LineItem {
  return { name: "", quantity: 1, unitPrice: 0 }
}

export default function CreateQuotationPage() {
  const [selectedRfq, setSelectedRfq] = useState(rfqOptions[0].id)
  const [items, setItems] = useState<LineItem[]>([emptyItem()])
  const [notes, setNotes] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function updateItem(index: number, field: keyof LineItem, value: string | number) {
    setItems((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  function addItem() {
    setItems((prev) => [...prev, emptyItem()])
  }

  function removeItem(index: number) {
    if (items.length === 1) return
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const tax = subtotal * 0.1
  const grandTotal = subtotal + tax

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 4000)
    }, 1500)
  }

  const isFormValid = selectedRfq && items.some((i) => i.name.trim() && i.quantity > 0 && i.unitPrice > 0) && expiryDate

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Submit Quotation</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Create and submit a quotation for an active RFQ
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* RFQ Selector */}
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                <FileText className="h-4 w-4 text-indigo-500" />
                RFQ Reference
              </label>
              <select
                value={selectedRfq}
                onChange={(e) => setSelectedRfq(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
              >
                {rfqOptions.map((rfq) => (
                  <option key={rfq.id} value={rfq.id}>
                    {rfq.id} — {rfq.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Line Items Editor */}
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="mb-3 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  <Calculator className="h-4 w-4 text-indigo-500" />
                  Line Items
                </label>
                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Item
                </button>
              </div>
              <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                      <th className="px-3 py-2">Item Name</th>
                      <th className="px-3 py-2">Quantity</th>
                      <th className="px-3 py-2">Unit Price</th>
                      <th className="px-3 py-2">Total</th>
                      <th className="px-3 py-2" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {items.map((item, i) => (
                      <tr key={i} className="text-zinc-700 dark:text-zinc-300">
                        <td className="px-3 py-1.5">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateItem(i, "name", e.target.value)}
                            placeholder="Item name"
                            className="w-full rounded border border-zinc-200 px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                          />
                        </td>
                        <td className="px-3 py-1.5">
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) => updateItem(i, "quantity", Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-20 rounded border border-zinc-200 px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                          />
                        </td>
                        <td className="px-3 py-1.5">
                          <input
                            type="number"
                            min={0}
                            step={0.01}
                            value={item.unitPrice}
                            onChange={(e) => updateItem(i, "unitPrice", Math.max(0, parseFloat(e.target.value) || 0))}
                            className="w-24 rounded border border-zinc-200 px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                          />
                        </td>
                        <td className="px-3 py-1.5 font-medium">
                          ${(item.quantity * item.unitPrice).toLocaleString()}
                        </td>
                        <td className="px-3 py-1.5">
                          <button
                            type="button"
                            onClick={() => removeItem(i)}
                            disabled={items.length === 1}
                            className="rounded p-1 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-30 dark:hover:bg-red-950/30"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="mt-4 flex flex-col items-end gap-1 text-sm">
                <div className="flex w-full max-w-xs justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex w-full max-w-xs justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Tax (10%)</span>
                  <span>${tax.toLocaleString()}</span>
                </div>
                <div className="flex w-full max-w-xs justify-between border-t border-zinc-200 pt-1 text-lg font-bold text-zinc-900 dark:border-zinc-700 dark:text-zinc-50">
                  <span>Grand Total</span>
                  <span>${grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Notes + Expiry */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  <FileText className="h-4 w-4 text-indigo-500" />
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Add any notes or special terms..."
                  className="w-full resize-none rounded-lg border border-zinc-300 px-3 py-2 text-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
                />
              </div>
              <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  <Calendar className="h-4 w-4 text-indigo-500" />
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!isFormValid || submitting || submitted}
                className={`inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-all ${
                  submitted
                    ? "bg-emerald-500 cursor-default"
                    : submitting
                      ? "bg-indigo-400 cursor-wait"
                      : "bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 disabled:cursor-not-allowed dark:disabled:bg-zinc-700"
                }`}
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Submitting...
                  </>
                ) : submitted ? (
                  <>Quotation Submitted ✓</>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Quotation
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
