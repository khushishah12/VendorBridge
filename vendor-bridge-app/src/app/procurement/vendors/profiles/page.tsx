"use client"

import { useState } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  ArrowLeft,
  Building2,
  Star,
  Mail,
  Phone,
  MapPin,
  FileText,
  BarChart3,
  Eye,
  XCircle,
  CheckCircle2,
  CreditCard,
  Calendar,
  Edit,
  Download,
  Award,
  TrendingUp,
  Users,
  Package,
  DollarSign,
} from "lucide-react"
import Link from "next/link"

interface VendorProfile {
  id: string
  name: string
  category: string
  contactPerson: string
  email: string
  phone: string
  location: string
  status: "Active" | "Inactive" | "Under Review"
  rating: number
  totalContracts: number
  totalSpend: number
  since: string
  description: string
  certifications: string[]
  recentDeals: { poRef: string; amount: number; date: string; status: string }[]
}

const mockProfiles: VendorProfile[] = [
  {
    id: "V-001", name: "TechSolutions Inc.", category: "IT Hardware & Software",
    contactPerson: "Sarah Chen", email: "sarah@techsolutions.com", phone: "+1 (555) 123-4567",
    location: "San Francisco, CA", status: "Active", rating: 4.8, totalContracts: 24, totalSpend: 1250000,
    since: "2022-03-15",
    description: "Leading provider of enterprise IT hardware, cloud infrastructure, and software solutions. Certified partner of major cloud platforms.",
    certifications: ["ISO 27001", "SOC 2 Type II", "AWS Advanced Partner", "Microsoft Gold Partner"],
    recentDeals: [
      { poRef: "PO-2025-0042", amount: 245000, date: "2025-06-01", status: "Completed" },
      { poRef: "PO-2025-0043", amount: 184500, date: "2025-05-28", status: "In Progress" },
    ],
  },
  {
    id: "V-002", name: "BuildRight Construction", category: "Construction & Infrastructure",
    contactPerson: "Mike Rodriguez", email: "mike@buildright.com", phone: "+1 (555) 234-5678",
    location: "Houston, TX", status: "Active", rating: 4.2, totalContracts: 18, totalSpend: 3400000,
    since: "2021-08-01",
    description: "Full-service construction company specializing in commercial infrastructure, warehouse development, and office renovations.",
    certifications: ["OSHA Certified", "LEED Accredited", "Licensed General Contractor"],
    recentDeals: [
      { poRef: "PO-2025-0044", amount: 445000, date: "2025-06-01", status: "Draft" },
    ],
  },
  {
    id: "V-007", name: "CloudSync Technologies", category: "Cloud Services & SaaS",
    contactPerson: "Aisha Patel", email: "aisha@cloudsync.io", phone: "+1 (555) 789-0123",
    location: "Seattle, WA", status: "Active", rating: 4.9, totalContracts: 15, totalSpend: 720000,
    since: "2023-05-01",
    description: "Innovative cloud-native SaaS provider offering enterprise collaboration tools, data analytics platforms, and AI/ML solutions.",
    certifications: ["ISO 27001", "GDPR Compliant", "AWS Advanced Partner"],
    recentDeals: [
      { poRef: "PO-2025-0052", amount: 95000, date: "2025-06-05", status: "Sent" },
    ],
  },
]

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  Inactive: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
  "Under Review": "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
}

