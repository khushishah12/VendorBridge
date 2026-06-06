"use client"

import { useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { vendorRfqs } from "@/lib/vendor-rfq-data"
import { FileText, Building2, Tag, Calendar, Clock } from "lucide-react"
import Link from "next/link"

function isExpired(deadline: string): boolean {
  return new Date(deadline).getTime() < Date.now()
}

export default function ClosedRfqsPage() {
  const closed = useMemo(() => {
    return vendorRfqs
      .filter((rfq) => isExpired(rfq.deadline))
      .map((rfq) => ({ ...rfq, displayStatus: "Expired" as const }))
  }, [])

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Closed & Expired RFQs</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {closed.length} RFQ{closed.length !== 1 && "s"} past their deadline
          </p>
        </div>

        {closed.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 py-16 dark:border-zinc-700">
            <FileText className="mb-3 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
            <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400">No closed or expired RFQs</p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500">All open RFQs are still accepting submissions</p>
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
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Deadline</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {closed.map((rfq) => (
                    <tr
                      key={rfq.id}
                      className="group transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                    >
                      <td className="px-4 py-3 font-mono text-xs font-medium text-indigo-600 dark:text-indigo-400">
                        {rfq.id}
                      </td>
                      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{rfq.title}</td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                        <span className="inline-flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5" />
                          {rfq.company}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{rfq.category}</td>
                      <td className="px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400">
                        {new Date(rfq.deadline).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-950/30 dark:text-red-400">
                          <Clock className="h-3 w-3" />
                          {rfq.displayStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/vendor/rfqs/${rfq.id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        >
                          View Details
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
