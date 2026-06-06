"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  Search,
  LayoutGrid,
  Table2,
  Star,
  Edit,
  Ban,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Building2,
  Filter,
  ChevronDown,
  Trash2,
} from "lucide-react"
import { adminVendors } from "@/lib/admin-data"
import type { AdminVendor } from "@/lib/admin-data"

type ViewMode = "cards" | "table"
type StatusFilter = "All" | AdminVendor["status"]

const statusStyles: Record<AdminVendor["status"], string> = {
  Active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  Blacklisted: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
  Inactive: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < full ? "fill-amber-400" : i === full && half ? "fill-amber-200" : "fill-none"} ${i >= full ? "text-zinc-300 dark:text-zinc-600" : ""}`}
        />
      ))}
      <span className="ml-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">{rating > 0 ? rating.toFixed(1) : "—"}</span>
    </span>
  )
}

function formatAmount(n: number) {
  return "$" + n.toLocaleString()
}

const statuses: StatusFilter[] = ["All", "Active", "Pending", "Blacklisted", "Inactive"]
const categories = [...new Set(adminVendors.map((v) => v.category))]

export default function AdminVendorsPage() {
  const [view, setView] = useState<ViewMode>("cards")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All")
  const [categoryFilter, setCategoryFilter] = useState("All")

  const filtered = useMemo(() => {
    return adminVendors.filter((v) => {
      if (search) {
        const q = search.toLowerCase()
        if (
          !v.companyName.toLowerCase().includes(q) &&
          !v.contactPerson.toLowerCase().includes(q) &&
          !v.email.toLowerCase().includes(q)
        )
          return false
      }
      if (statusFilter !== "All" && v.status !== statusFilter) return false
      if (categoryFilter !== "All" && v.category !== categoryFilter) return false
      return true
    })
  }, [search, statusFilter, categoryFilter])

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Vendor Management</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {adminVendors.length} registered vendors
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView("cards")}
              className={`rounded-lg border p-2 transition-colors ${
                view === "cards"
                  ? "border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-400"
                  : "border-zinc-300 text-zinc-500 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("table")}
              className={`rounded-lg border p-2 transition-colors ${
                view === "table"
                  ? "border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-400"
                  : "border-zinc-300 text-zinc-500 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              <Table2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by company, contact, email..."
              className="w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All Statuses" : s}
              </option>
            ))}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {(search || statusFilter !== "All" || categoryFilter !== "All") && (
            <button
              onClick={() => {
                setSearch("")
                setStatusFilter("All")
                setCategoryFilter("All")
              }}
              className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              Clear
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-zinc-400">
            <Building2 className="mb-3 h-12 w-12 opacity-40" />
            <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400">No vendors found</p>
            <p className="mt-1 text-sm">Try adjusting your search or filter criteria</p>
          </div>
        ) : view === "cards" ? (
          /* ======================== CARDS VIEW ======================== */
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((v) => (
              <div
                key={v.id}
                className="rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
              >
                {/* Card Header */}
                <div className="border-b border-zinc-100 p-4 dark:border-zinc-800">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                        {v.companyName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-zinc-50">{v.companyName}</p>
                        <p className="text-xs text-zinc-400">{v.id}</p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[v.status]}`}
                    >
                      {v.status === "Blacklisted" && <AlertTriangle className="h-3 w-3" />}
                      {v.status}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="space-y-3 p-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-zinc-400">Contact</p>
                      <p className="font-medium text-zinc-800 dark:text-zinc-200">{v.contactPerson}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Email</p>
                      <p className="truncate text-zinc-600 dark:text-zinc-400">{v.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Phone</p>
                      <p className="text-zinc-600 dark:text-zinc-400">{v.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">GST</p>
                      <p className="truncate text-xs text-zinc-600 dark:text-zinc-400">{v.gst}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-block rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      {v.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <StarRating rating={v.rating} />
                    <span className="text-xs text-zinc-400">
                      Last order: {v.lastOrderDate}
                    </span>
                  </div>

                  {/* Success Rate Bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">Success Rate</span>
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">{v.successRate}%</span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                      <div
                        className={`h-full rounded-full transition-all ${
                          v.successRate >= 80
                            ? "bg-emerald-500"
                            : v.successRate >= 50
                              ? "bg-amber-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${v.successRate}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-100 pt-3 text-sm dark:border-zinc-800">
                    <div>
                      <p className="text-xs text-zinc-400">Total Orders</p>
                      <p className="font-semibold text-zinc-900 dark:text-zinc-50">{v.totalOrders}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-zinc-400">Total Spend</p>
                      <p className="font-semibold text-zinc-900 dark:text-zinc-50">{formatAmount(v.totalSpend)}</p>
                    </div>
                  </div>

                  {/* Blacklist Reason */}
                  {v.status === "Blacklisted" && v.blacklistReason && (
                    <div className="rounded-lg bg-red-50 p-3 text-xs text-red-700 dark:bg-red-950/30 dark:text-red-400">
                      <div className="flex items-start gap-1.5">
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span>{v.blacklistReason}</span>
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="flex items-center gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                    <button className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800">
                      <Edit className="h-3.5 w-3.5" /> Edit
                    </button>
                    {v.status === "Blacklisted" ? (
                      <button className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800">
                        <CheckCircle className="h-3.5 w-3.5" /> Reactivate
                      </button>
                    ) : v.status === "Active" ? (
                      <button className="inline-flex items-center gap-1 rounded-lg border border-amber-300 px-3 py-1.5 text-xs font-medium text-amber-600 transition-colors hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-950/30">
                        <XCircle className="h-3.5 w-3.5" /> Deactivate
                      </button>
                    ) : (
                      <button className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 px-3 py-1.5 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/30">
                        <CheckCircle className="h-3.5 w-3.5" /> Activate
                      </button>
                    )}
                    {v.status !== "Blacklisted" && (
                      <button className="inline-flex items-center gap-1 rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/30">
                        <Ban className="h-3.5 w-3.5" /> Blacklist
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ======================== TABLE VIEW ======================== */
          <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3 text-right">Orders</th>
                  <th className="px-4 py-3 text-right">Spend</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filtered.map((v) => (
                  <tr key={v.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-[10px] font-bold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                          {v.companyName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-zinc-800 dark:text-zinc-200">{v.companyName}</p>
                          <p className="text-xs text-zinc-400">{v.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{v.contactPerson}</td>
                    <td className="px-4 py-3 text-zinc-500">{v.email}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        {v.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[v.status]}`}
                      >
                        {v.status === "Blacklisted" && <AlertTriangle className="h-3 w-3" />}
                        {v.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StarRating rating={v.rating} />
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-zinc-800 dark:text-zinc-200">
                      {v.totalOrders}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-zinc-800 dark:text-zinc-200">
                      {formatAmount(v.totalSpend)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button className="rounded-lg border border-zinc-300 p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:border-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300">
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        {v.status === "Active" ? (
                          <button className="rounded-lg border border-zinc-300 p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:border-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300">
                            <XCircle className="h-3.5 w-3.5" />
                          </button>
                        ) : v.status !== "Blacklisted" ? (
                          <button className="rounded-lg border border-zinc-300 p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:border-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300">
                            <CheckCircle className="h-3.5 w-3.5" />
                          </button>
                        ) : null}
                        {v.status !== "Blacklisted" && (
                          <button className="rounded-lg border border-zinc-300 p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:border-zinc-600 dark:hover:bg-red-950/30 dark:hover:text-red-400">
                            <Ban className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
