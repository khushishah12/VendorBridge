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

export const sidebarData: SidebarItem[] = [
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
