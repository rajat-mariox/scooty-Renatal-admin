import { Eye, EyeOff, Bike, ArrowLeft, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { stationAdminApi } from "../services/stationAdminApi"

type FpStep = "enter_email" | "reset_password"

export default function Login() {
    const navigate = useNavigate()
    const [mode, setMode] = useState<"password" | "otp">("password")
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [otp, setOtp] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [transactionId, setTransactionId] = useState("")
    const [resendTimer, setResendTimer] = useState(0)

    useEffect(() => {
        let timer: any;
        if (resendTimer > 0) {
            timer = setTimeout(() => setResendTimer(prev => prev - 1), 1000)
        }
        return () => clearTimeout(timer)
    }, [resendTimer])

    // ── Forgot Password modal state ──────────────────────────────
    const [fpOpen, setFpOpen] = useState(false)
    const [fpStep, setFpStep] = useState<FpStep>("enter_email")
    const [fpEmail, setFpEmail] = useState("")
    const [fpOtp, setFpOtp] = useState("")
    const [fpNewPassword, setFpNewPassword] = useState("")
    const [fpConfirmPassword, setFpConfirmPassword] = useState("")
    const [showFpNew, setShowFpNew] = useState(false)
    const [showFpConfirm, setShowFpConfirm] = useState(false)
    const [fpError, setFpError] = useState("")
    const [fpSuccess, setFpSuccess] = useState("")
    const [fpLoading, setFpLoading] = useState(false)
    const [fpTransactionId, setFpTransactionId] = useState("")
    const [canResend, setCanResend] = useState(true)

    const openForgotPassword = () => {
        setFpOpen(true)
        setFpStep("enter_email")
        setFpEmail(""); setFpOtp(""); setFpNewPassword(""); setFpConfirmPassword("")
        setFpTransactionId("")
        setFpError(""); setFpSuccess("")
        setCanResend(true)
    }

    const closeForgotPassword = () => {
        setFpOpen(false)
    }

    // ── OTP login helpers ────────────────────────────────────────
    const handleSendOtp = async () => {
        if (!email) { setError("Please enter your email"); return }
        setError("")
        setSuccess("")
        setIsLoading(true)
        try {
            const res = await stationAdminApi.sendOtp({ email: email.trim() }) as any
            if (res.code === 1 || res.success) {
                setTransactionId(res.data?.transactionId || res.transactionId || "")
                setSuccess("OTP sent successfully!")
                setResendTimer(30)
                setTimeout(() => setSuccess(""), 4000)
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to send OTP")
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendOtp = async () => {
        if (!transactionId) {
            handleSendOtp();
            return;
        }
        setError("")
        setSuccess("")
        setIsLoading(true)
        try {
            const res = await stationAdminApi.resendOtp({ transactionId }) as any
            if (res.code === 1 || res.success) {
                setSuccess("OTP resent successfully!")
                setResendTimer(30)
                setTimeout(() => setSuccess(""), 4000)
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to resend OTP")
        } finally {
            setIsLoading(false)
        }
    }

    // ── Main login ───────────────────────────────────────────────
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!email) { setError("Please enter your email"); return }
        if (mode === "password" && !password) { setError("Please enter your password"); return }
        if (mode === "otp") {
            if (!otp) { setError("Please enter your OTP"); return }
        }

        setIsLoading(true)
        try {
            if (mode === "password") {
                const response = await stationAdminApi.login({ email: email.trim(), password }) as any
                const token = response.data?.token || response.token
                const isSuccess = response.code === 1 || response.success

                if (isSuccess && token) {
                    localStorage.setItem('token', token)
                    localStorage.setItem('admin_details', JSON.stringify(response.data || {}))
                    navigate("/dashboard")
                } else {
                    setError(response.message || "Invalid credentials format")
                }
            } else {
                const payload: any = { 
                    email: email.trim(), 
                    otp 
                }
                if (transactionId) payload.transactionId = transactionId

                const response = await stationAdminApi.verifyOtp(payload) as any
                const isSuccess = response.code === 1 || response.success === true || response.status === 'success'
                const token = response.data?.token || response.token || response.jwt || response.accessToken

                if (isSuccess && token) {
                    localStorage.setItem('token', token)
                    localStorage.setItem('admin_details', JSON.stringify(response.data || {}))
                    navigate("/dashboard")
                } else {
                    setError(response.message || "Invalid OTP or Format")
                }
            }
        } catch (err: any) {
            const rawMessage = err.response?.data?.message || err.message || ""
            setError(rawMessage || "An error occurred during login")
        } finally {
            setIsLoading(false)
        }
    }

    // ── Forgot Password: step 1 – send OTP ──────────────────────
    const handleFpSendOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setFpError("")
        if (!fpEmail) { setFpError("Please enter your email"); return }
        setFpLoading(true)
        try {
            const res = await stationAdminApi.forgotPasswordSendOtp({ email: fpEmail.trim() }) as any
            if (res.code === 1 || res.success) {
                setFpTransactionId(res.data?.transactionId || res.transactionId || "")
                setFpStep("reset_password")
                setCanResend(false)
                setTimeout(() => setCanResend(true), 30000)
            } else {
                setFpError(res.message || "Failed to send OTP")
            }
        } catch (err: any) {
            setFpError(err.response?.data?.message || "Failed to send OTP")
        } finally {
            setFpLoading(false)
        }
    }

    // ── Forgot Password: resend OTP ──────────────────────────────
    const handleFpResendOtp = async () => {
        setFpError("")
        setFpLoading(true)
        try {
            const res = await stationAdminApi.forgotPasswordResendOtp({ transactionId: fpTransactionId }) as any
            if (res.code === 1 || res.success) {
                setCanResend(false)
                setTimeout(() => setCanResend(true), 30000)
            } else {
                setFpError(res.message || "Failed to resend OTP")
            }
        } catch (err: any) {
            setFpError(err.response?.data?.message || "Failed to resend OTP")
        } finally {
            setFpLoading(false)
        }
    }


    // ── Forgot Password: step 3 – reset password ─────────────────
    const handleFpReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setFpError("")
        if (!fpOtp) { setFpError("Please enter the OTP"); return }
        if (!fpNewPassword) { setFpError("Please enter a new password"); return }
        if (fpNewPassword.length < 6) { setFpError("Password must be at least 6 characters"); return }
        if (fpNewPassword !== fpConfirmPassword) { setFpError("Passwords do not match"); return }

        setFpLoading(true)
        try {
            const res = await stationAdminApi.forgotPasswordReset({
                transactionId: fpTransactionId,
                otp: fpOtp,
                newPassword: fpNewPassword,
            }) as any

            if (res.code === 1 || res.success) {
                setFpSuccess("Password reset successfully! You can now log in.")
                setTimeout(() => closeForgotPassword(), 2500)
            } else {
                setFpError(res.message || "Failed to reset password")
            }
        } catch (err: any) {
            setFpError(err.response?.data?.message || "Failed to reset password")
        } finally {
            setFpLoading(false)
        }
    }

    return (
        <>
            {/* ─────────────────────────────────────────────────────────
                ORIGINAL LOGIN LAYOUT — UNCHANGED
            ───────────────────────────────────────────────────────── */}
            <form onSubmit={handleLogin} className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">

                {/* Branding Section */}
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-4">
                        <div className="bg-[#FF6A1F] p-2.5 rounded-2xl shadow-xl shadow-orange-100 flex items-center justify-center">
                            <Bike className="text-white" size={32} strokeWidth={2.5} />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Station Admin
                    </h1>
                    <p className="text-sm text-slate-500 mt-2">
                        EV Scooty Rental Management
                    </p>
                </div>

                {/* Main Form Card */}
                <div className="w-full max-w-[448px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 p-10">

                    {/* Email Field */}
                    <div className="space-y-2 mb-6">
                        <label className="text-sm font-medium text-slate-600 block">
                            Email
                        </label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => { 
                                setEmail(e.target.value); 
                                setTransactionId(""); 
                                setError(""); 
                            }}
                            placeholder="Enter your email "
                            className={`w-full px-4 py-3 rounded-xl border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all ${error && !email ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-orange-500"}`}
                        />
                    </div>

                    {/* Auth Mode Toggle */}
                    <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-6">
                        <button
                            type="button"
                            onClick={() => { setMode("password"); setError(""); }}
                            className={`flex-1 font-medium py-2.5 rounded-lg transition-all ${mode === "password" ? "bg-orange-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-200"}`}
                        >
                            Password
                        </button>
                        <button
                            type="button"
                            onClick={() => { setMode("otp"); setError(""); }}
                            className={`flex-1 font-medium py-2.5 rounded-lg transition-all ${mode === "otp" ? "bg-orange-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-200"}`}
                        >
                            OTP
                        </button>
                    </div>

                    {mode === "password" ? (
                        <>
                            {/* Password Field */}
                            <div className="space-y-2 mb-4">
                                <label className="text-sm font-medium text-slate-600 block">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className={`w-full px-4 py-3 rounded-xl border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all ${error && !password ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-orange-500"}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Forgot Password Link — now opens modal */}
                            <div className="text-right mb-8">
                                <button
                                    type="button"
                                    onClick={openForgotPassword}
                                    className="text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-6 mb-8">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center block">
                                    <label className="text-sm font-medium text-slate-600">
                                        Enter OTP
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={resendTimer > 0 || isLoading}
                                        className="text-xs font-bold text-orange-600 hover:text-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {!transactionId ? "Get OTP" : resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="6-digit OTP"
                                    disabled={!transactionId}
                                    className={`w-full px-4 py-3 rounded-xl border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all ${error && !otp ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-orange-500"} ${!transactionId ? "bg-slate-50/50 cursor-not-allowed" : ""}`}
                                />
                                {!transactionId && (
                                    <p className="text-[10px] text-slate-400 ml-1">Click "Get OTP" to receive a code on your email.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 bg-green-50 border border-green-100 text-green-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            {success}
                        </div>
                    )}

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-200 transition-all transform hover:scale-[1.01] active:scale-[0.99] mb-6 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Logging in...
                            </>
                        ) : (
                            "Login to Dashboard"
                        )}
                    </button>

                    {/* Info Box */}
                    <div className="bg-slate-50 rounded-xl py-3 px-4 text-center">
                        <p className="text-xs text-slate-500">
                            Securely manage your rental fleet
                        </p>
                    </div>

                </div>

                {/* Footer */}
                <footer className="mt-12">
                    <p className="text-xs text-slate-400">
                        © 2026 EV Scooty Rental. All rights reserved.
                    </p>
                </footer>

            </form>

            {/* ─────────────────────────────────────────────────────────
                FORGOT PASSWORD MODAL (overlay — layout untouched)
            ───────────────────────────────────────────────────────── */}
            {fpOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-2xl p-8 relative animate-in fade-in zoom-in-95 duration-200">

                        {/* Close button */}
                        <button
                            onClick={closeForgotPassword}
                            className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* ── Step 1: Enter Email ── */}
                        {fpStep === "enter_email" && (
                            <form onSubmit={handleFpSendOtp}>
                                <h2 className="text-xl font-bold text-slate-800 mb-1">Forgot Password</h2>
                                <p className="text-sm text-slate-500 mb-7">Enter your registered email to receive an OTP.</p>

                                <div className="space-y-2 mb-5">
                                    <label className="text-sm font-medium text-slate-600 block">Email Address</label>
                                    <input
                                        type="email"
                                        value={fpEmail}
                                        onChange={(e) => setFpEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className={`w-full px-4 py-3 rounded-xl border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all ${fpError && !fpEmail ? "border-red-500" : "border-slate-200 focus:border-orange-500"}`}
                                    />
                                </div>

                                {fpError && (
                                    <div className="mb-5 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                        {fpError}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={fpLoading}
                                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-2"
                                >
                                    {fpLoading ? (
                                        <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending OTP...</>
                                    ) : "Send OTP"}
                                </button>
                            </form>
                        )}

                        {/* ── Step 2: Reset Password (combined with OTP) ── */}
                        {fpStep === "reset_password" && (
                            <form onSubmit={handleFpReset}>
                                <button
                                    type="button"
                                    onClick={() => setFpStep("enter_email")}
                                    className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-5 transition-colors"
                                >
                                    <ArrowLeft size={15} /> Back
                                </button>

                                <h2 className="text-xl font-bold text-slate-800 mb-1">Reset Password</h2>
                                <p className="text-sm text-slate-500 mb-7">Enter the OTP sent to <span className="font-semibold text-slate-700">{fpEmail}</span> and your new password.</p>

                                <div className="space-y-2 mb-4">
                                    <label className="text-sm font-medium text-slate-600 block">Enter OTP</label>
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="text"
                                            value={fpOtp}
                                            onChange={(e) => setFpOtp(e.target.value)}
                                            placeholder="6-digit OTP"
                                            maxLength={6}
                                            className={`w-full px-4 py-3 rounded-xl border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all ${fpError && !fpOtp ? "border-red-500" : "border-slate-200 focus:border-orange-500"}`}
                                        />
                                        <div className="text-right">
                                            <button
                                                type="button"
                                                onClick={handleFpResendOtp}
                                                disabled={!canResend || fpLoading}
                                                className="text-xs font-bold text-orange-600 hover:text-orange-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {canResend ? "Resend OTP" : "Resend OTP (wait 30s)"}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <label className="text-sm font-medium text-slate-600 block">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showFpNew ? "text" : "password"}
                                            value={fpNewPassword}
                                            onChange={(e) => setFpNewPassword(e.target.value)}
                                            placeholder="Min. 6 characters"
                                            className={`w-full px-4 py-3 rounded-xl border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all ${fpError && !fpNewPassword ? "border-red-500" : "border-slate-200 focus:border-orange-500"}`}
                                        />
                                        <button type="button" onClick={() => setShowFpNew(!showFpNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                            {showFpNew ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-5">
                                    <label className="text-sm font-medium text-slate-600 block">Confirm Password</label>
                                    <div className="relative">
                                        <input
                                            type={showFpConfirm ? "text" : "password"}
                                            value={fpConfirmPassword}
                                            onChange={(e) => setFpConfirmPassword(e.target.value)}
                                            placeholder="Re-enter new password"
                                            className={`w-full px-4 py-3 rounded-xl border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all ${fpError && fpNewPassword !== fpConfirmPassword ? "border-red-500" : "border-slate-200 focus:border-orange-500"}`}
                                        />
                                        <button type="button" onClick={() => setShowFpConfirm(!showFpConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                            {showFpConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {fpError && (
                                    <div className="mb-5 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                        {fpError}
                                    </div>
                                )}

                                {fpSuccess && (
                                    <div className="mb-5 bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                        {fpSuccess}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={fpLoading}
                                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-2"
                                >
                                    {fpLoading ? (
                                        <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Resetting...</>
                                    ) : "Reset Password"}
                                </button>
                            </form>
                        )}

                    </div>
                </div>
            )}
        </>
    )
}
