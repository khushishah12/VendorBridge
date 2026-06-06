"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, LogOut, ChevronDown, Bell, Menu, Building2 } from "lucide-react"

const roleConfig: Record<string, { name: string; label: string; initials: string; dashboard: string }> = {
  admin: { name: "System Administrator", label: "Full Access", initials: "SA", dashboard: "Admin Dashboard" },
  procurement: { name: "Procurement Officer", label: "Procurement Manager", initials: "PO", dashboard: "Procurement Dashboard" },
  vendor: { name: "Vendor Partner", label: "Registered Vendor", initials: "VP", dashboard: "Vendor Portal" },
  manager: { name: "Senior Manager", label: "Approval Authority", initials: "SM", dashboard: "Approval Dashboard" },
}

import { useAuth } from "@/context/AuthContext"

export default function Topbar({ onToggleSidebar, role }: { onToggleSidebar?: () => void; role?: string }) {
  const { currentUser, logout } = useAuth()
  const [profileOpen, setProfileOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const resolvedRole = currentUser?.role 
    ? (currentUser.role === 'PROCUREMENT_OFFICER' ? 'procurement' : currentUser.role.toLowerCase())
    : (role || "procurement")

  const config = roleConfig[resolvedRole] ?? roleConfig.procurement
  const email = currentUser?.email || "user@vendorbridge.io"
  const name = currentUser?.name || config.name

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
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-zinc-200/60 bg-white/75 backdrop-blur-xl px-4 dark:border-zinc-800/60 dark:bg-zinc-950/75">
      {/* Left */}
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onToggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 lg:hidden dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        >
          <Menu className="h-5 w-5" />
        </motion.button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {config.dashboard}
            </h1>
            <span className={`hidden sm:inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              role === "admin" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" :
              role === "procurement" ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300" :
              role === "vendor" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" :
              "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
            }`}>
              {config.label}
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{config.name}</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">3</span>
        </motion.button>

        <div className="relative" ref={dropdownRef}>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white shadow-sm">
              {config.initials}
            </div>
            <ChevronDown className={`hidden h-4 w-4 text-zinc-400 transition-transform duration-200 sm:block ${profileOpen ? "rotate-180" : ""}`} />
          </motion.button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-zinc-200 bg-white/90 backdrop-blur-xl shadow-lg dark:border-zinc-700 dark:bg-zinc-950/90"
              >
                <div className="border-b border-zinc-100 p-3 dark:border-zinc-800">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{name}</p>
                  <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{email}</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={() => logout()}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
