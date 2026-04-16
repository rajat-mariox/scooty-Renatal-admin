import { User, Lock, Eye, EyeOff, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"
import MainLayout from "../layouts/MainLayout"
import { adminApi } from "../services/adminApi"

// ─── Tiny toast helpers ───────────────────────────────────────────
type ToastState = { message: string; type: "success" | "error" } | null

function Toast({ toast }: { toast: ToastState }) {
    if (!toast) return null
    return (
        <div
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-sm font-semibold transition-all animate-in fade-in slide-in-from-bottom-4 duration-300 ${toast.type === "success"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-600"
                }`}
        >
            {toast.type === "success"
                ? <CheckCircle size={18} className="text-green-500" />
                : <AlertCircle size={18} className="text-red-500" />}
            {toast.message}
        </div>
    )
}

// ─── Reusable styled input ────────────────────────────────────
const inputCls = "w-full h-[52px] bg-white border border-slate-200 rounded-xl px-6 text-[14px] font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/15 transition-all"

const PasswordInput = ({
    value, onChange, show, onToggle, placeholder, hasError
}: {
    value: string
    onChange: (v: string) => void
    show: boolean
    onToggle: () => void
    placeholder: string
    hasError?: boolean
}) => (
    <div className="relative">
        <input
            type={show ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`${inputCls} pr-12 ${hasError ? "border-red-400 focus:border-red-400 focus:ring-red-500/15" : ""}`}
        />
        <button
            type="button"
            onClick={onToggle}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
    </div>
)

export default function Settings() {
    // ─── Profile state ──────────────────────────────────────────────────
    const [profile, setProfile] = useState({
        id: "",
        name: "",
        email: "",
        phone: "",
    })
    const [profileLoading, setProfileLoading] = useState(true)
    const [profileSaving, setProfileSaving] = useState(false)

    // ─── Change Password state ────────────────────────────────────
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [pwSaving, setPwSaving] = useState(false)
    const [pwError, setPwError] = useState("")

    // ─── Shared toast ─────────────────────────────────────────────
    const [toast, setToast] = useState<ToastState>(null)

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3500)
    }

    // ─── Fetch profile on mount ──────────────────────────────────────────────────
    useEffect(() => {
        const load = async () => {
            setProfileLoading(true)
            try {
                const meRes = await adminApi.getAdminDetails() as any
                const container = meRes?.data ?? meRes
                const me =
                    container?.admin ||
                    container?.user ||
                    container?.profile ||
                    container?.me ||
                    container
                setProfile({
                    id: me?._id || me?.id || "",
                    name: me?.name || me?.fullName || "",
                    email: me?.email || "",
                    phone: me?.phone || me?.mobile || me?.phoneNumber || "",
                })



            } catch {
                showToast("Failed to load profile", "error")
            } finally {
                setProfileLoading(false)
            }
        }
        load()
    }, [])

    // ─── Update profile ──────────────────────────────────────────
    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setProfileSaving(true)
        try {
            const payload = {
                name: profile.name,
                email: profile.email,
                mobile: profile.phone,
            }

            const res = await adminApi.updateAdminDetails(payload) as any
            if (res.code === 1 || res.success) {
                showToast("Profile updated successfully!", "success")
                // Refresh local storage if present
                const stored = localStorage.getItem("admin_details")
                if (stored) {
                    const parsed = JSON.parse(stored)
                    localStorage.setItem("admin_details", JSON.stringify({ ...parsed, name: profile.name, email: profile.email }))
                    window.dispatchEvent(new Event("admin_details_updated"))
                }
            } else {
                showToast(res.message || "Failed to update profile", "error")
            }
        } catch (err: any) {
            showToast(err.response?.data?.message || "Failed to update profile", "error")
        } finally {
            setProfileSaving(false)
        }
    }

    // ─── Change Password ─────────────────────────────────────────
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setPwError("")

        if (!currentPassword) { setPwError("Please enter your current password"); return }
        if (!newPassword) { setPwError("Please enter a new password"); return }
        if (newPassword.length < 6) { setPwError("New password must be at least 6 characters"); return }
        if (newPassword !== confirmPassword) { setPwError("Passwords do not match"); return }

        setPwSaving(true)
        try {
            const res = await adminApi.changePassword({
                currentPassword,
                newPassword,
            }) as any

            if (res.code === 1 || res.success) {
                showToast("Password changed successfully!", "success")
                setCurrentPassword(""); setNewPassword(""); setConfirmPassword("")
            } else {
                setPwError(res.message || "Failed to change password")
            }
        } catch (err: any) {
            setPwError(err.response?.data?.message || "Failed to change password")
        } finally {
            setPwSaving(false)
        }
    }



    return (
        <MainLayout>
            <div className="space-y-8 max-w-[1100px] ml-4 font-['Poppins']">

                {/* Header */}
                <div className="space-y-1">
                    <h2 className="text-[22px] font-bold text-slate-800 tracking-tight">Settings</h2>
                    <p className="text-slate-400 font-medium text-[14px]">Manage your account and preferences</p>
                </div>

                {/* ─── Profile Information Card ─── */}
                <form onSubmit={handleUpdateProfile}>
                    <div className="bg-white rounded-[1.2rem] border border-slate-100 shadow-sm shadow-slate-200/20 p-10">
                        <div className="flex items-center gap-3 mb-8">
                            <User size={20} className="text-slate-400" />
                            <h3 className="text-[16px] font-bold text-slate-800">Profile Information</h3>
                            {profileLoading && (
                                <RefreshCw size={16} className="text-orange-400 animate-spin ml-auto" />
                            )}
                        </div>

                        {profileLoading ? (
                            <div className="space-y-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-[52px] bg-slate-100 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[13px] font-semibold text-slate-400 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        placeholder="Enter full name"
                                        className={inputCls}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[13px] font-semibold text-slate-400 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        placeholder="Enter email address"
                                        className={inputCls}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[13px] font-semibold text-slate-400 ml-1">Phone Number</label>
                                    <input
                                        type="text"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        placeholder="Enter phone number"
                                        className={inputCls}
                                    />
                                </div>



                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={profileSaving}
                                        className="px-10 h-12 bg-[#FF6A1F] text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 text-[14px] flex items-center gap-2 disabled:opacity-70"
                                    >
                                        {profileSaving ? (
                                            <><RefreshCw size={16} className="animate-spin" /> Saving...</>
                                        ) : "Update Profile"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </form>

                {/* ─── Change Password Card ─── */}
                <form onSubmit={handleChangePassword}>
                    <div className="bg-white rounded-[1.2rem] border border-slate-100 shadow-sm shadow-slate-200/20 p-10">
                        <div className="flex items-center gap-3 mb-8">
                            <Lock size={20} className="text-slate-400" />
                            <h3 className="text-[16px] font-bold text-slate-800">Change Password</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[13px] font-semibold text-slate-400 ml-1">Current Password</label>
                                <PasswordInput
                                    value={currentPassword}
                                    onChange={setCurrentPassword}
                                    show={showCurrent}
                                    onToggle={() => setShowCurrent(!showCurrent)}
                                    placeholder="Enter current password"
                                    hasError={!!pwError && !currentPassword}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[13px] font-semibold text-slate-400 ml-1">New Password</label>
                                <PasswordInput
                                    value={newPassword}
                                    onChange={setNewPassword}
                                    show={showNew}
                                    onToggle={() => setShowNew(!showNew)}
                                    placeholder="Min. 6 characters"
                                    hasError={!!pwError && (newPassword.length < 6 || !newPassword)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[13px] font-semibold text-slate-400 ml-1">Confirm New Password</label>
                                <PasswordInput
                                    value={confirmPassword}
                                    onChange={setConfirmPassword}
                                    show={showConfirm}
                                    onToggle={() => setShowConfirm(!showConfirm)}
                                    placeholder="Re-enter new password"
                                    hasError={!!pwError && newPassword !== confirmPassword}
                                />
                            </div>

                            {pwError && (
                                <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                                    <AlertCircle size={16} className="shrink-0" />
                                    {pwError}
                                </div>
                            )}

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={pwSaving}
                                    className="px-10 h-12 bg-[#FF6A1F] text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 text-[14px] flex items-center gap-2 disabled:opacity-70"
                                >
                                    {pwSaving ? (
                                        <><RefreshCw size={16} className="animate-spin" /> Changing...</>
                                    ) : "Change Password"}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

            </div>

            {/* Toast notification */}
            <Toast toast={toast} />
        </MainLayout>
    )
}
