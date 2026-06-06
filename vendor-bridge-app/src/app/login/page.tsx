"use client"

import { useState, useCallback } from "react"
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Building2,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Loader2,
  FileText,
  Receipt,
  CheckCircle,
  ShoppingCart,
  TrendingUp,
  Shield,
  Sparkles,
  Quote,
} from "lucide-react"

type AuthTab = "login" | "register"
type Role = "procurement" | "vendor" | "manager"

interface FormErrors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
  role?: string
}

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0
  if (pw.length >= 6) score++
  if (pw.length >= 10) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const labels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"]
  const colors = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-emerald-500", "bg-emerald-600"]
  return { score, label: labels[score], color: colors[score] }
}

const flowSteps = [
  { icon: FileText, label: "RFQ", color: "text-blue-500", bg: "bg-blue-500/20" },
  { icon: Receipt, label: "Quotation", color: "text-purple-500", bg: "bg-purple-500/20" },
  { icon: CheckCircle, label: "Approval", color: "text-emerald-500", bg: "bg-emerald-500/20" },
  { icon: ShoppingCart, label: "PO", color: "text-indigo-500", bg: "bg-indigo-500/20" },
  { icon: TrendingUp, label: "Invoice", color: "text-amber-500", bg: "bg-amber-500/20" },
]

const statCards = [
  { icon: FileText, value: "1,200+", label: "RFQs managed", color: "text-blue-400" },
  { icon: Building2, value: "300+", label: "Vendors", color: "text-purple-400" },
  { icon: ShoppingCart, value: "800+", label: "Invoices", color: "text-emerald-400" },
]

const roleDescriptions: Record<Role, string> = {
  procurement: "Procurement Officer manages RFQs, quotations & vendor negotiations",
  vendor: "Vendor submits quotations, manages profiles & responds to RFQs",
  manager: "Manager/Approver reviews & approves procurement requests",
}

