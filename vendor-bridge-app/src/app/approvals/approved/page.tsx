"use client"

import { useState } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  ShoppingCart,
  User,
  Calendar,
  DollarSign,
  FileText,
  MessageSquare,
  ChevronRight,
  Clock,
  Trophy,
  XCircle,
} from "lucide-react"
import Link from "next/link"

interface ApprovalStep {
  role: string
  name: string
  date: string
  status: "Approved" | "Pending"
  remarks: string
}

interface ApprovedRequest {
  id: string
  rfqRef: string
  poRef: string | null
  title: string
  approvedBy: string
  approvedAmount: number
  approvalDate: string
  vendor: string
  quotationRef: string
  finalQuotation: { label: string; value: string }[]
  remarks: string
  timeline: ApprovalStep[]
}

const mockApproved: ApprovedRequest[] = [
  {
    id: "APR-2025-004", rfqRef: "RFQ-2025-0001", poRef: null,
    title: "Office Laptops Procurement", approvedBy: "Ananya Gupta (Manager)",
    approvedAmount: 184500, approvalDate: "2025-06-05", vendor: "TechSolutions Inc.",
    quotationRef: "QTN-2025-0101",
    finalQuotation: [
      { label: "Vendor", value: "TechSolutions Inc." },
      { label: "Item", value: "Laptop Pro X1 × 30" },
      { label: "Total Amount", value: "$184,500" },
      { label: "Delivery Timeline", value: "30 days" },
      { label: "Warranty", value: "3 years comprehensive" },
      { label: "Payment Terms", value: "Net 30" },
    ],
    remarks: "Approved. TechSolutions has consistently delivered quality products. Pricing is within budget. Proceed with PO generation.",
    timeline: [
      { role: "Procurement Officer", name: "Priya Sharma", date: "2025-06-01", status: "Approved", remarks: "Recommended for approval. Best value quote." },
      { role: "Manager", name: "Ananya Gupta", date: "2025-06-05", status: "Approved", remarks: "Approved. Budget available. Good vendor track record." },
    ],
  },
  {
    id: "APR-2025-005", rfqRef: "RFQ-2025-0004", poRef: "PO-2025-0042",
    title: "Cloud Infrastructure Services", approvedBy: "Ananya Gupta (Manager), Rajesh Kumar (Finance)",
    approvedAmount: 245000, approvalDate: "2025-06-02", vendor: "TechSolutions Inc.",
    quotationRef: "QTN-2025-0107",
    finalQuotation: [
      { label: "Vendor", value: "TechSolutions Inc." },
      { label: "Service", value: "Cloud Migration - Full Suite" },
      { label: "Total Amount", value: "$245,000" },
      { label: "Delivery Timeline", value: "14 days" },
      { label: "Support", value: "24/7, 1 year included" },
      { label: "Payment Terms", value: "Net 45" },
    ],
    remarks: "Approved by both manager and finance. Cloud migration is critical for Q3 roadmap. PO already generated.",
    timeline: [
      { role: "Procurement Officer", name: "System (Auto)", date: "2025-05-28", status: "Approved", remarks: "Auto-approved based on vendor criteria scoring." },
      { role: "Manager", name: "Ananya Gupta", date: "2025-06-01", status: "Approved", remarks: "Approved. Critical infrastructure project." },
      { role: "Finance", name: "Rajesh Kumar", date: "2025-06-02", status: "Approved", remarks: "Budget approved for FY25-Q3. Proceed." },
    ],
  },
]

