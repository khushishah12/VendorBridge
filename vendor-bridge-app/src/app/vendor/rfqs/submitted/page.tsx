"use client"

import { useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { vendorQuotations } from "@/lib/vendor-quotation-data"
import { FileText, Building2, DollarSign, Calendar, Eye } from "lucide-react"
import Link from "next/link"

function statusBadge(status: string) {
  const map: Record<string, string> = {
    Draft: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
    Submitted: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "Under Review": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    Shortlisted: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    Accepted: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    Rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  }
  return map[status] || ""
}

export default function SubmittedRfqsPage() {
  const quotations = useMemo(() => {
    return vendorQuotations.filter((q) => q.status !== "Draft")
  }, [])

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Submitted RFQs</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {quotations.length} quotation{quotations.length !== 1 && "s"} submitted — RFQs you have responded to
          </p>
        </div>

        {quotations.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 py-16 dark:border-zinc-700">
            <FileText className="mb-3 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
            <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400">No submitted quotations yet</p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500">Browse open RFQs and submit your first quotation</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                    <th className="px-4 py-3">RFQ ID</th>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Company</th>
                    <th className="px-4 py-3">Quotation ID</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Submitted</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {quotations.map((q) => (
                    <tr
                      key={q.id}
                      className="group transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                    >
                      <td className="px-4 py-3 font-mono text-xs font-medium text-indigo-600 dark:text-indigo-400">
                        {q.rfqId}
                      </td>
                      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{q.rfqTitle}</td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                        <span className="inline-flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5" />
                          {q.company}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-zinc-500 dark:text-zinc-400">{q.id}</td>
                      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                        ${q.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadge(q.status)}`}>
                          {q.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400">{q.submittedDate}</td>
                      <td className="px-4 py-3">
                        <Link
                          href="#"
                          className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
