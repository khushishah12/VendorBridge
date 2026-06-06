"use client"

import { motion, AnimatePresence } from "framer-motion"
import { BarChart3, Users, FileText, Receipt, CheckCircle, ShoppingCart, Activity, ShieldCheck, HelpCircle } from "lucide-react"

export interface FlowingMenuData {
  title: string
  marqueeText: string
  gradient: string
  mockupType: "dashboard" | "vendors" | "rfqs" | "quotations" | "approvals" | "pos" | "invoices" | "reports" | "logs"
}

const FLOWING_MENU_MAPPING: Record<string, FlowingMenuData> = {
  "Dashboard": {
    title: "Analytics Visualization",
    marqueeText: "METRICS • PERFORMANCE • LIVE ECOSYSTEM • TRENDS • STATS • ",
    gradient: "from-blue-600/40 via-indigo-600/40 to-cyan-600/40",
    mockupType: "dashboard",
  },
  "Vendors": {
    title: "Business Team",
    marqueeText: "PARTNERS • SUPPLIERS • COMPLIANCE • RATINGS • VERIFICATION • ",
    gradient: "from-purple-600/40 via-fuchsia-600/40 to-pink-600/40",
    mockupType: "vendors",
  },
  "RFQs": {
    title: "Procurement Documents",
    marqueeText: "SOURCING • RFQS • REQUESTS • SPECS • ITEMS • ",
    gradient: "from-sky-600/40 via-cyan-600/40 to-blue-600/40",
    mockupType: "rfqs",
  },
  "Quotations": {
    title: "Financial Comparison",
    marqueeText: "BIDS • PRICING • COMPARE • QUOTATIONS • BIDDING • ",
    gradient: "from-teal-600/40 via-emerald-600/40 to-cyan-600/40",
    mockupType: "quotations",
  },
  "Approvals": {
    title: "Workflow Network",
    marqueeText: "REVIEW • TIMELINE • MANAGER • FINANCE • DIRECTOR • ",
    gradient: "from-indigo-600/40 via-violet-600/40 to-purple-600/40",
    mockupType: "approvals",
  },
  "Purchase Orders": {
    title: "Enterprise Contracts",
    marqueeText: "POs • ORDERS • PURCHASE AGREEMENTS • SIGNATURES • ",
    gradient: "from-emerald-600/40 via-teal-600/40 to-green-600/40",
    mockupType: "pos",
  },
  "Invoices": {
    title: "Digital Billing",
    marqueeText: "INVOICES • PAYMENTS • GST TAX • CALCULATIONS • CASHFLOW • ",
    gradient: "from-orange-600/40 via-red-600/40 to-amber-600/40",
    mockupType: "invoices",
  },
  "Reports": {
    title: "Executive Analytics",
    marqueeText: "AUDITS • COMPLIANCE • SAVINGS • SAVINGS KEY FINDINGS • ",
    gradient: "from-rose-600/40 via-pink-600/40 to-red-600/40",
    mockupType: "reports",
  },
  "Activity Logs": {
    title: "Timeline Visualization",
    marqueeText: "AUDIT LOGS • SYSTEM EVENTS • HISTORY • SECURE IPS • ",
    gradient: "from-zinc-700/40 via-zinc-800/40 to-slate-900/40",
    mockupType: "logs",
  },
  "System Logs": {
    title: "Timeline Visualization",
    marqueeText: "AUDIT LOGS • SYSTEM EVENTS • HISTORY • SECURE IPS • ",
    gradient: "from-zinc-700/40 via-zinc-800/40 to-slate-900/40",
    mockupType: "logs",
  },
}

