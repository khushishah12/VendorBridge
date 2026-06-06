"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { vendorRfqs } from "@/lib/vendor-rfq-data"
import {
  ArrowLeft,
  Clock,
  Building2,
  Tag,
  DollarSign,
  Package,
  MapPin,
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Send,
  Bookmark,
  Download,
  MessageSquare,
  Paperclip,
  ChevronRight,
  Scale,
  Truck,
  Calendar,
  User,
} from "lucide-react"
import Link from "next/link"

function getTimeLeft(deadline: string): { text: string; urgent: boolean } {
  const diff = new Date(deadline).getTime() - Date.now()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  if (diff <= 0) return { text: "Expired", urgent: true }
  if (days > 0) return { text: `${days}d ${hours}h left`, urgent: days <= 3 }
  if (hours > 0) return { text: `${hours}h left`, urgent: true }
  return { text: "Closing soon", urgent: true }
}

const checklistItems = [
  { id: "specs", label: "Have you reviewed all specifications?", icon: FileText },
  { id: "deadline", label: "Can you meet the delivery deadline?", icon: Calendar },
  { id: "delivery", label: "Have you checked delivery terms & location?", icon: Truck },
  { id: "payment", label: "Are the payment terms acceptable?", icon: DollarSign },
  { id: "warranty", label: "Can you meet warranty requirements?", icon: Shield },
  { id: "conditions", label: "Have you reviewed special conditions?", icon: AlertTriangle },
]

