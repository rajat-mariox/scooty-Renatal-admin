import { Eye, EyeOff, Bike } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Login() {
    const navigate = useNavigate()
    const [mode, setMode] = useState<"password" | "otp">("password")
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [otp, setOtp] = useState("")
    const [error, setError] = useState("")

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!email && !password) {
            setError("Please enter your email and password")
            return
        }

        if (!email) {
            setError("Please enter your email")
            return
        }

        if (mode === "password" && !password) {
            setError("Please enter your password")
            return
        }

        if (mode === "otp" && !otp) {
            setError("Please enter your OTP")
            return
        }

        // Add actual login logic here
        console.log("Logging in with", { email, password, otp, mode })
        navigate("/dashboard")
    }

    return (
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
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@evstation.com"
                        className={`w-full px-4 py-3 rounded-xl border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all ${error && !email ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-orange-500"}`}
                    />
                </div>

                {/* Auth Mode Toggle */}
                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-6">
                    <button
                        type="button"
                        onClick={() => setMode("password")}
                        className={`flex-1 font-medium py-2.5 rounded-lg transition-all ${mode === "password" ? "bg-orange-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-200"}`}
                    >
                        Password
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode("otp")}
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

                        {/* Forgot Password Link */}
                        <div className="text-right mb-8">
                            <button type="button" className="text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors">
                                Forgot Password?
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="space-y-6 mb-8">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 block">
                                Enter OTP
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="6-digit OTP"
                                className={`w-full px-4 py-3 rounded-xl border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all ${error && !otp ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-orange-500"}`}
                            />
                        </div>
                        <div className="text-center">
                            <button type="button" className="text-sm font-bold text-orange-600 hover:text-orange-700">
                                Resend OTP
                            </button>
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

                {/* Login Button */}
                <button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-200 transition-all transform hover:scale-[1.01] active:scale-[0.99] mb-6"
                >
                    Login to Dashboard
                </button>

                {/* Demo Info Box */}
                <div className="bg-slate-50 rounded-xl py-3 px-4 text-center">
                    <p className="text-xs text-slate-500">
                        Demo: Any email & password will work
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
    )
}

