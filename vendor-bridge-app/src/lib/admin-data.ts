export interface AdminUser {
  id: string
  name: string
  email: string
  role: "admin" | "procurement" | "vendor" | "manager"
  status: "Active" | "Inactive" | "Suspended"
  department: string
  lastActive: string
  joinedDate: string
  activityLog: string[]
}

export interface AdminVendor {
  id: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  gst: string
  category: string
  status: "Active" | "Pending" | "Blacklisted" | "Inactive"
  rating: number
  successRate: number
  totalOrders: number
  totalSpend: number
  lastOrderDate: string
  blacklistReason?: string
}

export interface SystemLog {
  id: string
  user: string
  action: string
  details: string
  timestamp: string
  type: "auth" | "rfq" | "approval" | "po" | "invoice" | "user" | "vendor"
}

export interface AnalyticsSummary {
  totalRfqs: number
  totalPos: number
  totalInvoices: number
  totalVendors: number
  totalUsers: number
  conversionRate: number
  avgCycleTime: number
  totalSpend: number
  pendingPayments: number
}

export const adminUsers: AdminUser[] = [
  { id: "U-001", name: "Sarah Chen", email: "sarah@vendorbridge.io", role: "procurement", status: "Active", department: "IT Procurement", lastActive: "2025-07-08T09:15:00", joinedDate: "2024-03-01", activityLog: ["Created RFQ-2025-0042", "Approved PO-2025-0081", "Updated vendor rating"] },
  { id: "U-002", name: "Michael Torres", email: "michael@vendorbridge.io", role: "procurement", status: "Active", department: "Facilities", lastActive: "2025-07-07T14:30:00", joinedDate: "2024-06-15", activityLog: ["Submitted QTN-2025-0102", "Requested vendor evaluation"] },
  { id: "U-003", name: "Priya Patel", email: "priya@vendorbridge.io", role: "manager", status: "Active", department: "IT", lastActive: "2025-07-08T11:00:00", joinedDate: "2023-09-20", activityLog: ["Approved PO-2025-0081", "Rejected QTN-2025-0106"] },
  { id: "U-004", name: "Jennifer Walsh", email: "jennifer@vendorbridge.io", role: "procurement", status: "Inactive", department: "Admin", lastActive: "2025-06-20T16:45:00", joinedDate: "2024-01-10", activityLog: ["Created RFQ-2025-0045"] },
  { id: "U-005", name: "Raymond Kim", email: "raymond@vendorbridge.io", role: "manager", status: "Active", department: "IT Services", lastActive: "2025-07-07T10:00:00", joinedDate: "2024-04-05", activityLog: ["Submitted RFQ-2025-0047", "Reviewed quotations"] },
  { id: "U-006", name: "Dr. James Okafor", email: "james@vendorbridge.io", role: "procurement", status: "Active", department: "Medical", lastActive: "2025-07-06T08:30:00", joinedDate: "2025-02-14", activityLog: ["Created RFQ-2025-0046", "Urgent approval requested"] },
  { id: "U-007", name: "TechSolutions Inc.", email: "contact@techsolutions.com", role: "vendor", status: "Active", department: "IT Hardware", lastActive: "2025-07-07T15:20:00", joinedDate: "2024-05-01", activityLog: ["Submitted quotation for Laptop RFQ", "Updated company profile"] },
  { id: "U-008", name: "BuildRight Contractors", email: "info@buildright.com", role: "vendor", status: "Suspended", department: "Construction", lastActive: "2025-06-15T09:00:00", joinedDate: "2024-07-01", activityLog: ["Missed delivery deadline x2", "Compliance issue reported"] },
  { id: "U-009", name: "CloudPro Services", email: "sales@cloudpro.io", role: "vendor", status: "Active", department: "IT Services", lastActive: "2025-07-08T12:00:00", joinedDate: "2024-08-15", activityLog: ["AWS Migration project completed", "SLA compliance 98%"] },
  { id: "U-010", name: "Admin User", email: "admin@vendorbridge.io", role: "admin", status: "Active", department: "System Administration", lastActive: "2025-07-08T13:00:00", joinedDate: "2023-01-01", activityLog: ["System configuration updated", "User accounts reviewed"] },
]

export const adminVendors: AdminVendor[] = [
  { id: "V-001", companyName: "TechSolutions Inc.", contactPerson: "Lisa Wong", email: "lisa@techsolutions.com", phone: "+1-415-555-0101", gst: "GSTIN-27AABCU1234D1Z5", category: "IT Hardware", status: "Active", rating: 4.8, successRate: 94, totalOrders: 45, totalSpend: 1250000, lastOrderDate: "2025-07-01" },
  { id: "V-002", companyName: "BuildRight Contractors", contactPerson: "Carlos Mendez", email: "carlos@buildright.com", phone: "+1-510-555-0202", gst: "GSTIN-06BBBCM5678E1Z9", category: "Construction", status: "Blacklisted", rating: 2.1, successRate: 45, totalOrders: 8, totalSpend: 320000, lastOrderDate: "2025-05-15", blacklistReason: "Repeated delivery delays, contract breach" },
  { id: "V-003", companyName: "CloudPro Services", contactPerson: "Amit Sharma", email: "amit@cloudpro.io", phone: "+1-408-555-0303", gst: "GSTIN-29AACCS9012H1Z7", category: "IT Services", status: "Active", rating: 4.9, successRate: 98, totalOrders: 22, totalSpend: 890000, lastOrderDate: "2025-07-05" },
  { id: "V-004", companyName: "MedEquip Supplies", contactPerson: "Dr. Sarah Klein", email: "sarah@medequip.com", phone: "+1-650-555-0404", gst: "GSTIN-27AACCM3456K1Z3", category: "Medical Equipment", status: "Pending", rating: 0, successRate: 0, totalOrders: 0, totalSpend: 0, lastOrderDate: "N/A" },
  { id: "V-005", companyName: "OfficeDepot Direct", contactPerson: "Mark Rivera", email: "mark@officedepot.com", phone: "+1-925-555-0505", gst: "GSTIN-05AACCO7890L1Z1", category: "Office Supplies", status: "Active", rating: 4.2, successRate: 88, totalOrders: 120, totalSpend: 210000, lastOrderDate: "2025-07-03" },
  { id: "V-006", companyName: "DataSync Networks", contactPerson: "Naomi Chen", email: "naomi@datasync.com", phone: "+1-415-555-0606", gst: "GSTIN-27AACCD1112M1Z6", category: "IT Hardware", status: "Inactive", rating: 3.5, successRate: 70, totalOrders: 15, totalSpend: 180000, lastOrderDate: "2025-04-20" },
]

