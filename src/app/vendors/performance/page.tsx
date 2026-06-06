"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  ArrowLeft,
  Star,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Award,
  Clock,
  DollarSign,
  FileText,
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  SlidersHorizontal,
  Building2,
  Shield,
  AlertTriangle,
  Package,
  Users,
  Zap,
  Minus,
} from "lucide-react"
import Link from "next/link"

interface VendorPerformance {
  id: string
  name: string
  category: string
  overallRating: number
  qualityRating: number
  deliveryRating: number
  costRating: number
  complianceRating: number
  totalContracts: number
  onTimeDelivery: number
  avgResponseTime: string
  spendEfficiency: number
  trend: "up" | "stable" | "down"
  status: "Active" | "Under Review"
}

const mockPerf: VendorPerformance[] = [
  { id: "V-001", name: "TechSolutions Inc.", category: "IT Hardware & Software", overallRating: 4.8, qualityRating: 4.9, deliveryRating: 4.7, costRating: 4.5, complianceRating: 5.0, totalContracts: 24, onTimeDelivery: 96, avgResponseTime: "2 hours", spendEfficiency: 92, trend: "up", status: "Active" },
  { id: "V-007", name: "CloudSync Technologies", category: "Cloud Services & SaaS", overallRating: 4.9, qualityRating: 5.0, deliveryRating: 4.8, costRating: 4.7, complianceRating: 5.0, totalContracts: 15, onTimeDelivery: 100, avgResponseTime: "1 hour", spendEfficiency: 95, trend: "up", status: "Active" },
  { id: "V-005", name: "Global Supplies Co.", category: "Logistics & Shipping", overallRating: 4.6, qualityRating: 4.5, deliveryRating: 4.8, costRating: 4.3, complianceRating: 4.7, totalContracts: 31, onTimeDelivery: 94, avgResponseTime: "3 hours", spendEfficiency: 88, trend: "stable", status: "Active" },
  { id: "V-002", name: "BuildRight Construction", category: "Construction & Infrastructure", overallRating: 4.2, qualityRating: 4.3, deliveryRating: 4.0, costRating: 4.1, complianceRating: 4.5, totalContracts: 18, onTimeDelivery: 82, avgResponseTime: "6 hours", spendEfficiency: 78, trend: "stable", status: "Active" },
  { id: "V-003", name: "Acme Corp", category: "Office Supplies & Stationery", overallRating: 4.0, qualityRating: 4.1, deliveryRating: 3.8, costRating: 4.2, complianceRating: 3.9, totalContracts: 42, onTimeDelivery: 79, avgResponseTime: "4 hours", spendEfficiency: 85, trend: "stable", status: "Active" },
  { id: "V-004", name: "ServicePro Ltd.", category: "Facility Management", overallRating: 3.5, qualityRating: 3.2, deliveryRating: 3.8, costRating: 3.6, complianceRating: 3.4, totalContracts: 7, onTimeDelivery: 65, avgResponseTime: "8 hours", spendEfficiency: 62, trend: "down", status: "Under Review" },
]

function getColor(value: number): string {
  if (value >= 4.5) return "text-emerald-600 dark:text-emerald-400"
  if (value >= 3.5) return "text-amber-600 dark:text-amber-400"
  return "text-red-600 dark:text-red-400"
}

function getBgColor(value: number): string {
  if (value >= 4.5) return "bg-emerald-500"
  if (value >= 3.5) return "bg-amber-500"
  return "bg-red-500"
}

const categories = [...new Set(mockPerf.map((v) => v.category))]

