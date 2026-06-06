"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield,
  Building2,
  User,
  Lock,
  Mail,
  Phone,
  FileCheck,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Check
} from "lucide-react"
import Antigravity from "@/components/ui/Antigravity"
import ClickSpark from "@/components/ui/ClickSpark"
import { getHomeForRole } from "@/lib/route-guard"
import { useAuth } from "@/context/AuthContext"

type Step = 1 | 2 | 3 | 4 | 5
type Role = "procurement" | "vendor" | "manager" | "admin"

export default function RegisterPage() {
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)

  // Step 1: Company Details
  const [companyName, setCompanyName] = useState("")
  const [industry, setIndustry] = useState("")
  const [gstNumber, setGstNumber] = useState("")
  const [companySize, setCompanySize] = useState("1-10")
  const [website, setWebsite] = useState("")

  // Step 2: Admin Info
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  // Step 3: Security Setup
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Step 4: OTP Verification
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [otpTimer, setOtpTimer] = useState(300) // 5 minutes
  const [otpResent, setOtpResent] = useState(false)

  // Step 5: Role Selection
  const [selectedRole, setSelectedRole] = useState<Role>("procurement")

  // Password validations
  const hasMinLen = password.length >= 8
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[^A-Za-z0-9]/.test(password)
  const isMatch = password === confirmPassword && password.length > 0

  let score = 0
  if (hasMinLen) score++
  if (hasUpper) score++
  if (hasLower) score++
  if (hasNumber) score++
  if (hasSpecial) score++

  const strengthLabels = ["Weak", "Weak", "Medium", "Strong", "Enterprise Grade", "Enterprise Grade"]
  const strengthColors = ["bg-red-500", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-emerald-500", "bg-emerald-500"]

  // OTP Timer countdown
  useEffect(() => {
    if (step !== 4) return
    const timer = setInterval(() => {
      setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [step])

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s < 10 ? "0" : ""}${s}`
  }

  function handleOtpChange(index: number, val: string) {
    if (isNaN(Number(val))) return
    const newOtp = [...otp]
    newOtp[index] = val.substring(val.length - 1)
    setOtp(newOtp)

    // Auto focus next input
    if (val && index < 5) {
      const nextEl = document.getElementById(`otp-${index + 1}`)
      nextEl?.focus()
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevEl = document.getElementById(`otp-${index - 1}`)
      prevEl?.focus()
    }
  }

  function resendOtp() {
    setOtpTimer(300)
    setOtpResent(true)
    setTimeout(() => setOtpResent(false), 2000)
  }

  function nextStep() {
    // Basic validation
    if (step === 1) {
      if (!companyName.trim()) {
        alert("Company Name is required")
        return
      }
      if (!gstNumber.trim() || gstNumber.length < 10) {
        alert("Please enter a valid GST Number")
        return
      }
    }
    if (step === 2) {
      if (!fullName.trim()) {
        alert("Full Name is required")
        return
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Please enter a valid email address")
        return
      }
      if (!phone.trim()) {
        alert("Phone Number is required")
        return
      }
    }
    if (step === 3) {
      if (score < 4) {
        alert("Password must meet security standards (minimum Strong)")
        return
      }
      if (!isMatch) {
        alert("Passwords do not match")
        return
      }
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep((s) => (s + 1) as Step)
    }, 800)
  }

  function prevStep() {
    setStep((s) => (s - 1) as Step)
  }

  const { register } = useAuth()

  async function finishRegistration() {
    setLoading(true)

    // Map frontend roles to database role enum
    let dbRole: 'ADMIN' | 'MANAGER' | 'PROCUREMENT_OFFICER' | 'VENDOR' = 'PROCUREMENT_OFFICER'
    if (selectedRole === 'admin') dbRole = 'ADMIN'
    else if (selectedRole === 'manager') dbRole = 'MANAGER'
    else if (selectedRole === 'vendor') dbRole = 'VENDOR'

    const registrationData = {
      email,
      password,
      confirmPassword,
      name: fullName,
      phone,
      role: dbRole,
      companyName: dbRole === 'VENDOR' || companyName ? companyName : undefined,
      gstNumber: dbRole === 'VENDOR' || gstNumber ? gstNumber : undefined,
      website: website || undefined,
      department: industry || undefined,
    }

    const result = await register(registrationData)
    if (result.success) {
      window.location.href = getHomeForRole(selectedRole)
    } else {
      alert(result.error || "Registration failed. Please check your inputs.")
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#070707] text-white">
      {/* ClickSpark global sparks */}
      <ClickSpark sparkColor="#6EE7FF" sparkSize={12} sparkRadius={22} sparkCount={10} duration={500} extraScale={1.2} />

      {/* Left panel layout with Antigravity */}
      <div className="relative hidden w-full lg:flex lg:w-[40%] flex-col justify-between p-12 overflow-hidden border-r border-zinc-800 bg-[#070707]">
        <Antigravity
          count={300}
          magnetRadius={8}
          ringRadius={10}
          waveSpeed={0.5}
          waveAmplitude={1.2}
          particleSize={1.8}
          lerpSpeed={0.06}
          color="#A78BFA"
          particleShape="capsule"
          messages={[
            "Compiling Security Modules...",
            "Encrypting GST Credentials...",
            "Configuring Safe Routes...",
          ]}
        />

        {/* Branding Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-[0_0_15px_rgba(167,139,250,0.4)] border border-white/10">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-wider bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            VendorBridge
          </span>
        </div>

        {/* Dynamic Side Help Info */}
        <div className="relative z-10 my-auto space-y-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Sparkles className="h-4 w-4" />
          </div>
          <h3 className="text-xl font-bold">Secure Enterprise Onboarding</h3>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-xs">
            Complete the onboarding sequence to declare your organization profile and allocate roles. Accounts are protected via 2FA and JWT token keys.
          </p>
        </div>

        <div className="relative z-10 text-xs text-zinc-500">
          Onboarding Security Shield Active
        </div>
      </div>

      {/* Right side layout: Stepper Onboarding Card */}
      <div className="flex w-full lg:w-[60%] flex-col items-center justify-center p-8 bg-[#0a0a0a] overflow-y-auto">
        <div className="w-full max-w-xl space-y-8">
          
          {/* Back button */}
          {step > 1 && step < 5 && (
            <button
              onClick={prevStep}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Step {step - 1}
            </button>
          )}

          {/* Stepper progress visual */}
          <div className="relative flex justify-between items-center w-full select-none">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex flex-col items-center z-10 relative">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 font-bold text-xs ${
                    step === s
                      ? "border-cyan-400 bg-cyan-950/40 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                      : step > s
                      ? "border-emerald-500 bg-emerald-950/40 text-emerald-400"
                      : "border-zinc-800 bg-zinc-900 text-zinc-500"
                  }`}
                >
                  {step > s ? <Check className="h-4 w-4" /> : s}
                </div>
                <span className={`text-[10px] uppercase font-bold mt-2 tracking-wider ${step === s ? "text-cyan-400" : "text-zinc-500"}`}>
                  {s === 1 ? "Company" : s === 2 ? "Admin" : s === 3 ? "Security" : s === 4 ? "OTP" : "Onboard"}
                </span>
              </div>
            ))}
            {/* Background tracking lines */}
            <div className="absolute top-[18px] left-[18px] right-[18px] h-0.5 bg-zinc-800 -z-10" />
            <div
              className="absolute top-[18px] left-[18px] h-0.5 bg-emerald-500 transition-all duration-500 -z-10"
              style={{ width: `${((Math.min(step, 5) - 1) / 4) * 92}%` }}
            />
          </div>

          {/* STEPPER VIEWS */}
          <div className="bg-zinc-950/40 rounded-2xl border border-zinc-800/40 p-6 md:p-8 backdrop-blur-xl">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: Company Info */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-bold flex items-center gap-2 text-cyan-400">
                    <Building2 className="h-5 w-5" /> Company Information
                  </h3>
                  <p className="text-xs text-zinc-400">Setup your organization bridge profile details.</p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[10px] uppercase font-bold text-zinc-400">Company Name *</label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Acme Corporation"
                        className="w-full rounded-xl border border-zinc-850 bg-zinc-900/50 px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-zinc-400">Industry Sector</label>
                      <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full rounded-xl border border-zinc-850 bg-zinc-900/50 px-3 py-2.5 text-sm text-white focus:border-cyan-500 outline-none"
                      >
                        <option value="">Choose Industry...</option>
                        <option value="IT">IT & Tech Services</option>
                        <option value="Construction">Construction</option>
                        <option value="Logistics">Logistics & Shipping</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Healthcare">Medical & Healthcare</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-zinc-400">GST Registration Number *</label>
                      <input
                        type="text"
                        required
                        value={gstNumber}
                        onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                        placeholder="e.g. 27AAAAA1111A1Z1"
                        maxLength={15}
                        className="w-full rounded-xl border border-zinc-850 bg-zinc-900/50 px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none font-mono uppercase"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-zinc-400">Company Size</label>
                      <select
                        value={companySize}
                        onChange={(e) => setCompanySize(e.target.value)}
                        className="w-full rounded-xl border border-zinc-850 bg-zinc-900/50 px-3 py-2.5 text-sm text-white focus:border-cyan-500 outline-none"
                      >
                        <option value="1-10">Micro (1-10 employees)</option>
                        <option value="11-50">Small (11-50 employees)</option>
                        <option value="51-200">Medium (51-200 employees)</option>
                        <option value="200+">Enterprise (200+ employees)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-zinc-400">Corporate Website</label>
                      <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://company.com"
                        className="w-full rounded-xl border border-zinc-850 bg-zinc-900/50 px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Admin Info */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-bold flex items-center gap-2 text-cyan-400">
                    <User className="h-5 w-5" /> Admin Information
                  </h3>
                  <p className="text-xs text-zinc-400">Designate the primary workspace manager credentials.</p>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-zinc-400">Full Name *</label>
                      <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 focus-within:border-cyan-500 transition-colors">
                        <User className="h-4 w-4 text-zinc-500" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Sarah Jenkins"
                          className="w-full bg-transparent px-3 py-2 text-sm outline-none text-white placeholder-zinc-600"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-zinc-400">Admin Email Address *</label>
                      <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 focus-within:border-cyan-500 transition-colors">
                        <Mail className="h-4 w-4 text-zinc-500" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="s.jenkins@company.com"
                          className="w-full bg-transparent px-3 py-2 text-sm outline-none text-white placeholder-zinc-600"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-zinc-400">Contact Phone Number *</label>
                      <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 focus-within:border-cyan-500 transition-colors">
                        <Phone className="h-4 w-4 text-zinc-500" />
                        <input
                          type="text"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full bg-transparent px-3 py-2 text-sm outline-none text-white placeholder-zinc-600"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Security Setup */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-bold flex items-center gap-2 text-cyan-400">
                    <Lock className="h-5 w-5" /> Security & Passwords
                  </h3>
                  <p className="text-xs text-zinc-400">Define a highly resilient password for role assignments.</p>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-zinc-400">Password *</label>
                      <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 focus-within:border-cyan-500 transition-colors">
                        <Lock className="h-4 w-4 text-zinc-500" />
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Password"
                          className="w-full bg-transparent px-3 py-2 text-sm outline-none text-white placeholder-zinc-600"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-zinc-400">Confirm Password *</label>
                      <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 focus-within:border-cyan-500 transition-colors">
                        <Lock className="h-4 w-4 text-zinc-500" />
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Retype password"
                          className="w-full bg-transparent px-3 py-2 text-sm outline-none text-white placeholder-zinc-600"
                        />
                      </div>
                    </div>

                    {/* Security Checklist */}
                    {password && (
                      <div className="rounded-xl bg-black/40 border border-zinc-900 p-4 space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-500">Security Rating:</span>
                          <span className={`font-bold uppercase tracking-wider ${score >= 4 ? "text-emerald-400" : "text-amber-400"}`}>
                            {strengthLabels[score]}
                          </span>
                        </div>
                        <div className="flex gap-1 h-1.5">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className={`h-full flex-1 rounded transition-colors duration-350 ${
                                i <= score ? strengthColors[score] : "bg-zinc-800"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                          <div className={hasMinLen ? "text-emerald-400" : "text-zinc-500"}>✓ At least 8 characters</div>
                          <div className={hasUpper ? "text-emerald-400" : "text-zinc-500"}>✓ Uppercase Letter</div>
                          <div className={hasLower ? "text-emerald-400" : "text-zinc-500"}>✓ Lowercase Letter</div>
                          <div className={hasNumber ? "text-emerald-400" : "text-zinc-500"}>✓ Numerical Digit</div>
                          <div className={hasSpecial ? "text-emerald-400" : "text-zinc-500"}>✓ Special Character</div>
                          <div className={isMatch ? "text-emerald-400" : "text-zinc-500"}>✓ Confirm Match</div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* STEP 4: OTP Verification */}
              {step === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4 text-center"
                >
                  <h3 className="text-lg font-bold flex items-center justify-center gap-2 text-cyan-400">
                    <FileCheck className="h-5 w-5" /> Verify Email Address
                  </h3>
                  <p className="text-xs text-zinc-400">
                    We dispatched a 6-digit OTP code to <strong className="text-zinc-200">{email}</strong>.
                  </p>

                  {/* 6 box input */}
                  <div className="flex justify-center gap-2 py-4">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="h-12 w-12 text-center text-lg font-bold rounded-xl border border-zinc-800 bg-zinc-900 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.25)] outline-none text-cyan-300"
                      />
                    ))}
                  </div>

                  <div className="text-xs text-zinc-500 flex flex-col items-center gap-2 pt-2">
                    <span>Code expires in: <strong className="text-cyan-400 font-mono">{formatTimer(otpTimer)}</strong></span>
                    <button
                      type="button"
                      disabled={otpTimer > 240 || otpResent}
                      onClick={resendOtp}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {otpResent ? "Sending new code..." : "Resend OTP Code"}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 5: Role Onboarding Selection */}
              {step === 5 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-emerald-400">OTP Verified Successfully</h3>
                    <p className="text-xs text-zinc-400 mt-1">Select your workspace role to log in.</p>
                  </div>

                  <div className="grid gap-3 pt-2">
                    {[
                      {
                        role: "procurement",
                        title: "Procurement Officer",
                        desc: "Raise RFQs, collect & compare vendor quotes, generate POs.",
                      },
                      {
                        role: "vendor",
                        title: "Approved Supplier / Vendor",
                        desc: "Submit bidding quotations, accept PO orders, raise digital invoices.",
                      },
                      {
                        role: "manager",
                        title: "Workflow Manager / Approver",
                        desc: "Audit bids, sign digital purchase contracts, grant workflow clearance.",
                      },
                      {
                        role: "admin",
                        title: "System Administrator",
                        desc: "Oversee system parameters, logs, and core routing rules.",
                      },
                    ].map((item) => (
                      <button
                        key={item.role}
                        onClick={() => setSelectedRole(item.role as Role)}
                        className={`flex items-start gap-4 rounded-xl border p-4 hover:bg-zinc-900 text-left transition-all duration-200 ${
                          selectedRole === item.role
                            ? "border-cyan-400 bg-cyan-950/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
                            : "border-zinc-850 bg-zinc-900/20 text-zinc-400"
                        }`}
                      >
                        <div
                          className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                            selectedRole === item.role ? "border-cyan-400 text-cyan-400" : "border-zinc-700"
                          }`}
                        >
                          {selectedRole === item.role && <div className="h-2 w-2 rounded-full bg-cyan-400" />}
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${selectedRole === item.role ? "text-white" : "text-zinc-300"}`}>
                            {item.title}
                          </p>
                          <p className="text-xs text-zinc-500 mt-0.5">{item.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Wizard Action button panel */}
          <div className="flex justify-end gap-3">
            {step < 4 && (
              <button
                onClick={nextStep}
                disabled={loading}
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-6 py-3 text-sm font-bold shadow-lg shadow-indigo-500/20 hover:scale-[1.01] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            )}

            {step === 4 && (
              <button
                onClick={nextStep}
                disabled={otp.some((d) => !d) || loading}
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-6 py-3 text-sm font-bold shadow-lg shadow-indigo-500/20 hover:scale-[1.01] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Verify & Onboard
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            )}

            {step === 5 && (
              <button
                onClick={finishRegistration}
                disabled={loading}
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-6 py-3 text-sm font-bold shadow-lg shadow-indigo-500/20 hover:scale-[1.01] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Enter Workspace
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
