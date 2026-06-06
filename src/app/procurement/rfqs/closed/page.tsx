"use client"

import { useState } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  FileText,
  Clock,
  XCircle,
  CheckCircle2,
  Ban,
  Copy,
  RotateCcw,
  ChevronDown,
  Eye,
  Users,
  DollarSign,
  Calendar,
  ArrowLeft,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

type ClosureReason = "Completed" | "Expired deadline" | "Cancelled"

interface ClosedRfq {
  id: string
  title: string
  department: string
  status: "Closed" | "Expired"
  closureReason: ClosureReason
  finalVendor: string | null
  finalValue: number | null
  createdDate: string
  closedDate: string
  quotations: Quotation[]
  timeline: TimelineEvent[]
}

interface Quotation {
  vendor: string
  amount: number
  date: string
  status: "Approved" | "Rejected" | "Shortlisted"
}

interface TimelineEvent {
  date: string
  event: string
}

const mockClosed: ClosedRfq[] = [
  {
    id: "RFQ-2025-0004",
    title: "Cloud Infrastructure Services",
    department: "IT",
    status: "Closed",
    closureReason: "Completed",
    finalVendor: "TechSolutions Inc.",
    finalValue: 245000,
    createdDate: "2025-04-10",
    closedDate: "2025-05-28",
    quotations: [
      { vendor: "TechSolutions Inc.", amount: 245000, date: "2025-05-10", status: "Approved" },
      { vendor: "Acme Corp", amount: 278000, date: "2025-05-12", status: "Shortlisted" },
      { vendor: "Global Supplies Co.", amount: 310000, date: "2025-05-11", status: "Rejected" },
      { vendor: "ServicePro Ltd.", amount: 232000, date: "2025-05-09", status: "Shortlisted" },
    ],
    timeline: [
      { date: "2025-04-10", event: "RFQ created" },
      { date: "2025-04-12", event: "Sent to 6 vendors" },
      { date: "2025-05-09", event: "First quotation received" },
      { date: "2025-05-15", event: "Deadline passed — 4 quotations received" },
      { date: "2025-05-20", event: "Quotation from TechSolutions Inc. approved" },
      { date: "2025-05-28", event: "RFQ closed — PO generated" },
    ],
  },
  {
    id: "RFQ-2025-0005",
    title: "Medical Equipment Supply",
    department: "Medical",
    status: "Expired",
    closureReason: "Expired deadline",
    finalVendor: null,
    finalValue: null,
    createdDate: "2025-04-01",
    closedDate: "2025-05-01",
    quotations: [
      { vendor: "MedEquip Distributors", amount: 89000, date: "2025-04-20", status: "Shortlisted" },
      { vendor: "Global Supplies Co.", amount: 95000, date: "2025-04-22", status: "Rejected" },
    ],
    timeline: [
      { date: "2025-04-01", event: "RFQ created" },
      { date: "2025-04-03", event: "Sent to 4 vendors" },
      { date: "2025-04-20", event: "First quotation received" },
      { date: "2025-05-01", event: "Deadline expired — 2 quotations received" },
      { date: "2025-05-01", event: "RFQ auto-expired" },
    ],
  },
  {
    id: "RFQ-2025-0011",
    title: "Warehouse Renovation",
    department: "Construction",
    status: "Closed",
    closureReason: "Cancelled",
    finalVendor: null,
    finalValue: null,
    createdDate: "2025-03-15",
    closedDate: "2025-04-10",
    quotations: [],
    timeline: [
      { date: "2025-03-15", event: "RFQ created" },
      { date: "2025-03-18", event: "Sent to 5 vendors" },
      { date: "2025-04-10", event: "Project put on hold — RFQ cancelled" },
    ],
  },
]

const reasonIcons: Record<ClosureReason, typeof CheckCircle2> = {
  Completed: CheckCircle2,
  "Expired deadline": Clock,
  Cancelled: Ban,
}

const reasonStyles: Record<ClosureReason, string> = {
  Completed: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  "Expired deadline": "text-red-600 bg-red-50 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800",
  Cancelled: "text-zinc-600 bg-zinc-100 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
}

const quotationStatusStyles: Record<string, string> = {
  Approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  Shortlisted: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
  Rejected: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
}

