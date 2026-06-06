import DashboardLayout from "@/components/layout/DashboardLayout"
import AnimatedCounter from "@/components/ui/AnimatedCounter"
import {
  FileText,
  Receipt,
  CheckCircle,
  ShoppingCart,
  Building2,
  TrendingUp,
  AlertCircle,
  Clock,
} from "lucide-react"

const stats = [
  { label: "Active RFQs", value: 24, icon: FileText, change: "+12%", color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400" },
  { label: "Quotations Pending", value: 18, icon: Receipt, change: "+5%", color: "text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400" },
  { label: "Pending Approvals", value: 9, icon: CheckCircle, change: "-3%", color: "text-purple-600 bg-purple-50 dark:bg-purple-950/50 dark:text-purple-400" },
  { label: "Active POs", value: 42, icon: ShoppingCart, change: "+8%", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400" },
  { label: "Total Vendors", value: 156, icon: Building2, change: "+2%", color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-950/50 dark:text-cyan-400" },
]

const recentActivity = [
  { action: "New RFQ created", detail: "Office Supplies - Q3 2025", time: "5 min ago", type: "rfq" },
  { action: "Quotation received", detail: "Acme Corp - Server Hardware", time: "12 min ago", type: "quotation" },
  { action: "PO approved", detail: "PO-2025-0042 - IT Equipment", time: "1 hour ago", type: "approval" },
  { action: "Invoice paid", detail: "INV-2025-0089 - Azure Services", time: "2 hours ago", type: "invoice" },
  { action: "Vendor rating updated", detail: "TechSolutions Inc. - 4.8 ★", time: "3 hours ago", type: "vendor" },
]

const iconMap: Record<string, typeof Clock> = {
  rfq: FileText,
  quotation: Receipt,
  approval: CheckCircle,
  invoice: ShoppingCart,
  vendor: Building2,
}

export default function Home() {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Dashboard</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Overview of your procurement activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="card-hover rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex items-center justify-between">
              <div className={`rounded-lg p-2.5 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <span className={`text-xs font-medium ${stat.change.startsWith("+") ? "text-emerald-600" : "text-red-500"}`}>
                {stat.change}
              </span>
            </div>
            <p className="mt-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              <AnimatedCounter value={stat.value} />
            </p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Recent Activity</h3>
        <div className="space-y-0">
          {recentActivity.map((activity, i) => {
            const Icon = iconMap[activity.type] ?? AlertCircle
            return (
              <div
                key={i}
                className="row-hover flex items-start gap-4 border-b border-zinc-100 py-3 last:border-0 dark:border-zinc-800"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{activity.action}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{activity.detail}</p>
                </div>
                <span className="shrink-0 text-xs text-zinc-400">{activity.time}</span>
              </div>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}
