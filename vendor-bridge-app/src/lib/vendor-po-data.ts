export type VendorPoStatus = "Incoming" | "Accepted" | "In Progress" | "Delivered" | "Cancelled" | "Rejected"

export interface VendorPoItem {
  name: string
  quantity: number
  unitPrice: number
  total: number
}

export interface VendorPurchaseOrder {
  id: string
  rfqId: string
  rfqTitle: string
  company: string
  issuedDate: string
  deliveryDate: string
  status: VendorPoStatus
  amount: number
  paymentTerms: string
  shippingMethod: string
  notes: string
  items: VendorPoItem[]
}

export const vendorPurchaseOrders: VendorPurchaseOrder[] = [
  {
    id: "PO-2025-0081",
    rfqId: "RFQ-2025-0044",
    rfqTitle: "Cloud Infrastructure – AWS Migration",
    company: "DataFlow Solutions",
    issuedDate: "2025-07-05",
    deliveryDate: "2025-09-30",
    status: "In Progress",
    amount: 245000,
    paymentTerms: "50% upfront, 25% on cutover, 25% after 90 days",
    shippingMethod: "N/A (Service-based)",
    notes: "Kickoff scheduled for July 15. Access credentials to be shared 3 days prior.",
    items: [
      { name: "AWS Architecture Design", quantity: 1, unitPrice: 35000, total: 35000 },
      { name: "Server Migration", quantity: 15, unitPrice: 8000, total: 120000 },
      { name: "Database Migration", quantity: 3, unitPrice: 15000, total: 45000 },
      { name: "Post-Migration Support", quantity: 6, unitPrice: 7500, total: 45000 },
    ],
  },
  {
    id: "PO-2025-0082",
    rfqId: "RFQ-2025-0042",
    rfqTitle: "Laptop Procurement – 50 Units",
    company: "TechCorp International",
    issuedDate: "2025-07-08",
    deliveryDate: "2025-08-15",
    status: "Accepted",
    amount: 84500,
    paymentTerms: "Net 45 after delivery and inspection",
    shippingMethod: "Freight – FedEx Priority",
    notes: "Expedited shipping requested. Configurations confirmed with IT team.",
    items: [
      { name: "Dell Latitude 5540", quantity: 35, unitPrice: 1450, total: 50750 },
      { name: "Dell Latitude 7440", quantity: 10, unitPrice: 1950, total: 19500 },
      { name: "Dell Universal Dock WD19S", quantity: 50, unitPrice: 285, total: 14250 },
    ],
  },
  {
    id: "PO-2025-0083",
    rfqId: "RFQ-2025-0044",
    rfqTitle: "Office Renovation – Floor 4 & 5 (Phase 1)",
    company: "Vertex Properties",
    issuedDate: "2025-07-01",
    deliveryDate: "2025-08-30",
    status: "Incoming",
    amount: 138000,
    paymentTerms: "Milestone-based: 20% start, 40% midpoint, 35% completion, 5% retention",
    shippingMethod: "N/A (On-site service)",
    notes: "Awaiting signed copy. Floor 4 demolition to begin upon PO acceptance.",
    items: [
      { name: "Demolition & Site Preparation", quantity: 1, unitPrice: 15000, total: 15000 },
      { name: "Electrical & Data Cabling", quantity: 22000, unitPrice: 2.5, total: 55000 },
      { name: "Workstations Installation", quantity: 80, unitPrice: 650, total: 52000 },
      { name: "Meeting Room Fit-out", quantity: 8, unitPrice: 1750, total: 14000 },
      { name: "Break Area Furnishing", quantity: 2, unitPrice: 1000, total: 2000 },
    ],
  },
  {
    id: "PO-2025-0084",
    rfqId: "RFQ-2025-0046",
    rfqTitle: "Medical Equipment – ICU Monitors",
    company: "St. Mary's Medical Center",
    issuedDate: "2025-07-10",
    deliveryDate: "2025-09-01",
    status: "Incoming",
    amount: 205000,
    paymentTerms: "Net 60. Letter of credit required.",
    shippingMethod: "Medical-grade freight – Climate controlled",
    notes: "Installation must be coordinated with construction schedule. Biomedical sign-off required.",
    items: [
      { name: "Philips IntelliVue MX850", quantity: 20, unitPrice: 8750, total: 175000 },
      { name: "Central Monitoring Station", quantity: 2, unitPrice: 15000, total: 30000 },
    ],
  },
  {
    id: "PO-2025-0085",
    rfqId: "RFQ-2025-0045",
    rfqTitle: "Office Supplies – Q3 Bulk Order",
    company: "MetroCorp Group",
    issuedDate: "2025-07-02",
    deliveryDate: "2025-07-25",
    status: "Delivered",
    amount: 18750,
    paymentTerms: "Net 30",
    shippingMethod: "Ground – Multiple locations",
    notes: "Delivered to all 5 branches on July 22. Pending final inspection sign-off from Branch C.",
    items: [
      { name: "Copy Paper – A4", quantity: 200, unitPrice: 4.5, total: 900 },
      { name: "Sticky Notes – 3x3", quantity: 300, unitPrice: 1.8, total: 540 },
      { name: "Ballpoint Pens – Blue", quantity: 500, unitPrice: 0.85, total: 425 },
      { name: "File Folders – Letter", quantity: 50, unitPrice: 12, total: 600 },
      { name: "Printer Toner – HP 26X", quantity: 20, unitPrice: 65, total: 1300 },
      { name: "Shipping Labels & Tape", quantity: 10, unitPrice: 22, total: 220 },
    ],
  },
  {
    id: "PO-2025-0086",
    rfqId: "RFQ-2025-0043",
    rfqTitle: "Annual IT Support Services",
    company: "Pacific Northwest University",
    issuedDate: "2025-06-28",
    deliveryDate: "2025-07-15",
    status: "Cancelled",
    amount: 112000,
    paymentTerms: "N/A",
    shippingMethod: "N/A",
    notes: "Cancelled due to budget reallocation. Re-quote for reduced scope expected Q4.",
    items: [
      { name: "Helpdesk Support Services", quantity: 12, unitPrice: 4500, total: 54000 },
      { name: "Network Infrastructure Maintenance", quantity: 1, unitPrice: 28000, total: 28000 },
      { name: "Endpoint Management", quantity: 2500, unitPrice: 12, total: 30000 },
    ],
  },
]
