"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  ArrowLeft,
  Send,
  XCircle,
  CheckCircle2,
  Edit,
  RotateCcw,
  Eye,
  Clock,
  AlertTriangle,
  Search,
  SlidersHorizontal,
  FileText,
  DollarSign,
  Zap,
  Save,
} from "lucide-react"
import Link from "next/link"

type PoStage = "Draft" | "Waiting Approval" | "Sent but not acknowledged"
type Priority = "High" | "Medium" | "Low"

interface PendingPo {
  id: string
  vendor: string
  rfqRef: string
  quotationRef: string
  totalAmount: number
  stage: PoStage
  priority: Priority
  createdDate: string
  missingFields: string[]
  approvalStatus: string
  vendorResponse: string
}

const mockPending: PendingPo[] = [
  {
    id: "PO-2025-0044", vendor: "BuildRight Construction", rfqRef: "RFQ-2025-0002", quotationRef: "QTN-2025-0106",
    totalAmount: 445000, stage: "Draft", priority: "High", createdDate: "2025-06-06",
    missingFields: ["Delivery deadline", "Payment terms"],
    approvalStatus: "Pending Manager Approval", vendorResponse: "Not sent yet",
  },
  {
    id: "PO-2025-0047", vendor: "ServicePro Ltd.", rfqRef: "RFQ-2025-0013", quotationRef: "QTN-2025-0115",
    totalAmount: 92000, stage: "Waiting Approval", priority: "Medium", createdDate: "2025-06-04",
    missingFields: [],
    approvalStatus: "Pending Finance Approval", vendorResponse: "Not sent yet",
  },
  {
    id: "PO-2025-0043", vendor: "TechSolutions Inc.", rfqRef: "RFQ-2025-0001", quotationRef: "QTN-2025-0101",
    totalAmount: 184500, stage: "Sent but not acknowledged", priority: "High", createdDate: "2025-06-05",
    missingFields: [],
    approvalStatus: "Approved", vendorResponse: "Awaiting acknowledgment",
  },
]

const stageStyles: Record<PoStage, string> = {
  Draft: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
  "Waiting Approval": "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
  "Sent but not acknowledged": "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
}

const priorityStyles: Record<Priority, string> = {
  High: "text-red-600 dark:text-red-400",
  Medium: "text-amber-600 dark:text-amber-400",
  Low: "text-blue-600 dark:text-blue-400",
}

const stages: PoStage[] = ["Draft", "Waiting Approval", "Sent but not acknowledged"]
const priorities: Priority[] = ["High", "Medium", "Low"]

