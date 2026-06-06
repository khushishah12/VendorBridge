"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  Shield,
  Globe,
  Sparkles,
  DollarSign,
  TrendingUp,
  Building2,
  AlertCircle
} from "lucide-react"
import { getHomeForRole } from "@/lib/route-guard"
import Antigravity from "@/components/ui/Antigravity"
import ClickSpark from "@/components/ui/ClickSpark"
import { useAuth } from "@/context/AuthContext"

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotSent, setForgotSent] = useState(false)

  // Validate fields
  const [isValidEmail, setIsValidEmail] = useState(false)
  useEffect(() => {
    setIsValidEmail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  }, [email])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email) {
      setErrorMsg("Email is required")
      return
    }
    if (!password) {
      setErrorMsg("Password is required")
      return
    }

    setLoading(true)
    setErrorMsg("")

    const result = await login(email, password)
    if (result.success) {
      const role = localStorage.getItem("vb_role") || "procurement"
      window.location.href = getHomeForRole(role)
    } else {
      setErrorMsg(result.error || "Invalid email or password.")
      setLoading(false)
    }
  }

  async function handleQuickLogin(role: string, emailAddr: string) {
    setLoading(true)
    setErrorMsg("")
    const defaultPassword = "Password123!"
    const result = await login(emailAddr, defaultPassword)
    if (result.success) {
      window.location.href = getHomeForRole(role)
    } else {
      setErrorMsg(result.error || "Showcase login failed.")
      setLoading(false)
    }
  }

  function handleForgotSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      alert("Please enter a valid email address.")
      return
    }
    setForgotSent(true)
    setTimeout(() => {
      setForgotSent(false)
      setShowForgotModal(false)
      setForgotEmail("")
      alert("Password reset instructions have been dispatched to your email.")
    }, 2000)
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#070707] text-white">
      {/* ClickSpark Sparks */}
      <ClickSpark sparkColor="#6EE7FF" sparkSize={12} sparkRadius={22} sparkCount={10} duration={500} extraScale={1.2} />

      <div className="flex flex-1 flex-col lg:flex-row w-full z-10">
        
        {/* ===== LEFT SIDE: Futuristic Operating System Panel ===== */}
        <div className="relative hidden w-full lg:flex lg:w-[55%] flex-col justify-between p-12 overflow-hidden border-r border-zinc-800 bg-[#070707]">
          {/* Antigravity particles in background */}
          <Antigravity
            count={500}
            magnetRadius={8}
            ringRadius={10}
            waveSpeed={0.6}
            waveAmplitude={1.5}
            particleSize={1.8}
            lerpSpeed={0.08}
            color="#6EE7FF"
            autoAnimate={true}
            particleVariance={1}
            rotationSpeed={0.15}
            depthFactor={1.2}
            pulseSpeed={4}
            particleShape="capsule"
            fieldStrength={12}
            messages={[
              "Connecting Vendors...",
              "Fetching RFQs...",
              "Analyzing Procurement Data...",
              "Preparing Workspace...",
            ]}
          />

          {/* Top Branding Header */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-[0_0_15px_rgba(99,102,241,0.4)] border border-white/10">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-wider bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                VendorBridge
              </span>
              <span className="ml-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-2 py-0.5 text-[9px] font-extrabold tracking-wider text-cyan-400">
                ERP CORE v2.5
              </span>
            </div>
          </div>

          {/* Mid Section: Procurement Analytics holographic Preview */}
          <div className="relative z-10 my-auto max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-2xl relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[#6EE7FF]/5 to-transparent rounded-2xl pointer-events-none" />
              <div className="flex items-center gap-2 mb-4 text-[#6EE7FF] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-4 w-4" /> Live Procurement Ledger
              </div>

              {/* Mock Analytics Cards */}
              <div className="space-y-3">
                <div className="flex justify-between items-center rounded-xl bg-black/40 border border-white/5 p-3">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-emerald-400" />
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Total Value Managed</p>
                      <p className="text-sm font-bold text-white">₹8.4M <span className="text-xs text-emerald-400 font-medium">+18%</span></p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center rounded-xl bg-black/40 border border-white/5 p-3">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-cyan-400" />
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Approved Suppliers</p>
                      <p className="text-sm font-bold text-white">156 verified</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Trust Indicators */}
          <div className="relative z-10 flex justify-between items-center text-xs text-zinc-500 border-t border-zinc-900 pt-6">
            <span>Enterprise Encrypted (AES-256)</span>
            <span>Trusted by 50+ Top Corporates</span>
          </div>
        </div>

        {/* ===== RIGHT SIDE: Login Interactive Panel ===== */}
        <div className="flex w-full lg:w-[45%] items-center justify-center p-8 bg-[#0a0a0a]">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Welcome to the Future.
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                Log in to access your secure enterprise procurement workspace.
              </p>
            </div>

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-950/20 px-4 py-3 text-sm text-red-400"
              >
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {/* Login form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Email Address</label>
                <div className="group flex items-center rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 focus-within:border-cyan-500 focus-within:bg-zinc-900 transition-colors">
                  <Mail className="h-4 w-4 text-zinc-600 group-focus-within:text-cyan-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-transparent px-3 py-2 text-sm outline-none text-white placeholder-zinc-600"
                  />
                  {isValidEmail && <span className="text-emerald-400 text-xs font-bold">✓</span>}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs text-cyan-400 hover:text-cyan-300"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="group flex items-center rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 focus-within:border-cyan-500 focus-within:bg-zinc-900 transition-colors">
                  <Lock className="h-4 w-4 text-zinc-600 group-focus-within:text-cyan-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your security password"
                    className="w-full bg-transparent px-3 py-2 text-sm outline-none text-white placeholder-zinc-600"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-zinc-600 hover:text-white">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-800 bg-zinc-900 text-cyan-500 focus:ring-cyan-500/20"
                  />
                  <span className="text-xs text-zinc-400">Keep me logged in</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 py-3 text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.01] disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Logins for Hackathon judges */}
            <div className="border-t border-zinc-800 pt-6">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Judge Showcase Access</span>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                {[
                  { name: "Procurement Officer", email: "procurement@vendorbridge.io", role: "procurement" },
                  { name: "Vendor Dashboard", email: "vendor@vendorbridge.io", role: "vendor" },
                  { name: "Manager Approver", email: "manager@vendorbridge.io", role: "manager" },
                  { name: "System Admin", email: "admin@vendorbridge.io", role: "admin" },
                ].map((demo) => (
                  <button
                    key={demo.email}
                    onClick={() => handleQuickLogin(demo.role, demo.email)}
                    disabled={loading}
                    className="flex flex-col items-start rounded-xl border border-zinc-800 bg-zinc-900/30 p-2.5 hover:border-cyan-500/50 hover:bg-zinc-900 transition-colors text-left"
                  >
                    <span className="font-semibold text-zinc-200">{demo.name}</span>
                    <span className="text-[10px] text-zinc-500 font-mono mt-0.5">{demo.email}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Social Logins */}
            <div className="border-t border-zinc-800 pt-6">
              <p className="text-center text-xs text-zinc-500">Or connect secure workspace with</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin("procurement", "google@company.com")}
                  className="flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/20 py-2.5 hover:bg-zinc-900 text-xs font-semibold gap-2"
                >
                  <svg className="h-4 w-4 fill-zinc-400 group-hover:fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.478 0-6.3-2.823-6.3-6.3s2.822-6.3 6.3-6.3c1.706 0 3.2.677 4.3 1.77L21.4 4.75C19.06 2.46 15.82 1 12.24 1 5.74 1 .5 6.24.5 12.74S5.74 24.48 12.24 24.48c6.5 0 11.24-4.57 11.24-11.24 0-.765-.082-1.503-.233-2.195H12.24z"/>
                  </svg> Google
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin("procurement", "microsoft@company.com")}
                  className="flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/20 py-2.5 hover:bg-zinc-900 text-xs font-semibold gap-2"
                >
                  <Globe className="h-4 w-4 text-cyan-400" /> Microsoft
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin("procurement", "github@company.com")}
                  className="flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/20 py-2.5 hover:bg-zinc-900 text-xs font-semibold gap-2"
                >
                  <svg className="h-4 w-4 fill-zinc-400 group-hover:fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg> GitHub
                </button>
              </div>
            </div>

            <p className="text-center text-xs text-zinc-500">
              New to VendorBridge?{" "}
              <a href="/register" className="font-semibold text-cyan-400 hover:text-cyan-300">
                Register Workspace &rarr;
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-6 shadow-2xl"
          >
            <h3 className="text-lg font-bold">Reset Password</h3>
            <p className="mt-1 text-xs text-zinc-400">Enter your email and we will dispatch a reset link.</p>

            <form onSubmit={handleForgotSubmit} className="mt-4 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-400">Email Address</label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none text-white focus:border-cyan-500"
                />
              </div>

              <div className="flex gap-2 justify-end text-xs">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="rounded-lg border border-zinc-800 bg-transparent px-4 py-2 hover:bg-zinc-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotSent}
                  className="rounded-lg bg-cyan-600 px-4 py-2 font-bold hover:bg-cyan-500 disabled:opacity-50"
                >
                  {forgotSent ? "Sending..." : "Dispatch Link"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
