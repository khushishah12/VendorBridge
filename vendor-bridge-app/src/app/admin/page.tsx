"use client"
import { useEffect } from "react"
export default function AdminRedirect() {
  useEffect(() => { window.location.href = "/admin/dashboard" }, [])
  return null
}
