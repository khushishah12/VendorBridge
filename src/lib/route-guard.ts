"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export const ROLE_HOMES: Record<string, string> = {
  admin: "/admin/dashboard",
  procurement: "/procurement/dashboard",
  vendor: "/vendor/dashboard",
  manager: "/manager/dashboard",
}

const ROLE_ROUTE_PREFIXES: Record<string, string[]> = {
  admin: ["/admin", "/manager", "/vendor", "/procurement", "/"],
  procurement: ["/procurement", "/"],
  vendor: ["/vendor"],
  manager: ["/manager"],
}

function getAllowedPrefixes(role: string): string[] {
  return ROLE_ROUTE_PREFIXES[role] ?? []
}

export function getHomeForRole(role: string): string {
  return ROLE_HOMES[role] ?? "/"
}

export function pathMatchesPrefix(path: string, prefixes: string[]): boolean {
  return prefixes.some((p) => path === p || path.startsWith(p + "/"))
}

export function useRoleGuard(): { authorized: boolean; loading: boolean } {
  const pathname = usePathname()
  const [authorized, setAuthorized] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const role = localStorage.getItem("vb_role") || "procurement"
    const allowed = getAllowedPrefixes(role)

    if (pathname === "/login") {
      setAuthorized(true)
    } else {
      setAuthorized(pathMatchesPrefix(pathname, allowed))
    }
    setLoading(false)
  }, [pathname])

  return { authorized, loading }
}

export function useVerifyRole(expectedRole: string): boolean {
  const [match, setMatch] = useState(false)

  useEffect(() => {
    const role = localStorage.getItem("vb_role") || ""
    setMatch(role === expectedRole)
  }, [expectedRole])

  return match
}
