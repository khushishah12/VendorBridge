"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, CheckCircle2, ArrowRight, Loader2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 1500)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#070707] text-white px-4">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950/40 p-8 backdrop-blur-xl shadow-2xl relative">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Mail className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold">Reset Password</h2>
          <p className="mt-2 text-xs text-zinc-400">
            Enter your email and we will dispatch password recovery instructions.
          </p>
        </div>

        {sent ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-6 space-y-4"
          >
            <div className="flex items-center gap-2 rounded-xl bg-emerald-950/40 border border-emerald-500/20 p-4 text-emerald-400 text-sm">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>Password recovery link dispatched to {email}.</span>
            </div>
            <a
              href="/login"
              className="block text-center text-xs text-cyan-400 font-bold hover:text-cyan-300"
            >
              Return to Login
            </a>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-zinc-400">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none text-white focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 py-3 text-sm font-bold shadow-lg shadow-indigo-500/20 hover:scale-[1.01] transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Dispatch Reset Link
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

            <a
              href="/login"
              className="block text-center text-xs text-zinc-500 hover:text-white transition-colors"
            >
              &larr; Back to Login
            </a>
          </form>
        )}
      </div>
    </div>
  )
}
