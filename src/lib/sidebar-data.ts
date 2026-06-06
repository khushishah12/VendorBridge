import {
  LayoutDashboard,
  FileText,
  Receipt,
  CheckCircle,
  ShoppingCart,
  Building2,
  Bell,
  PlusCircle,
  List,
  FileEdit,
  Archive,
  Eye,
  GitCompareArrows,
  Star,
  XCircle,
  Clock,
  CheckCheck,
  Timer,
  Truck,
  Ban,
  UserCheck,
  UserX,
  BarChart3,
  MessageSquare,
  AlertTriangle,
  CreditCard,
  Shield,
  Activity,
  Users,
  BarChart3 as BarChart,
  ScrollText,
  type LucideIcon,
} from "lucide-react"

export type SubMenuItem = {
  label: string
  href: string
  icon: LucideIcon
  starred?: boolean
}

export type SidebarItem = {
  label: string
  href?: string
  icon: LucideIcon
  children?: SubMenuItem[]
}

export const procurementSidebar: SidebarItem[] = [
  { label: "Dashboard", href: "/procurement/dashboard", icon: LayoutDashboard },
  {
    label: "RFQs",
    icon: FileText,
    children: [
      { label: "Create RFQ", href: "/procurement/rfqs/create", icon: PlusCircle, starred: true },
      { label: "All RFQs", href: "/procurement/rfqs", icon: List },
      { label: "Draft RFQs", href: "/procurement/rfqs/drafts", icon: FileEdit },
      { label: "Closed / Expired", href: "/procurement/rfqs/closed", icon: Archive },
    ],
  },
  {
    label: "Quotations",
    icon: Receipt,
    children: [
      { label: "Received", href: "/procurement/quotations", icon: Eye },
      { label: "Compare", href: "/procurement/quotations/compare", icon: GitCompareArrows, starred: true },
      { label: "Shortlisted", href: "/procurement/quotations/shortlisted", icon: Star },
      { label: "Rejected", href: "/procurement/quotations/rejected", icon: XCircle },
    ],
  },
  {
    label: "Approvals",
    icon: CheckCircle,
    children: [
      { label: "Pending", href: "/procurement/approvals", icon: Clock },
      { label: "Approved", href: "/procurement/approvals/approved", icon: CheckCheck },
      { label: "Rejected", href: "/procurement/approvals/rejected", icon: XCircle },
      { label: "Timeline", href: "/procurement/approvals/timeline", icon: Timer },
    ],
  },
  {
    label: "Purchase Orders",
    icon: ShoppingCart,
    children: [
      { label: "Generate PO", href: "/procurement/purchase-orders/create", icon: PlusCircle, starred: true },
      { label: "All POs", href: "/procurement/purchase-orders", icon: List },
      { label: "Sent POs", href: "/procurement/purchase-orders/sent", icon: Eye },
      { label: "Pending", href: "/procurement/purchase-orders/pending", icon: Clock },
      { label: "Completed", href: "/procurement/purchase-orders/completed", icon: CheckCheck },
      { label: "Cancelled", href: "/procurement/purchase-orders/cancelled", icon: Ban },
    ],
  },
  {
    label: "Invoices",
    icon: FileText,
    children: [
      { label: "Generate Invoice", href: "/procurement/invoices/create", icon: PlusCircle, starred: true },
      { label: "All Invoices", href: "/procurement/invoices", icon: List },
      { label: "Sent", href: "/procurement/invoices/sent", icon: Eye },
      { label: "Paid", href: "/procurement/invoices/paid", icon: CreditCard },
      { label: "Unpaid", href: "/procurement/invoices/unpaid", icon: AlertTriangle },
    ],
  },
  {
    label: "Vendors",
    icon: Building2,
    children: [
      { label: "Vendor List", href: "/procurement/vendors", icon: List },
      { label: "Profiles", href: "/procurement/vendors/profiles", icon: Eye },
      { label: "Active", href: "/procurement/vendors/active", icon: UserCheck },
      { label: "Inactive", href: "/procurement/vendors/inactive", icon: UserX },
      { label: "Performance", href: "/procurement/vendors/performance", icon: BarChart3 },
    ],
  },
  {
    label: "Notifications",
    icon: Bell,
    children: [
      { label: "RFQ Updates", href: "/procurement/notifications/rfq", icon: FileText },
      { label: "Quotations", href: "/procurement/notifications/quotations", icon: Receipt },
      { label: "Approvals", href: "/procurement/notifications/approvals", icon: CheckCircle },
      { label: "Invoices", href: "/procurement/notifications/invoices", icon: FileText },
    ],
  },
]

