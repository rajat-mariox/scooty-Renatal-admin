import { ArrowLeft, RefreshCw, Check, X, Download, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import MainLayout from "../../layouts/MainLayout"
import { adminApi } from "../../services/adminApi"

const normalizeKycStatus = (user: any) => String(user?.kycStatus || user?.kyc_status || "").toUpperCase();

export default function UserDetail() {
    const { userId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const isOwnerRoute = location.pathname.startsWith("/admin/owners")
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [currentAction, setCurrentAction] = useState<'approve' | 'reject' | null>(null)
    const [rejectReason, setRejectReason] = useState("")
    const [rejectError, setRejectError] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [successMsg, setSuccessMsg] = useState("")

    useEffect(() => {
        fetchUserDetail()
    }, [userId])

    const fetchUserDetail = async () => {
        if (!userId) {
            setError("Invalid user ID")
            setLoading(false)
            return
        }
        setLoading(true)
        try {
            const response = await adminApi.getUserById(userId)
            const rawData = (response as any)?.data ?? response
            const userData = rawData?.user || rawData
            if (userData) {
                setUser(userData)
            } else {
                setError("User not found")
            }
        } catch (err) {
            console.error("Failed to fetch user details:", err)
            setError("Failed to load user details")
        } finally {
            setLoading(false)
        }
    }

    const handleKycAction = async (action: 'approve' | 'reject', rejectionReasonValue = "") => {
        if (!user || !userId) return
        if (action === 'reject' && !rejectionReasonValue.trim()) {
            setRejectError("Please provide a rejection reason")
            return
        }

        setSubmitting(true)
        try {
            const payload: any = { status: action === 'approve' ? 'APPROVED' : 'REJECTED' }
            if (action === 'reject') {
                payload.rejectionReason = rejectionReasonValue.trim()
            }
            const response = await adminApi.updateKycStatus(userId, payload)
            const rawData = (response as any)?.data ?? response
            const updatedUser = rawData?.user || rawData
            setUser(updatedUser || { ...user, kycStatus: action === 'approve' ? 'APPROVED' : 'REJECTED' })
            setSuccessMsg(`KYC ${action === 'approve' ? 'approved' : 'rejected'} successfully`)
            setCurrentAction(null)
            setRejectReason("")
            setRejectError("")
        } catch (err) {
            console.error("Failed to update KYC:", err)
            setRejectError("Failed to update KYC status. Try again.")
        } finally {
            setSubmitting(false)
        }
    }

    const kycStatus = user ? normalizeKycStatus(user) : ""
    const rejectionReason = user ? String(user?.kycRejectionReason || user?.kyc_rejection_reason || "").trim() : ""

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(isOwnerRoute ? "/admin/owners" : "/admin/users")}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">{isOwnerRoute ? "Owner" : "User"} KYC Review Details</h1>
                        <p className="text-sm text-slate-500">
                            Review and manage KYC documents for this {isOwnerRoute ? "owner" : "user"}.
                        </p>
                    </div>
                </div>

                {successMsg && (
                    <div className="rounded-3xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {successMsg}
                    </div>
                )}

                {error && !loading && (
                    <div className="rounded-3xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <RefreshCw className="animate-spin text-orange-600" size={40} />
                    </div>
                ) : user ? (
                    <>
                        {/* User Info Card */}
                        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Name</h3>
                                    <p className="text-xl font-bold text-slate-800">{user.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Email</h3>
                                    <p className="text-lg font-semibold text-slate-700">{user.email || 'N/A'}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Phone</h3>
                                    <p className="text-lg font-semibold text-slate-700">{user.mobile || user.phone || 'N/A'}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Company Name</h3>
                                    <p className="text-lg font-semibold text-slate-700">{user.companyName || 'N/A'}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">City</h3>
                                    <p className="text-lg font-semibold text-slate-700">{user.city || 'N/A'}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">State</h3>
                                    <p className="text-lg font-semibold text-slate-700">{user.state || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* KYC Status Card */}
                        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                            <h2 className="text-lg font-bold mb-4">KYC Status</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-slate-600">Status:</span>
                                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${kycStatus === 'APPROVED' ? 'bg-green-50 text-green-700' : kycStatus === 'REJECTED' ? 'bg-rose-50 text-rose-700' : kycStatus === 'PENDING' ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-700'}`}>
                                        {kycStatus === 'APPROVED' ? <Check size={16} /> : kycStatus === 'REJECTED' ? <X size={16} /> : kycStatus === 'PENDING' ? <AlertCircle size={16} /> : null}
                                        {kycStatus === 'APPROVED' ? 'Approved' : kycStatus === 'REJECTED' ? 'Rejected' : kycStatus === 'PENDING' ? 'Pending Review' : 'Not Submitted'}
                                    </span>
                                </div>

                                {user.kycSubmittedAt && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-slate-600">Submitted at:</span>
                                        <span className="text-sm text-slate-700">{new Date(user.kycSubmittedAt).toLocaleString()}</span>
                                    </div>
                                )}

                                {user.kycVerifiedAt && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-slate-600">Verified at:</span>
                                        <span className="text-sm text-slate-700">{new Date(user.kycVerifiedAt).toLocaleString()}</span>
                                    </div>
                                )}

                                {kycStatus === 'REJECTED' && rejectionReason && (
                                    <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4">
                                        <p className="text-sm font-semibold text-rose-700 mb-1">Rejection Reason:</p>
                                        <p className="text-sm text-rose-600">{rejectionReason}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* KYC Documents */}
                        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                            <h2 className="text-lg font-bold mb-4">KYC Documents</h2>
                            <div className="space-y-4">
                                {user.profilePhotoUrl && (
                                    <div className="border border-slate-200 rounded-2xl p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-semibold text-slate-800">Profile Photo</h4>
                                            <a
                                                href={user.profilePhotoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                            >
                                                <Download size={16} />
                                                Download
                                            </a>
                                        </div>
                                        {user.profilePhotoUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
                                            <img src={user.profilePhotoUrl} alt="Profile Photo" className="max-h-64 rounded-lg object-contain" />
                                        )}
                                    </div>
                                )}

                                {user.adharFile && (
                                    <div className="border border-slate-200 rounded-2xl p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-semibold text-slate-800">Aadhar Document</h4>
                                            <a
                                                href={user.adharFile}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                            >
                                                <Download size={16} />
                                                Download
                                            </a>
                                        </div>
                                        {user.adharFile.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
                                            <img src={user.adharFile} alt="Aadhar" className="max-h-64 rounded-lg object-contain" />
                                        )}
                                    </div>
                                )}

                                {user.panFile && (
                                    <div className="border border-slate-200 rounded-2xl p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-semibold text-slate-800">PAN Document</h4>
                                            <a
                                                href={user.panFile}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                            >
                                                <Download size={16} />
                                                Download
                                            </a>
                                        </div>
                                        {user.panFile.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
                                            <img src={user.panFile} alt="PAN" className="max-h-64 rounded-lg object-contain" />
                                        )}
                                    </div>
                                )}

                                {!user.profilePhotoUrl && !user.adharFile && !user.panFile && (
                                    <p className="text-slate-500 text-center py-8">No KYC documents uploaded yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {kycStatus !== 'APPROVED' && kycStatus !== 'REJECTED' && (
                            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                                <h2 className="text-lg font-bold mb-4">Take Action</h2>
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <button
                                        onClick={() => setCurrentAction('approve')}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                                    >
                                        <Check size={18} />
                                        Approve KYC
                                    </button>
                                    <button
                                        onClick={() => setCurrentAction('reject')}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-colors"
                                    >
                                        <X size={18} />
                                        Reject KYC
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Approval Confirmation Modal */}
                        {currentAction === 'approve' && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                                <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                                    <h3 className="text-xl font-bold mb-2">Approve KYC?</h3>
                                    <p className="text-sm text-slate-600 mb-6">This user will be marked as KYC verified and can proceed with their account.</p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setCurrentAction(null)}
                                            className="flex-1 px-4 py-3 rounded-full border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleKycAction('approve')}
                                            disabled={submitting}
                                            className="flex-1 px-4 py-3 rounded-full bg-green-600 font-semibold text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                                        >
                                            {submitting ? 'Approving...' : 'Approve'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Rejection Modal */}
                        {currentAction === 'reject' && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                                <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                                    <h3 className="text-xl font-bold mb-2">Reject KYC</h3>
                                    <p className="text-sm text-slate-600 mb-4">Provide a reason for rejection. The user will receive this feedback.</p>
                                    <textarea
                                        rows={4}
                                        value={rejectReason}
                                        onChange={(e) => { setRejectReason(e.target.value); setRejectError("") }}
                                        placeholder="Please explain why this KYC is being rejected..."
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 mb-2"
                                    />
                                    {rejectError && <p className="text-sm text-rose-600 mb-4">{rejectError}</p>}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => { setCurrentAction(null); setRejectReason(""); setRejectError("") }}
                                            className="flex-1 px-4 py-3 rounded-full border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleKycAction('reject', rejectReason)}
                                            disabled={submitting}
                                            className="flex-1 px-4 py-3 rounded-full bg-rose-600 font-semibold text-white hover:bg-rose-700 transition-colors disabled:opacity-50"
                                        >
                                            {submitting ? 'Rejecting...' : 'Reject'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : null}
            </div>
        </MainLayout>
    )
}
