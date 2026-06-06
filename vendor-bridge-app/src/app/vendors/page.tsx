"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  Search,
  SlidersHorizontal,
  Eye,
  ChevronDown,
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
  Edit,
  Download,
  Shield,
  CheckCircle2,
} from "lucide-react"
import Link from "next/link"

type VendorStatus = "Active" | "Inactive" | "Under Review"

interface Vendor {
  id: string
  name: string
  category: string
  contactPerson: string
  email: string
  phone: string
  location: string
  status: VendorStatus
  rating: number
  totalContracts: number
  totalSpend: number
  since: string
}

const mockVendors: Vendor[] = [
  { id: "V-001", name: "TechSolutions Inc.", category: "IT Hardware & Software", contactPerson: "Sarah Chen", email: "sarah@techsolutions.com", phone: "+1 (555) 123-4567", location: "San Francisco, CA", status: "Active", rating: 4.8, totalContracts: 24, totalSpend: 1250000, since: "2022-03-15" },
  { id: "V-002", name: "BuildRight Construction", category: "Construction & Infrastructure", contactPerson: "Mike Rodriguez", email: "mike@buildright.com", phone: "+1 (555) 234-5678", location: "Houston, TX", status: "Active", rating: 4.2, totalContracts: 18, totalSpend: 3400000, since: "2021-08-01" },
  { id: "V-003", name: "Acme Corp", category: "Office Supplies & Stationery", contactPerson: "Jane Doe", email: "jane@acmecorp.com", phone: "+1 (555) 345-6789", location: "Chicago, IL", status: "Active", rating: 4.0, totalContracts: 42, totalSpend: 890000, since: "2020-01-10" },
  { id: "V-004", name: "ServicePro Ltd.", category: "Facility Management", contactPerson: "David Kim", email: "david@servicepro.com", phone: "+1 (555) 456-7890", location: "Atlanta, GA", status: "Under Review", rating: 3.5, totalContracts: 7, totalSpend: 320000, since: "2024-06-01" },
  { id: "V-005", name: "Global Supplies Co.", category: "Logistics & Shipping", contactPerson: "Priya Sharma", email: "priya@globalsupplies.com", phone: "+1 (555) 567-8901", location: "Miami, FL", status: "Active", rating: 4.6, totalContracts: 31, totalSpend: 2100000, since: "2019-11-20" },
  { id: "V-006", name: "OfficeMax Supplies", category: "Office Supplies & Stationery", contactPerson: "Tom Wilson", email: "tom@officemax.com", phone: "+1 (555) 678-9012", location: "Dallas, TX", status: "Inactive", rating: 3.8, totalContracts: 5, totalSpend: 85000, since: "2024-01-15" },
  { id: "V-007", name: "CloudSync Technologies", category: "Cloud Services & SaaS", contactPerson: "Aisha Patel", email: "aisha@cloudsync.io", phone: "+1 (555) 789-0123", location: "Seattle, WA", status: "Active", rating: 4.9, totalContracts: 15, totalSpend: 720000, since: "2023-05-01" },
]

const statusStyles: Record<VendorStatus, string> = {
  Active: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  Inactive: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
  "Under Review": "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
}

const categories = [...new Set(mockVendors.map((v) => v.category))]
const statuses: VendorStatus[] = ["Active", "Inactive", "Under Review"]

