export interface VendorRfqItem {
  name: string
  description: string
  quantity: number
  specifications: string[]
  unitType: string
}

export interface VendorRfqAttachment {
  name: string
  type: "pdf" | "doc" | "image" | "drawing" | "spec"
  url: string
}

export interface VendorRfq {
  id: string
  title: string
  issuedBy: string
  company: string
  category: string
  deadline: string
  status: "Open" | "Active" | "Closing Soon"
  itemsCount: number
  estimatedBudget?: string
  description: string
  keyRequirements: string[]
  hasAttachments: boolean
  deliveryLocation: string
  paymentTerms: string
  warrantyRequirements: string
  specialConditions: string[]
  items: VendorRfqItem[]
  attachments: VendorRfqAttachment[]
}

export const vendorRfqs: VendorRfq[] = [
  {
    id: "RFQ-2025-0042",
    title: "Laptop Procurement – 50 Units",
    issuedBy: "Sarah Chen",
    company: "TechCorp International",
    category: "IT Hardware",
    deadline: "2025-07-15T17:00:00",
    status: "Open",
    itemsCount: 3,
    estimatedBudget: "$75,000 – $90,000",
    description: "We are seeking qualified vendors to supply 50 enterprise-grade laptops for our new engineering hires. Devices must support virtualization workloads and come with a minimum 3-year onsite warranty.",
    keyRequirements: [
      "Minimum 16GB RAM, 512GB SSD",
      "Intel i7 or AMD Ryzen 7 equivalent",
      "Pre-installed Windows 11 Pro",
      "3-year onsite warranty",
    ],
    hasAttachments: true,
    deliveryLocation: "TechCorp HQ, 1200 Innovation Drive, San Francisco, CA 94107",
    paymentTerms: "Net 45 after delivery and inspection. 30% advance payment for orders over $80,000.",
    warrantyRequirements: "Minimum 3-year comprehensive warranty with next-business-day onsite service. Extended warranty options must be quoted separately.",
    specialConditions: [
      "All devices must be unboxed, configured with corporate image, and tested before delivery",
      "Vendor must provide temporary loaner devices during any warranty repairs exceeding 48 hours",
      "Compliance with California e-waste regulations required",
    ],
    items: [
      {
        name: "Enterprise Laptop – Model A",
        description: "High-performance laptop for software engineering team",
        quantity: 35,
        specifications: ["Intel Core i7-13700H", "16GB DDR5 RAM", "512GB NVMe SSD", "15.6\" FHD IPS Display", "Thunderbolt 4 x2"],
        unitType: "Units",
      },
      {
        name: "Enterprise Laptop – Model B",
        description: "Ultra-portable laptop for management team",
        quantity: 10,
        specifications: ["Intel Core i7-1365U", "32GB DDR5 RAM", "1TB NVMe SSD", "14\" 2.8K OLED Display", "Fingerprint Reader"],
        unitType: "Units",
      },
      {
        name: "Docking Station",
        description: "Universal USB-C docking station with dual monitor support",
        quantity: 50,
        specifications: ["USB-C Power Delivery 100W", "Dual HDMI 2.1 + DisplayPort", "Gigabit Ethernet", "USB-A 3.2 x4", "3.5mm Audio"],
        unitType: "Units",
      },
    ],
    attachments: [
      { name: "RFQ_Spec_Sheet.pdf", type: "pdf", url: "#" },
      { name: "Technical_Requirements.docx", type: "doc", url: "#" },
      { name: "Warranty_Terms.pdf", type: "pdf", url: "#" },
      { name: "Reference_Setup.png", type: "image", url: "#" },
    ],
  },
  {
    id: "RFQ-2025-0043",
    title: "Office Renovation – Floor 4 & 5",
    issuedBy: "Michael Torres",
    company: "Vertex Properties",
    category: "Construction",
    deadline: "2025-07-20T14:00:00",
    status: "Active",
    itemsCount: 5,
    estimatedBudget: "$120,000 – $150,000",
    description: "Complete interior renovation of the 4th and 5th floors including open-plan workspaces, 8 meeting rooms, break areas, and executive offices. Scope includes demolition, electrical, HVAC, carpentry, and finishing.",
    keyRequirements: [
      "Licensed contractor with commercial interior fit-out experience",
      "Must complete within 45 calendar days",
      "OSHA safety compliance required",
      "Sustainable materials preferred (LEED certification a plus)",
    ],
    hasAttachments: true,
    deliveryLocation: "Vertex Tower, 500 Market Street, San Francisco, CA 94105",
    paymentTerms: "Milestone-based: 20% upon start, 40% at 50% completion, 35% upon completion, 5% held as retention for 90 days.",
    warrantyRequirements: "Minimum 2-year workmanship warranty on all construction. 5-year warranty on HVAC and electrical work. 10-year on roofing and waterproofing.",
    specialConditions: [
      "Work must be conducted during off-hours (6 PM – 6 AM) to minimize business disruption",
      "Noise levels must not exceed 60dB during daytime preparation work",
      "All materials must be stored in designated areas; daily site cleanup required",
      "Contractor must provide weekly progress reports with photographic evidence",
    ],
    items: [
      {
        name: "Demolition & Site Preparation",
        description: "Remove existing partitions, flooring, ceiling tiles; dispose of debris",
        quantity: 1,
        specifications: ["Asbestos-free verified", "Selective demolition only", "Structural walls to remain"],
        unitType: "Lump Sum",
      },
      {
        name: "Electrical & Data Cabling",
        description: "Complete rewiring, data ports, and lighting installation",
        quantity: 22000,
        specifications: ["Cat6a data cabling", "LED panel lighting with dimmers", "UPS-backed circuits for server room", "Minimum 8 power outlets per 100sqft"],
        unitType: "Sq Ft",
      },
      {
        name: "Workstations Installation",
        description: "Modular workstations with sit-stand desks",
        quantity: 80,
        specifications: ["Electric height-adjustable", "60\"x30\" work surface", "Cable management tray", "Under-desk personal locker"],
        unitType: "Workstations",
      },
      {
        name: "Meeting Room Fit-out",
        description: "8 meeting rooms with AV integration",
        quantity: 8,
        specifications: ["75\" Interactive displays x8", "Soundproof wall panels", "Video conferencing system", "Motorized blackout blinds"],
        unitType: "Rooms",
      },
      {
        name: "Break Area Furnishing",
        description: "Kitchenette, seating, and pantry setup",
        quantity: 2,
        specifications: ["Quartz countertops", "Commercial grade refrigerator x2", "Microwave x2, coffee machine x2", "Seating for 20 per area"],
        unitType: "Areas",
      },
    ],
    attachments: [
      { name: "Floor_Plan_4F.pdf", type: "drawing", url: "#" },
      { name: "Floor_Plan_5F.pdf", type: "drawing", url: "#" },
      { name: "Electrical_Schematic.pdf", type: "spec", url: "#" },
      { name: "Design_Moodboard.pdf", type: "pdf", url: "#" },
      { name: "Site_Photos.zip", type: "image", url: "#" },
    ],
  },
  {
    id: "RFQ-2025-0044",
    title: "Cloud Infrastructure – AWS Migration",
    issuedBy: "Priya Patel",
    company: "DataFlow Solutions",
    category: "IT Services",
    deadline: "2025-07-10T12:00:00",
    status: "Closing Soon",
    itemsCount: 4,
    estimatedBudget: "$200,000 – $280,000",
    description: "Migration of on-premise infrastructure to AWS, including 15 production servers, 3 databases, and associated network services. Vendor must provide architecture design, migration execution, and 6-month post-migration support.",
    keyRequirements: [
      "AWS Advanced or Premier Partner required",
      "Must have completed at least 3 migrations of similar scale",
      "SOC 2 Type II compliance a must",
      "Proposed timeline: 12 weeks for full migration",
    ],
    hasAttachments: true,
    deliveryLocation: "Remote / DataFlow datacenter at 880 Howard St, San Francisco, CA",
    paymentTerms: "50% upfront, 25% on successful cutover, 25% after 90 days of stable operations.",
    warrantyRequirements: "6-month post-migration support included. SLA of 4-hour response time for critical issues. Monthly performance review meetings for the first quarter.",
    specialConditions: [
      "All data must be encrypted in transit and at rest using AWS KMS",
      "Zero-downtime migration required for production workloads",
      "DR/BCP plan must be tested and documented before cutover",
      "Knowledge transfer sessions (4 sessions, 2 hours each) to be provided to internal team",
      "All Terraform/CloudFormation scripts must be handed over post-migration",
    ],
    items: [
      {
        name: "AWS Architecture Design",
        description: "Well-Architected Framework review, landing zone setup, network design",
        quantity: 1,
        specifications: ["Multi-AZ design", "Auto-scaling groups", "VPC with public/private subnets", "Security groups + NACLs"],
        unitType: "Lump Sum",
      },
      {
        name: "Server Migration",
        description: "Lift-and-shift and re-platform migration of 15 servers",
        quantity: 15,
        specifications: ["AWS MGN (CloudEndure) migration", "OS compatibility check", "Performance baseline before/after", "Rollback plan documented"],
        unitType: "Servers",
      },
      {
        name: "Database Migration",
        description: "Migration of PostgreSQL and MySQL databases to AWS RDS/Aurora",
        quantity: 3,
        specifications: ["AWS DMS with CDC", "Schema conversion if needed", "Encryption at rest enabled", "Automated backup with 35-day retention"],
        unitType: "Databases",
      },
      {
        name: "Post-Migration Support",
        description: "6 months of production support and optimization",
        quantity: 6,
        specifications: ["4-hour critical response SLA", "Monthly cost optimization review", "Security patch management", "24/7 monitoring setup"],
        unitType: "Months",
      },
    ],
    attachments: [
      { name: "Current_Architecture_Diagram.pdf", type: "drawing", url: "#" },
      { name: "Migration_Checklist.xlsx", type: "doc", url: "#" },
      { name: "Compliance_Requirements.pdf", type: "pdf", url: "#" },
      { name: "Network_Topology.png", type: "image", url: "#" },
      { name: "RFP_Response_Template.docx", type: "doc", url: "#" },
    ],
  },
  {
    id: "RFQ-2025-0045",
    title: "Office Supplies – Q3 Bulk Order",
    issuedBy: "Jennifer Walsh",
    company: "MetroCorp Group",
    category: "Office Supplies",
    deadline: "2025-07-05T16:00:00",
    status: "Closing Soon",
    itemsCount: 6,
    estimatedBudget: "$15,000 – $22,000",
    description: "Quarterly bulk order of general office supplies for all MetroCorp branches (5 locations). Standardized item list with brand preferences where applicable. Monthly deliveries preferred.",
    keyRequirements: [
      "Ability to deliver to 5 separate locations",
      "Brand preferences: Staples, Post-it, Pilot, Avery",
      "Monthly installment deliveries (Jul, Aug, Sep)",
      "Online ordering portal for mid-cycle replenishment",
    ],
    hasAttachments: false,
    deliveryLocation: "Multi-location delivery (5 branches in Bay Area)",
    paymentTerms: "Net 30. Early payment discount of 2% if paid within 10 days.",
    warrantyRequirements: "All items must be new and in original packaging. Damaged items replaced within 48 hours at vendor's cost.",
    specialConditions: [
      "Items must be sorted and labeled per branch location",
      "Eco-friendly/ recycled products preferred",
      "Delivery window: 8 AM – 12 PM, Monday–Thursday",
    ],
    items: [
      {
        name: "Copy Paper – A4",
        description: "80gsm white multipurpose paper, 500 sheets per ream",
        quantity: 200,
        specifications: ["80gsm brightness ≥ 92", "Suitable for double-sided printing", "FSC certified"],
        unitType: "Reams",
      },
      {
        name: "Sticky Notes – 3x3",
        description: "Yellow sticky notes, 100 sheets per pad",
        quantity: 300,
        specifications: ["Brand: Post-it preferred", "Super-sticky adhesive", "Recyclable"],
        unitType: "Pads",
      },
      {
        name: "Ballpoint Pens – Blue",
        description: "Medium point (1.0mm) blue ink pens",
        quantity: 500,
        specifications: ["Brand: Pilot or equivalent", "Medium point 1.0mm", "Retractable with grip"],
        unitType: "Units",
      },
      {
        name: "File Folders – Letter",
        description: "Letter-size manila file folders, 100 per box",
        quantity: 50,
        specifications: ["Letter size (8.5\" x 11\")", "Manila stock 11pt", "1/3 cut tab with reinforced edge"],
        unitType: "Boxes",
      },
      {
        name: "Printer Toner – HP 26X",
        description: "High-yield toner cartridge for HP LaserJet Pro series",
        quantity: 20,
        specifications: ["HP 26X (CF226X)", "High yield ~9,000 pages", "Genuine HP or compatible"],
        unitType: "Cartridges",
      },
      {
        name: "Shipping Labels & Tape",
        description: "A4 adhesive shipping labels and clear packing tape",
        quantity: 10,
        specifications: ["A4 adhesive labels 2-up", "Clear packing tape 2\" x 100yds", "Water-activated or acrylic"],
        unitType: "Packs",
      },
    ],
    attachments: [],
  },
  {
    id: "RFQ-2025-0046",
    title: "Medical Equipment – ICU Monitors",
    issuedBy: "Dr. James Okafor",
    company: "St. Mary's Medical Center",
    category: "Medical Equipment",
    deadline: "2025-07-28T17:00:00",
    status: "Active",
    itemsCount: 2,
    estimatedBudget: "$180,000 – $220,000",
    description: "Procurement of 20 patient monitoring systems for the new ICU wing. Devices must integrate with existing Epic EHR system and support continuous vital sign monitoring with central station capability.",
    keyRequirements: [
      "FDA 510(k) cleared",
      "Epic EHR integration certified",
      "Central monitoring station included",
      "5-year warranty with 24-hour replacement",
      "Training for 40 nursing staff included",
    ],
    hasAttachments: true,
    deliveryLocation: "St. Mary's Medical Center, 450 Grand Avenue, Oakland, CA 94612",
    paymentTerms: "Net 60. Letter of credit required for orders exceeding $200,000.",
    warrantyRequirements: "5-year comprehensive warranty covering parts, labor, and on-site calibration. Loaner equipment provided during any repair exceeding 24 hours.",
    specialConditions: [
      "Installation must be coordinated with ongoing construction schedule",
      "All devices require biomedical engineering sign-off before clinical use",
      "Data privacy: HIPAA compliance documentation required",
      "Vendor must provide 2-day on-site training for ICU nursing staff",
    ],
    items: [
      {
        name: "Patient Monitoring System – Bedside",
        description: "Multi-parameter bedside monitor with 15\" touchscreen",
        quantity: 20,
        specifications: ["ECG (5-lead, 12-lead capable)", "SpO2, NIBP, EtCO2, Temperature", "15\" HD touchscreen", "Wi-Fi + Ethernet connectivity", "Epic EHR interface module"],
        unitType: "Units",
      },
      {
        name: "Central Monitoring Station",
        description: "Central station with 20-bed capacity viewing",
        quantity: 2,
        specifications: ["24\" quad-view display", "20-bed capacity per station", "Remote alarm management", "24-hour waveform storage", "Nurse call integration"],
        unitType: "Units",
      },
    ],
    attachments: [
      { name: "Equipment_Specifications.pdf", type: "spec", url: "#" },
      { name: "FDA_Clearance_Certificate.pdf", type: "pdf", url: "#" },
      { name: "Installation_Requirements.docx", type: "doc", url: "#" },
      { name: "Integration_Guide_Epic.pdf", type: "pdf", url: "#" },
    ],
  },
  {
    id: "RFQ-2025-0047",
    title: "Annual IT Support Services",
    issuedBy: "Raymond Kim",
    company: "Pacific Northwest University",
    category: "IT Services",
    deadline: "2025-08-01T14:00:00",
    status: "Open",
    itemsCount: 3,
    estimatedBudget: "$95,000 – $130,000",
    description: "Comprehensive annual IT support contract covering helpdesk services, network infrastructure maintenance, and endpoint management for 500+ staff and 2,000+ student devices across 3 campuses.",
    keyRequirements: [
      "Minimum 5 years experience in educational IT support",
      "24/7 helpdesk with < 1-hour response time for critical issues",
      "Microsoft Gold Partner preferred",
      "Experience with Canvas LMS and Ellucian Banner",
    ],
    hasAttachments: true,
    deliveryLocation: "Pacific Northwest University, 3 campuses in Portland, OR metro area",
    paymentTerms: "Quarterly payments in advance. Annual contract with auto-renewal clause. 3% annual cap on price increase.",
    warrantyRequirements: "All work covered by 90-day workmanship warranty. Replacement parts warranty as per manufacturer + 30 days. Re-work at no cost if issue recurs within 30 days.",
    specialConditions: [
      "Helpdesk must provide bilingual support (English/Spanish)",
      "Monthly SLA reports required",
      "Vendor must maintain a local presence within 50 miles of main campus",
      "Background checks required for all on-site personnel",
      "Cyber insurance minimum $5M coverage required",
    ],
    items: [
      {
        name: "Helpdesk Support Services",
        description: "24/7 multi-channel helpdesk for staff and students",
        quantity: 12,
        specifications: ["Phone, email, chat, ticketing portal", "Tier 1-3 support", "< 1 hour critical response", "Monthly SLA reports"],
        unitType: "Months",
      },
      {
        name: "Network Infrastructure Maintenance",
        description: "Maintenance and upgrades of campus network equipment",
        quantity: 1,
        specifications: ["Quarterly network health audits", "Firmware updates and patch management", "Wireless site surveys", "SLA: 4-hour on-site for critical failures"],
        unitType: "Annual",
      },
      {
        name: "Endpoint Management",
        description: "MDM and endpoint security management for 2,500 devices",
        quantity: 2500,
        specifications: ["Microsoft Intune/Endpoint Manager", "Patch deployment within 7 days", "Antivirus and EDR management", "Asset tracking and reporting"],
        unitType: "Devices",
      },
    ],
    attachments: [
      { name: "SOW_Template.pdf", type: "pdf", url: "#" },
      { name: "SLA_Requirements.pdf", type: "spec", url: "#" },
      { name: "Campus_Network_Map.pdf", type: "drawing", url: "#" },
      { name: "Current_Inventory.xlsx", type: "doc", url: "#" },
    ],
  },
]
