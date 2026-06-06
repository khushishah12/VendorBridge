"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Shield, Sparkles, Mail, CheckCircle2, ArrowRight } from "lucide-react"
import ClickSpark from "@/components/ui/ClickSpark"

export default function OtpPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [timer, setTimer] = useState(300)
  const [resent, setResent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0))
    }, 1000)
    return () => clearInterval(countdown)
  }, [])

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60)
    const secs = s % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  function handleChange(idx: number, val: string) {
    if (isNaN(Number(val))) return
    const newOtp = [...otp]
    newOtp[idx] = val.substring(val.length - 1)
    setOtp(newOtp)

    if (val && idx < 5) {
      document.getElementById(`code-${idx + 1}`)?.focus()
    }
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      document.getElementById(`code-${idx - 1}`)?.focus()
    }
  }

  function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    if (otp.some((d) => !d)) return

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setVerified(true)
      setTimeout(() => {
        const role = localStorage.getItem("vb_role") || "procurement"
        window.location.href = `/procurement/dashboard`
      }, 1500)
    }, 1200)
  }

  function handleResend() {
    setTimer(300)
    setResent(true)
    setTimeout(() => setResent(false), 2000)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#070707] text-white">
      <ClickSpark sparkColor="#6EE7FF" sparkSize={12} sparkRadius={22} sparkCount={10} duration={500} extraScale={1.2} />

      {/* Background neon grid glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#6EE7FF]/5 via-transparent to-transparent -z-10" />

      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950/40 p-8 backdrop-blur-xl shadow-2xl relative">
        
        {/* Glow halo */}
        <div className="absolute -top-12 -left-12 h-24 w-24 rounded-full bg-cyan-500/10 blur-xl pointer-events-none" />

        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#6EE7FF]/10 text-[#6EE7FF] border border-[#6EE7FF]/20 shadow-[0_0_15px_rgba(110,231,255,0.2)]">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold">Security Verification</h2>
          <p className="mt-2 text-xs text-zinc-400">
            Enter the 6-digit OTP code dispatched to your registered enterprise email address.
          </p>
        </div>

        <form onSubmit={handleVerify} className="mt-8 space-y-6">
          <div className="flex justify-center gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`code-${idx}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="h-12 w-12 text-center text-lg font-bold rounded-xl border border-zinc-800 bg-zinc-900/60 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(110,231,255,0.25)] outline-none text-cyan-300"
              />
            ))}
          </div>

          <div className="text-center text-xs text-zinc-500 space-y-2">
            <p>Code expires in: <strong className="text-cyan-400 font-mono">{formatTime(timer)}</strong></p>
            <button
              type="button"
              disabled={timer > 240 || resent}
              onClick={handleResend}
              className="text-cyan-400 hover:text-cyan-300 font-semibold disabled:opacity-50"
            >
              {resent ? "Sending code..." : "Resend OTP Code"}
            </button>
          </div>

          {verified ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-950/40 border border-emerald-500/20 py-3 text-emerald-400 font-bold"
            >
              <CheckCircle2 className="h-5 w-5" /> Code Verified. Redirecting...
            </motion.div>
          ) : (
            <button
              type="submit"
              disabled={otp.some((d) => !d) || loading}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 py-3 text-sm font-bold shadow-lg shadow-indigo-500/20 hover:scale-[1.01] transition-all disabled:opacity-50"
            >
              Verify Credentials
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </form>
      </div>
    </div>
  )
}
