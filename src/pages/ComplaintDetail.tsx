import {
    ArrowLeft,
    Phone,
    CircleDollarSign,
    Info,
    X,
    RefreshCw,
    AlertCircle
} from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import MainLayout from "../layouts/MainLayout"
import { adminApi } from "../services/adminApi"

export default function ComplaintDetail() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const id = searchParams.get('id')

    const [status, setStatus] = useState("Pending")
    const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false)
    const [isResolveModalOpen, setIsResolveModalOpen] = useState(false)
    const [complaintData, setComplaintData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [actionLoading, setActionLoading] = useState(false)

    useEffect(() => {
        const fetchTicketDetails = async () => {
            if (!id) {
                setError("No ticket ID provided")
                setLoading(false)
                return
            }

            setLoading(true)
            try {
                const response = await adminApi.getTicketDetail(id)
                const data = (response as any).data || response

                const formattedData = {
                    id: data.ticketId || data.id || id,
                    date: data.date || data.createdAt ? new Date(data.date || data.createdAt).toISOString().split('T')[0] : "N/A",
                    userName: data.userName || data.user?.name || "Unknown User",
                    phone: data.phone || data.user?.phone || "N/A",
                    relatedRide: data.rideId || data.ride?.id || "N/A",
                    issueType: data.issue || data.subject || "General Support",
                    description: data.description || "No description provided."
                }

                setComplaintData(formattedData)
                setStatus(data.status || "Pending")
            } catch (err: any) {
                console.error("Failed to fetch ticket details:", err)
                setError(err.response?.data?.message || "Failed to load ticket details")
            } finally {
                setLoading(false)
            }
        }

        fetchTicketDetails()
    }, [id])

    const handleResolve = async () => {
        setActionLoading(true)
        try {
            // Check if updateTicketStatus exists in adminApi, if not just update local state
            if ((adminApi as any).updateTicketStatus) {
                await (adminApi as any).updateTicketStatus(id as string, { status: 'Resolved' })
            }
            setStatus("Resolved")
        } catch (error) {
            console.error("Failed to resolve ticket:", error)
        } finally {
            setActionLoading(false)
            setIsResolveModalOpen(false)
        }
    }

    if (loading) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <RefreshCw className="animate-spin text-orange-500" size={48} />
                    <span className="text-lg font-bold text-slate-500">Loading Complaint Details...</span>
                </div>
            </MainLayout>
        )
    }

    if (error || !complaintData) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center">
                        <AlertCircle className="text-rose-500" size={40} />
                    </div>
                    <span className="text-lg font-bold text-slate-700">{error || "Complaint not found"}</span>
                    <button
                        onClick={() => navigate("/support")}
                        className="px-6 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all mt-4"
                    >
                        Back to Support
                    </button>
                </div>
            </MainLayout>
        )
    }

    return (
        <MainLayout>
            <div className="space-y-6 max-w-[1500px] font-['Poppins']">

                {/* Top Navigation & Status */}
                <div className="flex items-start justify-between">
                    <div className="space-y-4">
                        <button
                            onClick={() => navigate("/support")}
                            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-[14px] font-semibold"
                        >
                            <ArrowLeft size={18} />
                            Back to Support
                        </button>
                        <div className="space-y-1">
                            <h2 className="text-[20px] font-bold text-slate-800 tracking-tight">Complaint Details - {complaintData.id}</h2>
                            <p className="text-slate-400 font-medium text-[14px]">{complaintData.issueType}</p>
                        </div>
                    </div>
                    <div className="pt-10">
                        <span className={`px-4 py-1 text-[11px] font-bold rounded-full inline-block ${status === "Resolved" || status === "Closed"
                                ? "bg-green-100 text-green-600"
                                : "bg-yellow-100 text-yellow-600"
                            }`}>
                            {status}
                        </span>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-12 gap-8">

                    {/* Left Column */}
                    <div className="col-span-12 lg:col-span-8 space-y-6">
                        {/* Complaint Information Card */}
                        <div className="bg-white rounded-[1.2rem] border border-slate-100 shadow-sm shadow-slate-200/20 p-8">
                            <h3 className="text-[16px] font-bold text-slate-800 mb-8">Complaint Information</h3>

                            <div className="grid grid-cols-2 gap-y-10">
                                <InfoItem label="Complaint ID" value={complaintData.id} />
                                <InfoItem label="Date" value={complaintData.date} />
                                <InfoItem label="User Name" value={complaintData.userName} />
                                <InfoItem label="Phone" value={complaintData.phone} />
                                <div>
                                    <span className="text-[12px] font-semibold text-slate-400 block mb-1">Related Ride</span>
                                    {complaintData.relatedRide !== "N/A" ? (
                                        <button
                                            onClick={() => navigate(`/rides/details?id=${complaintData.relatedRide}`)}
                                            className="text-[14px] font-bold text-[#FF6A1F] hover:underline"
                                        >
                                            {complaintData.relatedRide}
                                        </button>
                                    ) : (
                                        <p className="text-[14px] font-bold text-slate-800">N/A</p>
                                    )}
                                </div>
                                <InfoItem label="Issue Type" value={complaintData.issueType} />
                            </div>
                        </div>

                        {/* Description Card */}
                        <div className="bg-white rounded-[1.2rem] border border-slate-100 shadow-sm shadow-slate-200/20 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Info size={20} className="text-slate-400" />
                                <h3 className="text-[16px] font-bold text-slate-800">Description</h3>
                            </div>
                            <p className="text-[14px] text-slate-500 font-medium leading-relaxed">
                                {complaintData.description}
                            </p>
                        </div>
                    </div>

                    {/* Right Column (Widgets) */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        {/* Contact User Card */}
                        <div className="bg-white rounded-[1.2rem] border border-slate-100 shadow-sm shadow-slate-200/20 p-8">
                            <h3 className="text-[16px] font-bold text-slate-800 mb-6">Contact User</h3>
                            <button
                                onClick={() => window.location.href = `tel:${complaintData.phone}`}
                                className="w-full h-14 flex items-center justify-center gap-3 border-2 border-[#FF6A1F] rounded-xl text-[#FF6A1F] font-bold hover:bg-orange-50 transition-all text-[14px]"
                            >
                                <Phone size={20} />
                                Call {complaintData.userName}
                            </button>
                        </div>

                        {/* Issue Refund Card - Hidden if resolved */}
                        {status !== "Resolved" && status !== "Closed" && (
                            <div className="bg-white rounded-[1.2rem] border border-slate-100 shadow-sm shadow-slate-200/20 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <CircleDollarSign size={20} className="text-slate-800" />
                                    <h3 className="text-[16px] font-bold text-slate-800">Issue Refund</h3>
                                </div>
                                <button className="w-full h-14 flex items-center justify-center border-2 border-[#FF6A1F] rounded-xl text-[#FF6A1F] font-bold hover:bg-orange-50 transition-all text-[14px]">
                                    Issue Refund
                                </button>
                            </div>
                        )}

                        {/* Actions Card */}
                        {status !== "Resolved" && status !== "Closed" && (
                            <div className="bg-white rounded-[1.2rem] border border-slate-100 shadow-sm shadow-slate-200/20 p-8">
                                <h3 className="text-[16px] font-bold text-slate-800 mb-6">Actions</h3>
                                <div className="space-y-4">
                                    <button
                                        onClick={() => setIsResolveModalOpen(true)}
                                        className="w-full h-14 bg-gradient-to-r from-[#FF6A1F] to-[#FF8C4B] text-white font-bold rounded-xl hover:opacity-95 transition-all shadow-sm text-[14px]"
                                    >
                                        Mark as Resolved
                                    </button>
                                    <button
                                        onClick={() => setIsEscalateModalOpen(true)}
                                        className="w-full h-14 bg-[#FF4B4B] text-white font-bold rounded-xl hover:bg-red-600 transition-all shadow-sm text-[14px]"
                                    >
                                        Escalate to Super Admin
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Escalate Modal */}
            {isEscalateModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[1.5rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-center sm:text-left">
                        <h3 className="text-[18px] font-bold text-slate-900 mb-4">Escalate Complaint</h3>
                        <p className="text-slate-500 font-medium text-[15px] leading-relaxed mb-8">
                            Are you sure you want to escalate this complaint to Super Admin?
                        </p>
                        <div className="flex items-center justify-end gap-6">
                            <button
                                onClick={() => setIsEscalateModalOpen(false)}
                                className="text-slate-500 font-bold hover:text-slate-800 transition-colors text-[14px]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setIsEscalateModalOpen(false)}
                                className="bg-[#FF4B4B] hover:bg-red-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-sm text-[14px]"
                            >
                                Escalate
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Resolve Modal */}
            {isResolveModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[1.5rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-center sm:text-left">
                        <h3 className="text-[18px] font-bold text-slate-900 mb-4">Resolve Complaint</h3>
                        <p className="text-slate-500 font-medium text-[15px] leading-relaxed mb-8">
                            Are you sure you want to mark this complaint as resolved?
                        </p>
                        <div className="flex items-center justify-end gap-6">
                            <button
                                onClick={() => setIsResolveModalOpen(false)}
                                disabled={actionLoading}
                                className="text-slate-500 font-bold hover:text-slate-800 transition-colors text-[14px] disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleResolve}
                                disabled={actionLoading}
                                className="flex items-center gap-2 bg-[#FF6A1F] hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-sm text-[14px] disabled:opacity-70"
                            >
                                {actionLoading && <RefreshCw size={16} className="animate-spin" />}
                                Mark Resolved
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    )
}

function InfoItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="space-y-1">
            <span className="text-[12px] font-semibold text-slate-400 block mb-1">{label}</span>
            <p className="text-[14px] font-bold text-slate-800">{value}</p>
        </div>
    )
}