export default function VendorProfilesPage() {
  const [detailId, setDetailId] = useState<string | null>(null)
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  function showAction(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(null), 2500)
  }

  const detail = mockProfiles.find((p) => p.id === detailId)

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <Link href="/vendors" className="mb-2 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
            <ArrowLeft className="h-4 w-4" /> Back to Vendor List
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Vendor Profiles</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Detailed profiles of key vendors</p>
        </div>

        {actionMsg && (
          <div className="mb-4 rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{actionMsg}</div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockProfiles.map((profile) => (
            <div key={profile.id} className="group rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-base font-bold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                      {profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{profile.name}</h3>
                      <p className="text-xs text-zinc-400">{profile.category}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${statusStyles[profile.status]}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${profile.status === "Active" ? "bg-emerald-500" : profile.status === "Inactive" ? "bg-zinc-400" : "bg-amber-500"}`} />
                    {profile.status}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-2">{profile.description}</p>

                <div className="mt-4 flex items-center gap-4 text-sm text-zinc-500">
                  <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" /> {profile.rating}</span>
                  <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {profile.totalContracts} deals</span>
                  <span className="inline-flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> ${(profile.totalSpend / 1000).toFixed(0)}k</span>
                </div>

                {/* Certifications */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {profile.certifications.slice(0, 2).map((cert) => (
                    <span key={cert} className="inline-flex items-center gap-0.5 rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      <Award className="h-3 w-3" /> {cert}
                    </span>
                  ))}
                  {profile.certifications.length > 2 && (
                    <span className="text-xs text-zinc-400">+{profile.certifications.length - 2} more</span>
                  )}
                </div>

                {/* Contact */}
                <div className="mt-4 space-y-1.5 text-xs text-zinc-500">
                  <span className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> {profile.email}</span>
                  <span className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> {profile.phone}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {profile.location}</span>
                </div>
              </div>
              <div className="border-t border-zinc-100 px-6 py-3 dark:border-zinc-800">
                <button onClick={() => setDetailId(profile.id)}
                  className="flex w-full items-center justify-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                  <Eye className="h-4 w-4" /> View Full Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            <div className="sticky top-0 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-700 dark:bg-zinc-900">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{detail.name}</h2>
                <p className="text-sm text-zinc-400">{detail.id} &middot; {detail.category}</p>
              </div>
              <button onClick={() => setDetailId(null)} className="rounded-lg p-1 text-zinc-400 hover:text-zinc-600"><XCircle className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-indigo-100 text-xl font-bold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                  {detail.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[detail.status]}`}>{detail.status}</span>
                    <span className="inline-flex items-center gap-1 text-amber-500"><Star className="h-4 w-4 fill-amber-400" /> {detail.rating}</span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-500">Partner since {detail.since}</p>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{detail.description}</p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900">
                  <Mail className="h-4 w-4 shrink-0 text-zinc-400" />
                  <div><p className="text-xs text-zinc-400">Email</p><p className="text-sm text-zinc-700 dark:text-zinc-300">{detail.email}</p></div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900">
                  <Phone className="h-4 w-4 shrink-0 text-zinc-400" />
                  <div><p className="text-xs text-zinc-400">Phone</p><p className="text-sm text-zinc-700 dark:text-zinc-300">{detail.phone}</p></div>
                </div>
                <div className="sm:col-span-2 flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900">
                  <MapPin className="h-4 w-4 shrink-0 text-zinc-400" />
                  <div><p className="text-xs text-zinc-400">Location</p><p className="text-sm text-zinc-700 dark:text-zinc-300">{detail.location}</p></div>
                </div>
              </div>

              {/* Certifications */}
              <div>
                <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  <Award className="h-4 w-4 text-zinc-400" /> Certifications
                </h4>
                <div className="flex flex-wrap gap-2">
                  {detail.certifications.map((cert) => (
                    <span key={cert} className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" /> {cert}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent Deals */}
              <div>
                <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  <Package className="h-4 w-4 text-zinc-400" /> Recent Deals
                </h4>
                <div className="space-y-2">
                  {detail.recentDeals.map((deal) => (
                    <div key={deal.poRef} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900">
                      <div>
                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{deal.poRef}</p>
                        <p className="text-xs text-zinc-400">{deal.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">${deal.amount.toLocaleString()}</p>
                        <p className="text-xs text-zinc-400">{deal.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center dark:border-zinc-700 dark:bg-zinc-900">
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{detail.totalContracts}</p>
                  <p className="text-xs text-zinc-500">Total Contracts</p>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center dark:border-zinc-700 dark:bg-zinc-900">
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">${(detail.totalSpend / 1000).toFixed(0)}k</p>
                  <p className="text-xs text-zinc-500">Total Spend</p>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center dark:border-zinc-700 dark:bg-zinc-900">
                  <p className="text-2xl font-bold text-amber-500">{detail.rating}</p>
                  <p className="text-xs text-zinc-500">Rating</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-700">
                <button onClick={() => { setDetailId(null); showAction(`Editing ${detail.name} profile...`) }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  <Edit className="h-4 w-4" /> Edit Profile
                </button>
                <button onClick={() => { setDetailId(null); showAction(`Performance report for ${detail.name} generated`) }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                  <BarChart3 className="h-4 w-4" /> Performance Report
                </button>
                <button onClick={() => { setDetailId(null); showAction(`Contact ${detail.name} via email...`) }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  <Mail className="h-4 w-4" /> Contact Vendor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
