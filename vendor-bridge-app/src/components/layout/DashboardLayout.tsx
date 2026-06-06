"use client"

import { useState, useEffect } from "react"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [role, setRole] = useState<string>("procurement")

  useEffect(() => {
    setRole(localStorage.getItem("vb_role") || "procurement")
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar role={role} />
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
            <Sidebar role={role} />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:ml-64">
        <Topbar onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} role={role} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
