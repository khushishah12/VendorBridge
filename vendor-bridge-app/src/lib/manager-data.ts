export type ApprovalStatus = "Pending" | "Approved" | "Rejected" | "Urgent"
export type ApprovalType = "RFQ" | "Quotation" | "Purchase Order" | "Invoice"

export interface ApprovalRequest {
  id: string
  type: ApprovalType
  title: string
  submittedBy: string
  department: string
  amount: number
  priority: "High" | "Medium" | "Low"
  status: ApprovalStatus
  submittedDate: string
  deadline: string
  remarks?: string
  riskFlags: string[]
}

export interface WorkflowItem {
  id: string
  title: string
  rfqStatus: "Draft" | "Sent" | "Open" | "Closed"
  quotationStatus: "None" | "Received" | "Under Review" | "Shortlisted" | "Accepted" | "Rejected"
  approvalStatus: "Not Required" | "Pending" | "Approved" | "Rejected"
  poStatus: "None" | "Generated" | "Sent" | "Completed" | "Cancelled"
  daysInStage: number
  bottleneck: boolean
  bottleneckReason?: string
  value: number
  department: string
}

export interface ManagerNotification {
  id: string
  type: "approval" | "alert" | "urgent" | "warning"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
}

export const approvalRequests: ApprovalRequest[] = [
  {
    id: "APR-2025-0101",
    type: "Purchase Order",
    title: "PO-2025-0081 - AWS Cloud Migration",
    submittedBy: "Sarah Chen",
    department: "IT",
    amount: 245000,
    priority: "High",
    status: "Pending",
    submittedDate: "2025-07-05",
    deadline: "2025-07-12",
    riskFlags: ["High value (>$200K)", "Single vendor"],
  },
  {
    id: "APR-2025-0102",
    type: "Quotation",
    title: "QTN-2025-0102 - Office Renovation Fit-out",
    submittedBy: "Michael Torres",
    department: "Facilities",
    amount: 138000,
    priority: "High",
    status: "Pending",
    submittedDate: "2025-07-06",
    deadline: "2025-07-10",
    riskFlags: ["Urgent deadline", "Milestone payments"],
  },
  {
    id: "APR-2025-0103",
    type: "RFQ",
    title: "RFQ-2025-0046 - Medical ICU Monitors",
    submittedBy: "Dr. James Okafor",
    department: "Medical",
    amount: 205000,
    priority: "High",
    status: "Urgent",
    submittedDate: "2025-07-01",
    deadline: "2025-07-08",
    remarks: "Critical patient safety equipment - expedite requested",
    riskFlags: ["Regulatory compliance", "High value", "Patient safety critical"],
  },
  {
    id: "APR-2025-0104",
    type: "Purchase Order",
    title: "PO-2025-0082 - Laptop Procurement",
    submittedBy: "Sarah Chen",
    department: "IT",
    amount: 84500,
    priority: "Medium",
    status: "Pending",
    submittedDate: "2025-07-08",
    deadline: "2025-07-15",
    riskFlags: ["Bulk order"],
  },
  {
    id: "APR-2025-0105",
    type: "Invoice",
    title: "INV-2025-0032 - Q3 Office Supplies",
    submittedBy: "Jennifer Walsh",
    department: "Admin",
    amount: 18750,
    priority: "Low",
    status: "Approved",
    submittedDate: "2025-07-03",
    deadline: "2025-07-20",
    remarks: "Within budget. Approved.",
    riskFlags: [],
  },
  {
    id: "APR-2025-0106",
    type: "Quotation",
    title: "QTN-2025-0103 - AWS Migration (Accepted)",
    submittedBy: "Priya Patel",
    department: "IT",
    amount: 245000,
    priority: "High",
    status: "Approved",
    submittedDate: "2025-06-25",
    deadline: "2025-07-05",
    remarks: "Strong vendor credentials. Approved with conditions.",
    riskFlags: ["High value"],
  },
  {
    id: "APR-2025-0107",
    type: "RFQ",
    title: "RFQ-2025-0045 - Q3 Office Supplies",
    submittedBy: "Jennifer Walsh",
    department: "Admin",
    amount: 22000,
    priority: "Low",
    status: "Rejected",
    submittedDate: "2025-06-20",
    deadline: "2025-07-01",
    remarks: "Budget exceeded quarterly allocation. Request re-submission with reduced scope.",
    riskFlags: [],
  },
  {
    id: "APR-2025-0108",
    type: "Quotation",
    title: "QTN-2025-0106 - Annual IT Support",
    submittedBy: "Raymond Kim",
    department: "IT",
    amount: 112000,
    priority: "Medium",
    status: "Rejected",
    submittedDate: "2025-06-28",
    deadline: "2025-07-10",
    remarks: "Vendor does not meet minimum experience requirements.",
    riskFlags: ["Vendor qualification"],
  },
]