export default function ApprovedRequestsPage() {
  const [detailItem, setDetailItem] = useState<ApprovedRequest | null>(null)
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  function showAction(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(null), 2500)
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <Link href="/approvals" className="mb-2 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
            <ArrowLeft className="h-4 w-4" /> Back to Approvals
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Approved Requests</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{mockApproved.length} requests approved</p>
        </div>

        {/* Toast */}
        {actionMsg && (
          <div className="mb-4 rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{actionMsg}</div>
        )}

        {/* List */}
        <div className="space-y-4">
          {mockApproved.map((req) => (
            <div key={req.id} className="rounded-xl border border-emerald-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-emerald-900 dark:bg-zinc-950">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                      <CheckCircle2 className="h-3 w-3" /> Approved
                    </span>
                    {req.poRef && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                        <ShoppingCart className="h-3 w-3" /> PO Generated
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">{req.title}</h3>
                  <p className="text-sm text-zinc-500">{req.id} &middot; {req.rfqRef} &middot; {req.vendor}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                    <span className="inline-flex items-center gap-1 font-semibold text-zinc-800 dark:text-zinc-200">
                      <DollarSign className="h-4 w-4 text-zinc-400" /> ${req.approvedAmount.toLocaleString()}
                    </span>
                    <span className="inline-flex items-center gap-1 text-zinc-500">
                      <User className="h-3.5 w-3.5" /> {req.approvedBy}
                    </span>
                    <span className="inline-flex items-center gap-1 text-zinc-500">
                      <Calendar className="h-3.5 w-3.5" /> {req.approvalDate}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button onClick={() => setDetailItem(req)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                    <Eye className="h-4 w-4" /> Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            <div className="sticky top-0 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-700 dark:bg-zinc-900">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Approved Request Details</h2>
                <p className="text-sm text-zinc-400">{detailItem.id}</p>
              </div>
              <button onClick={() => setDetailItem(null)} className="rounded-lg p-1 text-zinc-400 hover:text-zinc-600"><XCircle className="h-5 w-5" /></button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <CheckCircle2 className="h-3 w-3" /> Approved
                </span>
                <span className="text-xs text-zinc-400">{detailItem.rfqRef} &middot; {detailItem.quotationRef}</span>
              </div>

              {/* Final Approved Quotation */}
              <div>
                <h4 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  <Trophy className="inline h-4 w-4 mr-1" /> Final Approved Quotation
                </h4>
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 divide-y divide-emerald-200 dark:border-emerald-900 dark:bg-emerald-950/30 dark:divide-emerald-900">
                  {detailItem.finalQuotation.map((row, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-2 text-sm">
                      <span className="text-emerald-700 dark:text-emerald-300">{row.label}</span>
                      <span className="font-medium text-emerald-800 dark:text-emerald-200">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Approval Remarks */}
              <div>
                <h4 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  <MessageSquare className="inline h-4 w-4 mr-1" /> Approval Remarks ⭐
                </h4>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 italic">&ldquo;{detailItem.remarks}&rdquo;</p>
                </div>
              </div>

              {/* Approval Timeline */}
              <div>
                <h4 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  <Clock className="inline h-4 w-4 mr-1" /> Approval Timeline
                </h4>
                <div className="relative pl-8">
                  {detailItem.timeline.map((step, i) => (
                    <div key={i} className="relative pb-6 last:pb-0">
                      <div className={`absolute left-0 top-1.5 flex h-5 w-5 items-center justify-center rounded-full ${
                        step.status === "Approved" ? "bg-emerald-100 dark:bg-emerald-950/50" : "bg-zinc-100 dark:bg-zinc-800"
                      }`}>
                        {step.status === "Approved" ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Clock className="h-3.5 w-3.5 text-zinc-400" />
                        )}
                      </div>
                      {i < detailItem.timeline.length - 1 && (
                        <div className="absolute left-[9px] top-7 h-full w-0.5 bg-zinc-200 dark:bg-zinc-700" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{step.role}</p>
                          <span className="text-xs text-zinc-400">by {step.name}</span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-0.5">{step.date} &middot; {step.remarks}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next steps */}
              <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-900 dark:bg-indigo-950/40">
                <h4 className="mb-2 text-sm font-semibold text-indigo-700 dark:text-indigo-300">Next Step</h4>
                {detailItem.poRef ? (
                  <p className="text-sm text-indigo-600 dark:text-indigo-400">
                    Purchase Order <span className="font-mono font-medium">{detailItem.poRef}</span> has already been generated.
                  </p>
                ) : (
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-indigo-600 dark:text-indigo-400">Generate a Purchase Order to proceed with this procurement.</p>
                    <button onClick={() => showAction(`PO created from ${detailItem.id}`)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 shrink-0">
                      <ShoppingCart className="h-4 w-4" /> Generate Purchase Order ⭐
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