export default function ClosedRfqsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <Link href="/rfqs" className="mb-2 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
            <ArrowLeft className="h-4 w-4" /> Back to All RFQs
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Closed / Expired RFQs</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{mockClosed.length} RFQs</p>
        </div>

        <div className="space-y-4">
          {mockClosed.map((rfq) => {
            const expanded = expandedId === rfq.id
            const ReasonIcon = reasonIcons[rfq.closureReason]
            return (
              <div
                key={rfq.id}
                className="rounded-xl border border-zinc-200 bg-white shadow-sm transition-all dark:border-zinc-800 dark:bg-zinc-950"
              >
                {/* Summary row */}
                <div className="flex flex-wrap items-center gap-4 p-5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${reasonStyles[rfq.closureReason]}`}>
                        <ReasonIcon className="h-3 w-3" />
                        {rfq.closureReason}
                      </span>
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                        rfq.status === "Closed"
                          ? "border-purple-200 bg-purple-100 text-purple-700 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-300"
                          : "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
                      }`}>
                        {rfq.status}
                      </span>
                    </div>
                    <h3 className="mt-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">{rfq.title}</h3>
                    <p className="text-sm text-zinc-500">{rfq.id} &middot; {rfq.department}</p>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    {rfq.finalVendor ? (
                      <div className="text-right">
                        <p className="text-xs text-zinc-400">Final Vendor</p>
                        <p className="font-medium text-zinc-800 dark:text-zinc-200">{rfq.finalVendor}</p>
                      </div>
                    ) : (
                      <div className="text-right">
                        <p className="text-xs text-zinc-400">Final Vendor</p>
                        <p className="text-zinc-400">—</p>
                      </div>
                    )}
                    {rfq.finalValue ? (
                      <div className="text-right">
                        <p className="text-xs text-zinc-400">Final Value</p>
                        <p className="font-medium text-zinc-800 dark:text-zinc-200">${rfq.finalValue.toLocaleString()}</p>
                      </div>
                    ) : (
                      <div className="text-right">
                        <p className="text-xs text-zinc-400">Final Value</p>
                        <p className="text-zinc-400">—</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExpandedId(expanded ? null : rfq.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      <Eye className="h-4 w-4" />
                      {expanded ? "Hide Details" : "View Details"}
                    </button>
                    <button className="rounded-lg border border-zinc-300 p-2 text-zinc-500 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800" title="Reopen RFQ">
                      <RotateCcw className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg border border-zinc-300 p-2 text-zinc-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400" title="Clone RFQ">
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                {expanded && (
                  <div className="border-t border-zinc-200 p-5 dark:border-zinc-800">
                    <div className="grid gap-6 lg:grid-cols-2">
                      {/* Quotations */}
                      <div>
                        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                          <TrendingUp className="h-4 w-4" /> Received Quotations
                        </h4>
                        {rfq.quotations.length === 0 ? (
                          <p className="text-sm text-zinc-400">No quotations received.</p>
                        ) : (
                          <div className="space-y-2">
                            {rfq.quotations.map((q, i) => (
                              <div key={i} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900">
                                <div>
                                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{q.vendor}</p>
                                  <p className="text-xs text-zinc-400">{q.date}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">${q.amount.toLocaleString()}</span>
                                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${quotationStatusStyles[q.status]}`}>{q.status}</span>
                                </div>
                              </div>
                            ))}
                            <div className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm dark:border-emerald-900 dark:bg-emerald-950/40">
                              <span className="font-medium text-emerald-700 dark:text-emerald-300">Final approved:</span>{" "}
                              <span className="text-emerald-600 dark:text-emerald-400">
                                {rfq.finalVendor ? `${rfq.finalVendor} — $${rfq.finalValue?.toLocaleString()}` : "None"}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Timeline */}
                      <div>
                        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                          <Calendar className="h-4 w-4" /> Timeline of Events
                        </h4>
                        <div className="relative pl-6">
                          {rfq.timeline.map((event, i) => (
                            <div key={i} className="relative pb-4 last:pb-0">
                              <div className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-indigo-500 bg-white dark:bg-zinc-950" />
                              {i < rfq.timeline.length - 1 && (
                                <div className="absolute left-[4.5px] top-4 h-full w-0.5 bg-zinc-200 dark:bg-zinc-700" />
                              )}
                              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{event.event}</p>
                              <p className="text-xs text-zinc-400">{event.date}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Clone / Reopen actions */}
                    <div className="mt-6 flex items-center gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                      <button className="inline-flex items-center gap-2 rounded-lg border border-indigo-300 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-950/60">
                        <Copy className="h-4 w-4" /> Clone RFQ
                      </button>
                      <button className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                        <RotateCcw className="h-4 w-4" /> Reopen RFQ
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}
