"use client"
import { useEffect } from "react"
export default function ManagerRedirect() {
  useEffect(() => { window.location.href = "/manager/dashboard" }, [])
  return null
}
