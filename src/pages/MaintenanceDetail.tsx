import {
    ArrowLeft,
    Wrench
} from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import MainLayout from "../layouts/MainLayout"

export default function MaintenanceDetail() {
    const navigate = useNavigate()
    const [currentStatus, setCurrentStatus] = useState<'Pending' | 'In Progress' | 'Completed'>('In Progress')

    const currentData = {
        id: "M001",
        vehicleId: "SC004",
        issueType: "Brake Issue",
        date: "2026-02-21",
        cost: "₹1,200",
        description: "Rear brake pad replacement required"
    }

    return (
        <MainLayout>
            <div className="space-y-6 max-w-[1500px] font-['Poppins']">

                {/* Navigation & Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-4">
                        <button
                            onClick={() => navigate("/maintenance")}
                            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-[14px] font-semibold"
                        >
                            <ArrowLeft size={18} />
                            Back to Maintenance Logs
                        </button>
                        <div className="space-y-1">
                            <h2 className="text-[20px] font-bold text-slate-800">Maintenance Details - {currentData.id}</h2>
                            <p className="text-slate-400 font-medium text-[14px]">{currentData.vehicleId}</p>
                        </div>
                    </div>
                    <div>
                        <span className={`px-4 py-1 text-[11px] font-bold rounded-full inline-block ${
                            currentStatus === 'Completed' ? 'bg-green-100 text-green-600' :
                            currentStatus === 'In Progress' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-rose-100 text-rose-500'
                        }`}>
                            {currentStatus}
                        </span>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-12 gap-6">

                    {/* Maintenance Info Card */}
                    <div className="col-span-12 lg:col-span-7 bg-white rounded-[1.2rem] border border-slate-100 shadow-sm shadow-slate-200/20 p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <Wrench size={20} className="text-slate-400" />
                            <h3 className="text-[16px] font-bold text-slate-800">Maintenance Information</h3>
                        </div>

                        <div className="space-y-6">
                            <InfoItem label="Log ID" value={currentData.id} />
                            <InfoItem label="Vehicle ID" value={currentData.vehicleId} />
                            <InfoItem label="Issue Type" value={currentData.issueType} />
                            <InfoItem label="Date" value={currentData.date} />
                            <InfoItem label="Cost" value={currentData.cost} />
                        </div>
                    </div>

                    {/* Status Management Card */}
                    <div className="col-span-12 lg:col-span-5 bg-white rounded-[1.2rem] border border-slate-100 shadow-sm shadow-slate-200/20 p-8 flex flex-col">
                        <h3 className="text-[16px] font-bold text-slate-800 mb-8">Status Management</h3>

                        <div className="space-y-8 flex-1">
                            <div>
                                <p className="text-[12px] font-semibold text-slate-400 mb-4">Current Status</p>
                                <span className={`px-4 py-1 text-[11px] font-bold rounded-full inline-block ${
                                    currentStatus === 'Completed' ? 'bg-green-100 text-green-600' :
                                    currentStatus === 'In Progress' ? 'bg-yellow-100 text-yellow-600' :
                                    'bg-rose-100 text-rose-500'
                                }`}>
                                    {currentStatus}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <button 
                                    onClick={() => setCurrentStatus(currentStatus === 'Pending' ? 'In Progress' : 'Pending')}
                                    className="w-full py-3.5 border-2 border-[#FF6A1F] rounded-xl text-[#FF6A1F] font-bold text-[14px] hover:bg-orange-50 transition-all"
                                >
                                    Update Status
                                </button>
                                <button 
                                    onClick={() => setCurrentStatus('Completed')}
                                    className="w-full py-3.5 bg-[#FF6A1F] text-white font-bold text-[14px] rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-100"
                                >
                                    Mark as Completed
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Issue Description Card */}
                    <div className="col-span-12 bg-white rounded-[1.2rem] border border-slate-100 shadow-sm shadow-slate-200/20 p-8">
                        <h3 className="text-[16px] font-bold text-slate-800 mb-4">Issue Description</h3>
                        <p className="text-[14px] text-slate-500 font-medium">
                            {currentData.description}
                        </p>
                    </div>

                </div>
            </div>
        </MainLayout>
    )
}

function InfoItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="space-y-1">
            <span className="text-[12px] font-semibold text-slate-400">{label}</span>
            <p className="text-[14px] font-bold text-slate-800">{value}</p>
        </div>
    )
}
