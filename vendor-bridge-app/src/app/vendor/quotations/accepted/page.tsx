"use client"

import { useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { vendorQuotations } from "@/lib/vendor-quotation-data"
import {
  CheckCircle,
  PartyPopper,
  Building2,
  DollarSign,
  Calendar,
  FileCheck,
  AlertCircle,
} from "lucide-react"

export default function AcceptedQuotationsPage() {
  const quotations = useMemo(
    () => vendorQuotations.filter((q) => q.status === "Accepted"),
    [],
  )

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <PartyPopper className="h-6 w-6 text-emerald-500" />
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Accepted</h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              {quotations.length} won
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Your quotations that have been accepted — congratulations!
          </p>
        </div>

        {quotations.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 py-16 dark:border-zinc-700">
            <CheckCircle className="mb-3 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
            <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400">No accepted quotations</p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500">Accepted quotations will appear here</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {quotations.map((q) => (
              <div
                key={q.id}
                className="rounded-xl border border-emerald-200 bg-white p-5 shadow-sm ring-1 ring-emerald-200 transition-shadow hover:shadow-lg dark:border-emerald-800 dark:bg-zinc-950 dark:ring-emerald-800/50"
              >
                {/* Celebration Icon */}
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                    <PartyPopper className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <CheckCircle className="h-3 w-3" /> Accepted
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
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      ${q.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                    <Calendar className="h-4 w-4 shrink-0" />
                    <span>Submitted {q.submittedDate}</span>
                  </div>
                </div>

                {/* PO Issued Indicator */}
                <div className="mb-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                  <FileCheck className="h-4 w-4" />
                  PO Issued
                </div>

                {/* Notes */}
                <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{q.notes}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