function RenderMockup({ type }: { type: FlowingMenuData["mockupType"] }) {
  switch (type) {
    case "dashboard":
      return (
        <div className="space-y-2.5">
          <div className="flex gap-1.5">
            <div className="h-10 w-16 rounded bg-white/10" />
            <div className="h-10 w-16 rounded bg-white/10" />
          </div>
          <div className="h-14 w-full rounded bg-white/5 border border-white/10 flex items-center justify-between px-3">
            <div className="h-2 w-16 rounded bg-white/20" />
            <div className="h-3.5 w-8 rounded-full bg-[#6EE7FF]/30" />
          </div>
        </div>
      )
    case "vendors":
      return (
        <div className="flex flex-col gap-2">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2 rounded bg-white/5 p-1.5 border border-white/10">
              <div className="h-6 w-6 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px] font-bold">V{i}</div>
              <div className="flex-1 space-y-1">
                <div className="h-2 w-16 rounded bg-white/20" />
                <div className="h-1.5 w-10 rounded bg-white/10" />
              </div>
              <div className="h-2 w-6 rounded bg-amber-400/20" />
            </div>
          ))}
        </div>
      )
    case "rfqs":
      return (
        <div className="space-y-2">
          <div className="h-8 w-full rounded bg-white/5 border border-white/10 p-1 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-400" />
            <div className="h-1.5 flex-1 rounded bg-white/20" />
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <div className="h-10 rounded bg-white/10" />
            <div className="h-10 rounded bg-white/10" />
            <div className="h-10 rounded bg-white/10" />
          </div>
        </div>
      )
    case "quotations":
      return (
        <div className="space-y-2">
          <div className="h-5 w-full rounded bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-between px-2">
            <span className="text-[8px] text-emerald-400 font-bold">WINNER</span>
            <div className="h-1.5 w-8 rounded bg-emerald-400/50" />
          </div>
          <div className="flex justify-between items-end gap-1">
            <div className="h-8 w-8 rounded bg-white/5 border border-white/10" />
            <div className="h-12 w-8 rounded bg-emerald-500/10 border border-emerald-500/20" />
            <div className="h-6 w-8 rounded bg-white/5 border border-white/10" />
          </div>
        </div>
      )
    case "approvals":
      return (
        <div className="flex items-center justify-center h-16 relative">
          <div className="h-5 w-5 rounded-full bg-[#6EE7FF] flex items-center justify-center z-10 text-[9px] font-bold text-zinc-950">✓</div>
          <div className="w-12 h-0.5 bg-[#6EE7FF]" />
          <div className="h-5 w-5 rounded-full bg-[#6EE7FF] flex items-center justify-center z-10 text-[9px] font-bold text-zinc-950 animate-pulse">⚙</div>
          <div className="w-12 h-0.5 bg-white/20" />
          <div className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center z-10 text-[9px]"></div>
        </div>
      )
    case "pos":
      return (
        <div className="rounded border border-emerald-500/20 bg-emerald-950/20 p-2 space-y-1.5">
          <div className="flex justify-between border-b border-emerald-500/10 pb-1">
            <div className="h-1.5 w-12 rounded bg-emerald-400/50" />
            <div className="h-1.5 w-8 rounded bg-white/30" />
          </div>
          <div className="h-1 w-full bg-white/10 rounded" />
          <div className="h-1 w-4/5 bg-white/10 rounded" />
        </div>
      )
    case "invoices":
      return (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="h-2 w-16 bg-white/20 rounded" />
            <div className="h-3 w-8 bg-orange-400/20 rounded border border-orange-400/30" />
          </div>
          <div className="h-0.5 w-full bg-white/5" />
          <div className="flex justify-between">
            <div className="h-1.5 w-6 bg-white/10 rounded" />
            <div className="h-2.5 w-10 bg-white/20 rounded" />
          </div>
        </div>
      )
    case "reports":
      return (
        <div className="flex items-end gap-1 h-14 pt-2 justify-center">
          <div className="w-2.5 h-6 bg-rose-500/30 rounded-t" />
          <div className="w-2.5 h-10 bg-rose-500/50 rounded-t" />
          <div className="w-2.5 h-4 bg-rose-500/20 rounded-t" />
          <div className="w-2.5 h-12 bg-[#6EE7FF] rounded-t" />
        </div>
      )
    case "logs":
      return (
        <div className="font-mono text-[7px] text-zinc-400 space-y-0.5 select-none">
          <p className="text-emerald-400">&gt; RFQ-CREATED V-001</p>
          <p className="text-purple-400">&gt; MGR-APPROVED ID:402</p>
          <p className="text-blue-400">&gt; PO-SENT SUCCESS</p>
        </div>
      )
    default:
      return <HelpCircle className="h-8 w-8 text-white/20" />
  }
}

interface FlowingMenuProps {
  hoveredItem: string | null
  x: number
  y: number
}

export default function FlowingMenu({ hoveredItem, x, y }: FlowingMenuProps) {
  if (!hoveredItem || !FLOWING_MENU_MAPPING[hoveredItem]) return null

  const data = FLOWING_MENU_MAPPING[hoveredItem]

  return (
    <div
      className="fixed z-[999] pointer-events-none hidden lg:block"
      style={{
        left: x + 20,
        top: Math.max(10, y - 90),
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, x: -10 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.9, x: -10 }}
        transition={{ type: "spring", stiffness: 450, damping: 28 }}
        className="w-60 overflow-hidden rounded-2xl border border-white/20 bg-zinc-950 p-4 shadow-2xl shadow-indigo-500/25 relative"
      >
        {/* Glow halo background mesh */}
        <div className={`absolute inset-0 bg-gradient-to-br ${data.gradient} opacity-20 -z-10`} />

        {/* Dynamic header label */}
        <span className="text-[9px] uppercase tracking-widest text-[#6EE7FF] font-bold">
          {data.title}
        </span>

        {/* Graphic Mockup preview frame */}
        <div className="mt-3 h-20 w-full rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col justify-center">
          <RenderMockup type={data.mockupType} />
        </div>

        {/* Endless scrolling text marquee */}
        <div className="mt-4 overflow-hidden relative w-full h-5 border-t border-dashed border-white/10 pt-1.5 flex items-center">
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-50%" }}
            transition={{
              ease: "linear",
              duration: 8,
              repeat: Infinity,
              repeatType: "loop",
            }}
            className="flex whitespace-nowrap text-[8px] font-extrabold uppercase tracking-widest text-white/50"
            style={{ width: "200%" }}
          >
            <span>{data.marqueeText}</span>
            <span>{data.marqueeText}</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
