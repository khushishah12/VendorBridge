"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  ArrowLeft,
  Trophy,
  Clock,
  DollarSign,
  Star,
  CheckCircle2,
  Send,
  XCircle,
  ChevronDown,
  Sparkles,
  TrendingDown,
  Zap,
  Shield,
} from "lucide-react"
import Link from "next/link"

interface QuotationItem {
  name: string
  qty: number
  unit: string
  price: number
}

interface QuotationCompare {
  id: string
  vendor: string
  totalAmount: number
  deliveryTimeline: string
  warranty: string
  rating: number
  pastOrders: number
  items: QuotationItem[]
}

const comparisonData: QuotationCompare[] = [
  {
    id: "QTN-2025-0101", vendor: "TechSolutions Inc.", totalAmount: 184500,
    deliveryTimeline: "30 days", warranty: "3 years comprehensive",
    rating: 4.8, pastOrders: 24,
    items: [
      { name: "Laptop Pro X1", qty: 30, unit: "pcs", price: 6150 },
    ],
  },
  {
    id: "QTN-2025-0102", vendor: "Acme Corp", totalAmount: 192000,
    deliveryTimeline: "45 days", warranty: "2 years standard",
    rating: 4.2, pastOrders: 15,
    items: [
      { name: "Laptop EliteBook", qty: 30, unit: "pcs", price: 6400 },
    ],
  },
  {
    id: "QTN-2025-0103", vendor: "Global Supplies Co.", totalAmount: 210000,
    deliveryTimeline: "60 days", warranty: "1 year basic",
    rating: 3.9, pastOrders: 8,
    items: [
      { name: "Laptop ThinkPad", qty: 30, unit: "pcs", price: 7000 },
    ],
  },
  {
    id: "QTN-2025-0104", vendor: "ServicePro Ltd.", totalAmount: 178500,
    deliveryTimeline: "21 days", warranty: "3 years comprehensive + on-site",
    rating: 4.6, pastOrders: 19,
    items: [
      { name: "Laptop Latitude Series", qty: 30, unit: "pcs", price: 5950 },
    ],
  },
]

type SortKey = "price" | "delivery" | "rating"

