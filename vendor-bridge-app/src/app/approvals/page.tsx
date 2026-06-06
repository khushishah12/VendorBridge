"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  Send,
  Eye,
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Clock,
  DollarSign,
  User,
  Shield,
  TrendingDown,
  FileText,
  Paperclip,
  CheckCircle2,
  Zap,
  Users,
  ChevronRight,
  Upload,
  XCircle,
} from "lucide-react"
import Link from "next/link"

type ApprovalStage = "Pending Manager Approval" | "Pending Finance Approval"
type Priority = "High" | "Medium" | "Low"

interface ApprovalItem {
  id: string
  rfqTitle: string
  quotationRef: string
  vendor: string
  totalAmount: number
  requestedBy: string
  stage: ApprovalStage
  priority: Priority
  createdDate: string
  rfqSummary: string
  selectedBreakdown: { label: string; value: string }[]
  vendorDetails: { label: string; value: string }[]
  priceComparison: { vendor: string; amount: number }[]
  attachments: { name: string; type: string }[]
}

const mockApprovals: ApprovalItem[] = [
  {
    id: "APR-2025-001", rfqTitle: "Office Laptops Procurement", quotationRef: "QTN-2025-0101",
    vendor: "TechSolutions Inc.", totalAmount: 184500,
    requestedBy: "Priya Sharma (Procurement Officer)", stage: "Pending Manager Approval",
    priority: "High", createdDate: "2025-06-01",
    rfqSummary: "30 laptops for the new engineering team. Budget allocated under IT-2025-Q3.",
    selectedBreakdown: [
      { label: "Item", value: "Laptop Pro X1 × 30" },
      { label: "Unit Price", value: "$6,150" },
      { label: "Total", value: "$184,500" },
      { label: "Delivery", value: "30 days" },
      { label: "Warranty", value: "3 years comprehensive" },
    ],
    vendorDetails: [
      { label: "Vendor", value: "TechSolutions Inc." },
      { label: "Rating", value: "4.8 / 5.0" },
      { label: "Past Orders", value: "24" },
      { label: "Payment Terms", value: "Net 30" },
    ],
    priceComparison: [
      { vendor: "TechSolutions Inc.", amount: 184500 },
      { vendor: "Acme Corp", amount: 192000 },
      { vendor: "Global Supplies Co.", amount: 210000 },
      { vendor: "ServicePro Ltd.", amount: 178500 },
    ],
    attachments: [
      { name: "TechSolutions_Quote_QTN-2025-0101.pdf", type: "PDF" },
      { name: "Price_Comparison_Sheet.xlsx", type: "XLS" },
      { name: "Laptop_Specs_Sheet.pdf", type: "PDF" },
    ],
  },
  {
    id: "APR-2025-002", rfqTitle: "Cloud Infrastructure Services", quotationRef: "QTN-2025-0107",
    vendor: "TechSolutions Inc.", totalAmount: 245000,
    requestedBy: "System (Auto-generated)", stage: "Pending Finance Approval",
    priority: "Medium", createdDate: "2025-05-28",
    rfqSummary: "Cloud migration services for corporate infrastructure. Phase 1 of 3.",
    selectedBreakdown: [
      { label: "Service", value: "Cloud Migration - Full Suite" },
      { label: "Total", value: "$245,000" },
      { label: "Delivery", value: "14 days" },
      { label: "Support", value: "24/7, 1 year included" },
    ],
    vendorDetails: [
      { label: "Vendor", value: "TechSolutions Inc." },
      { label: "Rating", value: "4.8 / 5.0" },
      { label: "Past Orders", value: "24" },
      { label: "Payment Terms", value: "Net 45" },
    ],
    priceComparison: [
      { vendor: "TechSolutions Inc.", amount: 245000 },
      { vendor: "ServicePro Ltd.", amount: 232000 },
    ],
    attachments: [
      { name: "Cloud_Migration_Proposal.pdf", type: "PDF" },
      { name: "SLA_Terms.docx", type: "DOC" },
    ],
  },
  {
    id: "APR-2025-003", rfqTitle: "Construction Materials - Phase 2", quotationRef: "QTN-2025-0106",
    vendor: "BuildRight Construction", totalAmount: 445000,
    requestedBy: "Rahul Verma (Procurement Officer)", stage: "Pending Manager Approval",
    priority: "High", createdDate: "2025-06-03",
    rfqSummary: "Steel beams and construction materials for Phase 2 of the warehouse project.",
    selectedBreakdown: [
      { label: "Item", value: "Steel Beams × 100" },
      { label: "Unit Price", value: "$4,450" },
      { label: "Total", value: "$445,000" },
      { label: "Delivery", value: "90 days (phased)" },
      { label: "Warranty", value: "Structural guarantee 10 yrs" },
    ],
    vendorDetails: [
      { label: "Vendor", value: "BuildRight Construction" },
      { label: "Rating", value: "4.5 / 5.0" },
      { label: "Past Orders", value: "12" },
      { label: "Payment Terms", value: "Milestone-based" },
    ],
    priceComparison: [
      { vendor: "BuildRight Construction", amount: 445000 },
    ],
    attachments: [
      { name: "BuildRight_Quote.pdf", type: "PDF" },
      { name: "Material_Specs.pdf", type: "PDF" },
    ],
  },
]

