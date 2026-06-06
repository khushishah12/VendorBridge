"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronLeft, type LucideIcon } from "lucide-react"
import { procurementSidebar, vendorSidebar, type SubMenuItem } from "@/lib/sidebar-data"

function SidebarSubItem({ item, collapsed }: { item: SubMenuItem; collapsed: boolean }) {
  const pathname = usePathname()
  const active = pathname === item.href

  return (
    <Link
      href={item.href}
      data-active={active}
      className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200
        ${active
          ? "bg-indigo-50 text-indigo-700 font-medium dark:bg-indigo-950/50 dark:text-indigo-300"
          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        }
        ${collapsed ? "justify-center px-2" : ""}
      `}
      title={collapsed ? item.label : undefined}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      {!collapsed && (
        <span className="flex items-center gap-1.5 truncate">
          {item.label}
          {item.starred && (
            <span className="inline-flex items-center justify-center rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
              ⭐
            </span>
          )}
        </span>
      )}
    </Link>
  )
}

type SidebarGroupProps = {
  label: string
  icon: LucideIcon
  childrenItems: SubMenuItem[]
  collapsed: boolean
  defaultOpen?: boolean
}

function SidebarGroup({ label, icon: Icon, childrenItems, collapsed, defaultOpen }: SidebarGroupProps) {
  const pathname = usePathname()
  const isActive = childrenItems.some((c) => pathname === c.href)
  const [open, setOpen] = useState(defaultOpen ?? isActive)

  return (
    <div>
      <button
        onClick={() => !collapsed && setOpen(!open)}
        data-active={isActive}
        className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200
          ${isActive
            ? "text-indigo-700 dark:text-indigo-300"
            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          }
          ${collapsed ? "justify-center px-2" : ""}
        `}
        title={collapsed ? label : undefined}
      >
        <Icon className="h-5 w-5 shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1 text-left truncate">{label}</span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open ? "rotate-0" : "-rotate-90"}`}
            />
          </>
        )}
      </button>
      {!collapsed && (
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-zinc-200 pl-2 dark:border-zinc-700">
            {childrenItems.map((child) => (
              <SidebarSubItem key={child.href} item={child} collapsed={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Sidebar({ role }: { role?: string }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const isVendor = role === "vendor"
  const menuData = isVendor ? vendorSidebar : procurementSidebar

  return (
    <>
      {/* Mobile overlay */}
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-30 flex h-full flex-col border-r border-zinc-200 bg-white shadow-sm transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-950
          ${collapsed ? "w-16" : "w-64"}
        `}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-zinc-200 px-4 dark:border-zinc-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white">
            VB
          </div>
          {!collapsed && (
            <div className="flex items-center gap-2 min-w-0">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-lg font-bold text-transparent">
                VendorBridge
              </span>
              {isVendor && (
                <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  Vendor
                </span>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4 scrollbar-thin">
          <div className="flex flex-col gap-1">
            {menuData.map((item) =>
              item.children ? (
                <SidebarGroup
                  key={item.label}
                  label={item.label}
                  icon={item.icon}
                  childrenItems={item.children}
                  collapsed={collapsed}
                />
              ) : (
                <Link
                  key={item.label}
                  href={item.href ?? "/"}
                  data-active={pathname === item.href}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200
                    ${pathname === item.href
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                    }
                    ${collapsed ? "justify-center px-2" : ""}
                  `}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              ),
            )}
          </div>
        </nav>

        {/* Collapse Button */}
        <div className="border-t border-zinc-200 p-2 dark:border-zinc-800">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
