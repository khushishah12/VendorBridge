"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
  ArrowLeft,
  ArrowRight,
  Sparkles,
  FileText,
  List,
  UserPlus
} from "lucide-react"

import DashboardLayout from "@/components/layout/DashboardLayout"
import Confetti from "@/components/ui/Confetti"

type Priority = "Low" | "Medium" | "High"
type VendorMode = "manual" | "category" | "all"
type Step = 1 | 2 | 3 | 4 | 5

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

const UNITS = ["pcs", "kg", "g", "m", "m²", "m³", "L", "box", "set", "pair", "roll", "pack"]
const CATEGORIES = ["IT Hardware & Software", "Cloud Services & SaaS", "Construction & Infrastructure", "Logistics & Shipping", "Facility Management", "Office Supplies & Stationery"]
const VENDOR_LIST = [
  "Acme Corp", "TechSolutions Inc.", "Global Supplies Co.", "BuildRight Construction",
  "ServicePro Ltd.", "CloudSync Technologies", "OfficeMax Supplies",
]

function generateRfqId(): string {
  const year = new Date().getFullYear()
  const num = String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0")
  return `RFQ-${year}-${num}`
}

export default function CreateRfqPageMirror() {
  const [step, setStep] = useState<Step>(1)
  const [rfqId] = useState(generateRfqId)
  
  // Step 1: RFQ Info
  const [title, setTitle] = useState("")
  const [department, setDepartment] = useState("")
  const [priority, setPriority] = useState<Priority>("Medium")
  const [submissionDeadline, setSubmissionDeadline] = useState("")
  const [deliveryDate, setDeliveryDate] = useState("")

  // Step 2: Line Items
  const [items, setItems] = useState<LineItem[]>([
    { id: crypto.randomUUID(), name: "", description: "", quantity: 1, unit: "pcs", expectedPrice: null },
  ])

  // Step 3: Vendor Assignment
  const [vendorMode, setVendorMode] = useState<VendorMode>("manual")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedVendors, setSelectedVendors] = useState<string[]>([])
  const [vendorDropdownOpen, setVendorDropdownOpen] = useState(false)

  // Step 4: Attachments & Terms
  const [files, setFiles] = useState<AttachedFile[]>([])
  const [paymentTerms, setPaymentTerms] = useState("")
  const [deliveryConditions, setDeliveryConditions] = useState("")
  const [warrantyRequirements, setWarrantyRequirements] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Submit state
  const [submitted, setSubmitted] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  // Load Auto-Saved Drafts
  useEffect(() => {
    const draft = localStorage.getItem("vb_draft_rfq")
    if (draft) {
      try {
        const parsed = JSON.parse(draft)
        setTitle(parsed.title || "")
        setDepartment(parsed.department || "")
        setPriority(parsed.priority || "Medium")
        setSubmissionDeadline(parsed.submissionDeadline || "")
        setDeliveryDate(parsed.deliveryDate || "")
        if (parsed.items && parsed.items.length > 0) setItems(parsed.items)
        setVendorMode(parsed.vendorMode || "manual")
        setSelectedCategory(parsed.selectedCategory || "")
        setSelectedVendors(parsed.selectedVendors || [])
        setPaymentTerms(parsed.paymentTerms || "")
        setDeliveryConditions(parsed.deliveryConditions || "")
        setWarrantyRequirements(parsed.warrantyRequirements || "")
      } catch (e) {}
    }
  }, [])

  // Auto-Save Drafts on field change
  useEffect(() => {
    if (title || department) {
      const draftData = {
        title, department, priority, submissionDeadline, deliveryDate,
        items, vendorMode, selectedCategory, selectedVendors,
        paymentTerms, deliveryConditions, warrantyRequirements
      }
      localStorage.setItem("vb_draft_rfq", JSON.stringify(draftData))
    }
  }, [title, department, priority, submissionDeadline, deliveryDate, items, vendorMode, selectedCategory, selectedVendors, paymentTerms, deliveryConditions, warrantyRequirements])

  function addItem() {
    setItems([...items, { id: crypto.randomUUID(), name: "", description: "", quantity: 1, unit: "pcs", expectedPrice: null },
    ])
  }

  function removeItem(id: string) {
    if (items.length > 1) setItems(items.filter((i) => i.id !== id))
  }

  function updateItem(id: string, field: keyof LineItem, value: any) {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)))
  }

  function toggleVendor(v: string) {
    setSelectedVendors((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
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
  }

  function removeFile(id: string) {
    setFiles(files.filter((f) => f.id !== id))
  }

  function validateStep(s: Step): boolean {
    const errs: string[] = []
    if (s === 1) {
      if (!title.trim()) errs.push("RFQ Title is required")
      if (!department.trim()) errs.push("Department is required")
      if (!submissionDeadline) errs.push("Submission deadline is required")
      if (!deliveryDate) errs.push("Expected delivery date is required")
    }
    if (s === 2) {
      if (items.some((i) => !i.name.trim())) errs.push("All line items must have a name")
      if (items.some((i) => i.quantity < 1)) errs.push("Item quantities must be at least 1")
    }
    if (s === 3) {
      if (vendorMode === "manual" && selectedVendors.length === 0) errs.push("Select at least one vendor to broadcast this RFQ")
      if (vendorMode === "category" && !selectedCategory) errs.push("Select a vendor category")
    }
    setErrors(errs)
    return errs.length === 0
  }

  function handleNext() {
    if (validateStep(step)) {
      setStep((s) => (s + 1) as Step)
    }
  }

  function handlePrev() {
    setStep((s) => (s - 1) as Step)
  }

  function handleSaveDraft() {
    setSavingDraft(true)
    setTimeout(() => {
      setSavingDraft(false)
      alert("Draft saved to workspace successfully!")
    }, 1000)
  }

  function handleSubmitRfq() {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      alert("Please correct fields in previous steps.")
      return
    }

    setSubmitted(true)
    localStorage.removeItem("vb_draft_rfq")

    try {
      const activeRfqs = JSON.parse(localStorage.getItem("vb_active_rfqs") || "[]")
      const newRfq = {
        id: rfqId,
        title,
        department,
        priority,
        status: "Open",
        deadline: submissionDeadline,
        delivery: deliveryDate,
        itemsCount: items.length,
        vendorsCount: vendorMode === "manual" ? selectedVendors.length : vendorMode === "category" ? 5 : VENDOR_LIST.length,
      }
      activeRfqs.unshift(newRfq)
      localStorage.setItem("vb_active_rfqs", JSON.stringify(activeRfqs))

      const notifyEvent = new CustomEvent("vb-event-pulse", {
        detail: { title: "RFQ Broadcasted", message: `RFQ ${rfqId} has been successfully broadcast to vendors.`, type: "rfq" }
      })
      window.dispatchEvent(notifyEvent)
    } catch (e) {}

    setTimeout(() => {
      window.location.href = "/procurement/rfqs"
    }, 3500)
  }

  return (
    <DashboardLayout>
      <Confetti active={submitted} />

      <div className="mx-auto max-w-4xl space-y-8 pb-16">
        <div className="flex items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Create Procurement Mission
            </h1>
            <p className="mt-1.5 text-sm text-zinc-500 dark:text-cyan-400 font-medium">
              Let&apos;s source the best vendor for your organization.
            </p>
          </div>
          <button
            onClick={handleSaveDraft}
            disabled={savingDraft || submitted}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-350 dark:border-zinc-800 bg-transparent px-4 py-2.5 text-xs font-bold hover:bg-zinc-900 transition-colors"
          >
            {savingDraft ? "Saving..." : "Save Draft"}
          </button>
        </div>

        {errors.length > 0 && (
          <div className="rounded-2xl border border-red-500/20 bg-red-950/20 p-4 flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider">Required Field Actions</h4>
              <ul className="mt-1.5 list-inside list-disc text-xs text-red-300 space-y-0.5">
                {errors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          </div>
        )}

        {!submitted && (
          <div className="flex justify-between items-center w-full select-none bg-zinc-950/40 rounded-2xl border border-zinc-800/40 p-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold ${
                    step === s
                      ? "border-cyan-400 bg-cyan-950/40 text-cyan-400"
                      : step > s
                      ? "border-emerald-500 bg-emerald-950/20 text-emerald-400"
                      : "border-zinc-800 text-zinc-650"
                  }`}
                >
                  {s}
                </div>
                <span className={`text-xs font-bold hidden md:inline uppercase tracking-wider ${step === s ? "text-cyan-400" : "text-zinc-500"}`}>
                  {s === 1 ? "Info" : s === 2 ? "Items" : s === 3 ? "Vendors" : s === 4 ? "Attachments" : "Review"}
                </span>
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-3xl border border-emerald-500/20 bg-emerald-950/20 p-8 text-center space-y-6"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-pulse">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-emerald-400">RFQ Published Successfully!</h2>
                <p className="text-sm text-zinc-400 max-w-md mx-auto">
                  RFQ {rfqId} has been successfully broadcast to vendors. Redirecting to workspace dashboard...
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-8 shadow-md"
            >
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-cyan-400" /> RFQ Information
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1.5">RFQ Title *</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. GPU Infrastructure Procurement"
                        className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm focus:border-cyan-500 outline-none text-zinc-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1.5">Department / Project *</label>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="e.g. IT Department"
                        className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm focus:border-cyan-500 outline-none text-zinc-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1.5">Priority</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["Low", "Medium", "High"].map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setPriority(p as Priority)}
                            className={`rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                              priority === p
                                ? "border-cyan-500 bg-cyan-950/20 text-cyan-400"
                                : "border-zinc-300 dark:border-zinc-800 text-zinc-500"
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1.5">Submission Deadline *</label>
                      <input
                        type="date"
                        value={submissionDeadline}
                        onChange={(e) => setSubmissionDeadline(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm focus:border-cyan-500 outline-none text-zinc-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1.5">Expected Delivery Date *</label>
                      <input
                        type="date"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm focus:border-cyan-500 outline-none text-zinc-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <List className="h-5 w-5 text-cyan-400" /> Products & Quantities
                    </h3>
                    <button
                      onClick={addItem}
                      className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 border border-cyan-500/20 bg-cyan-500/5 rounded-lg px-3 py-1.5 hover:bg-cyan-500/10 transition-colors"
                    >
                      <Plus className="h-4 w-4" /> Add Item
                    </button>
                  </div>

                  <div className="space-y-4">
                    {items.map((item, idx) => (
                      <div key={item.id} className="flex flex-wrap gap-3 items-end border-b border-zinc-100 dark:border-zinc-900 pb-4 last:border-0 last:pb-0">
                        <div className="flex-1 min-w-[200px] space-y-1">
                          <label className="text-[10px] uppercase font-bold text-zinc-500">Item Name *</label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateItem(item.id, "name", e.target.value)}
                            placeholder="e.g. NVIDIA H100 GPU"
                            className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm focus:border-cyan-500 outline-none"
                          />
                        </div>
                        <div className="w-20 space-y-1">
                          <label className="text-[10px] uppercase font-bold text-zinc-500">Qty *</label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, "quantity", Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm focus:border-cyan-500 outline-none"
                          />
                        </div>
                        <div className="w-24 space-y-1">
                          <label className="text-[10px] uppercase font-bold text-zinc-500">Unit</label>
                          <select
                            value={item.unit}
                            onChange={(e) => updateItem(item.id, "unit", e.target.value)}
                            className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2.5 text-sm focus:border-cyan-500 outline-none"
                          >
                            {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                          </select>
                        </div>
                        <div className="w-28 space-y-1">
                          <label className="text-[10px] uppercase font-bold text-zinc-500">Est. Price</label>
                          <input
                            type="number"
                            min="0"
                            placeholder="Optional"
                            value={item.expectedPrice ?? ""}
                            onChange={(e) => updateItem(item.id, "expectedPrice", e.target.value ? parseFloat(e.target.value) : null)}
                            className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm focus:border-cyan-500 outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          disabled={items.length === 1}
                          className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-2.5 text-zinc-400 hover:text-red-500 disabled:opacity-30"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-cyan-400" /> Vendor Assignment
                  </h3>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { mode: "manual", label: "Select Manually" },
                      { mode: "category", label: "By Category" },
                      { mode: "all", label: "Invite All" },
                    ].map((opt) => (
                      <button
                        key={opt.mode}
                        type="button"
                        onClick={() => setVendorMode(opt.mode as VendorMode)}
                        className={`rounded-xl border py-3.5 text-xs font-bold transition-all ${
                          vendorMode === opt.mode
                            ? "border-cyan-500 bg-cyan-950/20 text-cyan-400"
                            : "border-zinc-300 dark:border-zinc-800 text-zinc-550"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {vendorMode === "manual" && (
                    <div className="relative">
                      <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1.5">Select Specific Vendors *</label>
                      <button
                        type="button"
                        onClick={() => setVendorDropdownOpen(!vendorDropdownOpen)}
                        className="flex w-full items-center justify-between rounded-xl border border-zinc-300 dark:border-zinc-800 px-4 py-2.5 text-sm bg-transparent"
                      >
                        <span>
                          {selectedVendors.length === 0
                            ? "Choose vendors from listing..."
                            : `${selectedVendors.length} vendor(s) selected`}
                        </span>
                        <ChevronDown className="h-4 w-4 text-zinc-500" />
                      </button>
                      {vendorDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2 shadow-lg max-h-48 overflow-y-auto">
                          {VENDOR_LIST.map((v) => (
                            <label
                              key={v}
                              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-sm"
                            >
                              <input
                                type="checkbox"
                                checked={selectedVendors.includes(v)}
                                onChange={() => toggleVendor(v)}
                                className="rounded border-zinc-850 text-cyan-500 focus:ring-cyan-500/20"
                              />
                              <span>{v}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {selectedVendors.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {selectedVendors.map((v) => (
                            <span
                              key={v}
                              className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 px-3 py-0.5 text-xs font-semibold text-cyan-400 border border-cyan-500/20"
                            >
                              {v}
                              <button type="button" onClick={() => toggleVendor(v)} className="hover:text-cyan-200"><X className="h-3 w-3" /></button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {vendorMode === "category" && (
                    <div>
                      <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1.5">Select Supplier Segment Category *</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2.5 text-sm focus:border-cyan-500 outline-none text-zinc-850 dark:text-white"
                      >
                        <option value="">— Choose Category Segment —</option>
                        {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                  )}

                  {vendorMode === "all" && (
                    <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-4 text-xs text-cyan-400 leading-relaxed">
                      This RFQ will be broadcasted to **all** approved suppliers registered in your VendorBridge ecosystem.
                    </div>
                  )}
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Upload className="h-5 w-5 text-cyan-400" /> Documents & Terms
                  </h3>

                  <div className="space-y-4">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-zinc-350 dark:border-zinc-800 rounded-2xl p-6 text-center cursor-pointer hover:border-cyan-500 hover:bg-cyan-500/5 transition-all"
                    >
                      <Upload className="mx-auto mb-2 h-8 w-8 text-zinc-500" />
                      <p className="text-sm font-bold">Upload Specifications Documents</p>
                      <p className="text-xs text-zinc-500 mt-1">PDF, Excel sheets, images - max 10MB</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </div>

                    {files.length > 0 && (
                      <div className="space-y-2">
                        {files.map((file) => (
                          <div
                            key={file.id}
                            className="flex justify-between items-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 px-3 py-2 text-xs"
                          >
                            <span className="font-semibold">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeFile(file.id)}
                              className="text-zinc-500 hover:text-red-500"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="grid gap-3">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1.5">Payment Terms</label>
                        <input
                          type="text"
                          value={paymentTerms}
                          onChange={(e) => setPaymentTerms(e.target.value)}
                          placeholder="e.g. Net 30, 50% advance, milestone billing"
                          className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm focus:border-cyan-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1.5">Delivery Conditions</label>
                        <input
                          type="text"
                          value={deliveryConditions}
                          onChange={(e) => setDeliveryConditions(e.target.value)}
                          placeholder="e.g. Delivery within 14 days"
                          className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm focus:border-cyan-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-cyan-400" /> Review & Publish RFQ
                  </h3>

                  <div className="rounded-2xl border border-zinc-300 dark:border-zinc-800 p-5 space-y-4 bg-zinc-900/10">
                    <div className="flex justify-between items-start border-b border-zinc-100 dark:border-zinc-905 pb-3">
                      <div>
                        <h4 className="text-lg font-bold text-zinc-900 dark:text-white">{title || "GPU Procurement"}</h4>
                        <p className="text-xs text-zinc-450">{rfqId} &middot; Dept: {department}</p>
                      </div>
                      <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-0.5 text-xs font-bold text-amber-400">
                        {priority} Priority
                      </span>
                    </div>

                    <div className="text-xs grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-zinc-400 font-bold">Submission Deadline</p>
                        <p className="text-zinc-700 dark:text-zinc-200 mt-0.5">{submissionDeadline}</p>
                      </div>
                      <div>
                        <p className="text-zinc-400 font-bold">Expected Delivery</p>
                        <p className="text-zinc-700 dark:text-zinc-200 mt-0.5">{deliveryDate}</p>
                      </div>
                    </div>

                    <div className="border-t border-dashed border-zinc-800 pt-3">
                      <p className="text-xs font-bold text-zinc-400 mb-2">Line Items ({items.length})</p>
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="text-zinc-550 border-b border-zinc-800">
                            <th className="pb-1">Product Name</th>
                            <th className="pb-1 text-center">Qty</th>
                            <th className="pb-1 text-right">Est. Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((i) => (
                            <tr key={i.id} className="border-b border-zinc-900">
                              <td className="py-2 text-zinc-800 dark:text-zinc-200 font-medium">{i.name}</td>
                              <td className="py-2 text-center">{i.quantity} {i.unit}</td>
                              <td className="py-2 text-right">{i.expectedPrice ? `$${i.expectedPrice}` : "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="border-t border-dashed border-zinc-800 pt-3 text-xs">
                      <p className="text-zinc-400 font-bold">Invited Suppliers</p>
                      <p className="text-zinc-700 dark:text-zinc-200 mt-0.5">
                        {vendorMode === "manual"
                          ? selectedVendors.join(", ") || "No vendors selected"
                          : vendorMode === "category"
                          ? `All suppliers in category: "${selectedCategory}"`
                          : "Invite all approved suppliers"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-900">
                {step > 1 ? (
                  <button
                    onClick={handlePrev}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 dark:border-zinc-800 px-5 py-2.5 text-xs font-bold hover:bg-zinc-900 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" /> Previous Step
                  </button>
                ) : (
                  <div />
                )}

                {step < 5 ? (
                  <button
                    onClick={handleNext}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-650 to-cyan-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:scale-[1.01] transition-all"
                  >
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitRfq}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-650 to-cyan-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:scale-[1.01] transition-all"
                  >
                    <Send className="h-4 w-4" /> Broadcast Sourcing Mission
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </DashboardLayout>
  )
}