const stageStyles: Record<ApprovalStage, string> = {
  "Pending Manager Approval": "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
  "Pending Finance Approval": "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
}

const priorityStyles: Record<Priority, string> = {
  High: "text-red-600 dark:text-red-400",
  Medium: "text-amber-600 dark:text-amber-400",
  Low: "text-blue-600 dark:text-blue-400",
}

const stages: ApprovalStage[] = ["Pending Manager Approval", "Pending Finance Approval"]
const priorities: Priority[] = ["High", "Medium", "Low"]

export default function PendingApprovalsPage() {
  const [search, setSearch] = useState("")
  const [stageFilter, setStageFilter] = useState<ApprovalStage | "All">("All")
  const [priorityFilter, setPriorityFilter] = useState<Priority | "All">("All")
  const [showFilters, setShowFilters] = useState(false)
  const [detailItem, setDetailItem] = useState<ApprovalItem | null>(null)
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return mockApprovals.filter((a) => {
      if (search && !a.id.toLowerCase().includes(search.toLowerCase()) && !a.vendor.toLowerCase().includes(search.toLowerCase()) && !a.rfqTitle.toLowerCase().includes(search.toLowerCase())) return false
      if (stageFilter !== "All" && a.stage !== stageFilter) return false
      if (priorityFilter !== "All" && a.priority !== priorityFilter) return false
      return true
    })
  }, [search, stageFilter, priorityFilter])

  function showAction(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(null), 2500)
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Pending Approvals</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{filtered.length} requests awaiting approval</p>
        </div>

        {/* Toast */}
        {actionMsg && (
          <div className="mb-4 rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{actionMsg}</div>
        )}

        {/* Search + Filter */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, vendor, or RFQ..."
              className="w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${
              showFilters ? "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300" : "border-zinc-300 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}>
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="mb-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">Stage</label>
                <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value as ApprovalStage | "All")}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
                  <option value="All">All Stages</option>
                  {stages.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">Priority</label>
                <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as Priority | "All")}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
                  <option value="All">All</option>
                  {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <button onClick={() => { setStageFilter("All"); setPriorityFilter("All") }}
                className="rounded-lg px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-700">Clear</button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                <th className="px-4 py-3">Approval ID</th>
                <th className="px-4 py-3">RFQ / Quotation</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3">Requested By</th>
                <th className="px-4 py-3">Stage</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-zinc-400">
                    <Clock className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    No pending approvals
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-indigo-600 dark:text-indigo-400">{a.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-zinc-800 dark:text-zinc-200">{a.rfqTitle}</p>
                      <p className="text-xs text-zinc-400">{a.quotationRef}</p>
                    </td>
                    <td className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">{a.vendor}</td>
                    <td className="px-4 py-3 text-right font-medium text-zinc-900 dark:text-zinc-100">${a.totalAmount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-zinc-500">{a.requestedBy}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${stageStyles[a.stage]}`}>{a.stage}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${priorityStyles[a.priority]}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${a.priority === "High" ? "bg-red-500" : a.priority === "Medium" ? "bg-amber-500" : "bg-blue-500"}`} />
                        {a.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{a.createdDate}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button onClick={() => setDetailItem(a)}
                          className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400" title="View details">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            <div className="sticky top-0 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-700 dark:bg-zinc-900">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Approval Details</h2>
                <p className="text-sm text-zinc-400">{detailItem.id}</p>
              </div>
              <button onClick={() => setDetailItem(null)} className="rounded-lg p-1 text-zinc-400 hover:text-zinc-600"><XCircle className="h-5 w-5" /></button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status bar */}
              <div className="flex flex-wrap items-center gap-3">
                <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${stageStyles[detailItem.stage]}`}>
                  <Clock className="h-3 w-3" /> {detailItem.stage}
                </span>
                <span className={`inline-flex items-center gap-1 text-xs font-medium ${priorityStyles[detailItem.priority]}`}>
                  <Zap className="h-3 w-3" /> {detailItem.priority} Priority
                </span>
                <span className="text-xs text-zinc-400">Requested by {detailItem.requestedBy}</span>
              </div>

              {/* RFQ Summary */}
              <div>
                <h4 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  <FileText className="inline h-4 w-4 mr-1" /> RFQ Summary
                </h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{detailItem.rfqSummary}</p>
              </div>

              {/* Selected Quotation Breakdown */}
              <div>
                <h4 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  <CheckCircle2 className="inline h-4 w-4 mr-1" /> Selected Quotation Breakdown
                </h4>
                <div className="rounded-lg border border-zinc-200 divide-y divide-zinc-200 dark:border-zinc-700 dark:divide-zinc-700">
                  {detailItem.selectedBreakdown.map((row, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-2 text-sm">
                      <span className="text-zinc-500">{row.label}</span>
                      <span className="font-medium text-zinc-800 dark:text-zinc-200">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Vendor Details */}
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    <Users className="inline h-4 w-4 mr-1" /> Vendor Details
                  </h4>
                  <div className="rounded-lg border border-zinc-200 divide-y divide-zinc-200 dark:border-zinc-700 dark:divide-zinc-700">
                    {detailItem.vendorDetails.map((row, i) => (
                      <div key={i} className="flex items-center justify-between px-4 py-2 text-sm">
                        <span className="text-zinc-500">{row.label}</span>
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Comparison Snapshot */}
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    <TrendingDown className="inline h-4 w-4 mr-1" /> Price Comparison
                  </h4>
                  <div className="rounded-lg border border-zinc-200 divide-y divide-zinc-200 dark:border-zinc-700 dark:divide-zinc-700">
                    {detailItem.priceComparison.map((row, i) => {
                      const lowest = Math.min(...detailItem.priceComparison.map((p) => p.amount))
                      return (
                        <div key={i} className={`flex items-center justify-between px-4 py-2 text-sm ${row.amount === lowest ? "bg-emerald-50 dark:bg-emerald-950/30" : ""}`}>
                          <span className="text-zinc-600 dark:text-zinc-400">{row.vendor}</span>
                          <span className={`font-medium ${row.amount === lowest ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-800 dark:text-zinc-200"}`}>
                            ${row.amount.toLocaleString()}
                            {row.amount === lowest && <span className="ml-1 text-emerald-500">🟢</span>}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Attachments */}
              <div>
                <h4 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  <Paperclip className="inline h-4 w-4 mr-1" /> Attachments
                </h4>
                <div className="space-y-2">
                  {detailItem.attachments.map((att, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-white text-xs font-medium text-indigo-600 shadow-sm dark:bg-zinc-800 dark:text-indigo-400">
                        {att.type}
                      </div>
                      <span className="flex-1 text-zinc-700 dark:text-zinc-300">{att.name}</span>
                      <Upload className="h-4 w-4 text-zinc-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-700">
                <button onClick={() => { showAction(`${detailItem.id} sent for ${detailItem.stage === "Pending Manager Approval" ? "finance approval" : "final approval"}`) }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                  <Send className="h-4 w-4" /> Send for Approval
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  <Shield className="h-4 w-4" /> View Approval Chain
                </button>
                <button onClick={() => setDetailItem(null)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  <Clock className="h-4 w-4" /> Track Status Live
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
