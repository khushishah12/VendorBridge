"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  FileText,
  Edit,
  Send,
  Trash2,
  AlertTriangle,
  Clock,
  ArrowLeft,
  Plus,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"

interface DraftRfq {
  id: string
  title: string
  department: string
  itemsCount: number
  itemsIncomplete: boolean
  hasVendors: boolean
  lastEdited: string
  createdDate: string
}

const mockDrafts: DraftRfq[] = [
  { id: "RFQ-2025-0003", title: "Office Furniture & Workstations", department: "Admin", itemsCount: 2, itemsIncomplete: true, hasVendors: false, lastEdited: "2025-06-05 14:23", createdDate: "2025-04-20" },
  { id: "RFQ-2025-0006", title: "Annual Maintenance Services", department: "Services", itemsCount: 4, itemsIncomplete: false, hasVendors: true, lastEdited: "2025-06-04 09:15", createdDate: "2025-05-15" },
  { id: "RFQ-2025-0009", title: "Security Camera Installation", department: "IT", itemsCount: 1, itemsIncomplete: true, hasVendors: false, lastEdited: "2025-06-03 16:45", createdDate: "2025-06-01" },
  { id: "RFQ-2025-0010", title: "Cleaning Supplies - Monthly", department: "Admin", itemsCount: 3, itemsIncomplete: false, hasVendors: false, lastEdited: "2025-06-02 11:30", createdDate: "2025-05-28" },
]

export default function DraftRfqsPage() {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const total = mockDrafts.length
  const readyToSend = mockDrafts.filter((d) => !d.itemsIncomplete && d.hasVendors).length

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/rfqs" className="mb-2 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
              <ArrowLeft className="h-4 w-4" /> Back to All RFQs
            </Link>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Draft RFQs</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {total} drafts &middot; {readyToSend} ready to send
            </p>
          </div>
          <Link
            href="/rfqs/create"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" /> New RFQ
          </Link>
        </div>

        {/* Summary cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{total}</p>
            <p className="text-sm text-zinc-500">Total Drafts</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-2xl font-bold text-emerald-600">{readyToSend}</p>
            <p className="text-sm text-zinc-500">Ready to Send</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-2xl font-bold text-amber-600">{total - readyToSend}</p>
            <p className="text-sm text-zinc-500">Needs Attention</p>
          </div>
        </div>

        {/* Draft Cards */}
        <div className="space-y-3">
          {mockDrafts.map((draft) => (
            <div
              key={draft.id}
              className="group rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                {/* Left */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                      <Clock className="h-3 w-3" /> Not sent yet
                    </span>
                    {(!draft.hasVendors || draft.itemsIncomplete) && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-950/40 dark:text-red-400">
                        <AlertTriangle className="h-3 w-3" /> Incomplete
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">{draft.title}</h3>
                  <p className="text-sm text-zinc-500">{draft.id} &middot; {draft.department}</p>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-zinc-400">
                    <span>{draft.itemsCount} item{draft.itemsCount > 1 ? "s" : ""}</span>
                    <span className={draft.itemsIncomplete ? "text-red-500 font-medium" : ""}>
                      {draft.itemsIncomplete ? "⚠️ Incomplete items" : "All items complete"}
                    </span>
                    <span className={!draft.hasVendors ? "text-red-500 font-medium" : ""}>
                      {draft.hasVendors ? "✓ Vendors selected" : "✗ No vendors"}
                    </span>
                    <span>Last edited: {draft.lastEdited}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href="/rfqs/create"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    <Edit className="h-4 w-4" /> Continue
                  </Link>
                  <button
                    disabled={draft.itemsIncomplete || !draft.hasVendors}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                    title={draft.itemsIncomplete || !draft.hasVendors ? "Complete items and select vendors first" : "Send RFQ"}
                  >
                    <Send className="h-4 w-4" /> Send
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(draft.id)}
                    className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Delete Draft</h3>
            <p className="mt-2 text-sm text-zinc-500">This action cannot be undone. The RFQ draft will be permanently deleted.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">Cancel</button>
              <button onClick={() => setDeleteConfirm(null)} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