export default function VendorListPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<VendorStatus | "All">("All")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [ratingFilter, setRatingFilter] = useState<number | "All">("All")
  const [showFilters, setShowFilters] = useState(false)
  const [actionMenu, setActionMenu] = useState<string | null>(null)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return mockVendors.filter((v) => {
      if (search && !v.name.toLowerCase().includes(search.toLowerCase()) && !v.id.toLowerCase().includes(search.toLowerCase()) && !v.contactPerson.toLowerCase().includes(search.toLowerCase())) return false
      if (statusFilter !== "All" && v.status !== statusFilter) return false
      if (categoryFilter !== "All" && v.category !== categoryFilter) return false
      if (ratingFilter !== "All" && v.rating < ratingFilter) return false
      return true
    })
  }, [search, statusFilter, categoryFilter, ratingFilter])

  function showAction(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(null), 2500)
  }

  const detail = mockVendors.find((v) => v.id === detailId)

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Vendors</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{mockVendors.length} vendors registered</p>
          </div>
          <button onClick={() => showAction("Vendor registration form opened")}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
            <Plus className="h-4 w-4" /> Register Vendor
          </button>
        </div>

        {actionMsg && (
          <div className="mb-4 rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{actionMsg}</div>
        )}

        {/* Summary Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center gap-2 text-emerald-600"><UserCheck className="h-4 w-4" /><span className="text-xs font-medium">Active</span></div>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{mockVendors.filter((v) => v.status === "Active").length}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center gap-2 text-zinc-400"><UserX className="h-4 w-4" /><span className="text-xs font-medium">Inactive</span></div>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{mockVendors.filter((v) => v.status === "Inactive").length}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center gap-2 text-amber-600"><Shield className="h-4 w-4" /><span className="text-xs font-medium">Under Review</span></div>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{mockVendors.filter((v) => v.status === "Under Review").length}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center gap-2 text-indigo-600"><BarChart3 className="h-4 w-4" /><span className="text-xs font-medium">Avg Rating</span></div>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{(mockVendors.reduce((s, v) => s + v.rating, 0) / mockVendors.length).toFixed(1)} ★</p>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID, or contact..."
              className="w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${showFilters ? "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300" : "border-zinc-300 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"}`}>
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="mb-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">Status</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as VendorStatus | "All")}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
                  <option value="All">All</option>
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">Category</label>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
                  <option value="All">All Categories</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">Min Rating</label>
                <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value === "All" ? "All" : parseFloat(e.target.value))}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
                  <option value="All">Any Rating</option>
                  <option value="4">4+ ★</option>
                  <option value="3">3+ ★</option>
                  <option value="2">2+ ★</option>
                </select>
              </div>
              <button onClick={() => { setStatusFilter("All"); setCategoryFilter("All"); setRatingFilter("All") }}
                className="rounded-lg px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-700">Clear</button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Rating</th>
                <th className="px-4 py-3 text-right">Contracts</th>
                <th className="px-4 py-3 text-right">Total Spend</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-zinc-400">
                    <Building2 className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    No vendors found
                  </td>
                </tr>
              ) : (
                filtered.map((v) => (
                  <tr key={v.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                          {v.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-zinc-800 dark:text-zinc-200">{v.name}</p>
                          <p className="text-xs text-zinc-400">{v.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{v.category}</td>
                    <td className="px-4 py-3">
                      <p className="text-zinc-700 dark:text-zinc-300">{v.contactPerson}</p>
                      <p className="text-xs text-zinc-400">{v.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[v.status]}`}>{v.status}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-500">
                        <Star className="h-3.5 w-3.5 fill-amber-400" /> {v.rating}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-400">{v.totalContracts}</td>
                    <td className="px-4 py-3 text-right font-medium text-zinc-800 dark:text-zinc-200">${(v.totalSpend / 1000).toFixed(0)}k</td>
                    <td className="relative px-4 py-3 text-right">
                      <button onClick={() => setActionMenu(actionMenu === v.id ? null : v.id)}
                        className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300">
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      {actionMenu === v.id && (
                        <div className="absolute right-4 top-10 z-10 w-48 rounded-xl border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                          <button onClick={() => { setActionMenu(null); setDetailId(v.id) }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800">
                            <Eye className="h-4 w-4" /> View Profile
                          </button>
                          <button onClick={() => { setActionMenu(null); showAction(`Editing ${v.name}...`) }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800">
                            <Edit className="h-4 w-4" /> Edit
                          </button>
                          <button onClick={() => { setActionMenu(null); showAction(`Report for ${v.name} generated`) }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800">
                            <Download className="h-4 w-4" /> Export Report
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            <div className="sticky top-0 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-700 dark:bg-zinc-900">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{detail.name}</h2>
                <p className="text-sm text-zinc-400">{detail.id} &middot; {detail.category}</p>
              </div>
              <button onClick={() => setDetailId(null)} className="rounded-lg p-1 text-zinc-400 hover:text-zinc-600"><XCircle className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-100 text-lg font-bold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                  {detail.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[detail.status]}`}>{detail.status}</span>
                    <span className="inline-flex items-center gap-1 text-sm text-amber-500"><Star className="h-4 w-4 fill-amber-400" /> {detail.rating}</span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-500">Partner since {detail.since}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900">
                  <Mail className="h-4 w-4 text-zinc-400" />
                  <div><p className="text-xs text-zinc-400">Email</p><p className="text-sm text-zinc-700 dark:text-zinc-300">{detail.email}</p></div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900">
                  <Phone className="h-4 w-4 text-zinc-400" />
                  <div><p className="text-xs text-zinc-400">Phone</p><p className="text-sm text-zinc-700 dark:text-zinc-300">{detail.phone}</p></div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 sm:col-span-2 dark:border-zinc-700 dark:bg-zinc-900">
                  <MapPin className="h-4 w-4 text-zinc-400" />
                  <div><p className="text-xs text-zinc-400">Location</p><p className="text-sm text-zinc-700 dark:text-zinc-300">{detail.location}</p></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center dark:border-zinc-700 dark:bg-zinc-900">
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{detail.totalContracts}</p>
                  <p className="text-xs text-zinc-500">Contracts</p>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center dark:border-zinc-700 dark:bg-zinc-900">
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">${(detail.totalSpend / 1000).toFixed(0)}k</p>
                  <p className="text-xs text-zinc-500">Total Spend</p>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center dark:border-zinc-700 dark:bg-zinc-900">
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{detail.rating}</p>
                  <p className="text-xs text-zinc-500">Rating</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-700">
                <button onClick={() => { setDetailId(null); showAction(`Viewing contracts for ${detail.name}...`) }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                  <FileText className="h-4 w-4" /> View Contracts
                </button>
                <button onClick={() => { setDetailId(null); showAction(`Performance report for ${detail.name} generated`) }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  <BarChart3 className="h-4 w-4" /> Performance Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
