"use client"

import { useState, useRef } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  Plus,
  Trash2,
  Send,
  Save,
  Eye,
  Upload,
  X,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowLeft,
} from "lucide-react"

type Priority = "Low" | "Medium" | "High"
type VendorMode = "manual" | "category" | "all"
type RfqStatus = "draft" | "sent"

interface LineItem {
  id: string
  name: string
  description: string
  quantity: number
  unit: string
  expectedPrice: number | null
}

interface AttachedFile {
  id: string
  name: string
  size: number
  type: string
}

const units = ["pcs", "kg", "g", "m", "m²", "m³", "L", "box", "set", "pair", "roll", "pack"]
const categories = ["IT", "Construction", "Services", "Office Supplies", "Furniture", "Medical", "Automotive"]
const vendorList = [
  "Acme Corp", "TechSolutions Inc.", "Global Supplies Co.", "BuildRight Construction",
  "ServicePro Ltd.", "MedEquip Distributors", "AutoParts Direct", "OfficeMax Supplies",
]

function generateRfqId(): string {
  const year = new Date().getFullYear()
  const num = String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0")
  return `RFQ-${year}-${num}`
}

export default function CreateRfqPage() {
  const [title, setTitle] = useState("")
  const [rfqId] = useState(generateRfqId)
  const [department, setDepartment] = useState("")
  const [priority, setPriority] = useState<Priority>("Medium")

  const [items, setItems] = useState<LineItem[]>([
    { id: crypto.randomUUID(), name: "", description: "", quantity: 1, unit: "pcs", expectedPrice: null },
  ])

  const [vendorMode, setVendorMode] = useState<VendorMode>("manual")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedVendors, setSelectedVendors] = useState<string[]>([])
  const [vendorDropdownOpen, setVendorDropdownOpen] = useState(false)

  const [createdDate] = useState(new Date().toISOString().split("T")[0])
  const [submissionDeadline, setSubmissionDeadline] = useState("")
  const [deliveryDate, setDeliveryDate] = useState("")

  const [files, setFiles] = useState<AttachedFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [paymentTerms, setPaymentTerms] = useState("")
  const [deliveryConditions, setDeliveryConditions] = useState("")
  const [warrantyRequirements, setWarrantyRequirements] = useState("")

  const [status, setStatus] = useState<RfqStatus | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [showPreview, setShowPreview] = useState(false)

  function addItem() {
    setItems([...items, { id: crypto.randomUUID(), name: "", description: "", quantity: 1, unit: "pcs", expectedPrice: null }])
  }

  function removeItem(id: string) {
    if (items.length > 1) setItems(items.filter((i) => i.id !== id))
  }

  function updateItem(id: string, field: keyof LineItem, value: string | number | null) {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)))
  }

  function toggleVendor(v: string) {
    setSelectedVendors((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
    )
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files
    if (!fileList) return
    for (const file of Array.from(fileList)) {
      setFiles((prev) => [
        ...prev,
        { id: crypto.randomUUID(), name: file.name, size: file.size, type: file.type },
      ])
    }
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function removeFile(id: string) {
    setFiles(files.filter((f) => f.id !== id))
  }

  function validate(): boolean {
    const errs: string[] = []
    if (!title.trim()) errs.push("RFQ Title is required")
    if (!department.trim()) errs.push("Department is required")
    if (items.some((i) => !i.name.trim())) errs.push("All items must have a name")
    if (items.some((i) => i.quantity < 1)) errs.push("Item quantities must be at least 1")
    if (vendorMode === "manual" && selectedVendors.length === 0) errs.push("Select at least one vendor")
    if (vendorMode === "category" && !selectedCategory) errs.push("Select a vendor category")
    if (!submissionDeadline) errs.push("Submission deadline is required")
    if (!deliveryDate) errs.push("Expected delivery date is required")
    setErrors(errs)
    return errs.length === 0
  }

  function handleSaveDraft() {
    if (!validate()) return
    setStatus("draft")
  }

  function handleSendRfq() {
    if (!validate()) return
    setStatus("sent")
  }

  const priorityColors: Record<Priority, string> = {
    Low: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
    Medium: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
    High: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800",
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (status === "draft" || status === "sent") {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-2xl py-16 text-center">
          <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${status === "sent" ? "bg-emerald-100 dark:bg-emerald-950/50" : "bg-amber-100 dark:bg-amber-950/50"}`}>
            {status === "sent" ? (
              <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Save className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            RFQ {status === "sent" ? "Sent" : "Saved as Draft"}
          </h2>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            {status === "sent"
              ? `RFQ ${rfqId} has been sent to ${selectedVendors.length} vendor(s).`
              : `RFQ ${rfqId} has been saved as a draft.`}
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <a
              href="/rfqs"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to All RFQs
            </a>
            <button
              onClick={() => { setStatus(null); setShowPreview(false) }}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Create Another
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const formContent = (
    <div className="mx-auto max-w-4xl space-y-8 pb-16">
      {/* Header */}
      <div>
        <a href="/rfqs" className="mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
          <ArrowLeft className="h-4 w-4" /> Back to RFQs
        </a>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Create New RFQ</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Fill in the details below to create a Request for Quotation
        </p>
      </div>

      {/* Validation Errors */}
      {errors.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
          <div className="flex items-center gap-2 text-sm font-medium text-red-700 dark:text-red-400">
            <AlertCircle className="h-4 w-4" /> Please fix the following errors
          </div>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-red-600 dark:text-red-400">
            {errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}

      {/* 1. Basic Info */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Basic Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">RFQ Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='e.g. "Office Laptops Procurement"'
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">RFQ ID</label>
            <input
              type="text"
              value={rfqId}
              readOnly
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Department / Project *</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. IT Department"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Priority</label>
            <div className="flex gap-2">
              {(["Low", "Medium", "High"] as Priority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                    priority === p
                      ? priorityColors[p] + " ring-2 ring-indigo-500/20"
                      : "border-zinc-300 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Item Details */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Item Details</h2>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" /> Add Item
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-xs font-medium uppercase text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                <th className="pb-2 pr-2">Item Name *</th>
                <th className="pb-2 pr-2">Description</th>
                <th className="pb-2 pr-2 w-20">Qty *</th>
                <th className="pb-2 pr-2 w-20">Unit</th>
                <th className="pb-2 pr-2 w-28">Est. Price</th>
                <th className="pb-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="py-2 pr-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(item.id, "name", e.target.value)}
                      placeholder="Item name"
                      className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                      placeholder="Brief description"
                      className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <select
                      value={item.unit}
                      onChange={(e) => updateItem(item.id, "unit", e.target.value)}
                      className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
                    >
                      {units.map((u) => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </td>
                  <td className="py-2 pr-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.expectedPrice ?? ""}
                      onChange={(e) => updateItem(item.id, "expectedPrice", e.target.value ? parseFloat(e.target.value) : null)}
                      placeholder="—"
                      className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
                    />
                  </td>
                  <td className="py-2">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="rounded p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-30 dark:hover:bg-red-950/30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {items.length === 1 && (
          <p className="mt-2 text-xs text-zinc-400">Add at least one item. Click &quot;Add Item&quot; for more rows.</p>
        )}
      </section>

      {/* 3. Vendor Selection */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Vendor Selection</h2>

        <div className="mb-4 flex flex-wrap gap-2">
          {([["manual", "Select Manually"], ["category", "By Category"], ["all", "Invite All Approved"]] as [VendorMode, string][]).map(([mode, label]) => (
            <button
              key={mode}
              type="button"
              onClick={() => setVendorMode(mode)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
                vendorMode === mode
                  ? "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300"
                  : "border-zinc-300 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {vendorMode === "manual" && (
          <div className="relative">
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Select Vendors *</label>
            <button
              type="button"
              onClick={() => setVendorDropdownOpen(!vendorDropdownOpen)}
              className="flex w-full items-center justify-between rounded-lg border border-zinc-300 px-3 py-2 text-sm transition-colors hover:border-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
            >
              <span className={selectedVendors.length === 0 ? "text-zinc-400" : ""}>
                {selectedVendors.length === 0
                  ? "Choose vendors..."
                  : `${selectedVendors.length} vendor(s) selected`}
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${vendorDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {vendorDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                {vendorList.map((v) => (
                  <label
                    key={v}
                    className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  >
                    <input
                      type="checkbox"
                      checked={selectedVendors.includes(v)}
                      onChange={() => toggleVendor(v)}
                      className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    {v}
                  </label>
                ))}
              </div>
            )}
            {selectedVendors.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {selectedVendors.map((v) => (
                  <span
                    key={v}
                    className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                  >
                    {v}
                    <button type="button" onClick={() => toggleVendor(v)} className="hover:text-indigo-900"><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {vendorMode === "category" && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Select Category *</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
            >
              <option value="">— Choose category —</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}

        {vendorMode === "all" && (
          <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
            All approved vendors across all categories will be invited to this RFQ.
          </div>
        )}
      </section>

      {/* 4. Timeline */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Timeline</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Creation Date</label>
            <input
              type="date"
              value={createdDate}
              readOnly
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Submission Deadline *</label>
            <input
              type="date"
              value={submissionDeadline}
              onChange={(e) => setSubmissionDeadline(e.target.value)}
              min={createdDate}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Expected Delivery *</label>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              min={submissionDeadline || createdDate}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
        </div>
      </section>

      {/* 5. Attachments */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Attachments</h2>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 px-4 py-8 transition-colors hover:border-indigo-400 hover:bg-zinc-50 dark:border-zinc-600 dark:hover:border-indigo-500 dark:hover:bg-zinc-900"
        >
          <Upload className="mb-2 h-8 w-8 text-zinc-400" />
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Click to upload files</p>
          <p className="text-xs text-zinc-400">PDF, Excel, images, specs — up to 10MB each</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.xls,.xlsx,.doc,.docx,.png,.jpg,.jpeg,.zip"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
        {files.length > 0 && (
          <div className="mt-3 space-y-2">
            {files.map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
              >
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-white text-xs font-medium text-indigo-600 shadow-sm dark:bg-zinc-800 dark:text-indigo-400">
                    {f.type.includes("pdf") ? "PDF" : f.type.includes("sheet") || f.type.includes("excel") ? "XLS" : "DOC"}
                  </div>
                  <div>
                    <p className="font-medium text-zinc-700 dark:text-zinc-300">{f.name}</p>
                    <p className="text-xs text-zinc-400">{formatFileSize(f.size)}</p>
                  </div>
                </div>
                <button type="button" onClick={() => removeFile(f.id)} className="rounded p-1 text-zinc-400 hover:text-red-500">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 6. Terms & Conditions */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Terms &amp; Conditions</h2>
        <div className="grid gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Payment Terms</label>
            <textarea
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              placeholder="e.g. Net 30, 50% advance, milestone-based..."
              rows={2}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Delivery Conditions</label>
            <textarea
              value={deliveryConditions}
              onChange={(e) => setDeliveryConditions(e.target.value)}
              placeholder="e.g. FOB, EXW, delivery within 30 days..."
              rows={2}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Warranty Requirements</label>
            <textarea
              value={warrantyRequirements}
              onChange={(e) => setWarrantyRequirements(e.target.value)}
              placeholder="e.g. 1-year warranty, on-site support..."
              rows={2}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
        </div>
      </section>

      {/* 7. Actions */}
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <Save className="h-4 w-4" />
            Save as Draft
          </button>
          <button
            type="button"
            onClick={handleSendRfq}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            <Send className="h-4 w-4" />
            Send RFQ to Vendors
          </button>
        </div>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          <Eye className="h-4 w-4" />
          {showPreview ? "Hide Preview" : "Preview RFQ"}
        </button>
      </section>

      {/* Preview Panel */}
      {showPreview && (
        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">RFQ Preview</h2>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-900">
            <div className="mb-6 border-b border-zinc-200 pb-4 dark:border-zinc-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{title || "Untitled RFQ"}</h3>
                  <p className="text-sm text-zinc-500">{rfqId}</p>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-medium ${priorityColors[priority]}`}>
                  {priority}
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Department: {department || "—"}</p>
            </div>

            <div className="mb-6">
              <h4 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Items</h4>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-300 text-left text-xs font-medium text-zinc-500 dark:border-zinc-600">
                    <th className="pb-1 pr-2">#</th>
                    <th className="pb-1 pr-2">Item</th>
                    <th className="pb-1 pr-2">Qty</th>
                    <th className="pb-1 pr-2">Unit</th>
                    <th className="pb-1 text-right">Est. Price</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={item.id} className="border-b border-zinc-200 dark:border-zinc-800">
                      <td className="py-1.5 pr-2 text-zinc-400">{i + 1}</td>
                      <td className="py-1.5 pr-2 font-medium text-zinc-800 dark:text-zinc-200">{item.name || "—"}</td>
                      <td className="py-1.5 pr-2 text-zinc-600">{item.quantity}</td>
                      <td className="py-1.5 pr-2 text-zinc-600">{item.unit}</td>
                      <td className="py-1.5 text-right text-zinc-600">{item.expectedPrice ? `$${item.expectedPrice.toFixed(2)}` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mb-6 grid gap-4 text-sm sm:grid-cols-3">
              <div>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">Created:</span>
                <p className="text-zinc-500">{createdDate}</p>
              </div>
              <div>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">Deadline:</span>
                <p className="text-zinc-500">{submissionDeadline || "—"}</p>
              </div>
              <div>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">Delivery:</span>
                <p className="text-zinc-500">{deliveryDate || "—"}</p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="mb-1 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Vendors</h4>
              <p className="text-sm text-zinc-500">
                {vendorMode === "manual"
                  ? selectedVendors.join(", ") || "None selected"
                  : vendorMode === "category"
                    ? `All vendors in "${selectedCategory}" category`
                    : "All approved vendors"}
              </p>
            </div>

            {(paymentTerms || deliveryConditions || warrantyRequirements) && (
              <div className="space-y-2 text-sm">
                <h4 className="font-semibold text-zinc-700 dark:text-zinc-300">Terms</h4>
                {paymentTerms && <p><span className="font-medium text-zinc-600">Payment:</span> <span className="text-zinc-500">{paymentTerms}</span></p>}
                {deliveryConditions && <p><span className="font-medium text-zinc-600">Delivery:</span> <span className="text-zinc-500">{deliveryConditions}</span></p>}
                {warrantyRequirements && <p><span className="font-medium text-zinc-600">Warranty:</span> <span className="text-zinc-500">{warrantyRequirements}</span></p>}
              </div>
            )}

            {files.length > 0 && (
              <div className="mt-4 text-sm">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">Attachments:</span>
                <p className="text-zinc-500">{files.length} file(s)</p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )

  return <DashboardLayout>{formContent}</DashboardLayout>
}