export default function PendingPurchaseOrdersPage() {
  const [search, setSearch] = useState("")
  const [stageFilter, setStageFilter] = useState<PoStage | "All">("All")
  const [priorityFilter, setPriorityFilter] = useState<Priority | "All">("All")
  const [showFilters, setShowFilters] = useState(false)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return mockPending.filter((po) => {
      if (search && !po.id.toLowerCase().includes(search.toLowerCase()) && !po.vendor.toLowerCase().includes(search.toLowerCase())) return false
      if (stageFilter !== "All" && po.stage !== stageFilter) return false
      if (priorityFilter !== "All" && po.priority !== priorityFilter) return false
      return true
    })
  }, [search, stageFilter, priorityFilter])

  function showAction(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(null), 2500)
  }

  const detail = mockPending.find((p) => p.id === detailId)

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <Link href="/purchase-orders" className="mb-2 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
            <ArrowLeft className="h-4 w-4" /> Back to All POs
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Pending Purchase Orders</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{mockPending.length} POs in progress</p>
        </div>

        {actionMsg && (
          <div className="mb-4 rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{actionMsg}</div>
        )}

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by PO ID or vendor..."
              className="w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${
              showFilters ? "border-indigo-200 bg-indigo-50 text-indigo-700" : "border-zinc-300 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}>
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="mb-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">Stage</label>
                <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value as PoStage | "All")}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
                  <option value="All">All</option>
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
              <button onClick={() => { setStageFilter("All"); setPriorityFilter("All") }} className="rounded-lg px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-700">Clear</button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                <th className="px-4 py-3">PO ID</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">RFQ / Quotation</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3">Stage</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-zinc-400"><FileText className="mx-auto mb-2 h-8 w-8 opacity-50" />No pending POs</td></tr>
              ) : (
                filtered.map((po) => (
                  <tr key={po.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-indigo-600 dark:text-indigo-400">{po.id}</td>
                    <td className="px-4 py-3 font-medium text-zinc-800 dark:text-zinc-200">{po.vendor}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-zinc-500">{po.rfqRef}</p>
                      <p className="text-[10px] text-zinc-400">{po.quotationRef}</p>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-zinc-900 dark:text-zinc-100">${po.totalAmount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${stageStyles[po.stage]}`}>{po.stage}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${priorityStyles[po.priority]}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${po.priority === "High" ? "bg-red-500" : po.priority === "Medium" ? "bg-amber-500" : "bg-blue-500"}`} />
                        {po.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{po.createdDate}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setDetailId(po.id)}
                        className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            <div className="sticky top-0 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-700 dark:bg-zinc-900">
              <div><h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">PO Status Details</h2><p className="text-sm text-zinc-400">{detail.id}</p></div>
              <button onClick={() => setDetailId(null)} className="rounded-lg p-1 text-zinc-400 hover:text-zinc-600"><XCircle className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><p className="text-xs text-zinc-400">Vendor</p><p className="font-medium text-zinc-800 dark:text-zinc-200">{detail.vendor}</p></div>
                <div><p className="text-xs text-zinc-400">Stage</p><span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${stageStyles[detail.stage]}`}>{detail.stage}</span></div>
                <div><p className="text-xs text-zinc-400">Priority</p><span className={`text-sm font-medium ${priorityStyles[detail.priority]}`}>{detail.priority}</span></div>
                <div><p className="text-xs text-zinc-400">Amount</p><p className="font-medium text-zinc-800 dark:text-zinc-200">${detail.totalAmount.toLocaleString()}</p></div>
                <div><p className="text-xs text-zinc-400">Approval Status</p><p className="text-sm text-zinc-600 dark:text-zinc-400">{detail.approvalStatus}</p></div>
                <div><p className="text-xs text-zinc-400">Vendor Response</p><p className="text-sm text-zinc-600 dark:text-zinc-400">{detail.vendorResponse}</p></div>
              </div>

              {/* Missing Fields Warning */}
              {detail.missingFields.length > 0 && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
                  <div className="flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-300">
                    <AlertTriangle className="h-4 w-4" /> Missing Fields
                  </div>
                  <ul className="mt-1 list-inside list-disc text-sm text-amber-600 dark:text-amber-400">
                    {detail.missingFields.map((f) => <li key={f}>{f}</li>)}
                  </ul>
                </div>
              )}

              {detail.missingFields.length === 0 && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" /> All fields complete
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-700">
                {detail.stage === "Draft" && (
                  <button onClick={() => { setDetailId(null); showAction(`Editing ${detail.id}...`) }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                    <Edit className="h-4 w-4" /> Edit PO
                  </button>
                )}
                {detail.stage !== "Sent but not acknowledged" && (
                  <button onClick={() => { setDetailId(null); showAction(`${detail.id} sent to vendor`) }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                    <Send className="h-4 w-4" /> Send PO to Vendor ⭐
                  </button>
                )}
                {detail.stage === "Sent but not acknowledged" && (
                  <button onClick={() => { setDetailId(null); showAction(`${detail.id} resent`) }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                    <RotateCcw className="h-4 w-4" /> Resend PO
                  </button>
                )}
                <button onClick={() => { setDetailId(null); showAction(`${detail.id} cancelled`) }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/40">
                  <XCircle className="h-4 w-4" /> Cancel PO
                </button>
                <button onClick={() => { setDetailId(null); showAction(`${detail.id} marked as completed`) }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-950/40">
                  <CheckCircle2 className="h-4 w-4" /> Mark as Completed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
