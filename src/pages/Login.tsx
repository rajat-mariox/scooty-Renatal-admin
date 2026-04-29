import { Eye, EyeOff, Bike, ArrowLeft, KeyRound, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { adminApi } from "../services/adminApi"
import PrimaryButton from "../components/PrimaryButton"

type LoginStep = 'LOGIN' | 'FORGOT_EMAIL' | 'FORGOT_RESET'

export default function Login() {
    const navigate = useNavigate()
    const [step, setStep] = useState<LoginStep>('LOGIN')
    
    // Form fields
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    
    // UI state
    const [showPassword, setShowPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [error, setError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [transactionId, setTransactionId] = useState("")

    // Clear messages when navigating
    const resetMessages = () => {
        setError("")
        setSuccessMessage("")
    }

    // Auto-dismiss success messages after 2 seconds
    useEffect(() => {
        if (!successMessage) return
        const t = setTimeout(() => setSuccessMessage(""), 2000)
        return () => clearTimeout(t)
    }, [successMessage])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        resetMessages()

        if (!email) { setError("Please enter your email"); return }
        if (!password) { setError("Please enter your password"); return }

        setIsLoading(true)
        try {
            const response = await adminApi.login({ email: email.trim(), password }) as any
            const token = response.data?.token || response.token
            const isSuccess = response.code === 1 || response.success

            if (isSuccess && token) {
                localStorage.setItem('token', token)
                localStorage.setItem('admin_details', JSON.stringify(response.data || {}))
                navigate("/dashboard")
            } else {
                setError(response.message || "Invalid credentials format")
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "An error occurred during login")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSendForgotOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        resetMessages()

        if (!email) { setError("Please enter your email address"); return }

        setIsLoading(true)
        try {
            const response = await adminApi.forgotPasswordSendOtp({ email: email.trim() }) as any
            if (response.code === 1 || response.success) {
                setSuccessMessage("OTP sent securely to your email.")
                if (response.data?.transactionId || response.transactionId) {
                    setTransactionId(response.data?.transactionId || response.transactionId)
                }
                setStep('FORGOT_RESET')
                setOtp("")
                setNewPassword("")
                setConfirmPassword("")
            } else {
                setError(response.message || "Failed to send OTP")
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to send OTP")
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendOtp = async () => {
        resetMessages()
        setIsLoading(true)
        try {
            const response = await adminApi.forgotPasswordResendOtp({ transactionId }) as any
            if (response.code === 1 || response.success) {
                setSuccessMessage("A new OTP has been sent.")
            } else {
                setError(response.message || "Failed to resend OTP")
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to resend OTP")
        } finally {
            setIsLoading(false)
        }
    }

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        resetMessages()

        if (!otp) { setError("Please enter the 4-digit OTP"); return }
        if (!newPassword) { setError("Please enter a new password"); return }
        if (newPassword.length < 6) { setError("Password must be at least 6 characters"); return }
        if (newPassword !== confirmPassword) { setError("Passwords do not match"); return }

        setIsLoading(true)
        try {
            const response = await adminApi.forgotPasswordReset({ 
                transactionId: transactionId,
                otp: otp.trim(),
                newPassword: newPassword 
            }) as any

            if (response.code === 1 || response.success) {
                setPassword("")
                setStep('LOGIN')
                setSuccessMessage("Password reset successfully! Please login with your new password.")
            } else {
                setError(response.message || "Failed to reset password")
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to reset password")
        } finally {
            setIsLoading(false)
        }
    }

    // Input styling
    const inputCls = "w-full px-4 py-3 rounded-xl border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all border-slate-200 focus:border-orange-500"

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
            
            {/* Branding Section */}
            <div className="text-center mb-10">
                <div className="flex justify-center mb-4">
                    <div className="bg-[#FF6A1F] p-2.5 rounded-2xl shadow-xl shadow-orange-100 flex items-center justify-center">
                        <Bike className="text-white" size={32} strokeWidth={2.5} />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-slate-900">
                    Admin Portal
                </h1>
                <p className="text-sm text-slate-500 mt-2">
                    Super Admin Control Center
                </p>
            </div>

            {/* Main Container */}
            <div className="w-full max-w-[448px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 p-10 relative overflow-hidden">
                
                {/* Error/Success Messages */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                        <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="mb-6 bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                        <CheckCircle size={16} className="text-green-500 shrink-0" />
                        {successMessage}
                    </div>
                )}

                {/* ─── STEP 1: LOGIN ─── */}
                {step === 'LOGIN' && (
                    <form onSubmit={handleLogin} className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-4 mb-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600 block text-left">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); resetMessages(); }}
                                    placeholder="Enter your email"
                                    className={`${inputCls} ${error && !email ? "border-red-400" : ""}`}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-slate-600">Password</label>
                                    <button 
                                        type="button" 
                                        onClick={() => { setStep('FORGOT_EMAIL'); resetMessages(); }}
                                        className="text-[13px] font-bold text-orange-600 hover:text-orange-700 transition-colors"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value); resetMessages(); }}
                                        placeholder="Enter your password"
                                        className={`${inputCls} ${error && !password ? "border-red-400" : ""}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <PrimaryButton
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4"
                        >
                            {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Login to Dashboard"}
                        </PrimaryButton>
                    </form>
                )}

                {/* ─── STEP 2: FORGOT PASSWORD EMAIL ─── */}
                {step === 'FORGOT_EMAIL' && (
                    <form onSubmit={handleSendForgotOtp} className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <button 
                                type="button" 
                                onClick={() => { setStep('LOGIN'); resetMessages(); }}
                                className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                            >
                                <ArrowLeft size={18} />
                            </button>
                            <div>
                                <h2 className="text-[18px] font-bold text-slate-800">Reset Password</h2>
                                <p className="text-[12px] text-slate-400 font-medium">We'll send an OTP to your email</p>
                            </div>
                        </div>

                        <div className="space-y-2 mb-8">
                            <label className="text-sm font-medium text-slate-600 block text-left">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); resetMessages(); }}
                                placeholder="Enter your registered email"
                                className={inputCls}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {isLoading ? <div className="w-5 h-5 border-2 border-slate-500 border-t-white rounded-full animate-spin" /> : "Send OTP"}
                        </button>
                    </form>
                )}

                {/* ─── STEP 3: RESET PASSWORD (OTP) ─── */}
                {step === 'FORGOT_RESET' && (
                    <form onSubmit={handleResetPassword} className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <button 
                                type="button" 
                                onClick={() => { setStep('FORGOT_EMAIL'); resetMessages(); }}
                                className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                            >
                                <ArrowLeft size={18} />
                            </button>
                            <div>
                                <h2 className="text-[18px] font-bold text-slate-800">Create New Password</h2>
                                <p className="text-[12px] text-slate-400 font-medium">Verification code sent to {email}</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-slate-600">Verification OTP</label>
                                    <button 
                                        type="button" 
                                        onClick={handleResendOtp}
                                        disabled={isLoading}
                                        className="text-[13px] font-bold text-orange-600 hover:text-orange-700 disabled:opacity-50"
                                    >
                                        Resend Code
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); resetMessages(); }}
                                    placeholder="Enter 6-digit OTP"
                                    className={`${inputCls} tracking-widest font-mono`}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600 block text-left">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => { setNewPassword(e.target.value); resetMessages(); }}
                                        placeholder="Min. 6 characters"
                                        className={inputCls}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600 block text-left">Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => { setConfirmPassword(e.target.value); resetMessages(); }}
                                    placeholder="Re-enter new password"
                                    className={`${inputCls} ${newPassword && confirmPassword && newPassword !== confirmPassword ? "border-red-400 focus:border-red-400" : ""}`}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {isLoading ? <div className="w-5 h-5 border-2 border-slate-500 border-t-white rounded-full animate-spin" /> : 
                            <><KeyRound size={18} /> Reset Password</>}
                        </button>
                    </form>
                )}
            </div>

            {/* Footer */}
            <footer className="mt-12">
                <p className="text-xs text-slate-400">
                    © 2026 EV Scooty Rental. All rights reserved.
                </p>
            </footer>
        </div>
    )
}
