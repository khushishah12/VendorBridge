"use client"

import { useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { vendorQuotations } from "@/lib/vendor-quotation-data"
import {
  Star,
  Building2,
  DollarSign,
  Calendar,
  MessageSquare,
  Handshake,
  AlertCircle,
} from "lucide-react"

export default function ShortlistedQuotationsPage() {
  const quotations = useMemo(
    () => vendorQuotations.filter((q) => q.status === "Shortlisted"),
    [],
  )

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <Star className="h-6 w-6 text-amber-500" />
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Shortlisted</h1>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              {quotations.length} shortlisted
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Quotations that made it to the final round — negotiations in progress
          </p>
        </div>

        {quotations.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 py-16 dark:border-zinc-700">
            <AlertCircle className="mb-3 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
            <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400">No shortlisted quotations</p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500">Shortlisted quotations will appear here</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {quotations.map((q) => (
              <div
                key={q.id}
                className="rounded-xl border border-amber-200 bg-white p-5 shadow-sm ring-1 ring-amber-200 transition-shadow hover:shadow-md dark:border-amber-800 dark:bg-zinc-950 dark:ring-amber-800/50"
              >
                {/* Header */}
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                    <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    <Handshake className="h-3 w-3" /> Under Negotiation
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

                {/* Notes */}
                <div className="mb-4 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400" />
                    <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">{q.notes}</p>
                  </div>
                </div>

                {/* Follow-up CTA */}
                <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600">
                  <Handshake className="h-4 w-4" />
                  Follow Up
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
