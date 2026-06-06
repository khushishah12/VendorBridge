"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  ArrowLeft,
  Search,
  Eye,
  UserX,
  Mail,
  Phone,
  Building2,
  Calendar,
  XCircle,
  RotateCcw,
  AlertTriangle,
  Clock,
} from "lucide-react"
import Link from "next/link"

interface InactiveVendor {
  id: string
  name: string
  category: string
  contactPerson: string
  email: string
  phone: string
  lastActive: string
  reason: string
  reactivationPotential: "High" | "Medium" | "Low"
}

const mockInactive: InactiveVendor[] = [
  { id: "V-006", name: "OfficeMax Supplies", category: "Office Supplies & Stationery", contactPerson: "Tom Wilson", email: "tom@officemax.com", phone: "+1 (555) 678-9012", lastActive: "2025-03-15", reason: "No contracts in 90+ days", reactivationPotential: "Medium" },
  { id: "V-008", name: "QuickPrint Services", category: "Printing & Stationery", contactPerson: "Lisa Chen", email: "lisa@quickprint.com", phone: "+1 (555) 890-1234", lastActive: "2025-01-20", reason: "Quality compliance issues", reactivationPotential: "Low" },
  { id: "V-009", name: "GreenEnergy Solutions", category: "Utilities & Energy", contactPerson: "Raj Patel", email: "raj@greenenergy.com", phone: "+1 (555) 901-2345", lastActive: "2024-12-01", reason: "Contract expired — not renewed", reactivationPotential: "High" },
]

const potentialStyles: Record<string, string> = {
  High: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  Low: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
}

export default function InactiveVendorsPage() {
  const [search, setSearch] = useState("")
  const [detailId, setDetailId] = useState<string | null>(null)
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return mockInactive.filter((v) => {
      if (search && !v.name.toLowerCase().includes(search.toLowerCase()) && !v.id.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [search])

  function showAction(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(null), 2500)
  }

  const detail = mockInactive.find((v) => v.id === detailId)

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <Link href="/vendors" className="mb-2 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
            <ArrowLeft className="h-4 w-4" /> Back to Vendor List
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Inactive Vendors</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{mockInactive.length} inactive vendors</p>
        </div>

        {actionMsg && (
          <div className="mb-4 rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{actionMsg}</div>
        )}

        <div className="mb-4 relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inactive vendors..."
            className="w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
        </div>

        <div className="space-y-3">
          {filtered.map((v) => (
            <div key={v.id} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-sm font-bold text-zinc-400 dark:bg-zinc-800">
                    {v.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{v.name}</h3>
                    <p className="text-xs text-zinc-400">{v.category} &middot; {v.id}</p>
                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-zinc-400">
                      <span className="inline-flex items-center gap-1"><UserX className="h-3 w-3" /> {v.reason}</span>
                      <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> Last: {v.lastActive}</span>
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${potentialStyles[v.reactivationPotential]}`}>
                    <AlertTriangle className="h-3 w-3" /> {v.reactivationPotential}
                  </span>
                  <button onClick={() => setDetailId(v.id)}
                    className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
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
              <div className="grid gap-3">
                <div><p className="text-xs text-zinc-400">Category</p><p className="text-sm text-zinc-700 dark:text-zinc-300">{detail.category}</p></div>
                <div><p className="text-xs text-zinc-400">Contact</p><p className="text-sm text-zinc-700 dark:text-zinc-300">{detail.contactPerson}</p></div>
                <div><p className="text-xs text-zinc-400">Email</p><p className="text-sm text-zinc-700 dark:text-zinc-300">{detail.email}</p></div>
                <div><p className="text-xs text-zinc-400">Phone</p><p className="text-sm text-zinc-700 dark:text-zinc-300">{detail.phone}</p></div>
                <div><p className="text-xs text-zinc-400">Last Active</p><p className="text-sm text-zinc-700 dark:text-zinc-300">{detail.lastActive}</p></div>
                <div><p className="text-xs text-zinc-400">Reason</p><p className="text-sm text-zinc-700 dark:text-zinc-300">{detail.reason}</p></div>
                <div><p className="text-xs text-zinc-400">Reactivation Potential</p><span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${potentialStyles[detail.reactivationPotential]}`}>{detail.reactivationPotential}</span></div>
              </div>
              <div className="flex gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-700">
                <button onClick={() => { setDetailId(null); showAction(`Reactivation initiated for ${detail.name}`) }}
                  className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                  <RotateCcw className="inline h-4 w-4 mr-1" /> Reactivate
                </button>
                <button onClick={() => { setDetailId(null); showAction(`Contacting ${detail.name}...`) }}
                  className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  <Mail className="inline h-4 w-4 mr-1" /> Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
