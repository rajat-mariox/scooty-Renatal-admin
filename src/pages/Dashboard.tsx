import {
    Bike,
    CheckCircle2,
    Send,
    Wrench,
    Zap,
    Clock,
    Navigation,
    AlertTriangle,
    Plus,
    MapPin,
    RefreshCw
} from "lucide-react"
import MainLayout from "../layouts/MainLayout"
import { ReactNode, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { stationAdminApi } from "../services/stationAdminApi"

export default function Dashboard() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState([
        { label: "Total Scooties", value: "0", icon: <Bike className="text-white" size={20} />, iconBg: "bg-blue-600", key: "total" },
        { label: "Active", value: "0", icon: <CheckCircle2 className="text-white" size={20} />, iconBg: "bg-green-500", key: "active" },
        { label: "In Ride", value: "0", icon: <Send className="text-white" size={20} />, iconBg: "bg-orange-500", key: "inRide" },
        { label: "Maintenance", value: "0", icon: <Wrench className="text-white" size={20} />, iconBg: "bg-rose-500", key: "maintenance" },
        { label: "Charging", value: "0", icon: <Zap className="text-white" size={20} />, iconBg: "bg-yellow-500", key: "charging" },
    ])
    const [activities, setActivities] = useState<any[]>([])
    const [alerts, setAlerts] = useState<any[]>([])

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true)
            try {
                const response = await stationAdminApi.getDashboardStats()
                const data = (response as any).data || response

                // Map stats from API
                setStats(prev => prev.map(s => ({
                    ...s,
                    value: String(data.stats?.[s.key] || data[s.key] || 0)
                })))

                // Set activities and alerts if available
                setActivities(data.activities || [])
                setAlerts(data.alerts || [])
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    return (
        <MainLayout>
            <div className="space-y-8">
                {/* Welcome Section */}
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-2xl font-bold">Dashboard</h2>
                        <p className="text-slate-500 text-sm mt-1">
                            Welcome back, Admin User • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>
                    {loading && <RefreshCw className="animate-spin text-orange-500 mb-2" size={20} />}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-5 gap-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-32">
                            <div className="flex justify-between items-start">
                                <span className="text-slate-500 text-xs font-medium">{stat.label}</span>
                                <div className={`${stat.iconBg} p-2 rounded-xl`}>
                                    {stat.icon}
                                </div>
                            </div>
                            <div className="text-3xl font-bold">
                                {loading ? <div className="h-8 w-12 bg-slate-100 animate-pulse rounded" /> : stat.value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-12 gap-8">
                    {/* Left Box: Live Activity */}
                    <div className="col-span-8 bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold">Live Activity Feed</h3>
                            <Clock className="text-slate-300" size={20} />
                        </div>

                        <div className="space-y-6">
                            {loading ? (
                                [...Array(4)].map((_, i) => (
                                    <div key={i} className="flex gap-4 animate-pulse">
                                        <div className="w-10 h-10 bg-slate-100 rounded-xl" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-slate-100 rounded w-1/4" />
                                            <div className="h-3 bg-slate-100 rounded w-3/4" />
                                        </div>
                                    </div>
                                ))
                            ) : activities.length > 0 ? (
                                activities.map((activity, index) => (
                                    <ActivityItem
                                        key={index}
                                        icon={activity.type === 'ride' ? <Navigation size={18} className="text-green-500" /> : <AlertTriangle size={18} className="text-rose-500" />}
                                        title={activity.title}
                                        details={activity.description}
                                        time={activity.time}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-10 text-slate-400 font-medium">No recent activity</div>
                            )}
                        </div>
                    </div>

                    {/* Right Side: Quick Actions & Alerts */}
                    <div className="col-span-4 space-y-8">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                            <h3 className="text-lg font-bold mb-6">Quick Actions</h3>
                            <div className="space-y-4">
                                <button
                                    onClick={() => navigate('/add-vehicle')}
                                    className="w-full bg-orange-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-700 transition-all shadow-lg shadow-orange-100"
                                >
                                    <Plus size={18} />
                                    Add Vehicle
                                </button>
                                <button className="w-full border-2 border-orange-600 text-orange-600 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-50 transition-all">
                                    <MapPin size={18} />
                                    View Live Map
                                </button>
                                <button 
                                    onClick={() => navigate('/maintenance/new')}
                                    className="w-full border-2 border-orange-600 text-orange-600 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-50 transition-all"
                                >
                                    <Wrench size={18} />
                                    Raise Maintenance
                                </button>
                            </div>
                        </div>

                        {/* Recent Alerts */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold">Recent Alerts</h3>
                                <button className="text-orange-600 text-xs font-bold hover:underline">View All</button>
                            </div>

                            <div className="space-y-4">
                                {loading ? (
                                    [...Array(3)].map((_, i) => (
                                        <div key={i} className="h-20 bg-slate-50 border border-slate-100 rounded-2xl animate-pulse" />
                                    ))
                                ) : alerts.length > 0 ? (
                                    alerts.map((alert, index) => (
                                        <AlertItem
                                            key={index}
                                            title={alert.title}
                                            details={alert.description}
                                            time={alert.time}
                                        />
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-slate-300 font-medium text-xs border-2 border-dashed border-slate-50 rounded-2xl">No active alerts</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}


function ActivityItem({ icon, title, details, time }: { icon: ReactNode, title: string, details: string, time: string }) {
    return (
        <div className="flex items-start gap-4 pb-6 border-b border-slate-50 last:border-0 last:pb-0">
            <div className="bg-slate-50 p-2.5 rounded-xl">
                {icon}
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm">{title}</h4>
                    <span className="text-[10px] text-slate-400 font-medium">{time}</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{details}</p>
            </div>
        </div>
    )
}

function AlertItem({ title, details, time }: { title: string, details: string, time: string }) {
    return (
        <div className="p-4 border border-orange-200 bg-orange-50/30 rounded-2xl relative overflow-hidden group hover:border-orange-300 transition-colors">
            <div className="flex items-start gap-3 relative z-10">
                <AlertTriangle className="text-orange-500 shrink-0" size={18} />
                <div>
                    <h4 className="font-bold text-xs text-slate-800">{title}</h4>
                    <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{details}</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">{time}</p>
                </div>
            </div>
        </div>
    )
}
