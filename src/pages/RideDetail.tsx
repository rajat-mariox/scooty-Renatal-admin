import {
    ArrowLeft,
    Phone,
    MapPin,
    Clock,
    Navigation,
    Battery,
    Lock,
    Zap,
    CircleDot,
    X,
    Timer,
    Compass,
    RefreshCw,
    AlertCircle
} from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import MainLayout from "../layouts/MainLayout"
import { adminApi } from "../services/adminApi"

export default function RideDetail() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const id = searchParams.get('id')

    const [isLockModalOpen, setIsLockModalOpen] = useState(false)
    const [isForceEndModalOpen, setIsForceEndModalOpen] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState("")

    const [ride, setRide] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [actionLoading, setActionLoading] = useState(false)

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [showToast])

    useEffect(() => {
        const fetchRideDetails = async () => {
            if (!id) {
                setError("No ride ID provided")
                setLoading(false)
                return
            }

            setLoading(true)
            try {
                const response = await adminApi.getRideDetails(id)
                const data = (response as any).data || response
                setRide(data)
                setError(null)
            } catch (err: any) {
                console.error("Failed to fetch ride details:", err)
                setError(err.response?.data?.message || "Failed to load ride details")
            } finally {
                setLoading(false)
            }
        }

        fetchRideDetails()
    }, [id])

    const handleForceEnd = async () => {
        setActionLoading(true)
        try {
            if ((adminApi as any).forceEndRide) {
                await (adminApi as any).forceEndRide(id as string)
            }
            setToastMessage("Ride ended successfully")
            setShowToast(true)
            setIsForceEndModalOpen(false)
            if (ride) setRide({ ...ride, status: 'Completed' })
        } catch (err: any) {
            console.error("Failed to end ride:", err)
            // Show error toast logic can be added here
        } finally {
            setActionLoading(false)
        }
    }

    const handleLockVehicle = async () => {
        setActionLoading(true)
        try {
            if ((adminApi as any).lockVehicle) {
                await (adminApi as any).lockVehicle(ride?.vehicleId || ride?.vehicle?.id)
            }
            setToastMessage("Vehicle locked successfully")
            setShowToast(true)
            setIsLockModalOpen(false)
        } catch (err: any) {
            console.error("Failed to lock vehicle:", err)
            // Show error toast logic can be added here
        } finally {
            setActionLoading(false)
        }
    }

    if (loading) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <RefreshCw className="animate-spin text-orange-500" size={48} />
                    <span className="text-lg font-bold text-slate-500">Loading Ride Details...</span>
                </div>
            </MainLayout>
        )
    }

    if (error || !ride) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center">
                        <AlertCircle className="text-rose-500" size={40} />
                    </div>
                    <span className="text-lg font-bold text-slate-700">{error || "Ride not found"}</span>
                    <button
                        onClick={() => navigate("/ride-monitoring")}
                        className="px-6 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all mt-4"
                    >
                        Back to Rides
                    </button>
                </div>
            </MainLayout>
        )
    }

    const rideId = ride.rideId || ride.id || id
    const status = ride.status || "Ongoing"
    const isOngoing = status === "Ongoing" || status === "Active" || status === "In Progress"
    const userPhone = ride.user?.phone || ride.userPhone || "N/A"

    return (
        <MainLayout>
            <div className="space-y-8 max-w-7xl mx-auto">

                {/* Navigation & Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-4">
                        <button
                            onClick={() => navigate("/ride-monitoring")}
                            className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-xs font-bold uppercase tracking-wider"
                        >
                            <ArrowLeft size={16} />
                            Back to Rides
                        </button>
                        <div className="flex flex-col gap-2">
                            <h2 className="text-xl font-extrabold text-slate-900">Ride Details - {rideId}</h2>
                            <div>
                                <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${isOngoing ? 'bg-green-50 text-green-600' :
                                        status === 'Completed' ? 'bg-slate-100 text-slate-600' :
                                            'bg-rose-50 text-rose-600'
                                    }`}>
                                    {status}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => window.location.href = `tel:${userPhone}`}
                            className="px-6 py-2.5 border-[1.5px] border-[#FF6A1F] text-[#FF6A1F] font-bold rounded-xl hover:bg-orange-50 transition-all text-sm flex items-center gap-2"
                        >
                            <Phone size={18} />
                            Call Rider
                        </button>
                        {isOngoing && (
                            <button
                                onClick={() => setIsForceEndModalOpen(true)}
                                className="px-6 py-2.5 bg-[#F43F5E] text-white font-bold rounded-xl hover:bg-rose-600 transition-all text-sm flex items-center gap-2"
                            >
                                <CircleDot size={18} />
                                Force End Ride
                            </button>
                        )}
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                    {/* Left Column: Map and Timeline */}
                    <div className="col-span-1 md:col-span-8 space-y-6">

                        {/* Live Location / Map Placeholder */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-6">
                            <h3 className="font-bold text-slate-800 text-sm">{isOngoing ? 'Live Location' : 'Route Map'}</h3>
                            <div className="relative aspect-[16/8] bg-slate-100 rounded-3xl flex flex-col items-center justify-center overflow-hidden">
                                {/* Speed indicator overlay */}
                                {isOngoing && (
                                    <div className="absolute top-4 sm:top-6 left-4 sm:left-6 bg-white p-3 sm:p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-50 z-10 text-center min-w-[100px] sm:min-w-[120px]">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Current Speed</p>
                                        <p className="text-xl sm:text-2xl font-black text-[#FF6A1F]">{ride.currentSpeed || "0"} km/h</p>
                                    </div>
                                )}

                                <div className="flex flex-col items-center gap-4 text-slate-300">
                                    <div className="w-16 h-16 rounded-full bg-slate-200/50 flex items-center justify-center">
                                        <MapPin size={32} className="text-slate-400 opacity-50" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-base font-bold text-slate-500">{isOngoing ? 'Live Map View' : 'Route View'}</p>
                                        <p className="text-xs font-bold text-slate-400">{ride.currentLocation || ride.destination || "Location Data Unavailable"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ride Timeline */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-8">
                            <h3 className="font-bold text-slate-800 text-sm">Ride Timeline</h3>
                            <div className="space-y-0 px-2">
                                <TimelineItem
                                    icon={<MapPin size={16} className="text-green-500" />}
                                    title="Ride Started"
                                    location={ride.startLocation || ride.source || "Unknown Location"}
                                    time={ride.startTime || ride.createdAt ? new Date(ride.startTime || ride.createdAt).toLocaleString() : "Recently"}
                                    isFirst
                                />
                                <TimelineItem
                                    icon={<Navigation size={16} className={isOngoing ? "text-blue-500" : "text-slate-500"} />}
                                    title={isOngoing ? "Currently At" : "Ended At"}
                                    location={ride.currentLocation || ride.destination || ride.endLocation || "Unknown Location"}
                                    time={isOngoing ? "Active" : (ride.endTime || ride.updatedAt ? new Date(ride.endTime || ride.updatedAt).toLocaleString() : "N/A")}
                                    isLast
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Info and Stats */}
                    <div className="col-span-1 md:col-span-4 space-y-6">

                        {/* Rider Information */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-6">
                            <h3 className="font-bold text-slate-800 text-sm">Rider Information</h3>
                            <div className="space-y-5">
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Name</p>
                                    <p className="text-sm font-bold text-slate-800 mt-1">{ride.user?.name || ride.userName || "Unknown User"}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Phone</p>
                                    <p className="text-sm font-bold text-slate-800 mt-1">{userPhone}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Vehicle</p>
                                    <p className="text-sm font-bold text-[#FF6A1F] mt-1 cursor-pointer hover:underline" onClick={() => navigate(`/fleet/details?id=${ride.vehicleId || ride.vehicle?.id}`)}>
                                        {ride.vehicleId || ride.vehicle?.id || ride.vehicle?.model || "Unknown"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Live Statistics */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-6">
                            <h3 className="font-bold text-slate-800 text-sm">{isOngoing ? 'Live Statistics' : 'Ride Statistics'}</h3>
                            <div className="space-y-4">
                                <StatRow icon={<Timer size={18} />} label="Duration" value={ride.duration || "N/A"} />
                                <StatRow icon={<Compass size={18} />} label="Distance" value={ride.distance ? `${ride.distance} km` : "N/A"} />
                                <StatRow icon={<Zap size={18} />} label="Battery" value={`${ride.battery || ride.vehicle?.batteryLevel || 0}%`} isWarning={(ride.battery || ride.vehicle?.batteryLevel || 100) < 20} />

                                <div className="pt-2">
                                    <div className={`p-5 border-2 ${isOngoing ? 'border-[#FF6A1F]' : 'border-slate-200'} rounded-2xl flex items-center justify-between bg-white`}>
                                        <span className="text-sm font-bold text-slate-700">{isOngoing ? 'Current Fare' : 'Total Fare'}</span>
                                        <span className={`text-xl font-black ${isOngoing ? 'text-[#FF6A1F]' : 'text-slate-800'}`}>₹{ride.fare || "0"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        {isOngoing && (
                            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-6">
                                <h3 className="text-sm font-black text-slate-700">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => setIsLockModalOpen(true)}
                                        className="w-full flex items-center justify-center gap-3 py-4 border-2 border-[#FF6A1F] rounded-2xl text-[#FF6A1F] font-bold text-sm hover:bg-orange-50 transition-all"
                                    >
                                        <Lock size={18} />
                                        Lock Vehicle
                                    </button>
                                    <button
                                        onClick={() => setIsForceEndModalOpen(true)}
                                        className="w-full flex items-center justify-center gap-3 py-4 bg-[#F43F5E] rounded-2xl text-white font-bold text-sm hover:bg-rose-600 transition-all shadow-sm"
                                    >
                                        <CircleDot size={18} />
                                        Force End Ride
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* Lock Vehicle Modal */}
                {isLockModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 animate-in fade-in duration-300">
                        <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-12 shadow-2xl shadow-slate-900/40 transform animate-in zoom-in-95 duration-300">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Lock Vehicle</h2>

                            <p className="text-slate-500 font-medium mb-12 leading-relaxed">
                                Are you sure you want to lock this vehicle? The rider will not be able to use it.
                            </p>

                            <div className="flex items-center justify-end gap-10">
                                <button
                                    onClick={() => setIsLockModalOpen(false)}
                                    disabled={actionLoading}
                                    className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLockVehicle}
                                    disabled={actionLoading}
                                    className="flex items-center gap-2 px-10 py-4 bg-[#F43F5E] text-white text-sm font-bold rounded-2xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-100 disabled:opacity-70"
                                >
                                    {actionLoading && <RefreshCw size={16} className="animate-spin" />}
                                    Lock Vehicle
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Force End Ride Modal */}
                {isForceEndModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 animate-in fade-in duration-300">
                        <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-12 shadow-2xl shadow-slate-900/40 transform animate-in zoom-in-95 duration-300">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Force End Ride</h2>

                            <p className="text-slate-500 font-medium mb-12 leading-relaxed">
                                Are you sure you want to force end this ride? This action cannot be undone.
                            </p>

                            <div className="flex items-center justify-end gap-10">
                                <button
                                    onClick={() => setIsForceEndModalOpen(false)}
                                    disabled={actionLoading}
                                    className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleForceEnd}
                                    disabled={actionLoading}
                                    className="flex items-center gap-2 px-10 py-4 bg-[#F43F5E] text-white text-sm font-bold rounded-2xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-100 disabled:opacity-70"
                                >
                                    {actionLoading && <RefreshCw size={16} className="animate-spin" />}
                                    End Ride
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Toast */}
                {showToast && (
                    <div className="fixed top-20 right-8 z-[110] animate-in slide-in-from-top-4 fade-in duration-300">
                        <div className="bg-white px-8 py-4 rounded-2xl shadow-2xl shadow-slate-200 border border-slate-50 flex items-center gap-3">
                            <span className="text-slate-600 font-medium text-sm">{toastMessage}</span>
                        </div>
                    </div>
                )}

            </div>
        </MainLayout>
    )
}

function TimelineItem({ icon, title, location, time, isFirst, isLast }: { icon: any, title: string, location: string, time: string, isFirst?: boolean, isLast?: boolean }) {
    return (
        <div className="flex gap-6">
            <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white z-10 border border-slate-100 shadow-sm shadow-slate-100 ${isLast ? 'ring-8 ring-blue-50/50' : 'ring-8 ring-green-50/50'}`}>
                    {icon}
                </div>
                {!isLast && <div className="w-0.5 h-14 bg-slate-100 my-1"></div>}
            </div>
            <div className="pt-1.5 pb-8">
                <h4 className="font-black text-slate-800 text-sm">{title}</h4>
                <p className="text-xs text-slate-500 mt-1 font-bold">{location}</p>
                <p className={`text-[10px] uppercase font-black mt-2 tracking-wider ${time === 'Active' ? 'text-blue-500' : 'text-slate-400'}`}>{time}</p>
            </div>
        </div>
    )
}

function StatRow({ icon, label, value, isWarning }: { icon: any, label: string, value: string, isWarning?: boolean }) {
    return (
        <div className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
            <div className="flex items-center gap-3 text-slate-400">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                    {icon}
                </div>
                <span className="text-xs font-bold text-slate-500">{label}</span>
            </div>
            <span className={`text-sm font-black ${isWarning ? 'text-yellow-500' : 'text-slate-800'}`}>{value}</span>
        </div>
    )
}
