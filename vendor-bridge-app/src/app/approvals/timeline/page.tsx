"use client"

import { useState } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Link from "next/link"
import {
  ArrowLeft,
  FileText,
  Receipt,
  Star,
  Send,
  CheckCircle2,
  XCircle,
  ShoppingCart,
  Clock,
  User,
  MessageSquare,
  Calendar,
  ChevronRight,
  Search,
} from "lucide-react"

interface TimelineStep {
  label: string
  icon: typeof FileText
  status: "completed" | "active" | "pending" | "rejected" | "skipped"
  person: string
  timestamp: string
  comments: string
}

interface TimelineEntry {
  id: string
  title: string
  rfqRef: string
  steps: TimelineStep[]
}

const mockTimelines: TimelineEntry[] = [
  {
    id: "RFQ-2025-0001", title: "Office Laptops Procurement", rfqRef: "RFQ-2025-0001",
    steps: [
      { label: "RFQ Created", icon: FileText, status: "completed", person: "Priya Sharma", timestamp: "2025-05-01 09:30", comments: "RFQ created for 30 laptops" },
      { label: "Quotation Received", icon: Receipt, status: "completed", person: "System", timestamp: "2025-05-22 14:15", comments: "4 quotations received from vendors" },
      { label: "Shortlisted", icon: Star, status: "completed", person: "Priya Sharma", timestamp: "2025-05-25 11:00", comments: "TechSolutions Inc. shortlisted — best value" },
      { label: "Sent for Approval", icon: Send, status: "completed", person: "Priya Sharma", timestamp: "2025-06-01 10:45", comments: "Sent to manager for approval" },
      { label: "Manager Approved", icon: CheckCircle2, status: "completed", person: "Ananya Gupta", timestamp: "2025-06-05 16:20", comments: "Approved. Budget available. Good vendor track record." },
      { label: "Finance Approved", icon: CheckCircle2, status: "active", person: "Rajesh Kumar", timestamp: "—", comments: "Awaiting finance approval" },
      { label: "PO Generated", icon: ShoppingCart, status: "pending", person: "—", timestamp: "—", comments: "Pending finance approval" },
    ],
  },
  {
    id: "RFQ-2025-0004", title: "Cloud Infrastructure Services", rfqRef: "RFQ-2025-0004",
    steps: [
      { label: "RFQ Created", icon: FileText, status: "completed", person: "System (Auto)", timestamp: "2025-04-10 08:00", comments: "Auto-generated from infrastructure request" },
      { label: "Quotation Received", icon: Receipt, status: "completed", person: "System", timestamp: "2025-05-12 16:30", comments: "2 quotations received" },
      { label: "Shortlisted", icon: Star, status: "completed", person: "System (Auto)", timestamp: "2025-05-15 09:00", comments: "Auto-shortlisted based on scoring algorithm" },
      { label: "Sent for Approval", icon: Send, status: "completed", person: "System (Auto)", timestamp: "2025-05-28 10:00", comments: "Auto-sent after shortlist threshold met" },
      { label: "Manager Approved", icon: CheckCircle2, status: "completed", person: "Ananya Gupta", timestamp: "2025-06-01 14:30", comments: "Critical infrastructure project. Approved." },
      { label: "Finance Approved", icon: CheckCircle2, status: "completed", person: "Rajesh Kumar", timestamp: "2025-06-02 11:15", comments: "Budget approved for FY25-Q3" },
      { label: "PO Generated", icon: ShoppingCart, status: "completed", person: "System", timestamp: "2025-06-02 11:30", comments: "PO-2025-0042 generated automatically" },
    ],
  },
  {
    id: "RFQ-2025-0002", title: "Construction Materials - Phase 2", rfqRef: "RFQ-2025-0002",
    steps: [
      { label: "RFQ Created", icon: FileText, status: "completed", person: "Rahul Verma", timestamp: "2025-05-05 13:00", comments: "Phase 2 materials for warehouse project" },
      { label: "Quotation Received", icon: Receipt, status: "completed", person: "System", timestamp: "2025-05-30 10:20", comments: "1 quotation received" },
      { label: "Shortlisted", icon: Star, status: "completed", person: "Rahul Verma", timestamp: "2025-06-01 09:00", comments: "Only qualified vendor. Shortlisted." },
      { label: "Sent for Approval", icon: Send, status: "completed", person: "Rahul Verma", timestamp: "2025-06-03 11:30", comments: "Sent to manager for review" },
      { label: "Manager Approved", icon: XCircle, status: "rejected", person: "Ananya Gupta", timestamp: "2025-06-04 15:00", comments: "Budget frozen. Not approved this quarter." },
      { label: "Finance Approved", icon: Clock, status: "skipped", person: "—", timestamp: "—", comments: "Skipped — rejected at manager stage" },
      { label: "PO Generated", icon: Clock, status: "pending", person: "—", timestamp: "—", comments: "Awaiting approval" },
    ],
  },
]

