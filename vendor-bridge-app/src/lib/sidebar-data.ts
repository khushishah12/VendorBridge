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
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  {
    label: "RFQs",
    icon: FileText,
    children: [
      { label: "Create RFQ", href: "/rfqs/create", icon: PlusCircle, starred: true },
      { label: "All RFQs", href: "/rfqs", icon: List },
      { label: "Draft RFQs", href: "/rfqs/drafts", icon: FileEdit },
      { label: "Closed / Expired", href: "/rfqs/closed", icon: Archive },
    ],
  },
  {
    label: "Quotations",
    icon: Receipt,
    children: [
      { label: "Received", href: "/quotations", icon: Eye },
      { label: "Compare", href: "/quotations/compare", icon: GitCompareArrows, starred: true },
      { label: "Shortlisted", href: "/quotations/shortlisted", icon: Star },
      { label: "Rejected", href: "/quotations/rejected", icon: XCircle },
    ],
  },
  {
    label: "Approvals",
    icon: CheckCircle,
    children: [
      { label: "Pending", href: "/approvals", icon: Clock },
      { label: "Approved", href: "/approvals/approved", icon: CheckCheck },
      { label: "Rejected", href: "/approvals/rejected", icon: XCircle },
      { label: "Timeline", href: "/approvals/timeline", icon: Timer },
    ],
  },
  {
    label: "Purchase Orders",
    icon: ShoppingCart,
    children: [
      { label: "Generate PO", href: "/purchase-orders/create", icon: PlusCircle, starred: true },
      { label: "All POs", href: "/purchase-orders", icon: List },
      { label: "Sent POs", href: "/purchase-orders/sent", icon: Eye },
      { label: "Pending", href: "/purchase-orders/pending", icon: Clock },
      { label: "Completed", href: "/purchase-orders/completed", icon: CheckCheck },
      { label: "Cancelled", href: "/purchase-orders/cancelled", icon: Ban },
    ],
  },
  {
    label: "Invoices",
    icon: FileText,
    children: [
      { label: "Generate Invoice", href: "/invoices/create", icon: PlusCircle, starred: true },
      { label: "All Invoices", href: "/invoices", icon: List },
      { label: "Sent", href: "/invoices/sent", icon: Eye },
      { label: "Paid", href: "/invoices/paid", icon: CreditCard },
      { label: "Unpaid", href: "/invoices/unpaid", icon: AlertTriangle },
    ],
  },
  {
    label: "Vendors",
    icon: Building2,
    children: [
      { label: "Vendor List", href: "/vendors", icon: List },
      { label: "Profiles", href: "/vendors/profiles", icon: Eye },
      { label: "Active", href: "/vendors/active", icon: UserCheck },
      { label: "Inactive", href: "/vendors/inactive", icon: UserX },
      { label: "Performance", href: "/vendors/performance", icon: BarChart3 },
    ],
  },
  {
    label: "Notifications",
    icon: Bell,
    children: [
      { label: "RFQ Updates", href: "/notifications/rfq", icon: FileText },
      { label: "Quotations", href: "/notifications/quotations", icon: Receipt },
      { label: "Approvals", href: "/notifications/approvals", icon: CheckCircle },
      { label: "Invoices", href: "/notifications/invoices", icon: FileText },
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