export default function LoginPage() {
  const [tab, setTab] = useState<AuthTab>("login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  // Login fields
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  // Register fields
  const [fullName, setFullName] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState<Role>("procurement")
  const [companyName, setCompanyName] = useState("")

  const passwordStrength = getPasswordStrength(regPassword)

  function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  function validateLogin(): boolean {
    const e: FormErrors = {}
    if (!loginEmail) e.email = "Email is required"
    else if (!validateEmail(loginEmail)) e.email = "Invalid email format"
    if (!loginPassword) e.password = "Password is required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function validateRegister(): boolean {
    const e: FormErrors = {}
    if (!fullName.trim()) e.fullName = "Full name is required"
    if (!regEmail) e.email = "Email is required"
    else if (!validateEmail(regEmail)) e.email = "Invalid email format"
    if (!regPassword) e.password = "Password is required"
    else if (regPassword.length < 6) e.password = "Min 6 characters"
    if (!confirmPassword) e.confirmPassword = "Please confirm password"
    else if (confirmPassword !== regPassword) e.confirmPassword = "Passwords do not match"
    if (!role) e.role = "Select a role"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function getRoleFromEmail(email: string): string {
    if (email.includes("vendor")) return "vendor"
    if (email.includes("manager")) return "manager"
    return "procurement"
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!validateLogin()) return
    setLoading(true)
    setTimeout(() => {
      const role = getRoleFromEmail(loginEmail)
      localStorage.setItem("vb_role", role)
      localStorage.setItem("vb_email", loginEmail)
      setLoading(false)
      window.location.href = "/"
    }, 1500)
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!validateRegister()) return
    setLoading(true)
    setTimeout(() => {
      localStorage.setItem("vb_role", role)
      localStorage.setItem("vb_email", regEmail)
      setLoading(false)
      window.location.href = "/"
    }, 1500)
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
        <div className="animate-blob absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-3xl" />
        <div className="animate-blob absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-purple-500/20 blur-3xl" style={{ animationDelay: "2s" }} />
        <div className="animate-blob absolute left-1/3 top-1/3 h-[400px] w-[400px] rounded-full bg-indigo-500/15 blur-3xl" style={{ animationDelay: "4s" }} />
      </div>

      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-50" />

      <div className="relative flex min-h-screen w-full flex-col lg:flex-row">
        {/* ===== LEFT PANEL: Brand Story ===== */}
        <div className="relative flex w-full flex-col justify-center overflow-hidden px-8 py-12 lg:w-[55%] lg:px-16">
          {/* Logo */}
          <div className="animate-slide-right mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/30">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">VendorBridge</span>
          </div>

          {/* Tagline */}
          <div className="animate-slide-up mb-12" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
            <h1 className="text-4xl font-bold leading-tight text-white lg:text-5xl">
              Smart Procurement.
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Seamless Vendor Management.
              </span>
            </h1>
            <p className="mt-4 max-w-md text-base text-white/60">
              Streamline your entire procurement lifecycle — from RFQ to invoice — all in one powerful platform.
            </p>
          </div>

          {/* Flow Diagram */}
          <div className="animate-slide-up mb-12 hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm lg:block" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
            <div className="flex items-center justify-between">
              {flowSteps.map((step, i) => {
                const Icon = step.icon
                return (
                  <div key={step.label} className="flex items-center">
                    <div className="group flex flex-col items-center">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${step.bg} backdrop-blur transition-transform duration-300 group-hover:scale-110`}>
                        <Icon className={`h-6 w-6 ${step.color}`} />
                      </div>
                      <span className="mt-2 text-xs font-medium text-white/60">{step.label}</span>
                    </div>
                    {i < flowSteps.length - 1 && (
                      <div className="mx-3 flex items-center lg:mx-6">
                        <div className="h-px w-8 bg-gradient-to-r from-white/20 to-white/5 lg:w-16" />
                        <ChevronRight className="h-4 w-4 text-white/20" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Floating Stat Cards */}
          <div className="animate-slide-up flex flex-wrap gap-4" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
            {statCards.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="animate-float-slow group relative rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-lg hover:shadow-indigo-500/10"
                  style={{ animationDelay: `${i * 0.5}s` }}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                    <div>
                      <p className="text-lg font-bold text-white">{stat.value}</p>
                      <p className="text-xs text-white/50">{stat.label}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom decorative text */}
          <div className="animate-fade-in mt-auto hidden pt-12 text-xs text-white/20 lg:block" style={{ animationDelay: "0.5s", animationFillMode: "both" }}>
            <Quote className="mb-1 h-4 w-4 opacity-50" />
            <p className="italic">Trusted by procurement teams across 50+ enterprises</p>
          </div>
        </div>

        {/* ===== RIGHT PANEL: Auth Card ===== */}
        <div className="relative flex w-full items-center justify-center px-4 py-12 lg:w-[45%] lg:px-12">
          {/* Glassmorphism Card */}
          <div className="w-full max-w-md animate-slide-up rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl transition-all duration-500 hover:shadow-indigo-500/20 lg:p-10" style={{ animationDelay: "0.15s", animationFillMode: "both" }}>
            {/* Welcome Text */}
            <div className="mb-6 text-center">
              <p className="text-sm font-medium text-white/60">
                {tab === "login" ? "Welcome back" : "Get started"}
                <span className="ml-1">👋</span>
              </p>
              <h2 className="mt-1 text-2xl font-bold text-white">
                {tab === "login" ? "Sign in to your account" : "Create your account"}
              </h2>
            </div>

            {/* Tab Toggle */}
            <div className="mb-8 flex rounded-xl bg-white/5 p-1">
              <button
                onClick={() => { setTab("login"); setErrors({}) }}
                className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-300 ${
                  tab === "login" ? "bg-white/20 text-white shadow-sm" : "text-white/50 hover:text-white/80"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => { setTab("register"); setErrors({}) }}
                className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-300 ${
                  tab === "register" ? "bg-white/20 text-white shadow-sm" : "text-white/50 hover:text-white/80"
                }`}
              >
                Register
              </button>
            </div>

            {/* ===== LOGIN FORM ===== */}
            {tab === "login" && (
              <form onSubmit={handleLogin} className="space-y-5 animate-slide-up">
                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">Email Address</label>
                  <div className={`group flex items-center rounded-xl border bg-white/5 px-4 transition-all duration-200 focus-within:border-indigo-400 focus-within:bg-white/10 focus-within:shadow-lg focus-within:shadow-indigo-500/10 ${
                    errors.email ? "border-red-400" : "border-white/10"
                  }`}>
                    <Mail className="h-4 w-4 text-white/40 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full bg-transparent px-3 py-3 text-sm text-white placeholder-white/30 outline-none"
                    />
                    {loginEmail && validateEmail(loginEmail) && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    )}
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">Password</label>
                  <div className={`group flex items-center rounded-xl border bg-white/5 px-4 transition-all duration-200 focus-within:border-indigo-400 focus-within:bg-white/10 focus-within:shadow-lg focus-within:shadow-indigo-500/10 ${
                    errors.password ? "border-red-400" : "border-white/10"
                  }`}>
                    <Lock className="h-4 w-4 text-white/40 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-transparent px-3 py-3 text-sm text-white placeholder-white/30 outline-none"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-white/40 hover:text-white/60">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
                </div>

                {/* Remember Me + Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-indigo-500/40"
                    />
                    <span className="text-sm text-white/60">Remember me</span>
                  </label>
                  <button type="button" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                    Forgot password?
                  </button>
                </div>

                {/* Demo Credentials Hint */}
                <div className="rounded-xl border border-dashed border-indigo-500/30 bg-indigo-500/10 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                    <span className="text-xs font-medium text-indigo-300">Demo credentials</span>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { role: "Procurement Officer", email: "admin@vendorbridge.io", label: "Admin access" },
                      { role: "Vendor", email: "vendor@vendorbridge.io", label: "Vendor portal" },
                      { role: "Manager", email: "manager@vendorbridge.io", label: "Approval workflow" },
                    ].map((u) => (
                      <button
                        key={u.email}
                        type="button"
                        onClick={() => { setLoginEmail(u.email); setLoginPassword("password123") }}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-xs transition-colors hover:bg-white/5"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white/70">{u.role}</span>
                          <span className="text-indigo-400/70 font-mono">{u.email}</span>
                        </div>
                        <span className="text-white/40">/ password123</span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-1.5 text-[10px] text-white/30">Click any row to auto-fill — all share the password: <span className="font-mono text-indigo-400/60">password123</span></p>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-600/40 disabled:opacity-70"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ===== REGISTER FORM ===== */}
            {tab === "register" && (
              <form onSubmit={handleRegister} className="space-y-4 animate-slide-up">
                {/* Full Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">Full Name</label>
                  <div className={`flex items-center rounded-xl border bg-white/5 px-4 transition-all duration-200 focus-within:border-indigo-400 focus-within:bg-white/10 focus-within:shadow-lg focus-within:shadow-indigo-500/10 ${
                    errors.fullName ? "border-red-400" : "border-white/10"
                  }`}>
                    <User className="h-4 w-4 text-white/40" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-transparent px-3 py-3 text-sm text-white placeholder-white/30 outline-none"
                    />
                  </div>
                  {errors.fullName && <p className="mt-1 text-xs text-red-400">{errors.fullName}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">Email Address</label>
                  <div className={`flex items-center rounded-xl border bg-white/5 px-4 transition-all duration-200 focus-within:border-indigo-400 focus-within:bg-white/10 focus-within:shadow-lg focus-within:shadow-indigo-500/10 ${
                    errors.email ? "border-red-400" : "border-white/10"
                  }`}>
                    <Mail className="h-4 w-4 text-white/40" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full bg-transparent px-3 py-3 text-sm text-white placeholder-white/30 outline-none"
                    />
                    {regEmail && validateEmail(regEmail) && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    )}
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">Password</label>
                  <div className={`flex items-center rounded-xl border bg-white/5 px-4 transition-all duration-200 focus-within:border-indigo-400 focus-within:bg-white/10 focus-within:shadow-lg focus-within:shadow-indigo-500/10 ${
                    errors.password ? "border-red-400" : "border-white/10"
                  }`}>
                    <Lock className="h-4 w-4 text-white/40" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Create a strong password"
                      className="w-full bg-transparent px-3 py-3 text-sm text-white placeholder-white/30 outline-none"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-white/40 hover:text-white/60">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
                  {/* Password Strength Meter */}
                  {regPassword && (
                    <div className="mt-2 animate-slide-up">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              i <= passwordStrength.score ? passwordStrength.color : "bg-white/10"
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`mt-1 text-xs ${
                        passwordStrength.score <= 1 ? "text-red-400" : passwordStrength.score <= 3 ? "text-yellow-400" : "text-emerald-400"
                      }`}>
                        {passwordStrength.label}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">Confirm Password</label>
                  <div className={`flex items-center rounded-xl border bg-white/5 px-4 transition-all duration-200 focus-within:border-indigo-400 focus-within:bg-white/10 focus-within:shadow-lg focus-within:shadow-indigo-500/10 ${
                    errors.confirmPassword ? "border-red-400" : "border-white/10"
                  }`}>
                    <Lock className="h-4 w-4 text-white/40" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full bg-transparent px-3 py-3 text-sm text-white placeholder-white/30 outline-none"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-white/40 hover:text-white/60">
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>}
                </div>

                {/* Role Selection */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">Role</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["procurement", "vendor", "manager"] as Role[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`rounded-xl border px-3 py-2.5 text-center text-xs font-medium transition-all duration-200 ${
                          role === r
                            ? "border-indigo-400 bg-indigo-500/20 text-indigo-300 shadow-sm shadow-indigo-500/10"
                            : "border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/70"
                        }`}
                      >
                        {r === "procurement" ? "Procurement" : r === "vendor" ? "Vendor" : "Manager"}
                      </button>
                    ))}
                  </div>
                  {role && (
                    <p className="mt-2 text-xs text-white/40 italic flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-indigo-400" />
                      {roleDescriptions[role]}
                    </p>
                  )}
                  {errors.role && <p className="mt-1 text-xs text-red-400">{errors.role}</p>}
                </div>

                {/* Company Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">
                    Company Name <span className="text-white/30">(optional)</span>
                  </label>
                  <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-4 transition-all duration-200 focus-within:border-indigo-400 focus-within:bg-white/10 focus-within:shadow-lg focus-within:shadow-indigo-500/10">
                    <Building2 className="h-4 w-4 text-white/40" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Acme Corp"
                      className="w-full bg-transparent px-3 py-3 text-sm text-white placeholder-white/30 outline-none"
                    />
                  </div>
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-600/40 disabled:opacity-70"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Switch between login/register */}
            <p className="mt-6 text-center text-sm text-white/50">
              {tab === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button onClick={() => { setTab("register"); setErrors({}) }} className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                    Create one
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button onClick={() => { setTab("login"); setErrors({}) }} className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Footer */}
          <p className="absolute bottom-6 text-xs text-white/20">
            &copy; {new Date().getFullYear()} VendorBridge. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
