"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  FileText,
  UserPlus,
  GitCompareArrows,
  ShoppingCart,
  Receipt,
  BarChart3,
  type LucideIcon
} from "lucide-react"

interface ActionItem {
  label: string
  href: string
  icon: LucideIcon
  color: string
  glow: string
  border: string
  bg: string
}

const ACTIONS: ActionItem[] = [
  {
    label: "Create RFQ",
    href: "/procurement/rfqs/create",
    icon: FileText,
    color: "text-blue-500 dark:text-blue-400",
    glow: "shadow-blue-500/10 hover:shadow-blue-500/25",
    border: "border-blue-500/20 hover:border-blue-500/40",
    bg: "bg-blue-500/5 hover:bg-blue-500/10",
  },
  {
    label: "Add Vendor",
    href: "/procurement/vendors", // We can open vendor list and click Add Vendor
    icon: UserPlus,
    color: "text-purple-500 dark:text-purple-400",
    glow: "shadow-purple-500/10 hover:shadow-purple-500/25",
    border: "border-purple-500/20 hover:border-purple-500/40",
    bg: "bg-purple-500/5 hover:bg-purple-500/10",
  },
  {
    label: "Compare Quotes",
    href: "/procurement/quotations/compare",
    icon: GitCompareArrows,
    color: "text-cyan-500 dark:text-cyan-400",
    glow: "shadow-cyan-500/10 hover:shadow-cyan-500/25",
    border: "border-cyan-500/20 hover:border-cyan-500/40",
    bg: "bg-cyan-500/5 hover:bg-cyan-500/10",
  },
  {
    label: "Generate PO",
    href: "/procurement/purchase-orders/create",
    icon: ShoppingCart,
    color: "text-green-500 dark:text-green-400",
    glow: "shadow-green-500/10 hover:shadow-green-500/25",
    border: "border-green-500/20 hover:border-green-500/40",
    bg: "bg-green-500/5 hover:bg-green-500/10",
  },
  {
    label: "Generate Invoice",
    href: "/procurement/invoices/create",
    icon: Receipt,
    color: "text-orange-500 dark:text-orange-400",
    glow: "shadow-orange-500/10 hover:shadow-orange-500/25",
    border: "border-orange-500/20 hover:border-orange-500/40",
    bg: "bg-orange-500/5 hover:bg-orange-500/10",
  },
  {
    label: "View Analytics",
    href: "/procurement/reports",
    icon: BarChart3,
    color: "text-indigo-500 dark:text-indigo-400",
    glow: "shadow-indigo-500/10 hover:shadow-indigo-500/25",
    border: "border-indigo-500/20 hover:border-indigo-500/40",
    bg: "bg-indigo-500/5 hover:bg-indigo-500/10",
  },
]

export default function GlassIcons() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {ACTIONS.map((action) => {
        const Icon = action.icon
        return (
          <Link href={action.href} key={action.label} className="block group">
            <motion.div
              whileHover={{
                y: -6,
                scale: 1.02,
                rotateX: 2,
                rotateY: -2,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
              className={`relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border ${action.border} ${action.bg} ${action.glow} p-5 text-center shadow-lg backdrop-blur-xl transition-all duration-300 dark:bg-zinc-950/20`}
            >
              {/* Radial gradient background highlights on card hover */}
              <div className="absolute inset-0 bg-[radial-gradient(100px_circle_at_center,rgba(255,255,255,0.05),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Glowing Orb Backdrop */}
              <div className={`absolute -right-6 -bottom-6 h-16 w-16 rounded-full bg-current opacity-5 blur-xl group-hover:opacity-15 transition-opacity duration-300 ${action.color}`} />

              {/* Icon */}
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white/40 shadow-inner dark:bg-zinc-900/40 transition-transform duration-300 group-hover:scale-110 ${action.color}`}>
                <Icon className="h-6 w-6" />
              </div>

              {/* Text */}
              <span className="mt-3 text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors duration-200">
                {action.label}
              </span>
            </motion.div>
          </Link>
        )
      })}
    </div>
  )
}