const stepIcons: Record<string, typeof CheckCircle2> = {
  completed: CheckCircle2,
  active: Clock,
  pending: Clock,
  rejected: XCircle,
  skipped: Clock,
}

const stepColors: Record<string, string> = {
  completed: "border-emerald-500 bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
  active: "border-indigo-500 bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 ring-2 ring-indigo-500/30",
  pending: "border-zinc-300 bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500",
  rejected: "border-red-500 bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400",
  skipped: "border-zinc-300 bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500",
}

const connectorColors: Record<string, string> = {
  completed: "bg-emerald-300 dark:bg-emerald-700",
  active: "bg-indigo-300 dark:bg-indigo-700",
  rejected: "bg-red-300 dark:bg-red-700",
  pending: "bg-zinc-200 dark:bg-zinc-700",
  skipped: "bg-zinc-200 dark:bg-zinc-700",
}

export default function TimelineViewPage() {
  const [search, setSearch] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(mockTimelines[0]?.id ?? null)

  const filtered = mockTimelines.filter((t) =>
    !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <Link href="/approvals" className="mb-2 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
            <ArrowLeft className="h-4 w-4" /> Back to Approvals
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Approval Timeline</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">End-to-end workflow tracker for all approvals</p>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by RFQ ID or title..."
            className="w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
        </div>

        {/* Timeline Cards */}
        <div className="space-y-8">
          {filtered.map((entry) => {
            const expanded = expandedId === entry.id
            return (
              <div key={entry.id} className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                {/* Header */}
                <button
                  onClick={() => setExpandedId(expanded ? null : entry.id)}
                  className="flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-medium text-indigo-600 dark:text-indigo-400">{entry.id}</span>
                      {entry.steps.some((s) => s.status === "rejected") && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-950/40 dark:text-red-300">
                          <XCircle className="h-3 w-3" /> Rejected
                        </span>
                      )}
                      {entry.steps.every((s) => s.status === "completed") && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                          <CheckCircle2 className="h-3 w-3" /> Completed
                        </span>
                      )}
                      {entry.steps.some((s) => s.status === "active") && !entry.steps.some((s) => s.status === "rejected") && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                          <Clock className="h-3 w-3" /> In Progress
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1 text-base font-semibold text-zinc-900 dark:text-zinc-50">{entry.title}</h3>
                  </div>
                  <ChevronRight className={`h-5 w-5 text-zinc-400 transition-transform ${expanded ? "rotate-90" : ""}`} />
                </button>

                {/* Timeline Steps */}
                {expanded && (
                  <div className="border-t border-zinc-200 px-6 py-6 dark:border-zinc-800">
                    <div className="relative">
                      {/* Vertical Progress Bar */}
                      <div className="absolute left-6 top-0 h-full w-0.5 bg-zinc-200 dark:bg-zinc-700" />

                      <div className="space-y-0">
                        {entry.steps.map((step, i) => {
                          const StepIcon = step.icon
                          const StatusIcon = stepIcons[step.status]
                          const isLast = i === entry.steps.length - 1

                          return (
                            <div key={i} className="relative flex gap-6 pb-8 last:pb-0">
                              {/* Step icon circle */}
                              <div className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition-all ${stepColors[step.status]}`}>
                                <StepIcon className="h-5 w-5" />
                              </div>

                              {/* Connector line */}
                              {!isLast && (
                                <div className={`absolute left-6 top-12 w-0.5 ${connectorColors[step.status]}`}
                                  style={{ height: "calc(100% - 1.5rem)" }} />
                              )}

                              {/* Content */}
                              <div className="flex-1 min-w-0 pt-1.5">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className={`text-sm font-semibold ${
                                    step.status === "completed" ? "text-emerald-700 dark:text-emerald-300" :
                                    step.status === "active" ? "text-indigo-700 dark:text-indigo-300" :
                                    step.status === "rejected" ? "text-red-700 dark:text-red-300" :
                                    "text-zinc-400 dark:text-zinc-500"
                                  }`}>
                                    {step.status === "completed" && "✔ "}
                                    {step.status === "active" && "⏳ "}
                                    {step.status === "rejected" && "❌ "}
                                    {step.status === "skipped" && "— "}
                                    {step.label}
                                  </h4>
                                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                                    step.status === "completed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" :
                                    step.status === "active" ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300" :
                                    step.status === "rejected" ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300" :
                                    step.status === "skipped" ? "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400" :
                                    "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                                  }`}>
                                    {step.status}
                                  </span>
                                </div>
                                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                                  <span className="inline-flex items-center gap-1">
                                    <User className="h-3 w-3" /> {step.person}
                                  </span>
                                  <span className="inline-flex items-center gap-1">
                                    <Calendar className="h-3 w-3" /> {step.timestamp}
                                  </span>
                                </div>
                                {step.comments && (
                                  <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-900">
                                    <MessageSquare className="mt-0.5 h-3 w-3 shrink-0 text-zinc-400" />
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{step.comments}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-zinc-400">
            <Clock className="mx-auto mb-2 h-8 w-8 opacity-50" />
            No approval timelines found
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
