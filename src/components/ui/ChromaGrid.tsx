"use client"

import { useState, useRef, MouseEvent } from "react"
import { Star, ShieldAlert, TrendingUp, DollarSign } from "lucide-react"

export interface VendorItem {
  id: string
  name: string
  category: string
  rating: number
  totalSpend: number
  rfqSuccessRate: number
  contactPerson: string
  email: string
  phone: string
  location: string
  status: "Active" | "Inactive" | "Under Review"
}

interface ChromaGridProps {
  vendors: VendorItem[]
  onSelectVendor: (id: string) => void
}

const CATEGORY_STYLES: Record<string, { gradient: string; border: string; glow: string; text: string }> = {
  "IT Hardware & Software": {
    gradient: "from-blue-600/20 to-indigo-600/20",
    border: "group-hover:border-blue-500/50",
    glow: "rgba(59, 130, 246, 0.15)",
    text: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  "Cloud Services & SaaS": {
    gradient: "from-blue-600/20 to-indigo-600/20",
    border: "group-hover:border-blue-500/50",
    glow: "rgba(59, 130, 246, 0.15)",
    text: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  "Construction & Infrastructure": {
    gradient: "from-orange-600/20 to-amber-600/20",
    border: "group-hover:border-orange-500/50",
    glow: "rgba(249, 115, 22, 0.15)",
    text: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  },
  "Logistics & Shipping": {
    gradient: "from-emerald-600/20 to-teal-600/20",
    border: "group-hover:border-emerald-500/50",
    glow: "rgba(16, 185, 129, 0.15)",
    text: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  "Facility Management": {
    gradient: "from-purple-600/20 to-fuchsia-600/20",
    border: "group-hover:border-purple-500/50",
    glow: "rgba(168, 85, 247, 0.15)",
    text: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  },
  "Office Supplies & Stationery": {
    gradient: "from-cyan-600/20 to-teal-600/20",
    border: "group-hover:border-cyan-500/50",
    glow: "rgba(6, 182, 212, 0.15)",
    text: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  },
}

const DEFAULT_STYLE = {
  gradient: "from-zinc-700/20 to-zinc-600/20",
  border: "group-hover:border-zinc-500/50",
  glow: "rgba(161, 161, 170, 0.15)",
  text: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
}

function SpotlightCard({ vendor, onClick }: { vendor: VendorItem; onClick: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const style = CATEGORY_STYLES[vendor.category] || DEFAULT_STYLE

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white/70 p-6 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-950/70 cursor-pointer`}
    >
      {/* Background Spotlight Glow */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, ${style.glow}, transparent 80%)`,
          }}
        />
      )}

      {/* Background Gradient Mesh */}
      <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100 -z-10`} />

      {/* Card Content */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          {/* Logo & Category */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-sm font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 shadow-inner group-hover:bg-transparent group-hover:border group-hover:border-white/20 transition-all duration-300">
              {vendor.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide border-zinc-300 dark:border-transparent ${style.text}`}>
              {vendor.category.split(" & ")[0]}
            </span>
          </div>

          {/* Name & ID */}
          <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-300 group-hover:bg-clip-text transition-colors">
            {vendor.name}
          </h3>
          <p className="text-xs text-zinc-400 group-hover:text-zinc-300/70">{vendor.id} &middot; {vendor.location}</p>
        </div>

        {/* Rating and Performance */}
        <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800/80">
          <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-500">
            <Star className="h-4 w-4 fill-amber-400 text-amber-500" /> {vendor.rating.toFixed(1)}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-200">
            Success: <strong className="font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-white">{vendor.rfqSuccessRate}%</strong>
          </span>
        </div>

        {/* Dynamic Hover Insights */}
        <div className="mt-4 grid grid-cols-2 gap-2 overflow-hidden h-0 opacity-0 group-hover:h-12 group-hover:opacity-100 transition-all duration-300 ease-in-out border-t border-dashed border-white/10 pt-2">
          <div className="flex items-center gap-1 text-xs text-zinc-400">
            <DollarSign className="h-3 w-3 text-emerald-400" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Total Spend</p>
              <p className="font-semibold text-zinc-800 dark:text-zinc-200">${(vendor.totalSpend / 1000).toFixed(0)}k</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-zinc-400">
            <TrendingUp className="h-3 w-3 text-blue-400" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Insights</p>
              <p className="font-semibold text-zinc-800 dark:text-zinc-200">Top Partner</p>
            </div>
          </div>
        </div>

        {/* Action button at bottom */}
        <div className="mt-4 flex justify-end">
          <span className="text-xs font-semibold text-indigo-500 group-hover:text-indigo-400 dark:text-indigo-400 transition-colors flex items-center gap-1">
            View details &rarr;
          </span>
        </div>
      </div>
    </div>
  )
}

export default function ChromaGrid({ vendors, onSelectVendor }: ChromaGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {vendors.map((vendor) => (
        <SpotlightCard
          key={vendor.id}
          vendor={vendor}
          onClick={() => onSelectVendor(vendor.id)}
        />
      ))}
    </div>
  )
}
