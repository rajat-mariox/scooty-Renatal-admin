import {
    Search,
    Filter,
    MoreVertical,
    ChevronDown,
    Plus,
    RefreshCw
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import MainLayout from "../layouts/MainLayout"
import { useState, useEffect, useRef } from "react"
import { adminApi } from "../services/adminApi"

export default function FleetManagement() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("All")
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [isStationOpen, setIsStationOpen] = useState(false)
    const [openMenuId, setOpenMenuId] = useState<string | null>(null)
    const [modalAction, setModalAction] = useState<{ type: string, text: string, id: string } | null>(null)
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)
    const [vehicles, setVehicles] = useState<any[]>([])
    const [stations, setStations] = useState<any[]>([])
    const [selectedStationId, setSelectedStationId] = useState<string>("all")
    const [selectedStationLabel, setSelectedStationLabel] = useState<string>("All Stations")
    const menuRef = useRef<HTMLDivElement>(null)
    const filterRef = useRef<HTMLDivElement>(null)
    const stationRef = useRef<HTMLDivElement>(null)

    // Close menu/filter on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null)
            }
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false)
            }
            if (stationRef.current && !stationRef.current.contains(event.target as Node)) {
                setIsStationOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => {
        const savedStationId = localStorage.getItem("fleet_selected_station_id")
        const savedStationLabel = localStorage.getItem("fleet_selected_station_label")
        if (savedStationId) setSelectedStationId(savedStationId)
        if (savedStationLabel) setSelectedStationLabel(savedStationLabel)
    }, [])

    const fetchStations = async () => {
        try {
            const response = await adminApi.getStations()
            const data = (response as any).data || response
            const fetchedStations = Array.isArray(data.stations)
                ? data.stations
                : Array.isArray(data)
                    ? data
                    : []
            setStations(fetchedStations)
        } catch (error) {
            console.error("Failed to fetch stations:", error)
        }
    }

    const fetchVehicles = async (stationId?: string) => {
        setLoading(true)
        try {
            const queryStationId = stationId && stationId !== "all" ? stationId : undefined
            const response = await adminApi.getVehicles(queryStationId ? { stationId: queryStationId } : undefined)
            const data = (response as any).data || response
            
            // Format data if needed so it matches the table expectation
            const fetchedVehicles = Array.isArray(data.vehicles) ? data.vehicles : (Array.isArray(data) ? data : [])
            const mappedVehicles = fetchedVehicles.map((v: any) => ({
                id: v._id || v.vehicleId || v.id || "N/A",
                vehicleId: v.vehicleId || v.registrationNumber || v.id || v._id || "N/A",
                registrationNumber: v.registrationNumber || v.vehicleId || v.id || "N/A",
                model: v.modelName || v.model || "Unknown Model",
                battery: v.batteryPercent !== undefined ? v.batteryPercent : (v.batteryLevel !== undefined ? v.batteryLevel : (v.battery || 0)),
                status: String(v.status || "ACTIVE").replace(/_/g, " "),
                location: v.locationLabel || v.location || v.currentLocation || v.station?.name || "Station",
                lastRide: v.lastRide?.rideId || v.lastRide?.id || v.lastRide || "N/A"
            }))

            setVehicles(mappedVehicles)
        } catch (error) {
            console.error("Failed to fetch vehicles:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStations()
    }, [])

    useEffect(() => {
        fetchVehicles(selectedStationId)
    }, [selectedStationId])

    const handleConfirmAction = async () => {
        if (!modalAction) return
        setActionLoading(true)
        try {
            let statusToUpdate = modalAction.type === 'charging' ? 'Charging' : 
                                 modalAction.type === 'maintenance' ? 'Maintenance' : 'Active'
                                 
            await adminApi.updateVehicleStatus(modalAction.id, {
                status: statusToUpdate.toUpperCase().replace(" ", "_")
            })
            // Refresh list
            await fetchVehicles()
        } catch (error) {
            console.error("Failed to update status:", error)
        } finally {
            setActionLoading(false)
            setModalAction(null)
        }
    }

    const filteredVehicles = vehicles.filter((v) => {
        const query = searchQuery.toLowerCase()
        const matchesSearch = (
            v.registrationNumber.toLowerCase().includes(query) ||
            v.id.toLowerCase().includes(query) ||
            v.model.toLowerCase().includes(query) ||
            v.location.toLowerCase().includes(query)
        )
        const normalizedStatus = String(v.status || "").toLowerCase()
        const matchesStatus = statusFilter === "All" || normalizedStatus === statusFilter.toLowerCase()
        
        return matchesSearch && matchesStatus
    })

    return (
        <MainLayout>
            <div className="space-y-6">

                {/* Header Section */}
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-xl font-extrabold text-[#1E293B]">Fleet Management</h2>
                        <p className="text-slate-400 text-sm font-medium mt-1">Manage and monitor all vehicles in your station</p>
                    </div>
                    {loading && <RefreshCw className="animate-spin text-orange-500 mb-1" size={20} />}
                </div>

                {/* Filter Bar */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by ID, model, or registration.."
                            className="w-full bg-white border border-slate-100 rounded-xl pl-12 pr-6 py-2.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-orange-200 transition-all placeholder:text-slate-300"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative" ref={filterRef}>
                            <button 
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={`p-2.5 rounded-xl transition-all border ${isFilterOpen || statusFilter !== 'All' ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-white border-transparent text-slate-400 hover:bg-slate-50'}`}
                            >
                                <Filter size={20} />
                            </button>

                            {isFilterOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 overflow-hidden shadow-orange-500/5 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-5 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">
                                        Filter Status
                                    </div>
                                    {["All", "Active", "In Ride", "Charging", "Maintenance"].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => {
                                                setStatusFilter(status);
                                                setIsFilterOpen(false);
                                            }}
                                            className={`w-full text-left px-5 py-2.5 text-xs font-bold transition-all ${statusFilter === status ? 'text-orange-600 bg-orange-50' : 'text-slate-600 hover:bg-slate-50'}`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="relative" ref={stationRef}>
                            <button
                                onClick={() => setIsStationOpen(!isStationOpen)}
                                className={`flex items-center justify-between gap-8 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                                    selectedStationId === "all"
                                        ? "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"
                                        : "bg-orange-50 border-orange-200 text-orange-700"
                                }`}
                            >
                                <span className="max-w-[180px] truncate">{selectedStationLabel}</span>
                                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isStationOpen ? "rotate-180" : ""}`} />
                            </button>

                            {isStationOpen && (
                                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 overflow-hidden shadow-orange-500/5">
                                    <button
                                        onClick={() => {
                                            setSelectedStationId("all")
                                            setSelectedStationLabel("All Stations")
                                            localStorage.setItem("fleet_selected_station_id", "all")
                                            localStorage.setItem("fleet_selected_station_label", "All Stations")
                                            setIsStationOpen(false)
                                        }}
                                        className={`w-full text-left px-6 py-2.5 text-sm font-bold transition-all ${
                                            selectedStationId === "all"
                                                ? "text-orange-600 bg-orange-50"
                                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                    >
                                        All Stations
                                    </button>
                                    <div className="h-px bg-slate-50 my-2 mx-4" />
                                    {stations.map((station) => {
                                        const id = String(station?._id || station?.id || station?.stationId || "").trim()
                                        const name = String(station?.name || station?.stationName || "Unknown Station").trim()
                                        if (!id) return null
                                        return (
                                            <button
                                                key={id}
                                                onClick={() => {
                                                    setSelectedStationId(id)
                                                    setSelectedStationLabel(name)
                                                    localStorage.setItem("fleet_selected_station_id", id)
                                                    localStorage.setItem("fleet_selected_station_label", name)
                                                    setIsStationOpen(false)
                                                }}
                                                className={`w-full text-left px-6 py-2.5 text-sm font-bold transition-all ${
                                                    selectedStationId === id
                                                        ? "text-orange-600 bg-orange-50"
                                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                                }`}
                                            >
                                                {name}
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => navigate('/add-vehicle')}
                            className="flex items-center gap-2 px-5 py-2.5 bg-[#FF6A1F] text-white rounded-xl text-sm font-bold shadow-sm shadow-orange-100 hover:bg-orange-600 transition-all"
                        >
                            <Plus size={16} />
                            Add Vehicle
                        </button>
                    </div>
                </div>

                {/* Vehicle Table Card */}
                <div className="bg-white rounded-[2rem] border border-slate-100/80 shadow-sm overflow-hidden p-6 relative min-h-[400px]">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                            <div className="flex flex-col items-center gap-3">
                                <RefreshCw className="animate-spin text-orange-500" size={32} />
                                <span className="text-sm font-bold text-slate-500">Loading Fleet Data...</span>
                            </div>
                        </div>
                    ) : null}
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
                            {filteredVehicles.length > 0 ? filteredVehicles.map((v) => (
                                <tr
                                    key={v.id}
                                    onClick={() => navigate(`/fleet/details?id=${v.id}`)}
                                    className="hover:bg-slate-50/30 transition-all cursor-pointer group"
                                >
                                    <td className="px-6 py-6 text-sm font-bold text-slate-700">
                                        {v.registrationNumber}
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
                                                    style={{ width: `${Math.min(Math.max(v.battery, 0), 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className={`px-4 py-1.5 text-[10px] font-bold rounded-full transition-all ${v.status === 'ACTIVE' ? 'bg-green-100/50 text-green-600' :
                                            v.status === 'IN RIDE' ? 'bg-blue-100/50 text-blue-600' :
                                                v.status === 'CHARGING' ? 'bg-yellow-100/50 text-yellow-600' :
                                                    v.status === 'MAINTENANCE' ? 'bg-rose-100/50 text-rose-600' :
                                                    'bg-slate-100/50 text-slate-600'
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
                                                            setModalAction({ type: 'maintenance', text: 'maintenance', id: v.id });
                                                        }}
                                                    >
                                                        Mark for Maintenance
                                                    </button>
                                                    <button
                                                        className="w-full text-left px-6 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenMenuId(null);
                                                            setModalAction({ type: 'active', text: 'active', id: v.id });
                                                        }}
                                                    >
                                                        Mark as Active
                                                    </button>
                                                    <button
                                                        className="w-full text-left px-6 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenMenuId(null);
                                                            setModalAction({ type: 'charging', text: 'charging', id: v.id });
                                                        }}
                                                    >
                                                        Assign Charging
                                                    </button>
                                                    <button
                                                        className="w-full text-left px-6 py-2.5 text-xs font-extrabold text-orange-600 hover:bg-orange-50 transition-all"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            navigate(`/fleet/details?id=${v.id}`)
                                                        }}
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : !loading && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium border-2 border-dashed border-slate-50 rounded-2xl">
                                        No vehicles found matching your criteria
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Confirmation Modal */}
                {modalAction && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 animate-in fade-in duration-300">
                        <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 max-w-sm w-full mx-4 animate-in zoom-in-95 duration-200">
                            <h3 className="text-sm font-extrabold text-[#1E293B] mb-2">Confirm Action</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
                                Are you sure you want to change {modalAction.id}'s status to <strong>{modalAction.text}</strong>?
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setModalAction(null)}
                                    disabled={actionLoading}
                                    className="flex-1 py-3 text-sm font-extrabold text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmAction}
                                    disabled={actionLoading}
                                    className="flex-1 py-3 bg-[#FF6A1F] text-white text-sm font-extrabold rounded-2xl shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all flex justify-center items-center gap-2 disabled:opacity-70"
                                >
                                    {actionLoading ? <RefreshCw size={16} className="animate-spin" /> : null}
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