export default function VendorPerformancePage() {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [minRating, setMinRating] = useState<number | "All">("All")
  const [showFilters, setShowFilters] = useState(false)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return mockPerf.filter((v) => {
      if (search && !v.name.toLowerCase().includes(search.toLowerCase())) return false
      if (categoryFilter !== "All" && v.category !== categoryFilter) return false
      if (minRating !== "All" && v.overallRating < minRating) return false
      return true
    })
  }, [search, categoryFilter, minRating])

  function showAction(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(null), 2500)
  }

  const detail = mockPerf.find((v) => v.id === detailId)

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <Link href="/vendors" className="mb-2 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
            <ArrowLeft className="h-4 w-4" /> Back to Vendor List
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Vendor Performance</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Performance metrics & ratings for all vendors</p>
        </div>

        {actionMsg && (
          <div className="mb-4 rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{actionMsg}</div>
        )}

        {/* Summary */}
        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center gap-2 text-indigo-600"><Award className="h-4 w-4" /><span className="text-xs font-medium">Top Performer</span></div>
            <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-50">CloudSync Technologies</p>
            <p className="text-xs text-zinc-400">4.9 ★</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center gap-2 text-emerald-600"><CheckCircle2 className="h-4 w-4" /><span className="text-xs font-medium">Avg On-Time</span></div>
            <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-50">{(mockPerf.reduce((s, v) => s + v.onTimeDelivery, 0) / mockPerf.length).toFixed(0)}%</p>
            <p className="text-xs text-zinc-400">Delivery accuracy</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center gap-2 text-amber-600"><Zap className="h-4 w-4" /><span className="text-xs font-medium">Avg Response</span></div>
            <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-50">4 hrs</p>
            <p className="text-xs text-zinc-400">Average response time</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center gap-2 text-blue-600"><Users className="h-4 w-4" /><span className="text-xs font-medium">Vendors Tracked</span></div>
            <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-50">{mockPerf.length}</p>
            <p className="text-xs text-zinc-400">With performance data</p>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vendors..."
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
                <label className="mb-1 block text-xs font-medium text-zinc-500">Category</label>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
                  <option value="All">All Categories</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">Min Rating</label>
                <select value={minRating} onChange={(e) => setMinRating(e.target.value === "All" ? "All" : parseFloat(e.target.value))}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
                  <option value="All">Any</option>
                  <option value="4.5">4.5+ ★</option>
                  <option value="4">4+ ★</option>
                  <option value="3">3+ ★</option>
                </select>
              </div>
              <button onClick={() => { setCategoryFilter("All"); setMinRating("All") }} className="rounded-lg px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-700">Clear</button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3 text-center">Overall ★</th>
                <th className="px-4 py-3 text-center">Quality</th>
                <th className="px-4 py-3 text-center">Delivery</th>
                <th className="px-4 py-3 text-center">Cost</th>
                <th className="px-4 py-3 text-center">Compliance</th>
                <th className="px-4 py-3 text-center">On-Time %</th>
                <th className="px-4 py-3 text-center">Spend Eff.</th>
                <th className="px-4 py-3 text-center">Trend</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filtered.length === 0 ? (
                <tr><td colSpan={10} className="px-4 py-12 text-center text-zinc-400"><BarChart3 className="mx-auto mb-2 h-8 w-8 opacity-50" />No performance data</td></tr>
              ) : (
                filtered.map((v) => (
                  <tr key={v.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                          {v.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-zinc-800 dark:text-zinc-200">{v.name}</p>
                          <p className="text-xs text-zinc-400">{v.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-base font-bold ${getColor(v.overallRating)}`}>{v.overallRating}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="h-2 w-12 rounded-full bg-zinc-200 dark:bg-zinc-700">
                          <div className={`h-2 rounded-full ${getBgColor(v.qualityRating)}`} style={{ width: `${(v.qualityRating / 5) * 100}%` }} />
                        </div>
                        <span className={`text-xs font-medium ${getColor(v.qualityRating)}`}>{v.qualityRating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="h-2 w-12 rounded-full bg-zinc-200 dark:bg-zinc-700">
                          <div className={`h-2 rounded-full ${getBgColor(v.deliveryRating)}`} style={{ width: `${(v.deliveryRating / 5) * 100}%` }} />
                        </div>
                        <span className={`text-xs font-medium ${getColor(v.deliveryRating)}`}>{v.deliveryRating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="h-2 w-12 rounded-full bg-zinc-200 dark:bg-zinc-700">
                          <div className={`h-2 rounded-full ${getBgColor(v.costRating)}`} style={{ width: `${(v.costRating / 5) * 100}%` }} />
                        </div>
                        <span className={`text-xs font-medium ${getColor(v.costRating)}`}>{v.costRating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm font-medium ${getColor(v.complianceRating)}`}>{v.complianceRating}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm font-medium ${v.onTimeDelivery >= 90 ? "text-emerald-600 dark:text-emerald-400" : v.onTimeDelivery >= 75 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>
                        {v.onTimeDelivery}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm font-medium ${v.spendEfficiency >= 85 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                        {v.spendEfficiency}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {v.trend === "up" ? <TrendingUp className="inline h-4 w-4 text-emerald-500" /> : v.trend === "down" ? <TrendingDown className="inline h-4 w-4 text-red-500" /> : <Minus className="inline h-4 w-4 text-zinc-400" />}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setDetailId(v.id)}
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

        <div className="mt-4 flex items-center gap-4 text-xs text-zinc-400">
          <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-500" /> Overall Rating (weighted)</span>
          <span className="inline-flex items-center gap-1"><TrendingUp className="h-3 w-3 text-emerald-500" /> Improving</span>
          <span className="inline-flex items-center gap-1"><TrendingDown className="h-3 w-3 text-red-500" /> Declining</span>
        </div>
      </div>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            <div className="sticky top-0 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-700 dark:bg-zinc-900">
              <div><h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{detail.name}</h2><p className="text-sm text-zinc-400">{detail.id} &middot; {detail.category}</p></div>
              <button onClick={() => setDetailId(null)} className="rounded-lg p-1 text-zinc-400 hover:text-zinc-600"><XCircle className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className={`flex h-16 w-16 items-center justify-center rounded-xl text-2xl font-bold ${getColor(detail.overallRating)} bg-zinc-100 dark:bg-zinc-800`}>
                  {detail.overallRating}
                </div>
                <div>
                  <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{detail.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                    <span className="text-2xl font-bold text-amber-500">{detail.overallRating}</span>
                    <span className="text-sm text-zinc-400">/ 5.0</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-zinc-500">Quality</span>
                    <span className={`text-sm font-bold ${getColor(detail.qualityRating)}`}>{detail.qualityRating}</span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-700">
                    <div className={`h-2 rounded-full ${getBgColor(detail.qualityRating)}`} style={{ width: `${(detail.qualityRating / 5) * 100}%` }} />
                  </div>
                </div>
                <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-zinc-500">Delivery</span>
                    <span className={`text-sm font-bold ${getColor(detail.deliveryRating)}`}>{detail.deliveryRating}</span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-700">
                    <div className={`h-2 rounded-full ${getBgColor(detail.deliveryRating)}`} style={{ width: `${(detail.deliveryRating / 5) * 100}%` }} />
                  </div>
                </div>
                <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-zinc-500">Cost Efficiency</span>
                    <span className={`text-sm font-bold ${getColor(detail.costRating)}`}>{detail.costRating}</span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-700">
                    <div className={`h-2 rounded-full ${getBgColor(detail.costRating)}`} style={{ width: `${(detail.costRating / 5) * 100}%` }} />
                  </div>
                </div>
                <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-zinc-500">Compliance</span>
                    <span className={`text-sm font-bold ${getColor(detail.complianceRating)}`}>{detail.complianceRating}</span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-700">
                    <div className={`h-2 rounded-full ${getBgColor(detail.complianceRating)}`} style={{ width: `${(detail.complianceRating / 5) * 100}%` }} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-zinc-200 p-4 text-center dark:border-zinc-700">
                  <p className="text-xs text-zinc-500">On-Time Delivery</p>
                  <p className={`text-xl font-bold ${detail.onTimeDelivery >= 90 ? "text-emerald-600" : detail.onTimeDelivery >= 75 ? "text-amber-600" : "text-red-600"}`}>{detail.onTimeDelivery}%</p>
                </div>
                <div className="rounded-lg border border-zinc-200 p-4 text-center dark:border-zinc-700">
                  <p className="text-xs text-zinc-500">Avg Response</p>
                  <p className="text-xl font-bold text-zinc-800 dark:text-zinc-200">{detail.avgResponseTime}</p>
                </div>
                <div className="rounded-lg border border-zinc-200 p-4 text-center dark:border-zinc-700">
                  <p className="text-xs text-zinc-500">Spend Efficiency</p>
                  <p className={`text-xl font-bold ${detail.spendEfficiency >= 85 ? "text-emerald-600" : "text-amber-600"}`}>{detail.spendEfficiency}%</p>
                </div>
              </div>

              <div className="flex items-center gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-700">
                <button onClick={() => { setDetailId(null); showAction(`Full performance report for ${detail.name} generated`) }}
                  className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                  <BarChart3 className="inline h-4 w-4 mr-1" /> Generate Report
                </button>
                <button onClick={() => { setDetailId(null) }}
                  className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  View Full Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
