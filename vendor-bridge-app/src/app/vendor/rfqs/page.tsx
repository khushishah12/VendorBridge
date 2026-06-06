"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { vendorRfqs, type VendorRfq } from "@/lib/vendor-rfq-data"
import {
  Search,
  SlidersHorizontal,
  Clock,
  Eye,
  FileText,
  Building2,
  Tag,
  DollarSign,
  Package,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Bell,
  Send,
  BarChart3,
  Paperclip,
  Star,
  Calendar,
} from "lucide-react"
import Link from "next/link"

const categories = ["IT Hardware", "IT Services", "Construction", "Medical Equipment", "Office Supplies"]

function getTimeLeft(deadline: string): { text: string; urgent: boolean } {
  const diff = new Date(deadline).getTime() - Date.now()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  if (diff <= 0) return { text: "Expired", urgent: true }
  if (days > 0) return { text: `${days}d ${hours}h left`, urgent: days <= 3 }
  if (hours > 0) return { text: `${hours}h left`, urgent: true }
  return { text: "Closing soon", urgent: true }
}

export default function VendorRfqsPage() {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("All")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [budgetMin, setBudgetMin] = useState("")
  const [budgetMax, setBudgetMax] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [notifyIds, setNotifyIds] = useState<Set<string>>(new Set())
  const [submittingId, setSubmittingId] = useState<string | null>(null)
  const [submittedId, setSubmittedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return vendorRfqs
      .filter((rfq) => {
        if (search && !rfq.title.toLowerCase().includes(search.toLowerCase()) && !rfq.id.toLowerCase().includes(search.toLowerCase())) return false
        if (categoryFilter !== "All" && rfq.category !== categoryFilter) return false
        if (statusFilter !== "All" && rfq.status !== statusFilter) return false
        return true
      })
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
  }, [search, categoryFilter, statusFilter])

  function toggleSave(id: string) {
    setSavedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleNotify(id: string) {
    setNotifyIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleSubmitQuote(id: string) {
    setSubmittingId(id)
    setTimeout(() => {
      setSubmittingId(null)
      setSubmittedId(id)
      setTimeout(() => setSubmittedId(null), 3000)
    }, 1200)
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Available RFQs</h1>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                Action Zone
              </span>
            </div>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {filtered.length} open opportunities — respond before deadlines
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <BarChart3 className="h-4 w-4" />
            <span>Sort by: <strong>Deadline</strong></span>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search RFQs by title or ID..."
              className="w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-3 text-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
              showFilters
                ? "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300"
                : "border-zinc-300 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mb-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">Category</label>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
                  <option value="All">All Categories</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">Status</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
                  <option value="All">All</option>
                  <option value="Open">Open</option>
                  <option value="Active">Active</option>
                  <option value="Closing Soon">Closing Soon</option>
                </select>
              </div>
              <button onClick={() => { setCategoryFilter("All"); setStatusFilter("All"); setBudgetMin(""); setBudgetMax("") }}
                className="rounded-lg px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
                Clear
              </button>
            </div>
          </div>
        )}

        {/* RFQ Cards */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 py-16 dark:border-zinc-700">
              <FileText className="mb-3 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
              <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400">No RFQs found</p>
              <p className="text-sm text-zinc-400 dark:text-zinc-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            filtered.map((rfq) => {
              const timeLeft = getTimeLeft(rfq.deadline)
              const isExpanded = expandedId === rfq.id
              const isSaved = savedIds.has(rfq.id)
              const isNotified = notifyIds.has(rfq.id)
              const isSubmitting = submittingId === rfq.id
              const justSubmitted = submittedId === rfq.id

              return (
                <div
                  key={rfq.id}
                  className={`group rounded-xl border shadow-sm transition-all duration-200 hover:shadow-md
                    ${justSubmitted ? "border-emerald-300 bg-emerald-50/50 dark:border-emerald-700 dark:bg-emerald-950/20" : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"}
                    ${rfq.status === "Closing Soon" ? "ring-1 ring-amber-300 dark:ring-amber-700" : ""}
                  `}
                >
                  {/* Card Header */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-medium text-indigo-600 dark:text-indigo-400">{rfq.id}</span>
                          {rfq.status === "Closing Soon" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                              <Clock className="h-3 w-3" /> Closing Soon
                            </span>
                          )}
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            rfq.status === "Open" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          }`}>
                            {rfq.status}
                          </span>
                        </div>
                        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                          {rfq.title}
                        </h2>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                          <span className="inline-flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5" />
                            {rfq.company}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Tag className="h-3.5 w-3.5" />
                            {rfq.category}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Package className="h-3.5 w-3.5" />
                            {rfq.itemsCount} items
                          </span>
                          {rfq.estimatedBudget && (
                            <span className="inline-flex items-center gap-1">
                              <DollarSign className="h-3.5 w-3.5" />
                              {rfq.estimatedBudget}
                            </span>
                          )}
                          {rfq.hasAttachments && (
                            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                              <Paperclip className="h-3.5 w-3.5" />
                              Attachments
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Time Left + Actions */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <div className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold ${
                          timeLeft.urgent ? "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400" : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        }`}>
                          <Clock className="h-4 w-4" />
                          {timeLeft.text}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleSave(rfq.id)}
                            className={`rounded-lg p-1.5 transition-colors ${
                              isSaved ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30" : "text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            }`}
                            title={isSaved ? "Saved" : "Save for later"}
                          >
                            <Bookmark className={`h-4 w-4 ${isSaved ? "fill-amber-500" : ""}`} />
                          </button>
                          <button
                            onClick={() => toggleNotify(rfq.id)}
                            className={`rounded-lg p-1.5 transition-colors ${
                              isNotified ? "text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/30" : "text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            }`}
                            title={isNotified ? "Notifications on" : "Notify me on changes"}
                          >
                            <Bell className={`h-4 w-4 ${isNotified ? "fill-indigo-500" : ""}`} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <Link
                        href={`/vendor/rfqs/${rfq.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View Details
                      </Link>
                      <button
                        onClick={() => handleSubmitQuote(rfq.id)}
                        disabled={isSubmitting || justSubmitted}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-all ${
                          justSubmitted
                            ? "bg-emerald-500 cursor-default"
                            : isSubmitting
                              ? "bg-indigo-400 cursor-wait"
                              : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Submitting...
                          </>
                        ) : justSubmitted ? (
                          <>Quotation Submitted ✓</>
                        ) : (
                          <>
                            <Send className="h-3.5 w-3.5" />
                            Submit Quotation
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : rfq.id)}
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        {isExpanded ? "Hide Preview" : "Quick Preview"}
                      </button>
                    </div>

                    {/* Expanded Quick Preview */}
                    {isExpanded && (
                      <div className="mt-4 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                        <div className="grid gap-6 md:grid-cols-2">
                          <div>
                            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Description</h4>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300">{rfq.description}</p>
                          </div>
                          <div>
                            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Key Requirements</h4>
                            <ul className="space-y-1">
                              {rfq.keyRequirements.map((req, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                                  <Star className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" />
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-4 text-xs text-zinc-400">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Deadline: {new Date(rfq.deadline).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            Issued by: {rfq.issuedBy}
                          </span>
                          {rfq.hasAttachments && (
                            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                              <Paperclip className="h-3 w-3" />
                              {rfq.attachments.length} files attached
                            </span>
                          )}
                        </div>

                        {/* Items mini table */}
                        <div className="mt-3 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="bg-zinc-50 text-left font-semibold text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                                <th className="px-3 py-2">Item</th>
                                <th className="px-3 py-2">Qty</th>
                                <th className="px-3 py-2">Unit</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                              {rfq.items.slice(0, 3).map((item, i) => (
                                <tr key={i} className="text-zinc-700 dark:text-zinc-300">
                                  <td className="px-3 py-1.5">{item.name}</td>
                                  <td className="px-3 py-1.5">{item.quantity}</td>
                                  <td className="px-3 py-1.5">{item.unitType}</td>
                                </tr>
                              ))}
                              {rfq.items.length > 3 && (
                                <tr className="text-zinc-400">
                                  <td colSpan={3} className="px-3 py-1.5 italic">+{rfq.items.length - 3} more items</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Stats footer */}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Open: {vendorRfqs.filter(r => r.status === "Open").length}</span>
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> Active: {vendorRfqs.filter(r => r.status === "Active").length}</span>
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Closing Soon: {vendorRfqs.filter(r => r.status === "Closing Soon").length}</span>
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-zinc-400" /> Saved: {savedIds.size}</span>
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-indigo-500" /> Notifications: {notifyIds.size}</span>
        </div>
      </div>
    </DashboardLayout>
  )
}
