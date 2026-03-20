import { Search } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import MainLayout from "../layouts/MainLayout"

export default function UserSupport() {
    const navigate = useNavigate()
    const complaints = [
        {
            id: "C001",
            user: "Sanjay Verma",
            phone: "+91 99123 45678",
            issue: "Vehicle stopped mid-ride",
            rideId: "R003",
            date: "2026-02-23",
            status: "Pending"
        },
        {
            id: "C002",
            user: "Kavita Sharma",
            phone: "+91 88234 56789",
            issue: "Overcharged",
            rideId: "R004",
            date: "2026-02-22",
            status: "Resolved"
        },
    ]
    
    const [searchQuery, setSearchQuery] = useState("")

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
                <div className="space-y-1">
                    <h2 className="text-[18px] font-bold text-slate-800 tracking-tight">User Support</h2>
                    <p className="text-slate-400 font-medium text-[13px]">Manage and resolve customer complaints</p>
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
                <div className="bg-white rounded-[1.2rem] border border-slate-100 shadow-sm shadow-slate-200/20">
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
                                {filteredComplaints.map((complaint) => (
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
                                                complaint.status === "Pending"
                                                    ? "bg-yellow-100 text-yellow-600"
                                                    : "bg-green-100 text-green-600"
                                            }`}>
                                                {complaint.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <button
                                                onClick={() => navigate("/support/detail")}
                                                className="px-4 py-1.5 bg-[#FF6A1F] hover:bg-orange-600 text-white text-[12px] font-bold rounded-lg transition-all shadow-sm"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}
