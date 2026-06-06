"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  ArrowLeft,
  Search,
  Eye,
  Star,
  Mail,
  Phone,
  MapPin,
  Building2,
  FileText,
  BarChart3,
  UserCheck,
  DollarSign,
  Calendar,
  XCircle,
  TrendingUp,
  Award,
} from "lucide-react"
import Link from "next/link"

interface ActiveVendor {
  id: string
  name: string
  category: string
  contactPerson: string
  email: string
  phone: string
  location: string
  rating: number
  totalContracts: number
  totalSpend: number
  since: string
  lastActive: string
  performanceTrend: "up" | "stable" | "down"
}

const mockActive: ActiveVendor[] = [
  { id: "V-001", name: "TechSolutions Inc.", category: "IT Hardware & Software", contactPerson: "Sarah Chen", email: "sarah@techsolutions.com", phone: "+1 (555) 123-4567", location: "San Francisco, CA", rating: 4.8, totalContracts: 24, totalSpend: 1250000, since: "2022-03-15", lastActive: "2025-06-05", performanceTrend: "up" },
  { id: "V-002", name: "BuildRight Construction", category: "Construction & Infrastructure", contactPerson: "Mike Rodriguez", email: "mike@buildright.com", phone: "+1 (555) 234-5678", location: "Houston, TX", rating: 4.2, totalContracts: 18, totalSpend: 3400000, since: "2021-08-01", lastActive: "2025-06-03", performanceTrend: "stable" },
  { id: "V-003", name: "Acme Corp", category: "Office Supplies & Stationery", contactPerson: "Jane Doe", email: "jane@acmecorp.com", phone: "+1 (555) 345-6789", location: "Chicago, IL", rating: 4.0, totalContracts: 42, totalSpend: 890000, since: "2020-01-10", lastActive: "2025-06-06", performanceTrend: "stable" },
  { id: "V-005", name: "Global Supplies Co.", category: "Logistics & Shipping", contactPerson: "Priya Sharma", email: "priya@globalsupplies.com", phone: "+1 (555) 567-8901", location: "Miami, FL", rating: 4.6, totalContracts: 31, totalSpend: 2100000, since: "2019-11-20", lastActive: "2025-06-04", performanceTrend: "up" },
  { id: "V-007", name: "CloudSync Technologies", category: "Cloud Services & SaaS", contactPerson: "Aisha Patel", email: "aisha@cloudsync.io", phone: "+1 (555) 789-0123", location: "Seattle, WA", rating: 4.9, totalContracts: 15, totalSpend: 720000, since: "2023-05-01", lastActive: "2025-06-06", performanceTrend: "up" },
]

const trendStyles: Record<string, string> = {
  up: "text-emerald-600 dark:text-emerald-400",
  stable: "text-zinc-500 dark:text-zinc-400",
  down: "text-red-500 dark:text-red-400",
}

export default function ActiveVendorsPage() {
  const [search, setSearch] = useState("")
  const [detailId, setDetailId] = useState<string | null>(null)
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return mockActive.filter((v) => {
      if (search && !v.name.toLowerCase().includes(search.toLowerCase()) && !v.id.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [search])

  function showAction(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(null), 2500)
  }

  const detail = mockActive.find((v) => v.id === detailId)

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <Link href="/vendors" className="mb-2 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
            <ArrowLeft className="h-4 w-4" /> Back to Vendor List
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Active Vendors</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{mockActive.length} active vendors</p>
        </div>

        {actionMsg && (
          <div className="mb-4 rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{actionMsg}</div>
        )}

        <div className="mb-4 relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search active vendors..."
            className="w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v) => (
            <div key={v.id} className="rounded-xl border border-emerald-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-emerald-800 dark:bg-zinc-950">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-sm font-bold text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                    {v.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{v.name}</h3>
                    <p className="text-xs text-zinc-400">{v.category}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 text-xs font-medium ${trendStyles[v.performanceTrend]}`}>
                  <TrendingUp className="h-3.5 w-3.5" />
                </span>
              </div>

              <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500">
                <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-500" /> {v.rating}</span>
                <span className="inline-flex items-center gap-1"><DollarSign className="h-3 w-3" /> ${(v.totalSpend / 1000).toFixed(0)}k</span>
                <span className="inline-flex items-center gap-1"><FileText className="h-3 w-3" /> {v.totalContracts} deals</span>
              </div>

              <div className="mt-3 space-y-1 text-xs text-zinc-400">
                <p className="flex items-center gap-1"><Mail className="h-3 w-3" /> {v.email}</p>
                <p className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Last active: {v.lastActive}</p>
              </div>

              <div className="mt-4 flex gap-2">
                <button onClick={() => setDetailId(v.id)}
                  className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-700">
                  View Details
                </button>
                <button onClick={() => showAction(`Contacting ${v.name}...`)}
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800">
                  <Mail className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-h-[85vh] w-full max-w-lg rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            <div className="sticky top-0 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-700 dark:bg-zinc-900">
              <div><h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{detail.name}</h2><p className="text-sm text-zinc-400">{detail.id}</p></div>
              <button onClick={() => setDetailId(null)} className="rounded-lg p-1 text-zinc-400 hover:text-zinc-600"><XCircle className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div><p className="text-xs text-zinc-400">Category</p><p className="text-sm text-zinc-700 dark:text-zinc-300">{detail.category}</p></div>
                <div><p className="text-xs text-zinc-400">Rating</p><p className="text-sm text-amber-500"><Star className="inline h-3.5 w-3.5 fill-amber-400" /> {detail.rating}</p></div>
                <div><p className="text-xs text-zinc-400">Contact</p><p className="text-sm text-zinc-700 dark:text-zinc-300">{detail.contactPerson}</p></div>
                <div><p className="text-xs text-zinc-400">Phone</p><p className="text-sm text-zinc-700 dark:text-zinc-300">{detail.phone}</p></div>
                <div className="sm:col-span-2"><p className="text-xs text-zinc-400">Email</p><p className="text-sm text-zinc-700 dark:text-zinc-300">{detail.email}</p></div>
                <div className="sm:col-span-2"><p className="text-xs text-zinc-400">Location</p><p className="text-sm text-zinc-700 dark:text-zinc-300">{detail.location}</p></div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-900">
                  <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{detail.totalContracts}</p>
                  <p className="text-xs text-zinc-500">Contracts</p>
                </div>
                <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-900">
                  <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">${(detail.totalSpend / 1000).toFixed(0)}k</p>
                  <p className="text-xs text-zinc-500">Spend</p>
                </div>
                <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-900">
                  <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{detail.since}</p>
                  <p className="text-xs text-zinc-500">Since</p>
                </div>
              </div>
              <div className="flex gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-700">
                <button onClick={() => { setDetailId(null) }}
                  className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                  Full Profile
                </button>
                <button onClick={() => { setDetailId(null); showAction(`Contacting ${detail.name}...`) }}
                  className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
