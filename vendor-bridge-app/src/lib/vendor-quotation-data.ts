export type VendorQuoteStatus = "Draft" | "Submitted" | "Under Review" | "Shortlisted" | "Accepted" | "Rejected"
export type QuotePriority = "High" | "Medium" | "Low"

export interface VendorQuotation {
  id: string
  rfqId: string
  rfqTitle: string
  company: string
  submittedDate: string
  amount: number
  status: VendorQuoteStatus
  priority: QuotePriority
  expiryDate: string
  notes: string
  items: { name: string; quantity: number; unitPrice: number; total: number }[]
}

export const vendorQuotations: VendorQuotation[] = [
  {
    id: "QTN-2025-0101",
    rfqId: "RFQ-2025-0042",
    rfqTitle: "Laptop Procurement – 50 Units",
    company: "TechCorp International",
    submittedDate: "2025-06-20",
    amount: 84500,
    status: "Under Review",
    priority: "High",
    expiryDate: "2025-07-30",
    notes: "Offering Dell Latitude 5540 with 3-year pro support. Volume discount applied.",
    items: [
      { name: "Dell Latitude 5540", quantity: 35, unitPrice: 1450, total: 50750 },
      { name: "Dell Latitude 7440", quantity: 10, unitPrice: 1950, total: 19500 },
      { name: "Dell Universal Dock WD19S", quantity: 50, unitPrice: 285, total: 14250 },
    ],
  },
  {
    id: "QTN-2025-0102",
    rfqId: "RFQ-2025-0043",
    rfqTitle: "Office Renovation – Floor 4 & 5",
    company: "Vertex Properties",
    submittedDate: "2025-06-22",
    amount: 138000,
    status: "Shortlisted",
    priority: "High",
    expiryDate: "2025-08-01",
    notes: "Completed similar fit-out for Salesforce tower in 2024. Can start within 2 weeks.",
    items: [
      { name: "Demolition & Site Preparation", quantity: 1, unitPrice: 15000, total: 15000 },
      { name: "Electrical & Data Cabling", quantity: 22000, unitPrice: 2.5, total: 55000 },
      { name: "Workstations Installation", quantity: 80, unitPrice: 650, total: 52000 },
      { name: "Meeting Room Fit-out", quantity: 8, unitPrice: 1750, total: 14000 },
      { name: "Break Area Furnishing", quantity: 2, unitPrice: 1000, total: 2000 },
    ],
  },
  {
    id: "QTN-2025-0103",
    rfqId: "RFQ-2025-0044",
    rfqTitle: "Cloud Infrastructure – AWS Migration",
    company: "DataFlow Solutions",
    submittedDate: "2025-06-25",
    amount: 245000,
    status: "Accepted",
    priority: "High",
    expiryDate: "2025-08-15",
    notes: "AWS Advanced Partner with 5 certified architects. Migration completed in 10 weeks.",
    items: [
      { name: "AWS Architecture Design", quantity: 1, unitPrice: 35000, total: 35000 },
      { name: "Server Migration", quantity: 15, unitPrice: 8000, total: 120000 },
      { name: "Database Migration", quantity: 3, unitPrice: 15000, total: 45000 },
      { name: "Post-Migration Support", quantity: 6, unitPrice: 7500, total: 45000 },
    ],
  },
  {
    id: "QTN-2025-0104",
    rfqId: "RFQ-2025-0045",
    rfqTitle: "Office Supplies – Q3 Bulk Order",
    company: "MetroCorp Group",
    submittedDate: "2025-06-28",
    amount: 18750,
    status: "Submitted",
    priority: "Low",
    expiryDate: "2025-07-20",
    notes: "Can deliver to all 5 branches. Offering 2% early payment discount.",
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
    id: "QTN-2025-0105",
    rfqId: "RFQ-2025-0046",
    rfqTitle: "Medical Equipment – ICU Monitors",
    company: "St. Mary's Medical Center",
    submittedDate: "2025-07-01",
    amount: 205000,
    status: "Under Review",
    priority: "High",
    expiryDate: "2025-08-10",
    notes: "Partnering with Philips for their IntelliVue MX850. FDA cleared and Epic integrated.",
    items: [
      { name: "Philips IntelliVue MX850", quantity: 20, unitPrice: 8750, total: 175000 },
      { name: "Central Monitoring Station", quantity: 2, unitPrice: 15000, total: 30000 },
    ],
  },
  {
    id: "QTN-2025-0106",
    rfqId: "RFQ-2025-0047",
    rfqTitle: "Annual IT Support Services",
    company: "Pacific Northwest University",
    submittedDate: "2025-07-03",
    amount: 112000,
    status: "Rejected",
    priority: "Medium",
    expiryDate: "2025-07-25",
    notes: "Budget exceeded their allocation. Will re-quote for reduced scope.",
    items: [
      { name: "Helpdesk Support Services", quantity: 12, unitPrice: 4500, total: 54000 },
      { name: "Network Infrastructure Maintenance", quantity: 1, unitPrice: 28000, total: 28000 },
      { name: "Endpoint Management", quantity: 2500, unitPrice: 12, total: 30000 },
    ],
  },
]
