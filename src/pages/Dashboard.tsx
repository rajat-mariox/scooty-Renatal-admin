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
    MapPin
} from "lucide-react"
import MainLayout from "../layouts/MainLayout"
import { ReactNode } from "react"

export default function Dashboard() {
    const stats = [
        { label: "Total Scooties", value: "6", icon: <Bike className="text-white" size={20} />, iconBg: "bg-blue-600" },
        { label: "Active", value: "3", icon: <CheckCircle2 className="text-white" size={20} />, iconBg: "bg-green-500" },
        { label: "In Ride", value: "1", icon: <Send className="text-white" size={20} />, iconBg: "bg-orange-500" },
        { label: "Maintenance", value: "1", icon: <Wrench className="text-white" size={20} />, iconBg: "bg-rose-500" },
        { label: "Charging", value: "1", icon: <Zap className="text-white" size={20} />, iconBg: "bg-yellow-500" },
    ]

    return (
        <MainLayout>
            <div className="space-y-8">
                {/* Welcome Section */}
                <div>
                    <h2 className="text-2xl font-bold">Dashboard</h2>
                    <p className="text-slate-500 text-sm mt-1">
                        Welcome back, Admin User • Monday, February 23, 2026
                    </p>
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
                            <div className="text-3xl font-bold">{stat.value}</div>
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
                            <ActivityItem
                                icon={<Navigation size={18} className="text-green-500" />}
                                title="Ride Started"
                                details="SC002 - Rahul Sharma started a ride"
                                time="5 mins ago"
                            />
                            <ActivityItem
                                icon={<CheckCircle2 size={18} className="text-blue-500" />}
                                title="Ride Ended"
                                details="SC001 - Priya Singh completed ride (₹85)"
                                time="12 mins ago"
                            />
                            <ActivityItem
                                icon={<AlertTriangle size={18} className="text-rose-500" />}
                                title="Complaint Raised"
                                details="C001 - Vehicle stopped mid-ride"
                                time="25 mins ago"
                            />
                            <ActivityItem
                                icon={<Zap size={18} className="text-yellow-500" />}
                                title="Battery Alert"
                                details="SC003 battery dropped below 20%"
                                time="1 hour ago"
                            />
                        </div>
                    </div>

                    {/* Right Side: Quick Actions & Alerts */}
                    <div className="col-span-4 space-y-8">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                            <h3 className="text-lg font-bold mb-6">Quick Actions</h3>
                            <div className="space-y-4">
                                <button className="w-full bg-orange-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-700 transition-all shadow-lg shadow-orange-100">
                                    <Plus size={18} />
                                    Add Vehicle
                                </button>
                                <button className="w-full border-2 border-orange-600 text-orange-600 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-50 transition-all">
                                    <MapPin size={18} />
                                    View Live Map
                                </button>
                                <button className="w-full border-2 border-orange-600 text-orange-600 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-50 transition-all">
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
                                <AlertItem
                                    title="Low Battery Alert"
                                    details="SC003 battery dropped below 20%"
                                    time="5 mins ago"
                                />
                                <AlertItem
                                    title="Maintenance Due"
                                    details="SC001 is due for routine service"
                                    time="1 hour ago"
                                />
                                <AlertItem
                                    title="Geo-fence Violation"
                                    details="SC002 detected outside operational area"
                                    time="2 hours ago"
                                />
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
