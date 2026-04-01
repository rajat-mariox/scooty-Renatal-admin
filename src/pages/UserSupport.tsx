import { Search, RefreshCw } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import MainLayout from "../layouts/MainLayout"
import { adminApi } from "../services/adminApi"

export default function UserSupport() {
    const navigate = useNavigate()
    const [complaints, setComplaints] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    const fetchTickets = async () => {
        setLoading(true)
        try {
            const response = await adminApi.getTickets()
            const data = (response as any).data || response
            const fetchedTickets = Array.isArray(data.tickets) ? data.tickets : (Array.isArray(data) ? data : [])
            
            const mappedTickets = fetchedTickets.map((t: any) => ({
                id: t.ticketId || t.id || "N/A",
                user: t.userName || t.user?.name || "Unknown User",
                phone: t.phone || t.user?.phone || "N/A",
                issue: t.issue || t.subject || t.description || "No description",
                rideId: t.rideId || t.ride?.id || "-",
                date: t.date || t.createdAt ? new Date(t.date || t.createdAt).toISOString().split('T')[0] : "N/A",
                status: t.status || "Pending"
            }))
            
            setComplaints(mappedTickets)
        } catch (error) {
            console.error("Failed to fetch tickets:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTickets()
    }, [])

    const filteredComplaints = complaints.filter((c) => {
        const query = searchQuery.toLowerCase()
        return (
            c.id.toLowerCase().includes(query) ||
            c.user.toLowerCase().includes(query) ||
            c.issue.toLowerCase().includes(query) ||
            c.status.toLowerCase().includes(query)
        )
    })

    return (
        <MainLayout>
            <div className="space-y-6 max-w-[1500px] font-['Poppins']">
                
                {/* Header Section */}
                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                        <h2 className="text-[18px] font-bold text-slate-800 tracking-tight">User Support</h2>
                        <p className="text-slate-400 font-medium text-[13px]">Manage and resolve customer complaints</p>
                    </div>
                    {loading && <RefreshCw className="animate-spin text-orange-500 mb-1" size={18} />}
                </div>

                {/* Search & Filter Container */}
                <div className="bg-white px-6 py-8 rounded-[1.2rem] border border-slate-100 shadow-sm shadow-slate-200/20">
                    <div className="flex gap-4">
                        <div className="relative flex-1 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                                <Search size={20} strokeWidth={2} />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by Complaint ID, User, or Issue..."
                                className="w-full pl-14 pr-6 py-3.5 bg-white text-[14px] focus:outline-none font-medium text-slate-700 placeholder:text-slate-300 placeholder:font-normal"
                            />
                        </div>
                        <div className="w-[72px] h-[52px] bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm">
                            {/* Filter placeholder from image */}
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-[1.2rem] border border-slate-100 shadow-sm shadow-slate-200/20 relative min-h-[300px]">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                            <div className="flex flex-col items-center gap-3">
                                <RefreshCw className="animate-spin text-orange-500" size={32} />
                                <span className="text-sm font-bold text-slate-500">Loading Support Tickets...</span>
                            </div>
                        </div>
                    ) : null}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="px-6 py-6 text-[13px] font-semibold text-slate-400">ID</th>
                                    <th className="px-6 py-6 text-[13px] font-semibold text-slate-400">User</th>
                                    <th className="px-6 py-6 text-[13px] font-semibold text-slate-400">Phone</th>
                                    <th className="px-6 py-6 text-[13px] font-semibold text-slate-400">Issue</th>
                                    <th className="px-6 py-6 text-[13px] font-semibold text-slate-400">Ride ID</th>
                                    <th className="px-6 py-6 text-[13px] font-semibold text-slate-400">Date</th>
                                    <th className="px-6 py-6 text-[13px] font-semibold text-slate-400">Status</th>
                                    <th className="px-6 py-6 text-[13px] font-semibold text-slate-400">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredComplaints.length > 0 ? filteredComplaints.map((complaint) => (
                                    <tr key={complaint.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <span className="text-[14px] font-bold text-slate-800">{complaint.id}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[14px] text-slate-600 font-medium">{complaint.user}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[14px] text-slate-500 font-medium">{complaint.phone}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[14px] font-bold text-slate-800">{complaint.issue}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[14px] text-slate-600 font-medium">{complaint.rideId}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[14px] text-slate-400 font-medium whitespace-nowrap">{complaint.date}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-4 py-1 text-[11px] font-bold rounded-full inline-block ${
                                                complaint.status === "Pending" || complaint.status === 'Open' || complaint.status === 'In Progress'
                                                    ? "bg-yellow-100 text-yellow-600"
                                                    : "bg-green-100 text-green-600"
                                            }`}>
                                                {complaint.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <button
                                                onClick={() => navigate(`/support/detail?id=${complaint.id}`)}
                                                className="px-4 py-1.5 bg-[#FF6A1F] hover:bg-orange-600 text-white text-[12px] font-bold rounded-lg transition-all shadow-sm"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                )) : !loading && (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center text-slate-400 font-medium border-2 border-dashed border-slate-50 rounded-xl">
                                            No support tickets found matching your criteria
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
