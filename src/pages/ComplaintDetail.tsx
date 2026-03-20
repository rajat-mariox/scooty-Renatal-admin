import {
    ArrowLeft,
    Phone,
    CircleDollarSign,
    Info,
    X
} from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import MainLayout from "../layouts/MainLayout"

export default function ComplaintDetail() {
    const navigate = useNavigate()
    const [status, setStatus] = useState("Pending")
    const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false)
    const [isResolveModalOpen, setIsResolveModalOpen] = useState(false)

    const complaintData = {
        id: "C001",
        date: "2026-02-23",
        userName: "Sanjay Verma",
        phone: "+91 99123 45678",
        relatedRide: "R003",
        issueType: "Vehicle stopped mid-ride",
        description: "The scooter suddenly stopped working during my ride. Battery was showing 40%."
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
                        <span className={`px-4 py-1 text-[11px] font-bold rounded-full inline-block ${
                            status === "Resolved" 
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
                                    <p className="text-[14px] font-bold text-[#FF6A1F]">{complaintData.relatedRide}</p>
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
                            <button className="w-full h-14 flex items-center justify-center gap-3 border-2 border-[#FF6A1F] rounded-xl text-[#FF6A1F] font-bold hover:bg-orange-50 transition-all text-[14px]">
                                <Phone size={20} />
                                Call {complaintData.userName}
                            </button>
                        </div>

                        {/* Issue Refund Card - Hidden if resolved */}
                        {status !== "Resolved" && (
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
                        <div className="bg-white rounded-[1.2rem] border border-slate-100 shadow-sm shadow-slate-200/20 p-8">
                            <h3 className="text-[16px] font-bold text-slate-800 mb-6">Actions</h3>
                            {status !== "Resolved" && (
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
                            )}
                        </div>
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
                                className="text-slate-500 font-bold hover:text-slate-800 transition-colors text-[14px]"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => {
                                    setStatus("Resolved");
                                    setIsResolveModalOpen(false);
                                }}
                                className="bg-[#FF6A1F] hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-sm text-[14px]"
                            >
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
