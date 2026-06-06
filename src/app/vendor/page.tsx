"use client"

import { useEffect } from "react"

export default function VendorRedirect() {
  useEffect(() => {
    window.location.href = "/vendor/dashboard"
  }, [])
  return null
}
