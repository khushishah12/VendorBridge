"use client"

import { useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { vendorQuotations } from "@/lib/vendor-quotation-data"
import {
  Clock,
  FileText,
  Building2,
  DollarSign,
  Calendar,
  MessageSquare,
  AlertCircle,
} from "lucide-react"

function priorityBadge(priority: string) {
  const map: Record<string, string> = {
    High: "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400",
    Medium: "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
    Low: "bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400",
  }
  return map[priority] || ""
}

export default function ReviewQuotationsPage() {
  const quotations = useMemo(
    () => vendorQuotations.filter((q) => q.status === "Under Review"),
    [],
  )

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Under Review</h1>
            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
              {quotations.length} pending
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Quotations currently being evaluated by the procurement team
          </p>
        </div>

        {quotations.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 py-16 dark:border-zinc-700">
            <AlertCircle className="mb-3 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
            <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400">No quotations under review</p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500">All submitted quotations have been reviewed</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {quotations.map((q) => (
              <div
                key={q.id}
                className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
              >
                {/* Header */}
                <div className="mb-3 flex items-start justify-between gap-2">
                  <span className="font-mono text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    {q.id}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                    <Clock className="h-3 w-3" /> Under Review
                  </span>
                </div>

                <h2 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  {q.rfqTitle}
                </h2>

                {/* Info Rows */}
                <div className="mb-3 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                    <Building2 className="h-4 w-4 shrink-0" />
                    <span>{q.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                    <DollarSign className="h-4 w-4 shrink-0" />
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      ${q.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                    <Calendar className="h-4 w-4 shrink-0" />
                    <span>Submitted {q.submittedDate}</span>
                  </div>
                </div>

                {/* Priority */}
                <div className="mb-3">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityBadge(q.priority)}`}
                  >
                    {q.priority} Priority
                  </span>
                </div>

                {/* Notes */}
                <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400" />
                    <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">{q.notes}</p>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="mt-3 text-xs text-zinc-400">
                  {q.items.length} line item{q.items.length !== 1 && "s"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
