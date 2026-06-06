"use client"

import { useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { vendorQuotations } from "@/lib/vendor-quotation-data"
import {
  XCircle,
  Building2,
  DollarSign,
  Calendar,
  MessageSquare,
  RefreshCw,
  CheckCircle,
} from "lucide-react"

export default function RejectedQuotationsPage() {
  const quotations = useMemo(
    () => vendorQuotations.filter((q) => q.status === "Rejected"),
    [],
  )

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Rejected</h1>
            <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400">
              {quotations.length} rejected
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Quotations that were not selected — review feedback and try again
          </p>
        </div>

        {quotations.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 py-16 dark:border-zinc-700">
            <CheckCircle className="mb-3 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
            <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400">No rejections</p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500">All your quotations are still in the running</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {quotations.map((q) => (
              <div
                key={q.id}
                className="rounded-xl border border-red-200 bg-white p-5 shadow-sm ring-1 ring-red-200 transition-shadow hover:shadow-md dark:border-red-800 dark:bg-zinc-950 dark:ring-red-800/50"
              >
                {/* Header */}
                <div className="mb-3 flex items-start justify-between">
                  <span className="font-mono text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    {q.id}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    <XCircle className="h-3 w-3" /> Rejected
                  </span>
                </div>

                <h2 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  {q.rfqTitle}
                </h2>

                {/* Info */}
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

                {/* Reason / Notes */}
                <div className="mb-4 rounded-lg bg-red-50 p-3 dark:bg-red-950/20">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
                    <p className="text-xs leading-relaxed text-red-700 dark:text-red-400">{q.notes}</p>
                  </div>
                </div>

                {/* Re-quote Button */}
                <button
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
                >
                  <RefreshCw className="h-4 w-4" />
                  Re-quote
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
