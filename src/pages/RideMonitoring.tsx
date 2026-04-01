import {
    Search,
    Map,
    RefreshCw
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import MainLayout from "../layouts/MainLayout"
import { adminApi } from "../services/adminApi"

export default function RideMonitoring() {
    const navigate = useNavigate()
    const [rides, setRides] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    const fetchRides = async () => {
        setLoading(true)
        try {
            const response = await adminApi.getRides()
            const data = (response as any).data || response
            const fetchedRides = Array.isArray(data.rides) ? data.rides : (Array.isArray(data) ? data : [])
            
            const mappedRides = fetchedRides.map((r: any) => ({
                id: r.rideId || r.id || "N/A",
                riderName: r.userName || r.user?.name || "Unknown Rider",
                riderPhone: r.phone || r.user?.phone || "N/A",
                vehicle: r.vehicleId || r.vehicle?.id || "N/A",
                duration: r.duration || "00:00",
                distance: r.distance ? `${r.distance} km` : "0 km",
                battery: r.batteryLevel !== undefined ? r.batteryLevel : (r.battery || 0),
                status: r.status || "Ongoing"
            }))
            
            setRides(mappedRides)
        } catch (error) {
            console.error("Failed to fetch rides:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRides()
    }, [])

    const filteredRides = rides.filter((ride) => {
        const query = searchQuery.toLowerCase()
        return (
            ride.id.toLowerCase().includes(query) ||
            ride.riderName.toLowerCase().includes(query) ||
            ride.vehicle.toLowerCase().includes(query)
        )
    })

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Ride Monitoring</h2>
                        <p className="text-slate-500 text-sm mt-1">Monitor all active and recent rides in real-time</p>
                    </div>
                    {loading && <RefreshCw className="animate-spin text-orange-500 mb-1" size={20} />}
                </div>

                {/* Search Bar Container */}
                <div className="bg-white rounded-[2rem] border border-slate-100/80 shadow-sm p-4">
                    <div className="relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by Ride ID, Rider name, or Vehicle ID..."
                            className="w-full bg-white border border-slate-100 rounded-2xl pl-16 pr-6 py-4 text-sm font-medium focus:outline-none focus:ring-0 transition-all placeholder:text-slate-400"
                        />
                    </div>
                </div>

                {/* Rides Table Container */}
                <div className="bg-white rounded-[2rem] border border-slate-100/80 shadow-sm overflow-hidden p-6 relative min-h-[400px]">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                            <div className="flex flex-col items-center gap-3">
                                <RefreshCw className="animate-spin text-orange-500" size={32} />
                                <span className="text-sm font-bold text-slate-500">Loading Rides...</span>
                            </div>
                        </div>
                    ) : null}
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-6 py-6 text-[10px] uppercase tracking-wider font-bold text-slate-400/80">Ride ID</th>
                                <th className="px-6 py-6 text-[10px] uppercase tracking-wider font-bold text-slate-400/80">Rider</th>
                                <th className="px-6 py-6 text-[10px] uppercase tracking-wider font-bold text-slate-400/80">Vehicle</th>
                                <th className="px-6 py-6 text-[10px] uppercase tracking-wider font-bold text-slate-400/80">Duration</th>
                                <th className="px-6 py-6 text-[10px] uppercase tracking-wider font-bold text-slate-400/80">Distance</th>
                                <th className="px-6 py-6 text-[10px] uppercase tracking-wider font-bold text-slate-400/80">Battery</th>
                                <th className="px-6 py-6 text-[10px] uppercase tracking-wider font-bold text-slate-400/80">Status</th>
                                <th className="px-6 py-6 text-[10px] uppercase tracking-wider font-bold text-slate-400/80">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50/50">
                            {filteredRides.length > 0 ? filteredRides.map((ride) => (
                                <tr key={ride.id} className="hover:bg-slate-50/30 transition-all group">
                                    <td className="px-6 py-8 text-sm font-bold text-slate-700">{ride.id}</td>
                                    <td className="px-6 py-8">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900">{ride.riderName}</span>
                                            <span className="text-[10px] font-bold text-slate-400 mt-0.5">{ride.riderPhone}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-8 text-sm font-bold text-slate-500">{ride.vehicle}</td>
                                    <td className="px-6 py-8 text-sm font-bold text-slate-500">{ride.duration}</td>
                                    <td className="px-6 py-8 text-sm font-bold text-slate-500">{ride.distance}</td>
                                    <td className="px-6 py-8">
                                        <span className={`text-sm font-bold ${ride.battery < 50 ? 'text-yellow-500' : 'text-green-500'}`}>
                                            {ride.battery}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-8">
                                        <span className="px-4 py-1.5 bg-green-50 text-green-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                            {ride.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-8">
                                        <button
                                            onClick={() => navigate(`/ride/details?id=${ride.id}`)}
                                            className="px-6 py-2 bg-[#FF6A1F] text-white text-[10px] font-extrabold rounded-xl shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all uppercase tracking-wider"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            )) : !loading && (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-slate-400 font-medium border-2 border-dashed border-slate-50 rounded-2xl">
                                        No active or recent rides found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Bottom Action Button */}
                <div className="flex justify-center pt-2">
                    <button className="flex items-center gap-2.5 px-8 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 font-bold text-sm hover:bg-slate-100 transition-all">
                        <Map size={18} />
                        View All Rides on Map
                    </button>
                </div>
            </div>
        </MainLayout>
    )
}

