"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  Search,
  SlidersHorizontal,
  Building2,
  Star,
  Mail,
  Phone,
  MapPin,
  FileText,
  UserCheck,
  UserX,
  BarChart3,
  Plus,
  Shield,
  XCircle,
  LayoutGrid,
  List
} from "lucide-react"

import ChromaGrid, { VendorItem } from "@/components/ui/ChromaGrid"

const MOCK_VENDORS: VendorItem[] = [
  { id: "V-001", name: "TechSolutions Inc.", category: "IT Hardware & Software", contactPerson: "Sarah Chen", email: "sarah@techsolutions.com", phone: "+1 (555) 123-4567", location: "San Francisco, CA", status: "Active", rating: 4.8, totalSpend: 1250000, rfqSuccessRate: 94 },
  { id: "V-002", name: "BuildRight Construction", category: "Construction & Infrastructure", contactPerson: "Mike Rodriguez", email: "mike@buildright.com", phone: "+1 (555) 234-5678", location: "Houston, TX", status: "Active", rating: 4.2, totalSpend: 3400000, rfqSuccessRate: 85 },
  { id: "V-003", name: "Acme Corp", category: "Office Supplies & Stationery", contactPerson: "Jane Doe", email: "jane@acmecorp.com", phone: "+1 (555) 345-6789", location: "Chicago, IL", status: "Active", rating: 4.0, totalSpend: 890000, rfqSuccessRate: 90 },
  { id: "V-004", name: "ServicePro Ltd.", category: "Facility Management", contactPerson: "David Kim", email: "david@servicepro.com", phone: "+1 (555) 456-7890", location: "Atlanta, GA", status: "Under Review", rating: 3.5, totalSpend: 320000, rfqSuccessRate: 72 },
  { id: "V-005", name: "Global Supplies Co.", category: "Logistics & Shipping", contactPerson: "Priya Sharma", email: "priya@globalsupplies.com", phone: "+1 (555) 567-8901", location: "Miami, FL", status: "Active", rating: 4.6, totalSpend: 2100000, rfqSuccessRate: 88 },
  { id: "V-006", name: "OfficeMax Supplies", category: "Office Supplies & Stationery", contactPerson: "Tom Wilson", email: "tom@officemax.com", phone: "+1 (555) 678-9012", location: "Dallas, TX", status: "Inactive", rating: 3.8, totalSpend: 85000, rfqSuccessRate: 64 },
  { id: "V-007", name: "CloudSync Technologies", category: "Cloud Services & SaaS", contactPerson: "Aisha Patel", email: "aisha@cloudsync.io", phone: "+1 (555) 789-0123", location: "Seattle, WA", status: "Active", rating: 4.9, totalSpend: 720000, rfqSuccessRate: 98 },
]

const STATUS_STYLES: Record<string, string> = {
  Active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Inactive: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  "Under Review": "bg-amber-500/10 text-amber-400 border-amber-500/20",
}

