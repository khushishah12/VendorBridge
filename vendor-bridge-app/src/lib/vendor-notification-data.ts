export type VendorNotifType = "rfq" | "quotation" | "po" | "update"
export type VendorNotifPriority = "high" | "medium" | "low"

export interface VendorNotification {
  id: string
  type: VendorNotifType
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: VendorNotifPriority
  actionUrl?: string
  sender: string
}

export const vendorNotifications: VendorNotification[] = [
  // RFQ notifications
  {
    id: "N-2025-V001",
    type: "rfq",
    title: "New RFQ: Medical Equipment – ICU Monitors",
    message: "St. Mary's Medical Center has posted a new RFQ for 20 ICU patient monitoring systems. Deadline: Jul 28, 2025.",
    timestamp: "2025-07-01T08:30:00",
    read: false,
    priority: "high",
    actionUrl: "/vendor/rfqs/RFQ-2025-0046",
    sender: "St. Mary's Medical Center",
  },
  {
    id: "N-2025-V002",
    type: "rfq",
    title: "RFQ Updated: Laptop Procurement – 50 Units",
    message: "TechCorp International has updated the specifications for the laptop RFQ. Quantity increased from 40 to 50 units.",
    timestamp: "2025-06-28T14:15:00",
    read: false,
    priority: "medium",
    actionUrl: "/vendor/rfqs/RFQ-2025-0042",
    sender: "TechCorp International",
  },
  {
    id: "N-2025-V003",
    type: "rfq",
    title: "RFQ Closing Soon: Cloud Infrastructure Migration",
    message: "The AWS Migration RFQ by DataFlow Solutions closes in 3 days. Submit your quotation before Jul 10.",
    timestamp: "2025-06-27T09:00:00",
    read: true,
    priority: "high",
    actionUrl: "/vendor/rfqs/RFQ-2025-0044",
    sender: "DataFlow Solutions",
  },
  {
    id: "N-2025-V004",
    type: "rfq",
    title: "New RFQ: Office Supplies – Q3 Bulk Order",
    message: "MetroCorp Group has posted a bulk office supplies RFQ. Budget range $15K-$22K. 5 location delivery.",
    timestamp: "2025-06-25T10:45:00",
    read: true,
    priority: "low",
    actionUrl: "/vendor/rfqs/RFQ-2025-0045",
    sender: "MetroCorp Group",
  },
  // Quotation notifications
  {
    id: "N-2025-V005",
    type: "quotation",
    title: "Quotation Shortlisted: Office Renovation",
    message: "Your quotation QTN-2025-0102 for Office Renovation has been shortlisted. Vertex Properties will contact you for negotiations.",
    timestamp: "2025-07-02T16:20:00",
    read: false,
    priority: "high",
    actionUrl: "/vendor/quotations/shortlisted",
    sender: "Vertex Properties",
  },
  {
    id: "N-2025-V006",
    type: "quotation",
    title: "Quotation Accepted: AWS Migration",
    message: "Congratulations! Your quotation QTN-2025-0103 for Cloud Infrastructure Migration has been accepted. PO to follow.",
    timestamp: "2025-07-01T11:00:00",
    read: false,
    priority: "high",
    actionUrl: "/vendor/quotations/accepted",
    sender: "DataFlow Solutions",
  },
  {
    id: "N-2025-V007",
    type: "quotation",
    title: "Quotation Rejected: IT Support Services",
    message: "Your quotation QTN-2025-0106 for Annual IT Support Services was not selected due to budget constraints.",
    timestamp: "2025-06-30T13:10:00",
    read: true,
    priority: "medium",
    actionUrl: "/vendor/quotations/rejected",
    sender: "Pacific Northwest University",
  },
  {
    id: "N-2025-V008",
    type: "quotation",
    title: "Quotation Under Review: Medical Equipment",
    message: "Your quotation QTN-2025-0105 for ICU Monitors is under review by St. Mary's procurement team.",
    timestamp: "2025-06-29T09:30:00",
    read: false,
    priority: "medium",
    actionUrl: "/vendor/quotations/review",
    sender: "St. Mary's Medical Center",
  },
  // PO notifications
  {
    id: "N-2025-V009",
    type: "po",
    title: "New PO Received: Laptop Procurement",
    message: "PO-2025-0082 has been issued by TechCorp International for $84,500. Review and accept by Jul 15.",
    timestamp: "2025-07-08T10:00:00",
    read: false,
    priority: "high",
    actionUrl: "/vendor/purchase-orders",
    sender: "TechCorp International",
  },
  {
    id: "N-2025-V010",
    type: "po",
    title: "PO Ready: Office Renovation",
    message: "PO-2025-0083 from Vertex Properties is ready for your review. Milestone payment terms included.",
    timestamp: "2025-07-06T08:45:00",
    read: false,
    priority: "high",
    actionUrl: "/vendor/purchase-orders",
    sender: "Vertex Properties",
  },
  {
    id: "N-2025-V011",
    type: "po",
    title: "PO Cancelled: IT Support Services",
    message: "PO-2025-0086 for Annual IT Support Services has been cancelled due to budget reallocation.",
    timestamp: "2025-07-04T15:30:00",
    read: true,
    priority: "medium",
    actionUrl: "/vendor/purchase-orders/cancelled",
    sender: "Pacific Northwest University",
  },
  {
    id: "N-2025-V012",
    type: "po",
    title: "Delivery Confirmed: Office Supplies",
    message: "MetroCorp Group has confirmed delivery of all Q3 office supplies. Payment processing initiated.",
    timestamp: "2025-07-03T12:00:00",
    read: true,
    priority: "low",
    actionUrl: "/vendor/purchase-orders/delivered",
    sender: "MetroCorp Group",
  },
  // Update notifications
  {
    id: "N-2025-V013",
    type: "update",
    title: "Platform Update: New RFQ Categories Added",
    message: "VendorBridge has added 'Medical Equipment' and 'Construction' categories. Update your vendor profile to match.",
    timestamp: "2025-07-05T06:00:00",
    read: false,
    priority: "low",
    sender: "VendorBridge System",
  },
  {
    id: "N-2025-V014",
    type: "update",
    title: "Profile Completion Reminder",
    message: "Your vendor profile is 70% complete. Add certifications and past project details to increase visibility.",
    timestamp: "2025-07-02T06:00:00",
    read: false,
    priority: "medium",
    sender: "VendorBridge System",
  },
  {
    id: "N-2025-V015",
    type: "update",
    title: "Payment Terms Updated",
    message: "DataFlow Solutions has updated their default payment terms to Net 45. Review your active quotations.",
    timestamp: "2025-06-28T06:00:00",
    read: true,
    priority: "low",
    sender: "VendorBridge System",
  },
]