export const workflowItems: WorkflowItem[] = [
  {
    id: "WF-001",
    title: "Cloud Infrastructure - AWS Migration",
    rfqStatus: "Closed",
    quotationStatus: "Accepted",
    approvalStatus: "Approved",
    poStatus: "Completed",
    daysInStage: 0,
    bottleneck: false,
    value: 245000,
    department: "IT",
  },
  {
    id: "WF-002",
    title: "Office Renovation - Floor 4 & 5",
    rfqStatus: "Closed",
    quotationStatus: "Shortlisted",
    approvalStatus: "Pending",
    poStatus: "None",
    daysInStage: 4,
    bottleneck: true,
    bottleneckReason: "Awaiting manager approval for shortlisted quotation",
    value: 138000,
    department: "Facilities",
  },
  {
    id: "WF-003",
    title: "Laptop Procurement - 50 Units",
    rfqStatus: "Closed",
    quotationStatus: "Under Review",
    approvalStatus: "Pending",
    poStatus: "None",
    daysInStage: 3,
    bottleneck: false,
    value: 84500,
    department: "IT",
  },
  {
    id: "WF-004",
    title: "Medical Equipment - ICU Monitors",
    rfqStatus: "Open",
    quotationStatus: "Under Review",
    approvalStatus: "Pending",
    poStatus: "None",
    daysInStage: 2,
    bottleneck: false,
    value: 205000,
    department: "Medical",
  },
  {
    id: "WF-005",
    title: "Annual IT Support Services",
    rfqStatus: "Closed",
    quotationStatus: "Rejected",
    approvalStatus: "Not Required",
    poStatus: "Cancelled",
    daysInStage: 5,
    bottleneck: true,
    bottleneckReason: "Re-quotation pending from alternative vendors",
    value: 112000,
    department: "IT",
  },
  {
    id: "WF-006",
    title: "Office Supplies - Q3 Bulk Order",
    rfqStatus: "Closed",
    quotationStatus: "Accepted",
    approvalStatus: "Approved",
    poStatus: "Completed",
    daysInStage: 0,
    bottleneck: false,
    value: 18750,
    department: "Admin",
  },
]

export const managerNotifications: ManagerNotification[] = [
  {
    id: "MN-001",
    type: "approval",
    title: "New Approval Request",
    message: "Sarah Chen submitted PO-2025-0081 for AWS Cloud Migration ($245,000) — requires your approval.",
    timestamp: "2025-07-08T09:30:00",
    read: false,
    actionUrl: "/manager/approvals",
  },
  {
    id: "MN-002",
    type: "urgent",
    title: "Urgent: Medical ICU Monitors RFQ",
    message: "RFQ-2025-0046 for ICU monitors is marked urgent. Patient safety equipment — deadline Jul 8.",
    timestamp: "2025-07-08T08:15:00",
    read: false,
    actionUrl: "/manager/approvals",
  },
  {
    id: "MN-003",
    type: "alert",
    title: "High-Value Procurement Alert",
    message: "Active procurement requests total $672,500 pending your decision this week.",
    timestamp: "2025-07-07T10:00:00",
    read: false,
    actionUrl: "/manager/dashboard",
  },
  {
    id: "MN-004",
    type: "warning",
    title: "Delayed: Office Renovation Workflow",
    message: "Quotation for Office Renovation has been in 'Shortlisted' status for 4 days. Bottleneck detected.",
    timestamp: "2025-07-07T07:00:00",
    read: true,
    actionUrl: "/manager/workflows",
  },
  {
    id: "MN-005",
    type: "approval",
    title: "Approval Confirmed: AWS Migration",
    message: "You approved the AWS Cloud Migration PO on Jul 5. PO has been sent to vendor.",
    timestamp: "2025-07-05T14:00:00",
    read: true,
    actionUrl: "/manager/approvals/approved",
  },
  {
    id: "MN-006",
    type: "warning",
    title: "System Warning: Missing Documentation",
    message: "RFQ-2025-0046 is missing insurance verification documents. Flagged for review.",
    timestamp: "2025-07-06T11:00:00",
    read: true,
    actionUrl: "/manager/workflows",
  },
]
