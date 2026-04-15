import {
    ArrowLeft,
    Wrench,
    RefreshCw,
    AlertCircle
} from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import MainLayout from "../layouts/MainLayout"
import { adminApi } from "../services/adminApi"

export default function MaintenanceDetail() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const id = searchParams.get('id')

    const [currentStatus, setCurrentStatus] = useState<string>('Pending')
    const [currentData, setCurrentData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [actionLoading, setActionLoading] = useState(false)

    useEffect(() => {
        const fetchMaintenanceDetails = async () => {
            if (!id) {
                setError("No maintenance log ID provided")
                setLoading(false)
                return
            }

            setLoading(true)
            try {
                const response = await adminApi.getMaintenanceDetail(id)
                const data = (response as any).data || response
                const logData = data.request || data

                if (logData) {
                    const formattedData = {
                        id: logData.logId || logData.id || "N/A",
                        vehicleId: logData.vehicleId?.registrationNumber || logData.vehicleId?.id || logData.vehicleId || logData.vehicle?.id || "N/A",
                        issueType: logData.issueType || "General Maintenance",
                        date: logData.date || logData.createdAt ? new Date(logData.date || logData.createdAt).toISOString().split('T')[0] : "N/A",
                        cost: logData.cost || logData.estimatedCost ? `₹${logData.cost || logData.estimatedCost}` : "-",
                        description: logData.description || "No description provided."
                    }
                    setCurrentData(formattedData)
                    setCurrentStatus(logData.status || "Pending")
                    setError(null)
                } else {
                    setError("Maintenance log not found")
                }
            } catch (err: any) {
                console.error("Failed to fetch maintenance details:", err)
                setError(err.response?.data?.message || "Failed to load maintenance details")
            } finally {
                setLoading(false)
            }
        }

        fetchMaintenanceDetails()
    }, [id])

    const handleUpdateStatus = async (newStatus: string) => {
        setActionLoading(true)
        try {
            await adminApi.updateMaintenanceStatus(id!, {
                status: newStatus
            })
            setCurrentStatus(newStatus)
        } catch (err: any) {
            console.error("Failed to update status:", err)
        } finally {
            setActionLoading(false)
        }
    }

    if (loading) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <RefreshCw className="animate-spin text-orange-500" size={48} />
                    <span className="text-lg font-bold text-slate-500">Loading Maintenance Details...</span>
                </div>
            </MainLayout>
        )
    }

    if (error || !currentData) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center">
                        <AlertCircle className="text-rose-500" size={40} />
                    </div>
                    <span className="text-lg font-bold text-slate-700">{error || "Maintenance Log not found"}</span>
                    <button 
                        onClick={() => navigate("/maintenance")}
                        className="px-6 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all mt-4"
                    >
                        Back to Logs
                    </button>
                </div>
            </MainLayout>
        )
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
                            <p className="text-slate-400 font-medium text-[14px]">Vehicle: {currentData.vehicleId}</p>
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
                                {currentStatus !== 'Completed' && (
                                    <>
                                        <button 
                                            onClick={() => handleUpdateStatus(currentStatus === 'Pending' ? 'In Progress' : 'Pending')}
                                            disabled={actionLoading}
                                            className="w-full flex justify-center items-center gap-2 py-3.5 border-2 border-[#FF6A1F] rounded-xl text-[#FF6A1F] font-bold text-[14px] hover:bg-orange-50 transition-all disabled:opacity-50"
                                        >
                                            {currentStatus === 'Pending' ? 'Mark In Progress' : 'Mark Pending'}
                                        </button>
                                        <button 
                                            onClick={() => handleUpdateStatus('Completed')}
                                            disabled={actionLoading}
                                            className="w-full flex justify-center items-center gap-2 py-3.5 bg-[#FF6A1F] text-white font-bold text-[14px] rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 disabled:opacity-70"
                                        >
                                            {actionLoading && <RefreshCw size={16} className="animate-spin" />}
                                            Mark as Completed
                                        </button>
                                    </>
                                )}
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