export const vendorSidebar: SidebarItem[] = [
  { label: "Dashboard", href: "/vendor/dashboard", icon: LayoutDashboard },
  {
    label: "RFQs",
    icon: FileText,
    children: [
      { label: "Available RFQs ⭐", href: "/vendor/rfqs", icon: Eye, starred: true },
      { label: "Submitted RFQs", href: "/vendor/rfqs/submitted", icon: CheckCheck },
      { label: "Closed / Expired", href: "/vendor/rfqs/closed", icon: Archive },
    ],
  },
  {
    label: "Quotations",
    icon: Receipt,
    children: [
      { label: "Submit Quotation ⭐", href: "/vendor/quotations/create", icon: PlusCircle, starred: true },
      { label: "My Quotations", href: "/vendor/quotations", icon: List },
      { label: "Under Review", href: "/vendor/quotations/review", icon: Clock },
      { label: "Accepted", href: "/vendor/quotations/accepted", icon: CheckCheck },
      { label: "Rejected", href: "/vendor/quotations/rejected", icon: XCircle },
      { label: "Shortlisted", href: "/vendor/quotations/shortlisted", icon: Star },
    ],
  },
  {
    label: "Purchase Orders",
    icon: ShoppingCart,
    children: [
      { label: "Incoming POs ⭐", href: "/vendor/purchase-orders", icon: Eye, starred: true },
      { label: "Accepted POs", href: "/vendor/purchase-orders/accepted", icon: CheckCheck },
      { label: "Delivered POs", href: "/vendor/purchase-orders/delivered", icon: Truck },
      { label: "Rejected / Cancelled", href: "/vendor/purchase-orders/cancelled", icon: Ban },
    ],
  },
  {
    label: "Notifications",
    icon: Bell,
    children: [
      { label: "New RFQs", href: "/vendor/notifications/rfq", icon: FileText },
      { label: "Quotation Updates", href: "/vendor/notifications/quotations", icon: Receipt },
      { label: "PO Received", href: "/vendor/notifications/po", icon: ShoppingCart },
      { label: "Changes & Updates", href: "/vendor/notifications/updates", icon: MessageSquare },
    ],
  },
]

export const managerSidebar: SidebarItem[] = [
  { label: "Dashboard", href: "/manager/dashboard", icon: LayoutDashboard },
  {
    label: "Approvals",
    icon: Shield,
    children: [
      { label: "Pending ⭐", href: "/manager/approvals", icon: Clock, starred: true },
      { label: "Approved", href: "/manager/approvals/approved", icon: CheckCheck },
      { label: "Rejected", href: "/manager/approvals/rejected", icon: XCircle },
      { label: "Bulk Actions", href: "/manager/approvals/bulk", icon: List },
    ],
  },
  { label: "Workflows", href: "/manager/workflows", icon: Activity },
  {
    label: "Notifications",
    icon: Bell,
    children: [
      { label: "All Alerts", href: "/manager/notifications", icon: Bell },
      { label: "Approval Requests", href: "/manager/notifications", icon: Shield },
      { label: "Warnings", href: "/manager/notifications", icon: AlertTriangle },
    ],
  },
]

export const adminSidebar: SidebarItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "User Management ⭐", href: "/admin/users", icon: Users },
  { label: "Vendor Management ⭐", href: "/admin/vendors", icon: Building2 },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart },
  { label: "System Logs", href: "/admin/logs", icon: ScrollText },
]