export default function CompareQuotationsPage() {
  const [sortBy, setSortBy] = useState<SortKey>("price")
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null)
  const [hiddenVendors, setHiddenVendors] = useState<string[]>([])
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  const sorted = useMemo(() => {
    const visible = comparisonData.filter((q) => !hiddenVendors.includes(q.vendor))
    return [...visible].sort((a, b) => {
      if (sortBy === "price") return a.totalAmount - b.totalAmount
      if (sortBy === "delivery") {
        const aDays = parseInt(a.deliveryTimeline)
        const bDays = parseInt(b.deliveryTimeline)
        return aDays - bDays
      }
      return b.rating - a.rating
    })
  }, [sortBy, hiddenVendors])

  const lowestPrice = sorted.length > 0 ? Math.min(...sorted.map((q) => q.totalAmount)) : 0
  const fastestDelivery = sorted.length > 0
    ? Math.min(...sorted.map((q) => parseInt(q.deliveryTimeline)))
    : 0

  function showAction(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(null), 2500)
  }

  const allItemNames = [...new Set(comparisonData.flatMap((q) => q.items.map((i) => i.name)))]

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/quotations" className="mb-2 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
              <ArrowLeft className="h-4 w-4" /> Back to Quotations
            </Link>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Compare Quotations</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {sorted.length} vendors &middot; RFQ-2025-0001 - Office Laptops Procurement
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedWinner && (
              <div className="flex items-center gap-2">
                <button onClick={() => showAction("Sent for approval")}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                  <Send className="h-4 w-4" /> Send for Approval
                </button>
                <button onClick={() => { showAction("Other quotations rejected"); setSelectedWinner(null) }}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/40">
                  <XCircle className="h-4 w-4" /> Reject Others
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Toast */}
        {actionMsg && (
          <div className="mb-4 rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            {actionMsg}
          </div>
        )}

        {/* Sort + Filter bar */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Sort by:</span>
          {(["price", "delivery", "rating"] as SortKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                sortBy === key
                  ? "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300"
                  : "border-zinc-300 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              {key === "price" && <><DollarSign className="inline h-3.5 w-3.5 mr-1" />Price</>}
              {key === "delivery" && <><Clock className="inline h-3.5 w-3.5 mr-1" />Delivery</>}
              {key === "rating" && <><Star className="inline h-3.5 w-3.5 mr-1" />Rating</>}
            </button>
          ))}
          <span className="ml-4 text-sm text-zinc-500 dark:text-zinc-400">Hide:</span>
          {comparisonData.map((q) => (
            <button
              key={q.vendor}
              onClick={() => setHiddenVendors((prev) =>
                prev.includes(q.vendor) ? prev.filter((v) => v !== q.vendor) : [...prev, q.vendor],
              )}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                hiddenVendors.includes(q.vendor)
                  ? "border-zinc-200 bg-zinc-100 text-zinc-400 line-through dark:border-zinc-700 dark:bg-zinc-800"
                  : "border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              {q.vendor.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400 w-48">
                  Criteria
                </th>
                {sorted.map((q) => (
                  <th
                    key={q.vendor}
                    className={`px-4 py-3 text-center transition-colors ${
                      selectedWinner === q.vendor
                        ? "bg-emerald-50 dark:bg-emerald-950/30"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{q.vendor}</span>
                      <span className="text-xs text-zinc-400">{q.id}</span>
                      {selectedWinner === q.vendor && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                          <Trophy className="h-3 w-3" /> Selected
                        </span>
                      )}
                      {!selectedWinner && q.totalAmount === lowestPrice && sorted.length > 1 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-300">
                          <TrendingDown className="h-3 w-3" /> Lowest Price
                        </span>
                      )}
                      {!selectedWinner && parseInt(q.deliveryTimeline) === fastestDelivery && sorted.length > 1 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                          <Zap className="h-3 w-3" /> Fastest
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {/* Total Price row */}
              <tr className={selectedWinner ? "bg-emerald-50/50 dark:bg-emerald-950/20" : ""}>
                <td className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">
                  <DollarSign className="inline h-4 w-4 mr-1" /> Total Price
                </td>
                {sorted.map((q) => (
                  <td
                    key={q.vendor}
                    className={`px-4 py-3 text-center font-bold text-lg transition-colors ${
                      q.totalAmount === lowestPrice
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-zinc-900 dark:text-zinc-100"
                    } ${selectedWinner === q.vendor ? "bg-emerald-50/50 dark:bg-emerald-950/20" : ""}`}
                  >
                    ${q.totalAmount.toLocaleString()}
                    {q.totalAmount === lowestPrice && (
                      <span className="ml-1.5 text-xs text-emerald-500">🟢</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Item-wise breakdown */}
              <tr>
                <td colSpan={sorted.length + 1} className="px-4 py-2 bg-zinc-50/50 dark:bg-zinc-900/50">
                  <span className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">Item-wise Pricing</span>
                </td>
              </tr>
              {allItemNames.map((itemName) => {
                const prices = sorted.map((q) => {
                  const item = q.items.find((i) => i.name === itemName)
                  return item ? item.price : null
                })
                const minPrice = Math.min(...prices.filter((p): p is number => p !== null))
                return (
                  <tr key={itemName}>
                    <td className="px-4 py-2.5 text-zinc-600 dark:text-zinc-400">{itemName}</td>
                    {sorted.map((q) => {
                      const item = q.items.find((i) => i.name === itemName)
                      return (
                        <td key={q.vendor} className={`px-4 py-2.5 text-center ${
                          item && item.price === minPrice
                            ? "text-emerald-600 font-medium dark:text-emerald-400"
                            : "text-zinc-600 dark:text-zinc-400"
                        }`}>
                          {item ? `$${item.price.toLocaleString()}` : "—"}
                          {item && item.price === minPrice && <span className="ml-1 text-emerald-500">🟢</span>}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
              <tr>
                <td className="px-4 py-2.5 text-zinc-500">Quantity</td>
                {sorted.map((q) => (
                  <td key={q.vendor} className="px-4 py-2.5 text-center text-zinc-600 dark:text-zinc-400">
                    {q.items.map((i) => `${i.qty} ${i.unit}`).join(", ")}
                  </td>
                ))}
              </tr>

              {/* Delivery */}
              <tr>
                <td className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">
                  <Clock className="inline h-4 w-4 mr-1" /> Delivery Timeline
                </td>
                {sorted.map((q) => (
                  <td className={`px-4 py-3 text-center font-medium ${
                    parseInt(q.deliveryTimeline) === fastestDelivery
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-zinc-700 dark:text-zinc-300"
                  }`}>
                    {q.deliveryTimeline}
                    {parseInt(q.deliveryTimeline) === fastestDelivery && <span className="ml-1">⏱️</span>}
                  </td>
                ))}
              </tr>

              {/* Warranty */}
              <tr>
                <td className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">
                  <Shield className="inline h-4 w-4 mr-1" /> Warranty / Terms
                </td>
                {sorted.map((q) => (
                  <td className="px-4 py-3 text-center text-zinc-600 dark:text-zinc-400">{q.warranty}</td>
                ))}
              </tr>

              {/* Rating */}
              <tr>
                <td className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">
                  <Star className="inline h-4 w-4 mr-1" /> Rating &amp; Past Performance
                </td>
                {sorted.map((q) => (
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-col items-center">
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-500">
                        <Star className="h-3.5 w-3.5 fill-amber-400" /> {q.rating}
                      </span>
                      <span className="text-xs text-zinc-400">{q.pastOrders} past orders</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Best Overall */}
              {sorted.length > 1 && (
                <tr>
                  <td className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">
                    <Sparkles className="inline h-4 w-4 mr-1" /> Best Overall
                  </td>
                  {sorted.map((q) => {
                    const score = (q.rating * 10) - (q.totalAmount / 100000) + (fastestDelivery / parseInt(q.deliveryTimeline || "30"))
                    const isBest = score === Math.max(...sorted.map((x) => (x.rating * 10) - (x.totalAmount / 100000) + (fastestDelivery / parseInt(x.deliveryTimeline || "30"))))
                    return (
                      <td className="px-4 py-3 text-center">
                        {isBest ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-950/40 dark:text-purple-300">
                            <Trophy className="h-3 w-3" /> Top Pick
                          </span>
                        ) : (
                          <span className="text-xs text-zinc-400">—</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              )}

              {/* Select Winner row */}
              <tr className="border-t-2 border-zinc-200 dark:border-zinc-700">
                <td className="px-4 py-4 font-semibold text-zinc-700 dark:text-zinc-300">
                  <CheckCircle2 className="inline h-4 w-4 mr-1" /> Select Winner
                </td>
                {sorted.map((q) => (
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => setSelectedWinner(selectedWinner === q.vendor ? null : q.vendor)}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                        selectedWinner === q.vendor
                          ? "border-emerald-300 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/30 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                          : "border-zinc-300 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {selectedWinner === q.vendor ? (
                        <><CheckCircle2 className="inline h-4 w-4 mr-1" /> Selected</>
                      ) : (
                        "Select"
                      )}
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Bottom actions */}
        {selectedWinner && (
          <div className="mt-6 flex flex-wrap items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="font-semibold text-emerald-800 dark:text-emerald-200">
                  {selectedWinner} selected as winning quotation
                </p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  You can now send for approval or reject the other vendors
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <button onClick={() => showAction("Sent for approval")}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                <Send className="h-4 w-4" /> Send for Approval
              </button>
              <button onClick={() => { showAction("Other quotations rejected in bulk"); setSelectedWinner(null) }}
                className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-800 dark:bg-zinc-900 dark:text-red-300 dark:hover:bg-red-950/40">
                <XCircle className="h-4 w-4" /> Reject Others
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
