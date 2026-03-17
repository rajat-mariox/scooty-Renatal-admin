import { Zap, Wrench, MapPin, Clock, Check } from "lucide-react"
import MainLayout from "../layouts/MainLayout"
import { ReactNode } from "react"

export default function Notifications() {
    return (
        <MainLayout>
            <div className="space-y-8">
                {/* Notifications Header */}
                <div>
                    <h2 className="text-2xl font-bold">Notifications</h2>
                    <p className="text-slate-500 text-sm mt-1">
                        Stay updated with alerts and system events
                    </p>
                </div>

                {/* Notifications List Container */}
                <div className="space-y-6">
                    {/* Filter Bar */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex items-center justify-between">
                        <div className="flex gap-2">
                            <button className="px-5 py-2 rounded-xl bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-100 transition-all">
                                All
                            </button>
                            <button className="px-5 py-2 rounded-xl text-slate-500 hover:bg-slate-50 font-bold text-sm transition-all border border-transparent">
                                Unread (2)
                            </button>
                            <button className="px-5 py-2 rounded-xl text-slate-500 hover:bg-slate-50 font-bold text-sm transition-all border border-transparent">
                                Read
                            </button>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all">
                            <Check size={18} className="text-slate-400 font-bold" />
                            Mark All as Read
                        </button>
                    </div>

                    {/* Notifications Items */}
                    <div className="space-y-4">
                        <NotificationCard
                            icon={<Zap size={18} className="text-orange-500" />}
                            title="Low Battery Alert"
                            description="SC003 battery dropped below 20%"
                            time="5 mins ago"
                            hasLink
                            isNew
                        />
                        <NotificationCard
                            icon={<Wrench size={18} className="text-blue-500" />}
                            title="Maintenance Due"
                            description="SC001 is due for routine service"
                            time="1 hour ago"
                            hasLink
                            isNew
                        />
                        <NotificationCard
                            icon={<MapPin size={18} className="text-rose-500" />}
                            title="Geo-fence Violation"
                            description="SC002 detected outside operational area"
                            time="2 hours ago"
                            hasLink
                        />
                        <NotificationCard
                            icon={<Clock size={18} className="text-orange-500" />}
                            title="Ride Overdue"
                            description="Ride R005 exceeded maximum duration"
                            time="3 hours ago"
                        />
                    </div>

                    {/* Notification Types Legend */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                        <h3 className="text-sm font-bold text-slate-600 mb-6">Notification Types</h3>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="flex items-center gap-3">
                                <Zap size={18} className="text-orange-500 opacity-50" />
                                <span className="text-sm font-bold text-slate-600">Low Battery</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin size={18} className="text-rose-500 opacity-50" />
                                <span className="text-sm font-bold text-slate-600">Geo-fence</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock size={18} className="text-orange-500 opacity-50" />
                                <span className="text-sm font-bold text-slate-600">Overdue</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Wrench size={18} className="text-blue-500 opacity-50" />
                                <span className="text-sm font-bold text-slate-600">Maintenance</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

function NotificationCard({
    icon,
    title,
    description,
    time,
    hasLink,
    isNew
}: {
    icon: ReactNode,
    title: string,
    description: string,
    time: string,
    hasLink?: boolean,
    isNew?: boolean
}) {
    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex items-start gap-6 relative group hover:shadow-md transition-all">
            <div className="bg-slate-50 p-3 rounded-2xl">
                {icon}
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h4 className="font-bold text-base text-slate-900">{title}</h4>
                    {isNew && (
                        <span className="px-3 py-1 bg-rose-50 text-rose-500 text-[10px] font-bold rounded-full">
                            New
                        </span>
                    )}
                </div>
                <p className="text-sm text-slate-500 mt-1 font-medium">{description}</p>
                <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-slate-400 font-medium">{time}</span>
                    {hasLink && (
                        <button className="text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors">
                            View Details →
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
