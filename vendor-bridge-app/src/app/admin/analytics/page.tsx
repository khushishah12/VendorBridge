"use client"

import { useState } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  FileText,
  ShoppingCart,
  Receipt,
  Building2,
  Users,
  TrendingUp,
  Clock,
  DollarSign,
  AlertCircle,
  BarChart3,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react"
import { analyticsSummary, monthlySpendData, topVendors } from "@/lib/admin-data"

type DateRange = "30d" | "quarter" | "year" | "all"

function formatAmount(n: number) {
  if (n >= 1000000) return "$" + (n / 1000000).toFixed(1) + "M"
  if (n >= 1000) return "$" + (n / 1000).toFixed(0) + "K"
  return "$" + n.toLocaleString()
}

function formatFull(n: number) {
  return "$" + n.toLocaleString()
}

const dateRanges: { key: DateRange; label: string }[] = [
  { key: "30d", label: "Last 30 days" },
  { key: "quarter", label: "Last Quarter" },
  { key: "year", label: "Last Year" },
  { key: "all", label: "All Time" },
]

const maxAmount = Math.max(...monthlySpendData.map((d) => d.amount))

export default function AdminAnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>("all")

  const netPaid = analyticsSummary.totalSpend - analyticsSummary.pendingPayments

  const procStats = [
    { label: "Total RFQs", value: analyticsSummary.totalRfqs, icon: FileText, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400" },
    { label: "RFQ → PO Conversion", value: analyticsSummary.conversionRate + "%", icon: TrendingUp, color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400" },
    { label: "Avg Cycle Time", value: analyticsSummary.avgCycleTime + " days", icon: Clock, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400" },
    { label: "Total POs", value: analyticsSummary.totalPos, icon: ShoppingCart, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400" },
    { label: "Total Invoices", value: analyticsSummary.totalInvoices, icon: Receipt, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400" },
    { label: "Total Vendors", value: analyticsSummary.totalVendors, icon: Building2, color: "text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30 dark:text-cyan-400" },
  ]

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Analytics & Insights</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Procurement performance, spending trends, and vendor analytics
            </p>
          </div>
          {/* Date Range */}
          <div className="inline-flex items-center rounded-lg border border-zinc-200 bg-white p-0.5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
            {dateRanges.map((range) => (
              <button
                key={range.key}
                onClick={() => setDateRange(range.key)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  dateRange === range.key
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Procurement Analytics */}
        <div className="mb-8">
          <h2 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-50">Procurement Analytics</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {procStats.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="mt-3 text-xl font-bold text-zinc-900 dark:text-zinc-50">{stat.value}</p>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Spending Trends + Vendor Analytics */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Spending Trends - Bar Chart */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Spending Trends</h2>
              </div>
              <span className="text-xs text-zinc-400">Monthly spend</span>
            </div>
            <div className="flex items-end gap-3" style={{ height: 200 }}>
              {monthlySpendData.map((d) => {
                const heightPct = (d.amount / maxAmount) * 100
                return (
                  <div key={d.month} className="group relative flex flex-1 flex-col items-center justify-end h-full">
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-zinc-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-zinc-700">
                      {formatFull(d.amount)}
                    </div>
                    <div
                      className="w-full max-w-[48px] rounded-t-md bg-gradient-to-t from-indigo-600 to-indigo-400 transition-all hover:from-indigo-500 hover:to-indigo-300"
                      style={{ height: `${heightPct}%`, minHeight: 4 }}
                    />
                    <span className="mt-2 text-[10px] font-medium text-zinc-500 dark:text-zinc-400">{d.month}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Top Vendors */}
          <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Top Vendors</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                    <th className="px-4 py-3">Vendor Name</th>
                    <th className="px-4 py-3 text-right">Orders</th>
                    <th className="px-4 py-3">Success Rate</th>
                    <th className="px-4 py-3 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {topVendors.map((v) => (
                    <tr key={v.name} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900">
                      <td className="px-4 py-3 font-medium text-zinc-800 dark:text-zinc-200">{v.name}</td>
                      <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-400">{v.orders}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-20 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                            <div
                              className={`h-full rounded-full ${
                                v.successRate >= 80
                                  ? "bg-emerald-500"
                                  : v.successRate >= 50
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                              }`}
                              style={{ width: `${v.successRate}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-zinc-500">{v.successRate}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-zinc-800 dark:text-zinc-200">
                        {formatFull(v.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div>
          <h2 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-50">Financial Summary</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Total Spend</p>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{formatFull(analyticsSummary.totalSpend)}</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Pending Payments</p>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{formatFull(analyticsSummary.pendingPayments)}</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Net Paid</p>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{formatFull(netPaid)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