export default function VendorManagementPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null)
  
  // Registration Form Modal
  const [showRegModal, setShowRegModal] = useState(false)
  const [regName, setRegName] = useState("")
  const [regCategory, setRegCategory] = useState("IT Hardware & Software")
  const [regContact, setRegContact] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPhone, setRegPhone] = useState("")
  const [regLocation, setRegLocation] = useState("")

  const [vendorsList, setVendorsList] = useState<VendorItem[]>(MOCK_VENDORS)

  const categories = useMemo(() => {
    return ["All", ...new Set(vendorsList.map((v) => v.category))]
  }, [vendorsList])

  const filteredVendors = useMemo(() => {
    return vendorsList.filter((v) => {
      const matchSearch =
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.id.toLowerCase().includes(search.toLowerCase()) ||
        v.contactPerson.toLowerCase().includes(search.toLowerCase())
      
      const matchStatus = statusFilter === "All" || v.status === statusFilter
      const matchCategory = categoryFilter === "All" || v.category === categoryFilter

      return matchSearch && matchStatus && matchCategory
    })
  }, [vendorsList, search, statusFilter, categoryFilter])

  const activeVendorDetail = useMemo(() => {
    return vendorsList.find((v) => v.id === selectedVendorId)
  }, [vendorsList, selectedVendorId])

  function handleRegisterVendor(e: React.FormEvent) {
    e.preventDefault()
    if (!regName || !regContact || !regEmail) {
      alert("Please fill required fields.")
      return
    }

    const newVendor: VendorItem = {
      id: `V-00${vendorsList.length + 1}`,
      name: regName,
      category: regCategory,
      contactPerson: regContact,
      email: regEmail,
      phone: regPhone || "+1 (555) 000-0000",
      location: regLocation || "Remote",
      status: "Under Review",
      rating: 5.0,
      totalSpend: 0,
      rfqSuccessRate: 100,
    }

    setVendorsList((prev) => [...prev, newVendor])
    setShowRegModal(false)

    // Clear form
    setRegName("")
    setRegContact("")
    setRegEmail("")
    setRegPhone("")
    setRegLocation("")

    alert(`${regName} has been registered and is under review.`)
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Supplier Ecosystem
            </h1>
            <p className="mt-1.5 text-sm text-zinc-500 dark:text-cyan-400 font-medium">
              Build stronger supplier relationships & track real-time SLA metrics.
            </p>
          </div>
          <button
            onClick={() => setShowRegModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-650 to-cyan-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:scale-[1.01] transition-all"
          >
            <Plus className="h-4 w-4" /> Register Vendor
          </button>
        </div>

        {/* Highlight KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/40">
            <div className="flex items-center gap-2 text-emerald-400"><UserCheck className="h-4 w-4" /><span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Active Partners</span></div>
            <p className="mt-2 text-2xl font-black text-zinc-900 dark:text-white">{vendorsList.filter((v) => v.status === "Active").length}</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/40">
            <div className="flex items-center gap-2 text-zinc-400"><UserX className="h-4 w-4" /><span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Inactive</span></div>
            <p className="mt-2 text-2xl font-black text-zinc-900 dark:text-white">{vendorsList.filter((v) => v.status === "Inactive").length}</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/40">
            <div className="flex items-center gap-2 text-amber-400"><Shield className="h-4 w-4" /><span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Under Review</span></div>
            <p className="mt-2 text-2xl font-black text-zinc-900 dark:text-white">{vendorsList.filter((v) => v.status === "Under Review").length}</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/40">
            <div className="flex items-center gap-2 text-indigo-400"><BarChart3 className="h-4 w-4" /><span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Average Rating</span></div>
            <p className="mt-2 text-2xl font-black text-zinc-900 dark:text-white">
              {(vendorsList.reduce((s, v) => s + v.rating, 0) / vendorsList.length).toFixed(1)} ★
            </p>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search vendor name, ID, or contact person..."
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 py-2.5 pl-10 pr-4 text-sm focus:border-cyan-500 focus:outline-none dark:bg-zinc-900/60 dark:text-white"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition-all ${
                showFilters
                  ? "border-cyan-500/30 bg-cyan-950/20 text-cyan-400"
                  : "border-zinc-350 dark:border-zinc-800 text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
          </div>

          {/* Toggle View mode */}
          <div className="flex rounded-xl bg-zinc-100 dark:bg-zinc-900 p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-lg p-2 transition-colors ${viewMode === "grid" ? "bg-white dark:bg-zinc-800 text-cyan-500 shadow-sm" : "text-zinc-400 hover:text-zinc-200"}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-lg p-2 transition-colors ${viewMode === "list" ? "bg-white dark:bg-zinc-800 text-cyan-500 shadow-sm" : "text-zinc-400 hover:text-zinc-200"}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Collapsed Filter Dropdowns */}
        {showFilters && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/40 backdrop-blur-sm">
            <div className="flex flex-wrap items-end gap-6 text-sm">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-400">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="rounded-xl border border-zinc-300 dark:border-zinc-800 px-4 py-2 bg-transparent dark:text-white outline-none"
                >
                  {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-400">SLA Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-zinc-300 dark:border-zinc-800 px-4 py-2 bg-transparent dark:text-white outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Under Review">Under Review</option>
                </select>
              </div>

              <button
                onClick={() => { setCategoryFilter("All"); setStatusFilter("All"); setSearch("") }}
                className="rounded-xl border border-dashed border-zinc-350 dark:border-zinc-800 px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-xs font-bold transition-all"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {/* MAIN VENDOR SHOWCASE VIEWS */}
        {filteredVendors.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 py-16 text-center text-zinc-500">
            <Building2 className="mx-auto mb-3 h-10 w-10 opacity-30 text-cyan-400 animate-pulse" />
            <h4 className="text-sm font-bold text-zinc-400">No Suppliers Found</h4>
            <p className="text-xs text-zinc-500 mt-1">Try refining your keyword query or resetting search filter criteria.</p>
          </div>
        ) : viewMode === "grid" ? (
          <ChromaGrid
            vendors={filteredVendors}
            onSelectVendor={(id) => setSelectedVendorId(id)}
          />
        ) : (
          /* List Mode Table layout */
          <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-md dark:border-zinc-800 dark:bg-zinc-950/40 backdrop-blur-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-left text-xs font-bold uppercase tracking-wider text-zinc-400">
                  <th className="px-5 py-4">Vendor ID</th>
                  <th className="px-5 py-4">Company Name</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Location</th>
                  <th className="px-5 py-4">SLA Rating</th>
                  <th className="px-5 py-4">Success</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                {filteredVendors.map((v) => (
                  <tr
                    key={v.id}
                    onClick={() => setSelectedVendorId(v.id)}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-4 text-xs font-mono font-bold text-cyan-400">{v.id}</td>
                    <td className="px-5 py-4 font-bold text-zinc-800 dark:text-zinc-100">{v.name}</td>
                    <td className="px-5 py-4 text-zinc-500">{v.category}</td>
                    <td className="px-5 py-4 text-zinc-500">{v.location}</td>
                    <td className="px-5 py-4 text-amber-500 font-bold">★ {v.rating.toFixed(1)}</td>
                    <td className="px-5 py-4 font-bold">{v.rfqSuccessRate}%</td>
                    <td className="px-5 py-4">
                      <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${STATUS_STYLES[v.status]}`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300">
                        Profile &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* DETAIL MODAL PANEL */}
      {activeVendorDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedVendorId(null)}
              className="absolute right-6 top-6 rounded-xl border border-zinc-200 dark:border-zinc-800 p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              <XCircle className="h-5 w-5" />
            </button>

            {/* Header profile cards */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-zinc-150 dark:border-zinc-800/80 pb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xl font-bold">
                {activeVendorDetail.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white">{activeVendorDetail.name}</h2>
                  <span className={`rounded-full border px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide ${STATUS_STYLES[activeVendorDetail.status]}`}>
                    {activeVendorDetail.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-400">Category: {activeVendorDetail.category}</p>
              </div>
            </div>

            {/* Contact Grid details */}
            <div className="grid gap-4 sm:grid-cols-2 mt-6">
              <div className="flex items-center gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 px-4 py-3">
                <Mail className="h-4 w-4 text-zinc-400" />
                <div>
                  <p className="text-[9px] uppercase font-bold text-zinc-500">Email Address</p>
                  <p className="text-xs text-zinc-800 dark:text-zinc-200 font-semibold">{activeVendorDetail.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 px-4 py-3">
                <Phone className="h-4 w-4 text-zinc-400" />
                <div>
                  <p className="text-[9px] uppercase font-bold text-zinc-500">Contact Number</p>
                  <p className="text-xs text-zinc-800 dark:text-zinc-200 font-semibold">{activeVendorDetail.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 px-4 py-3 sm:col-span-2">
                <MapPin className="h-4 w-4 text-zinc-400" />
                <div>
                  <p className="text-[9px] uppercase font-bold text-zinc-500">Corporate Address</p>
                  <p className="text-xs text-zinc-800 dark:text-zinc-200 font-semibold">{activeVendorDetail.location}</p>
                </div>
              </div>
            </div>

            {/* Performance Statistics Grid */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 text-center">
                <p className="text-2xl font-black text-zinc-950 dark:text-white">★ {activeVendorDetail.rating.toFixed(1)}</p>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-1">SLA Rating</p>
              </div>

              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 text-center">
                <p className="text-2xl font-black text-zinc-950 dark:text-white">${(activeVendorDetail.totalSpend / 1000).toFixed(0)}k</p>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-1">Total Spend</p>
              </div>

              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 text-center">
                <p className="text-2xl font-black text-zinc-950 dark:text-white">{activeVendorDetail.rfqSuccessRate}%</p>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-1">Success Rate</p>
              </div>
            </div>

            {/* Actions panel */}
            <div className="flex gap-3 border-t border-zinc-100 dark:border-zinc-800/80 pt-6 mt-6">
              <button
                onClick={() => { setSelectedVendorId(null); alert("Opening billing ledger...") }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-2.5 text-xs font-bold text-white shadow-md"
              >
                <FileText className="h-4 w-4" /> View Ledger Invoices
              </button>
              <button
                onClick={() => { setSelectedVendorId(null); alert("Compiling custom SLA performance report...") }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-350 dark:border-zinc-850 px-4 py-2.5 text-xs font-bold text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
              >
                <BarChart3 className="h-4 w-4" /> Performance Reports
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REGISTER VENDOR MODAL */}
      {showRegModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-2xl relative">
            <button
              onClick={() => setShowRegModal(false)}
              className="absolute right-6 top-6 rounded-xl border border-zinc-200 dark:border-zinc-800 p-2 text-zinc-400 hover:bg-zinc-900 transition-all"
            >
              <XCircle className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-zinc-950 dark:text-white flex items-center gap-2 mb-2">
              <Building2 className="h-5 w-5 text-cyan-400" /> New Supplier Registration
            </h3>
            <p className="text-xs text-zinc-400 mb-6">Register a new enterprise partner and initiate audit checks.</p>

            <form onSubmit={handleRegisterVendor} className="space-y-4 text-sm">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-400">Vendor / Company Name *</label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Acme Supplier Corp"
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 outline-none text-zinc-850 dark:text-white focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-400">Category Segment</label>
                <select
                  value={regCategory}
                  onChange={(e) => setRegCategory(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2.5 outline-none text-zinc-850 dark:text-white focus:border-cyan-500"
                >
                  <option value="IT Hardware & Software">IT Hardware & Software</option>
                  <option value="Cloud Services & SaaS">Cloud Services & SaaS</option>
                  <option value="Construction & Infrastructure">Construction & Infrastructure</option>
                  <option value="Logistics & Shipping">Logistics & Shipping</option>
                  <option value="Facility Management">Facility Management</option>
                  <option value="Office Supplies & Stationery">Office Supplies & Stationery</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-400">Contact Person *</label>
                <input
                  type="text"
                  required
                  value={regContact}
                  onChange={(e) => setRegContact(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 outline-none text-zinc-850 dark:text-white focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-zinc-400">Email *</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="email@company.com"
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 outline-none text-zinc-850 dark:text-white focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-zinc-400">Phone</label>
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 outline-none text-zinc-850 dark:text-white focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-400">Location Address</label>
                <input
                  type="text"
                  value={regLocation}
                  onChange={(e) => setRegLocation(e.target.value)}
                  placeholder="e.g. Houston, TX"
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 outline-none text-zinc-850 dark:text-white focus:border-cyan-500"
                />
              </div>

              <div className="flex gap-2 justify-end pt-4 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setShowRegModal(false)}
                  className="rounded-xl border border-zinc-250 dark:border-zinc-850 px-4 py-2 hover:bg-zinc-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-5 py-2 text-white shadow-md"
                >
                  Initiate Check
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
