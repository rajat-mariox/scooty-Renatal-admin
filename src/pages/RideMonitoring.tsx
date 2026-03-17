import {
    Search,
    Map
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import MainLayout from "../layouts/MainLayout"

export default function RideMonitoring() {
    const navigate = useNavigate()

    const rides = [
        {
            id: "R001",
            riderName: "Rahul Sharma",
            riderPhone: "+91 98765 43210",
            vehicle: "SC002",
            duration: "15:32",
            distance: "4.2 km",
            battery: 45,
            status: "Ongoing"
        },
        {
            id: "R002",
            riderName: "Priya Singh",
            riderPhone: "+91 87654 32109",
            vehicle: "SC005",
            duration: "08:15",
            distance: "2.8 km",
            battery: 67,
            status: "Ongoing"
        },
    ]

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header Section */}
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Ride Monitoring</h2>
                    <p className="text-slate-500 text-sm mt-1">Monitor all active and recent rides in real-time</p>
                </div>

                {/* Search Bar Container */}
                <div className="bg-white rounded-[2rem] border border-slate-100/80 shadow-sm p-4">
                    <div className="relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                        <input
                            type="text"
                            placeholder="Search by Ride ID, Rider name, or Vehicle ID..."
                            className="w-full bg-white border border-slate-100 rounded-2xl pl-16 pr-6 py-4 text-sm font-medium focus:outline-none focus:ring-0 transition-all placeholder:text-slate-400"
                        />
                    </div>
                </div>

                {/* Rides Table Container */}
                <div className="bg-white rounded-[2rem] border border-slate-100/80 shadow-sm overflow-hidden p-6">
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
                            {rides.map((ride) => (
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
                                            onClick={() => navigate("/ride/details")}
                                            className="px-6 py-2 bg-[#FF6A1F] text-white text-[10px] font-extrabold rounded-xl shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all uppercase tracking-wider"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
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
