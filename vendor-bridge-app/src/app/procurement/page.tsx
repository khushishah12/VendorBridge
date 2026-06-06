"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ProcurementIndex() {
  const router = useRouter()
  useEffect(() => { router.replace("/procurement/dashboard") }, [router])
  return null
}
