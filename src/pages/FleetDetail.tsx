import {
    ArrowLeft,
    FileText,
    DollarSign,
    History,
    Wrench,
    RefreshCw,
    AlertCircle
} from "lucide-react"
import { useNavigate, useSearchParams } from "react-router-dom"
import MainLayout from "../layouts/MainLayout"
import { ReactNode, useState, useEffect } from "react"
import { stationAdminApi } from "../services/stationAdminApi"

export default function FleetDetail() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const id = searchParams.get('id')
    
    const [vehicle, setVehicle] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchVehicle = async () => {
            if (!id) {
                setError("No vehicle ID provided")
                setLoading(false)
                return
            }
            
            setLoading(true)
            try {
                const response = await stationAdminApi.getVehicleDetails(id)
                const data = (response as any).data || response
                
                // Set default structure if some properties are missing
                setVehicle({
                    ...data,
                    rides: Array.isArray(data.rides) ? data.rides : [],
                    maintenanceLogs: Array.isArray(data.maintenanceLogs) ? data.maintenanceLogs : []
                })
                setError(null)
            } catch (err: any) {
                console.error("Failed to fetch vehicle details:", err)
                setError(err.response?.data?.message || "Failed to load vehicle details")
            } finally {
                setLoading(false)
            }
        }
        
        fetchVehicle()
    }, [id])

    if (loading) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <RefreshCw className="animate-spin text-orange-500" size={48} />
                    <span className="text-lg font-bold text-slate-500">Loading Vehicle Details...</span>
                </div>
            </MainLayout>
        )
    }

    if (error || !vehicle) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center">
                        <AlertCircle className="text-rose-500" size={40} />
                    </div>
                    <span className="text-lg font-bold text-slate-700">{error || "Vehicle not found"}</span>
                    <button 
                        onClick={() => navigate("/fleet")}
                        className="px-6 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all mt-4"
                    >
                        Back to Fleet
                    </button>
                </div>
            </MainLayout>
        )
    }

    const vehicleId = vehicle.vehicleId || vehicle.id || "N/A"
    const model = vehicle.model || vehicle.name || "Unknown Model"
    const status = vehicle.status || "Unknown"
    const battery = vehicle.batteryLevel !== undefined ? vehicle.batteryLevel : (vehicle.battery || 0)
    
    return (
        <MainLayout>
            <div className="space-y-8">

                {/* Navigation & Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-4">
                        <button
                            onClick={() => navigate("/fleet")}
                            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
                        >
                            <ArrowLeft size={16} />
                            Back to Fleet
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Vehicle Details - {vehicleId}</h2>
                            <p className="text-slate-500 text-sm font-medium">{model}</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => navigate(`/maintenance/new?vehicleId=${vehicleId}`)}
                            className="px-6 py-3 border-2 border-orange-600 text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-all text-sm"
                        >
                            Report Issue
                        </button>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                    {/* Vehicle Information */}
                    <div className="col-span-1 md:col-span-4 bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
                        <h3 className="font-bold text-slate-800">Vehicle Information</h3>
                        <div className="space-y-5">
                            <InfoRow label="Vehicle ID" value={vehicleId} />
                            <InfoRow label="Model" value={model} />
                            <InfoRow label="Registration Number" value={vehicle.registrationNumber || vehicle.licensePlate || "N/A"} />
                            <div className="space-y-1.5">
                                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Status</span>
                                <div>
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                        status === 'Active' ? 'bg-green-50 text-green-600' :
                                        status === 'Maintenance' ? 'bg-rose-50 text-rose-600' :
                                        status === 'Charging' ? 'bg-blue-50 text-blue-600' :
                                        'bg-slate-50 text-slate-600'
                                    }`}>
                                        {status}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Battery Level</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-slate-700">{battery}%</span>
                                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${battery < 20 ? 'bg-rose-500' : battery < 50 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${battery}%` }}></div>
                                    </div>
                                </div>
                            </div>
                            <InfoRow label="Current Location" value={vehicle.location || vehicle.station?.name || "N/A"} />
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="col-span-1 md:col-span-4 bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
                        <div className="flex items-center gap-2">
                            <FileText size={18} className="text-slate-400" />
                            <h3 className="font-bold text-slate-800">Documents</h3>
                        </div>
                        <div className="space-y-6">
                            <DocRow label="Insurance" value={vehicle.documents?.insurance ? "Valid" : "Pending"} status={vehicle.documents?.insurance ? "valid" : "pending"} />
                            <DocRow label="Registration" value={vehicle.documents?.registration ? "Valid" : "Pending"} status={vehicle.documents?.registration ? "valid" : "pending"} />
                            <DocRow label="Pollution Certificate" value={vehicle.documents?.pollution ? "Valid" : "Pending"} status={vehicle.documents?.pollution ? "valid" : "pending"} />
                        </div>
                    </div>

                    {/* Performance */}
                    <div className="col-span-1 md:col-span-4 bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
                        <div className="flex items-center gap-2">
                            <DollarSign size={18} className="text-slate-400" />
                            <h3 className="font-bold text-slate-800">Performance</h3>
                        </div>
                        <div className="space-y-8">
                            <div>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Total Rides</p>
                                <p className="text-3xl font-extrabold text-slate-900 mt-1">{vehicle.stats?.totalRides || vehicle.totalRides || 0}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Total Earnings</p>
                                <p className="text-3xl font-extrabold text-slate-900 mt-1">₹{vehicle.stats?.totalEarnings || vehicle.totalEarnings || 0}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Total Distance</p>
                                <p className="text-xl font-bold text-slate-900 mt-1">{vehicle.stats?.totalDistance || vehicle.totalDistance || 0} km</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Recent Ride History */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex items-center gap-2">
                        <History size={18} className="text-slate-400" />
                        <h3 className="font-bold text-slate-800 text-lg">Recent Ride History</h3>
                    </div>
                    {vehicle.rides?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-8 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-400">Ride ID</th>
                                        <th className="px-8 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-400">Rider</th>
                                        <th className="px-8 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-400">Date</th>
                                        <th className="px-8 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-400">Duration</th>
                                        <th className="px-8 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-400">Distance</th>
                                        <th className="px-8 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-400 text-right">Fare</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {vehicle.rides.map((ride: any) => (
                                        <RideRow 
                                            key={ride.id || ride.rideId}
                                            id={ride.id || ride.rideId || "N/A"} 
                                            rider={ride.user?.name || ride.userName || "Unknown"} 
                                            date={ride.date || ride.createdAt ? new Date(ride.date || ride.createdAt).toLocaleDateString() : "N/A"} 
                                            duration={ride.duration || "N/A"} 
                                            distance={ride.distance ? `${ride.distance} km` : "N/A"} 
                                            fare={ride.fare ? `₹${ride.fare}` : "-"} 
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center text-slate-400 font-medium">
                            No recent rides found for this vehicle.
                        </div>
                    )}
                </div>

                {/* Maintenance History */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden pb-4">
                    <div className="p-8 border-b border-slate-50 flex items-center gap-2">
                        <Wrench size={18} className="text-slate-400" />
                        <h3 className="font-bold text-slate-800 text-lg">Maintenance History</h3>
                    </div>
                    {vehicle.maintenanceLogs?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-8 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-400">Log ID</th>
                                        <th className="px-8 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-400">Date</th>
                                        <th className="px-8 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-400">Type</th>
                                        <th className="px-8 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-400">Status</th>
                                        <th className="px-8 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-400 text-right">Cost</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {vehicle.maintenanceLogs.map((log: any) => (
                                        <MaintenanceRow 
                                            key={log.id || log.logId}
                                            id={log.id || log.logId || "N/A"} 
                                            date={log.date || log.createdAt ? new Date(log.date || log.createdAt).toLocaleDateString() : "N/A"} 
                                            type={log.type || log.issueType || "General Maintenance"} 
                                            status={log.status || "Pending"} 
                                            cost={log.cost ? `₹${log.cost}` : "-"} 
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center text-slate-400 font-medium">
                            No maintenance records found for this vehicle.
                        </div>
                    )}
                </div>

            </div>
        </MainLayout>
    )
}

function InfoRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{label}</span>
            <p className="text-sm font-bold text-slate-700">{value}</p>
        </div>
    )
}

function DocRow({ label, value, status = "valid" }: { label: string, value: string, status?: "valid" | "pending" }) {
    return (
        <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500">{label}</p>
            <p className={`text-sm font-bold ${status === 'valid' ? 'text-green-600' : 'text-yellow-600'}`}>{value}</p>
        </div>
    )
}

function MaintenanceRow({ id, date, type, status, cost }: { id: string, date: string, type: string, status: string, cost: string }) {
    return (
        <tr className="hover:bg-slate-50/50 transition-colors group">
            <td className="px-8 py-5 text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{id}</td>
            <td className="px-8 py-5 text-sm font-bold text-slate-400">{date}</td>
            <td className="px-8 py-5 text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{type}</td>
            <td className="px-8 py-5">
                <span className={`px-3 py-1 text-[10px] font-bold rounded-full ${status === 'Completed' ? 'bg-green-50 text-green-600' :
                    status === 'In Progress' ? 'bg-blue-50 text-blue-600' :
                        'bg-yellow-50 text-yellow-600'
                    }`}>
                    {status}
                </span>
            </td>
            <td className="px-8 py-5 text-sm font-bold text-slate-900 text-right">{cost}</td>
        </tr>
    )
}

function RideRow({ id, rider, date, duration, distance, fare }: { id: string, rider: string, date: string, duration: string, distance: string, fare: string }) {
    return (
        <tr className="hover:bg-slate-50/50 transition-colors group">
            <td className="px-8 py-5 text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{id}</td>
            <td className="px-8 py-5 text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{rider}</td>
            <td className="px-8 py-5 text-sm font-bold text-slate-400">{date}</td>
            <td className="px-8 py-5 text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{duration}</td>
            <td className="px-8 py-5 text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{distance}</td>
            <td className="px-8 py-5 text-sm font-bold text-slate-900 text-right">{fare}</td>
        </tr>
    )
}
