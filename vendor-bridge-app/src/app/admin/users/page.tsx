"use client"

import { useState, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import {
  Search, ChevronDown, Plus, X, MoreHorizontal,
  UserCheck, UserX, AlertTriangle
} from "lucide-react"
import { adminUsers } from "@/lib/admin-data"
import type { AdminUser } from "@/lib/admin-data"

const roleBadge: Record<AdminUser["role"], string> = {
  admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  procurement: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  vendor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  manager: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
}

const statusBadge: Record<AdminUser["status"], string> = {
  Active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Inactive: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  Suspended: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

function formatLastActive(ts: string) {
  const d = new Date(ts)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  if (diffHours < 1) return "Just now"
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

const roleOptions: Array<{ label: string; value: AdminUser["role"] | "All" }> = [
  { label: "All Roles", value: "All" },
  { label: "Admin", value: "admin" },
  { label: "Procurement", value: "procurement" },
  { label: "Vendor", value: "vendor" },
  { label: "Manager", value: "manager" },
]

const statusOptions: Array<{ label: string; value: AdminUser["status"] | "All" }> = [
  { label: "All Statuses", value: "All" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
  { label: "Suspended", value: "Suspended" },
]

interface NewUserForm {
  name: string
  email: string
  role: AdminUser["role"]
  department: string
}

const emptyForm: NewUserForm = { name: "", email: "", role: "procurement", department: "" }

export default function AdminUsersPage() {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<AdminUser["role"] | "All">("All")
  const [statusFilter, setStatusFilter] = useState<AdminUser["status"] | "All">("All")
  const [actionMenu, setActionMenu] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newUser, setNewUser] = useState<NewUserForm>(emptyForm)
  const [toast, setToast] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return adminUsers.filter((u) => {
      if (search) {
        const q = search.toLowerCase()
        if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false
      }
      if (roleFilter !== "All" && u.role !== roleFilter) return false
      if (statusFilter !== "All" && u.status !== statusFilter) return false
      return true
    })
  }, [search, roleFilter, statusFilter])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  function handleAddUser() {
    showToast(`User "${newUser.name}" added (demo — no backend)`)
    setShowAddModal(false)
    setNewUser(emptyForm)
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">User Management</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{adminUsers.length} total users</p>
          </div>
          <button onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
            <Plus className="h-4 w-4" /> Add User
          </button>
        </div>

        {toast && (
          <div className="mb-4 rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{toast}</div>
        )}

        {/* Search & Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          </div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as AdminUser["role"] | "All")}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
            {roleOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as AdminUser["status"] | "All")}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
            {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          {(search || roleFilter !== "All" || statusFilter !== "All") && (
            <button onClick={() => { setSearch(""); setRoleFilter("All"); setStatusFilter("All") }}
              className="rounded-lg px-3 py-2 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
              Clear
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Last Active</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-zinc-400">
                    <UserX className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    No users found matching your filters
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-zinc-800 dark:text-zinc-200">{u.name}</p>
                          <p className="text-xs text-zinc-400">{u.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${roleBadge[u.role]}`}>
                        {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{u.department}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge[u.status]}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400">{formatLastActive(u.lastActive)}</td>
                    <td className="relative px-4 py-3 text-right">
                      <button onClick={() => setActionMenu(actionMenu === u.id ? null : u.id)}
                        className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {actionMenu === u.id && (
                        <div className="absolute right-4 top-10 z-10 w-48 rounded-xl border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                          <button onClick={() => { setActionMenu(null); showToast(`Editing ${u.name} (demo)`) }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800">
                            Edit
                          </button>
                          <button onClick={() => { setActionMenu(null); showToast(`${u.name} ${u.status === "Active" ? "suspended" : "activated"} (demo)`) }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800">
                            {u.status === "Active" ? "Suspend" : "Activate"}
                          </button>
                          <button onClick={() => { setActionMenu(null); showToast(`${u.name} deleted (demo)`) }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30">
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-lg rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Add New User</h2>
              <button onClick={() => { setShowAddModal(false); setNewUser(emptyForm) }}
                className="rounded-lg p-1 text-zinc-400 hover:text-zinc-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">Name</label>
                <input type="text" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Full name"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">Email</label>
                <input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">Role</label>
                  <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value as AdminUser["role"] })}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100">
                    <option value="procurement">Procurement</option>
                    <option value="vendor">Vendor</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">Department</label>
                  <input type="text" value={newUser.department} onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                    placeholder="e.g. IT"
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-zinc-200 px-6 py-4 dark:border-zinc-700">
              <button onClick={() => { setShowAddModal(false); setNewUser(emptyForm) }}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                Cancel
              </button>
              <button onClick={handleAddUser} disabled={!newUser.name || !newUser.email}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
