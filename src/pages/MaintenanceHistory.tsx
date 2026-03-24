import { Search, Plus, RefreshCw } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import MainLayout from "../layouts/MainLayout"
import { stationAdminApi } from "../services/stationAdminApi"

export default function MaintenanceHistory() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState("")
    const [logs, setLogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchMaintenanceLogs = async () => {
        setLoading(true)
        try {
            const response = await stationAdminApi.getMaintenanceLogs()
            const data = (response as any).data || response
            const fetchedLogs = Array.isArray(data.logs) ? data.logs : (Array.isArray(data) ? data : [])
            
            const mappedLogs = fetchedLogs.map((log: any) => ({
                id: log.logId || log.id || "N/A",
                vehicleId: log.vehicleId || log.vehicle?.id || "N/A",
                issueType: log.issueType || "General Maintenance",
                description: log.description || "No description provided",
                status: log.status || "Pending",
                cost: log.cost ? `₹${log.cost}` : "-",
                date: log.date || log.createdAt ? new Date(log.date || log.createdAt).toISOString().split('T')[0] : "N/A"
            }))
            
            setLogs(mappedLogs)
        } catch (error) {
            console.error("Failed to fetch maintenance logs:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMaintenanceLogs()
    }, [])

    const filteredLogs = logs.filter((log) => {
        const query = searchQuery.toLowerCase()
        return (
            log.id.toLowerCase().includes(query) ||
            log.vehicleId.toLowerCase().includes(query) ||
            log.issueType.toLowerCase().includes(query)
        )
    })

    return (
        <MainLayout>
            <div className="space-y-6 max-w-[1500px] font-['Poppins']">
                
                {/* Header title section */}
                <div className="flex items-center justify-between">
                    <div className="flex items-end gap-4">
                        <div className="space-y-1">
                            <h2 className="text-[18px] font-bold text-slate-800 tracking-tight">Maintenance Logs</h2>
                            <p className="text-slate-400 font-medium text-[13px]">Track and manage vehicle maintenance records</p>
                        </div>
                        {loading && <RefreshCw className="animate-spin text-orange-500 mb-1" size={18} />}
                    </div>
                    <button
                        onClick={() => navigate("/maintenance/new")}
                        className="px-6 py-2.5 bg-[#FF6A1F] text-white font-bold rounded-xl hover:bg-orange-600 transition-all text-sm flex items-center gap-2"
                    >
                        <Plus size={18} strokeWidth={3} />
                        Add Maintenance
                    </button>
                </div>

                {/* Search Input Card */}
                <div className="bg-white px-6 py-8 rounded-[1.2rem] border border-slate-100 shadow-sm shadow-slate-200/20">
                    <div className="relative max-w-full border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                            <Search size={20} strokeWidth={2} />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by Log ID, Vehicle ID, or Issue Type..."
                            className="w-full pl-14 pr-6 py-3.5 bg-white text-[14px] focus:outline-none font-medium text-slate-700 placeholder:text-slate-300 placeholder:font-normal"
                        />
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-[1.2rem] border border-slate-100 shadow-sm shadow-slate-200/20 relative min-h-[300px]">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                            <div className="flex flex-col items-center gap-3">
                                <RefreshCw className="animate-spin text-orange-500" size={32} />
                                <span className="text-sm font-bold text-slate-500">Loading Maintenance Logs...</span>
                            </div>
                        </div>
                    ) : null}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="px-6 py-6 text-[13px] font-semibold text-slate-400">Log ID</th>
                                    <th className="px-6 py-6 text-[13px] font-semibold text-slate-400">Vehicle ID</th>
                                    <th className="px-6 py-6 text-[13px] font-semibold text-slate-400">Issue Type</th>
                                    <th className="px-6 py-6 text-[13px] font-semibold text-slate-400">Description</th>
                                    <th className="px-6 py-6 text-[13px] font-semibold text-slate-400">Status</th>
                                    <th className="px-6 py-6 text-[13px] font-semibold text-slate-400">Cost</th>
                                    <th className="px-6 py-6 text-[13px] font-semibold text-slate-400">Date</th>
                                    <th className="px-6 py-6 text-[13px] font-semibold text-slate-400">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <span className="text-[14px] font-bold text-slate-800">{log.id}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[14px] text-slate-600 font-medium">{log.vehicleId}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[14px] font-bold text-slate-800">{log.issueType}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[14px] text-slate-500 font-medium">{log.description}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-4 py-1 text-[11px] font-bold rounded-full inline-block ${
                                                log.status === 'Completed' ? 'bg-green-100 text-green-600' :
                                                log.status === 'In Progress' ? 'bg-yellow-100 text-yellow-600' :
                                                'bg-rose-100 text-rose-500'
                                            }`}>
                                                {log.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[14px] font-bold text-slate-800">{log.cost}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[14px] text-slate-500 font-medium whitespace-nowrap">{log.date}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <button
                                                onClick={() => navigate(`/maintenance/details?id=${log.id}`)}
                                                className="px-4 py-1.5 bg-[#FF6A1F] hover:bg-orange-600 text-white text-[12px] font-bold rounded-lg transition-all shadow-sm"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                )) : !loading && (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center text-slate-400 font-medium border-2 border-dashed border-slate-50 rounded-xl">
                                            No maintenance logs found matching your criteria
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

