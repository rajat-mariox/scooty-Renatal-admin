import {
    Search,
    Filter,
    MoreVertical,
    ChevronDown
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import MainLayout from "../layouts/MainLayout"
import { useState, useEffect, useRef } from "react"

export default function FleetManagement() {
    const navigate = useNavigate()
    const [openMenuId, setOpenMenuId] = useState<string | null>(null)
    const [modalAction, setModalAction] = useState<{ type: string, text: string } | null>(null)
    const menuRef = useRef<HTMLDivElement>(null)

    // Close menu on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const vehicles = [
        { id: "SC001", model: "Ola S1 Pro", battery: 85, status: "Maintenance", location: "Station A - Bay 3", lastRide: "10 mins ago" },
        { id: "SC002", model: "Ather 450X", battery: 45, status: "In Ride", location: "Moving - Connaught Place", lastRide: "Active" },
        { id: "SC003", model: "TVS iQube", battery: 15, status: "Charging", location: "Station A - Charging Bay 1", lastRide: "2 hours ago" },
        { id: "SC004", model: "Bajaj Chetak", battery: 0, status: "Maintenance", location: "Workshop", lastRide: "3 days ago" },
        { id: "SC005", model: "Ola S1 Air", battery: 92, status: "Active", location: "Station A - Bay 1", lastRide: "5 mins ago" },
        { id: "SC006", model: "Simple One", battery: 68, status: "Active", location: "Station A - Bay 5", lastRide: "30 mins ago" },
    ]

    return (
        <MainLayout>
            <div className="space-y-6">

                {/* Header Section */}
                <div>
                    <h2 className="text-xl font-extrabold text-[#1E293B]">Fleet Management</h2>
                    <p className="text-slate-400 text-sm font-medium mt-1">Manage and monitor all vehicles in your station</p>
                </div>

                {/* Filter Bar */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input
                            type="text"
                            placeholder="Search by ID, model, or registration.."
                            className="w-full bg-white border border-slate-100 rounded-xl pl-12 pr-6 py-2.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-orange-200 transition-all placeholder:text-slate-300"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
                            <Filter size={20} />
                        </button>
                        <div className="relative group">
                            <button className="flex items-center gap-8 px-4 py-2.5 bg-white border border-slate-100 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 transition-all">
                                Station Admin
                                <ChevronDown size={14} className="text-slate-400" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Vehicle Table Card */}
                <div className="bg-white rounded-[2rem] border border-slate-100/80 shadow-sm overflow-hidden p-6">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-6 py-4 text-xs font-bold text-slate-400/80">Vehicle ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400/80">Model</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400/80">Battery</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400/80">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400/80">Location</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400/80">Last Ride</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400/80 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50/50">
                            {vehicles.map((v) => (
                                <tr
                                    key={v.id}
                                    onClick={() => navigate("/fleet/details")}
                                    className="hover:bg-slate-50/30 transition-all cursor-pointer group"
                                >
                                    <td className="px-6 py-6 text-sm font-bold text-slate-700">
                                        {v.id}
                                    </td>
                                    <td className="px-6 py-6 text-sm font-medium text-slate-500">
                                        {v.model}
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-sm font-bold w-9 ${v.battery <= 15 ? 'text-rose-500' :
                                                v.battery <= 50 ? 'text-yellow-500' : 'text-green-500'
                                                }`}>
                                                {v.battery}%
                                            </span>
                                            <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden shrink-0">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${v.battery <= 15 ? 'bg-rose-500' :
                                                        v.battery <= 50 ? 'bg-yellow-500' : 'bg-green-500'
                                                        }`}
                                                    style={{ width: `${v.battery}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className={`px-4 py-1.5 text-[10px] font-bold rounded-full transition-all ${v.status === 'Active' ? 'bg-green-100/50 text-green-600' :
                                            v.status === 'In Ride' ? 'bg-blue-100/50 text-blue-600' :
                                                v.status === 'Charging' ? 'bg-yellow-100/50 text-yellow-600' :
                                                    'bg-rose-100/50 text-rose-600'
                                            }`}>
                                            {v.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 text-sm font-medium text-slate-500">
                                        {v.location}
                                    </td>
                                    <td className="px-6 py-6 text-sm font-medium text-slate-500">
                                        {v.lastRide}
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="relative inline-block text-left">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setOpenMenuId(openMenuId === v.id ? null : v.id)
                                                }}
                                                className="p-2 text-slate-300 hover:text-slate-600 transition-colors"
                                            >
                                                <MoreVertical size={18} />
                                            </button>

                                            {openMenuId === v.id && (
                                                <div
                                                    ref={menuRef}
                                                    className="absolute right-full top-0 mr-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 overflow-hidden shadow-orange-500/5 animate-in fade-in slide-in-from-right-2 duration-200"
                                                >
                                                    <button
                                                        className="w-full text-left px-6 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenMenuId(null);
                                                            setModalAction({ type: 'maintenance', text: 'maintenance' });
                                                        }}
                                                    >
                                                        Mark for Maintenance
                                                    </button>
                                                    <button
                                                        className="w-full text-left px-6 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenMenuId(null);
                                                            setModalAction({ type: 'active', text: 'active' });
                                                        }}
                                                    >
                                                        Mark as Active
                                                    </button>
                                                    <button
                                                        className="w-full text-left px-6 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenMenuId(null);
                                                            setModalAction({ type: 'charging', text: 'charging' });
                                                        }}
                                                    >
                                                        Assign Charging
                                                    </button>
                                                    <button
                                                        className="w-full text-left px-6 py-2.5 text-xs font-extrabold text-orange-600 hover:bg-orange-50 transition-all"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            navigate("/fleet/details")
                                                        }}
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Confirmation Modal */}
                {modalAction && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 max-w-sm w-full mx-4 animate-in zoom-in-95 duration-200">
                            <h3 className="text-sm font-extrabold text-[#1E293B] mb-2">Confirm Action</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
                                Are you sure you want to {modalAction.text} this vehicle?
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setModalAction(null)}
                                    className="flex-1 py-3 text-sm font-extrabold text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        // Logic for action would go here
                                        setModalAction(null)
                                    }}
                                    className="flex-1 py-3 bg-[#FF6A1F] text-white text-sm font-extrabold rounded-2xl shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </MainLayout>
    )
}
