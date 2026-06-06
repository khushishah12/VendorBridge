"use client"

import { useState, useRef, useEffect } from "react"
import { User, LogOut, ChevronDown, Bell, Menu, Building2 } from "lucide-react"

const roleConfig: Record<string, { name: string; label: string; initials: string; dashboard: string }> = {
  admin: { name: "System Administrator", label: "Full Access", initials: "SA", dashboard: "Admin Dashboard" },
  procurement: { name: "Procurement Officer", label: "Procurement Manager", initials: "PO", dashboard: "Procurement Dashboard" },
  vendor: { name: "Vendor Partner", label: "Registered Vendor", initials: "VP", dashboard: "Vendor Portal" },
  manager: { name: "Senior Manager", label: "Approval Authority", initials: "SM", dashboard: "Approval Dashboard" },
}

export default function Topbar({ onToggleSidebar, role }: { onToggleSidebar?: () => void; role?: string }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const config = roleConfig[role ?? "procurement"] ?? roleConfig.procurement
  const email = typeof window !== "undefined" ? localStorage.getItem("vb_email") || "user@vendorbridge.io" : "user@vendorbridge.io"

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 lg:hidden dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{config.dashboard}</h1>
            {role === "vendor" && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                Vendor Access
              </span>
            )}
            {role === "admin" && (
              <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                Full Access
              </span>
            )}
            {role === "manager" && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                Manager Access
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Welcome back, {config.name}</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notifications bell */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-950" />
        </button>

        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${
              role === "vendor" ? "bg-gradient-to-br from-emerald-500 to-teal-600" : "bg-gradient-to-br from-indigo-500 to-purple-600"
            }`}>
              {config.initials}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{config.name}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{config.label}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-zinc-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 dark:border-zinc-700 dark:bg-zinc-900">
              {/* Profile header */}
              <div className={`px-4 py-6 text-white ${
                role === "vendor" ? "bg-gradient-to-r from-emerald-500 to-teal-600" : "bg-gradient-to-r from-indigo-500 to-purple-600"
              }`}>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-lg font-bold backdrop-blur-sm">
                    {config.initials}
                  </div>
                  <div>
                    <p className="font-semibold">{config.name}</p>
                    <p className="text-sm text-white/80">{email}</p>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="p-2">
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  <User className="h-4 w-4" />
                  Profile Settings
                </button>
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
                  <span className="flex h-4 w-4 items-center justify-center rounded bg-zinc-200 text-[10px] font-bold text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                    {role === "vendor" ? "V" : "PM"}
                  </span>
                  Role: {config.label}
                </button>
              </div>

              <div className="border-t border-zinc-200 p-2 dark:border-zinc-700">
                <button onClick={() => { localStorage.clear(); window.location.href = "/login" }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
