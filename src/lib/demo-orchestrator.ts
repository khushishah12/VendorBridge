"use client"

export interface SimulatedEvent {
  title: string
  message: string
  type: "rfq" | "quotation" | "approval" | "invoice" | "vendor"
  timestamp: string
}

const SIMULATED_ACTIONS: Omit<SimulatedEvent, "timestamp">[] = [
  {
    title: "RFQ Published",
    message: "RFQ-2026-9042 'High-Performance GPU Clusters' was broadcast to 5 vendors.",
    type: "rfq",
  },
  {
    title: "Quotation Received",
    message: "Acme Corp submitted a quote of ₹4.8M for the GPU Procurement.",
    type: "quotation",
  },
  {
    title: "Quotation Received",
    message: "TechSolutions Inc. submitted a competitive bid of ₹4.5M with 15-day delivery.",
    type: "quotation",
  },
  {
    title: "Manager Approval Granted",
    message: "Manager approved PO-2026-0421 'Raw Material Contract' (₹1.2M).",
    type: "approval",
  },
  {
    title: "Finance Verification Complete",
    message: "Finance approved and cleared billing for INV-2026-1049.",
    type: "approval",
  },
  {
    title: "Purchase Order Dispatched",
    message: "PO-2026-0810 was automatically generated and sent to BuildRight Construction.",
    type: "invoice",
  },
  {
    title: "Invoice Raised",
    message: "Logistics Hub submitted Invoice INV-2026-3029 (₹310K) for shipping services.",
    type: "invoice",
  },
  {
    title: "New Supplier Registered",
    message: "CloudSync Technologies was verified as an active IT Cloud vendor.",
    type: "vendor",
  },
]

type Listener = (event: SimulatedEvent) => void
const listeners = new Set<Listener>()

let timer: NodeJS.Timeout | null = null

export function subscribeToDemoEvents(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function broadcastEvent(event: SimulatedEvent) {
  listeners.forEach((l) => l(event))

  // Dispatch global custom event for canvas node visualizations to trigger physics pulse
  if (typeof window !== "undefined") {
    const customEvent = new CustomEvent("vb-event-pulse", { detail: event })
    window.dispatchEvent(customEvent)
  }
}

export function startDemoSimulation() {
  if (timer) return

  // Store demo active flag
  localStorage.setItem("vb_demo_active", "true")

  // Simulate an event every 7 seconds
  timer = setInterval(() => {
    const rawEvent = SIMULATED_ACTIONS[Math.floor(Math.random() * SIMULATED_ACTIONS.length)]
    const newEvent: SimulatedEvent = {
      ...rawEvent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    }

    // Append to dashboard's temporary localStorage log so it appears in the activity list
    try {
      const logs = JSON.parse(localStorage.getItem("vb_activity_logs") || "[]")
      logs.unshift(newEvent)
      localStorage.setItem("vb_activity_logs", JSON.stringify(logs.slice(0, 30)))
    } catch (e) {
      console.error(e)
    }

    broadcastEvent(newEvent)
  }, 7000)
}

export function stopDemoSimulation() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  localStorage.setItem("vb_demo_active", "false")
}

export function isDemoActive(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("vb_demo_active") === "true"
}