export default function RfqDetailPage() {
  const params = useParams()
  const router = useRouter()
  const rfq = vendorRfqs.find((r) => r.id === params.id)

  const [saved, setSaved] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [checklist, setChecklist] = useState<Record<string, boolean>>({})

  if (!rfq) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-24">
          <XCircle className="mb-3 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
          <h2 className="text-xl font-semibold text-zinc-700 dark:text-zinc-300">RFQ Not Found</h2>
          <p className="mt-1 text-sm text-zinc-500">The RFQ you are looking for does not exist or has expired.</p>
          <Link href="/vendor/rfqs" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            <ArrowLeft className="h-4 w-4" /> Back to Available RFQs
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const timeLeft = getTimeLeft(rfq.deadline)
  const allChecked = checklistItems.every((item) => checklist[item.id])

  function handleSubmit() {
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 1800)
  }

  function toggleChecklist(id: string) {
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Link href="/vendor/rfqs" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-700 dark:hover:text-zinc-300">
            <ArrowLeft className="h-4 w-4" />
            Available RFQs
            <ChevronRight className="h-3 w-3" />
          </Link>
          <span className="text-sm text-zinc-400">{rfq.id}</span>
        </div>

        {/* RFQ Header */}
        <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-medium text-indigo-600 dark:text-indigo-400">{rfq.id}</span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  rfq.status === "Open" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                  rfq.status === "Closing Soon" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                }`}>
                  {rfq.status}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{rfq.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" />
                  {rfq.company}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  {rfq.issuedBy}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Tag className="h-4 w-4" />
                  {rfq.category}
                </span>
                {rfq.estimatedBudget && (
                  <span className="inline-flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4" />
                    {rfq.estimatedBudget}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Package className="h-4 w-4" />
                  {rfq.itemsCount} items
                </span>
              </div>
            </div>
            <div className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${
              timeLeft.urgent ? "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400" : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            }`}>
              <Clock className="h-5 w-5" />
              {timeLeft.text}
            </div>
          </div>

          {/* Description */}
          <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {rfq.description}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column — Items + Attachments + Additional Info */}
          <div className="space-y-6 lg:col-span-2">
            {/* Item Requirements */}
            <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="border-b border-zinc-200 px-5 py-3 dark:border-zinc-800">
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Item Requirements</h2>
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {rfq.items.map((item, i) => (
                  <div key={i} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-zinc-900 dark:text-zinc-100">{item.name}</h3>
                        <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{item.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{item.quantity}</p>
                        <p className="text-xs text-zinc-400">{item.unitType}</p>
                      </div>
                    </div>
                    {item.specifications.length > 0 && (
                      <div className="mt-3">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-400">Specifications</p>
                        <div className="flex flex-wrap gap-1.5">
                          {item.specifications.map((spec, j) => (
                            <span key={j} className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Attachments */}
            <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="border-b border-zinc-200 px-5 py-3 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Attachments</h2>
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                    {rfq.attachments.length} files
                  </span>
                </div>
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {rfq.attachments.length === 0 ? (
                  <p className="px-5 py-4 text-sm text-zinc-400">No attachments for this RFQ.</p>
                ) : (
                  rfq.attachments.map((att, i) => (
                    <div key={i} className="flex items-center justify-between px-5 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                          att.type === "pdf" ? "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400" :
                          att.type === "doc" ? "bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400" :
                          att.type === "image" ? "bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400" :
                          "bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                        }`}>
                          {att.type === "pdf" ? "PDF" : att.type === "doc" ? "DOC" : att.type === "image" ? "IMG" : att.type === "drawing" ? "DWG" : "SPEC"}
                        </div>
                        <span className="truncate text-sm font-medium text-zinc-700 dark:text-zinc-300">{att.name}</span>
                      </div>
                      <button className="shrink-0 rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="border-b border-zinc-200 px-5 py-3 dark:border-zinc-800">
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Additional Information</h2>
              </div>
              <div className="space-y-4 px-5 py-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                  <div>
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Delivery Location</p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">{rfq.deliveryLocation}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                  <div>
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Payment Terms</p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">{rfq.paymentTerms}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                  <div>
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Warranty Requirements</p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">{rfq.warrantyRequirements}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                  <div>
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Special Conditions</p>
                    <ul className="mt-1 space-y-1">
                      {rfq.specialConditions.map((cond, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                          <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-zinc-400" />
                          {cond}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column — Actions + Checklist */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={handleSubmit}
                  disabled={submitting || submitted}
                  className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-all ${
                    submitted
                      ? "bg-emerald-500 cursor-default"
                      : submitting
                        ? "bg-indigo-400 cursor-wait"
                        : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {submitting ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : submitted ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {submitting ? "Submitting..." : submitted ? "Quotation Submitted" : "Submit Quotation"}
                </button>

                <button
                  onClick={() => setSaved(!saved)}
                  className={`flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                    saved
                      ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400"
                      : "border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                >
                  <Bookmark className={`h-4 w-4 ${saved ? "fill-amber-500" : ""}`} />
                  {saved ? "Saved" : "Save RFQ"}
                </button>

                <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  <Download className="h-4 w-4" />
                  Download RFQ PDF
                </button>

                <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800">
                  <MessageSquare className="h-4 w-4" />
                  Ask Clarification
                </button>
              </div>
            </div>

            {/* Bid Readiness Checklist */}
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Bid Readiness</h2>
                {allChecked && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <CheckCircle className="h-3 w-3" /> Ready
                  </span>
                )}
              </div>
              <div className="space-y-3">
                {checklistItems.map((item) => {
                  const checked = checklist[item.id]
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleChecklist(item.id)}
                      className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-xs font-medium transition-colors ${
                        checked
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400"
                          : "border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {checked ? (
                        <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                      ) : (
                        <item.icon className="h-4 w-4 shrink-0 text-zinc-400" />
                      )}
                      {item.label}
                    </button>
                  )
                })}
              </div>
              {allChecked && !submitted && (
                <p className="mt-3 text-center text-xs text-emerald-600 dark:text-emerald-400">
                  You're ready to bid! Click Submit Quotation above.
                </p>
              )}
              {Object.keys(checklist).length > 0 && !allChecked && (
                <p className="mt-3 text-center text-xs text-zinc-400">
                  {Object.keys(checklist).length}/{checklistItems.length} checked
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
