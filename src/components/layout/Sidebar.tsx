"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronLeft, type LucideIcon } from "lucide-react"
import { procurementSidebar, vendorSidebar, managerSidebar, adminSidebar, type SubMenuItem } from "@/lib/sidebar-data"
import FlowingMenu from "./FlowingMenu"

function SidebarSubItem({ item, collapsed }: { item: SubMenuItem; collapsed: boolean }) {
  const pathname = usePathname()
  const active = pathname === item.href

  return (
    <Link
      href={item.href}
      data-active={active}
      className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200
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
      {active && !collapsed && (
        <motion.span
          layoutId="sidebarActive"
          className="absolute inset-0 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 -z-10"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      {active && collapsed && (
        <motion.span
          layoutId="sidebarActiveCollapsed"
          className="absolute inset-0 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 -z-10"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
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
  onHoverChange: (label: string | null, e?: React.MouseEvent) => void
}

function SidebarGroup({ label, icon: Icon, childrenItems, collapsed, defaultOpen, onHoverChange }: SidebarGroupProps) {
  const pathname = usePathname()
  const isActive = childrenItems.some((c) => pathname === c.href)
  const [open, setOpen] = useState(defaultOpen ?? isActive)

  if (collapsed) {
    return (
      <div
        className="group relative"
        onMouseEnter={(e) => onHoverChange(label, e)}
        onMouseMove={(e) => onHoverChange(label, e)}
        onMouseLeave={() => onHoverChange(null)}
      >
        <div className="flex items-center justify-center rounded-lg px-3 py-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100">
          <Icon className="h-5 w-5 shrink-0" />
        </div>
        <div className="invisible absolute left-full top-0 ml-2 rounded-lg border border-zinc-200 bg-white p-2 shadow-lg opacity-0 transition-all group-hover:visible group-hover:opacity-100 dark:border-zinc-700 dark:bg-zinc-950 z-20">
          <p className="mb-1 px-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
          {childrenItems.map((child) => {
            const childActive = pathname === child.href
            return (
              <Link
                key={child.href}
                href={child.href}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm whitespace-nowrap ${
                  childActive ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300" : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                <child.icon className="h-3.5 w-3.5" />
                {child.label}
                {child.starred && <span className="text-amber-500">⭐</span>}
              </Link>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        onMouseEnter={(e) => onHoverChange(label, e)}
        onMouseMove={(e) => onHoverChange(label, e)}
        onMouseLeave={() => onHoverChange(null)}
        data-active={isActive}
        className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200
          ${isActive
            ? "text-indigo-700 dark:text-indigo-300"
            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          }
        `}
      >
        <Icon className="h-5 w-5 shrink-0" />
        <span className="flex-1 text-left truncate">{label}</span>
        <motion.div
          animate={{ rotate: open ? 0 : -90 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <ChevronDown className="h-4 w-4 shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-zinc-200 pl-2 dark:border-zinc-700">
              {childrenItems.map((child) => (
                <SidebarSubItem key={child.href} item={child} collapsed={false} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Sidebar({ role }: { role?: string }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const isVendor = role === "vendor"
  const isManager = role === "manager"
  const isAdmin = role === "admin"
  const menuData = isVendor ? vendorSidebar : isManager ? managerSidebar : isAdmin ? adminSidebar : procurementSidebar

  // Flowing Menu states
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleHoverChange = (label: string | null, e?: React.MouseEvent) => {
    setHoveredItem(label)
    if (e) {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
  }

  return (
    <>
      <aside
        className={`fixed left-0 top-0 z-30 flex h-full flex-col border-r border-zinc-200 bg-white/80 backdrop-blur-xl shadow-sm transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-950/80
          ${collapsed ? "w-16" : "w-64"}
        `}
      >
        <div className="flex h-16 items-center gap-3 border-b border-zinc-200 px-4 dark:border-zinc-800">
          <motion.div
            whileHover={{ scale: 1.05, rotate: -3 }}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white shadow-md"
          >
            VB
          </motion.div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 min-w-0"
            >
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-lg font-bold text-transparent">
                VendorBridge
              </span>
              {(isVendor || isManager || isAdmin) && (
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  isVendor
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : isManager
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                }`}>
                  {isVendor ? "Vendor" : isManager ? "Manager" : "Admin"}
                </span>
              )}
            </motion.div>
          )}
        </div>

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
                  onHoverChange={handleHoverChange}
                />
              ) : (
                <Link
                  key={item.label}
                  href={item.href ?? "/"}
                  onMouseEnter={(e) => handleHoverChange(item.label, e)}
                  onMouseMove={(e) => handleHoverChange(item.label, e)}
                  onMouseLeave={() => handleHoverChange(null)}
                  data-active={pathname === item.href}
                  className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200
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
                  {pathname === item.href && (
                    <motion.span
                      layoutId="sidebarSingleActive"
                      className="absolute inset-0 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              ),
            )}
          </div>
        </nav>

        <div className="border-t border-zinc-200 p-2 dark:border-zinc-800">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <motion.div
              animate={{ rotate: collapsed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.div>
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Portal/Overlay for Sidebar Hovers */}
      <AnimatePresence>
        {hoveredItem && (
          <FlowingMenu
            hoveredItem={hoveredItem}
            x={mousePos.x}
            y={mousePos.y}
          />
        )}
      </AnimatePresence>
    </>
  )
}