export const systemLogs: SystemLog[] = [
  { id: "LOG-001", user: "Sarah Chen", action: "Created RFQ", details: "RFQ-2025-0042 - Laptop Procurement (50 Units)", timestamp: "2025-07-08T09:15:00", type: "rfq" },
  { id: "LOG-002", user: "Priya Patel", action: "Approved PO", details: "PO-2025-0081 - AWS Cloud Migration ($245,000)", timestamp: "2025-07-08T11:00:00", type: "approval" },
  { id: "LOG-003", user: "Admin User", action: "User Login", details: "admin@vendorbridge.io authenticated from IP 192.168.1.100", timestamp: "2025-07-08T10:30:00", type: "auth" },
  { id: "LOG-004", user: "Michael Torres", action: "Quotation Submitted", details: "QTN-2025-0102 - Office Renovation Fit-out ($138,000)", timestamp: "2025-07-07T14:30:00", type: "rfq" },
  { id: "LOG-005", user: "CloudPro Services", action: "Generated Invoice", details: "INV-2025-0090 - AWS Migration Phase 1 ($122,500)", timestamp: "2025-07-07T12:00:00", type: "invoice" },
  { id: "LOG-006", user: "Admin User", action: "User Status Changed", details: "BuildRight Contractors (U-008) set to Suspended", timestamp: "2025-07-06T16:00:00", type: "user" },
  { id: "LOG-007", user: "Raymond Kim", action: "RFQ Submitted", details: "RFQ-2025-0047 - Annual IT Support Services", timestamp: "2025-07-06T10:00:00", type: "rfq" },
  { id: "LOG-008", user: "Jennifer Walsh", action: "PO Generated", details: "PO-2025-0085 - Office Supplies Q3 ($18,750)", timestamp: "2025-07-05T14:00:00", type: "po" },
  { id: "LOG-009", user: "Priya Patel", action: "Rejected Quotation", details: "QTN-2025-0106 - Annual IT Support (vendor qualification)", timestamp: "2025-07-05T11:00:00", type: "approval" },
  { id: "LOG-010", user: "Admin User", action: "System Configuration", details: "Updated payment terms default to Net 45", timestamp: "2025-07-04T09:00:00", type: "user" },
  { id: "LOG-011", user: "TechSolutions Inc.", action: "Quotation Submitted", details: "QTN-2025-0101 - Laptop Procurement ($84,500)", timestamp: "2025-07-03T15:00:00", type: "rfq" },
  { id: "LOG-012", user: "Sarah Chen", action: "Vendor Rating Updated", details: "TechSolutions Inc. rating changed to 4.8 ★", timestamp: "2025-07-02T13:00:00", type: "vendor" },
  { id: "LOG-013", user: "Dr. James Okafor", action: "User Login", details: "james@vendorbridge.io authenticated from new device", timestamp: "2025-07-01T08:00:00", type: "auth" },
  { id: "LOG-014", user: "Admin User", action: "Vendor Approved", details: "CloudPro Services (V-003) status set to Active", timestamp: "2025-06-30T10:00:00", type: "vendor" },
  { id: "LOG-015", user: "TechSolutions Inc.", action: "Invoice Generated", details: "INV-2025-0088 - Laptop Delivery ($50,750)", timestamp: "2025-06-28T16:00:00", type: "invoice" },
]

export const analyticsSummary: AnalyticsSummary = {
  totalRfqs: 128,
  totalPos: 94,
  totalInvoices: 156,
  totalVendors: 42,
  totalUsers: 24,
  conversionRate: 73.4,
  avgCycleTime: 18.5,
  totalSpend: 4850000,
  pendingPayments: 420000,
}

export const monthlySpendData = [
  { month: "Jan", amount: 380000 },
  { month: "Feb", amount: 410000 },
  { month: "Mar", amount: 395000 },
  { month: "Apr", amount: 425000 },
  { month: "May", amount: 402000 },
  { month: "Jun", amount: 438000 },
]

export const topVendors = [
  { name: "TechSolutions Inc.", orders: 45, successRate: 94, revenue: 1250000 },
  { name: "CloudPro Services", orders: 22, successRate: 98, revenue: 890000 },
  { name: "OfficeDepot Direct", orders: 120, successRate: 88, revenue: 210000 },
  { name: "BuildRight Contractors", orders: 8, successRate: 45, revenue: 320000 },
  { name: "DataSync Networks", orders: 15, successRate: 70, revenue: 180000 },
]
