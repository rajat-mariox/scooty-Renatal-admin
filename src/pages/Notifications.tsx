import { Zap, Wrench, MapPin, Clock, Check, RefreshCw, AlertCircle } from "lucide-react"
import MainLayout from "../layouts/MainLayout"
import { ReactNode, useState, useEffect } from "react"
import { adminApi } from "../services/adminApi"

export default function Notifications() {
    const [notifications, setNotifications] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

    const fetchNotifications = async () => {
        setLoading(true)
        try {
            const response = await adminApi.getNotifications()
            const data = (response as any).data || response
            const fetchedList = Array.isArray(data.notifications) ? data.notifications : (Array.isArray(data) ? data : [])
            setNotifications(fetchedList)
        } catch (error) {
            console.error("Failed to fetch notifications:", error)
        } finally {
            setLoading(false)
        }
    }

    const markAllAsRead = async () => {
        try {
            await adminApi.readAllNotifications()
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
        } catch (error) {
            console.error("Failed to mark all as read:", error)
        }
    }

    useEffect(() => {
        fetchNotifications()
    }, [])

    const unreadCount = notifications.filter(n => !n.isRead).length
    
    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return !n.isRead
        if (filter === 'read') return n.isRead
        return true
    })

    const getIconForType = (type: string) => {
        const lowerType = type?.toLowerCase() || ''
        if (lowerType.includes('battery')) return <Zap size={18} className="text-orange-500" />
        if (lowerType.includes('maintenance')) return <Wrench size={18} className="text-blue-500" />
        if (lowerType.includes('geo')) return <MapPin size={18} className="text-rose-500" />
        if (lowerType.includes('time') || lowerType.includes('overdue')) return <Clock size={18} className="text-orange-500" />
        return <AlertCircle size={18} className="text-slate-500" />
    }

    return (
        <MainLayout>
            <div className="space-y-8 max-w-[1500px]">
                {/* Notifications Header */}
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-2xl font-bold">Notifications</h2>
                        <p className="text-slate-500 text-sm mt-1">
                            Stay updated with alerts and system events
                        </p>
                    </div>
                    {loading && <RefreshCw className="animate-spin text-orange-500 mb-1" size={20} />}
                </div>

                {/* Notifications List Container */}
                <div className="space-y-6">
                    {/* Filter Bar */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-2">
                            <button 
                                onClick={() => setFilter('all')}
                                className={`px-5 py-2 rounded-xl font-bold text-sm transition-all border ${filter === 'all' ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-100' : 'text-slate-500 hover:bg-slate-50 border-transparent'}`}
                            >
                                All
                            </button>
                            <button 
                                onClick={() => setFilter('unread')}
                                className={`px-5 py-2 rounded-xl font-bold text-sm transition-all border ${filter === 'unread' ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-100' : 'text-slate-500 hover:bg-slate-50 border-transparent'}`}
                            >
                                Unread ({unreadCount})
                            </button>
                            <button 
                                onClick={() => setFilter('read')}
                                className={`px-5 py-2 rounded-xl font-bold text-sm transition-all border ${filter === 'read' ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-100' : 'text-slate-500 hover:bg-slate-50 border-transparent'}`}
                            >
                                Read
                            </button>
                        </div>
                        <button 
                            onClick={markAllAsRead}
                            disabled={unreadCount === 0}
                            className={`flex items-center gap-2 px-4 py-2 border rounded-xl font-bold text-sm transition-all ${
                                unreadCount === 0 
                                ? 'border-slate-100 text-slate-300 bg-slate-50 cursor-not-allowed' 
                                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            <Check size={18} className={unreadCount === 0 ? "text-slate-300" : "text-slate-400"} />
                            Mark All as Read
                        </button>
                    </div>

                    {/* Notifications Items */}
                    <div className="space-y-4 min-h-[300px] relative">
                        {loading && notifications.length === 0 ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10 rounded-3xl border border-slate-100">
                                <div className="flex flex-col items-center gap-3">
                                    <RefreshCw className="animate-spin text-orange-500" size={32} />
                                    <span className="text-sm font-bold text-slate-500">Loading Notifications...</span>
                                </div>
                            </div>
                        ) : null}
                        
                        {filteredNotifications.length > 0 ? filteredNotifications.map((notification, index) => (
                            <NotificationCard
                                key={notification.id || index}
                                icon={getIconForType(notification.type || notification.title)}
                                title={notification.title || "Notification"}
                                description={notification.message || notification.description || ""}
                                time={notification.createdAt ? new Date(notification.createdAt).toLocaleString() : "Recently"}
                                hasLink={!!notification.link || !!notification.actionUrl}
                                isNew={!notification.isRead}
                            />
                        )) : !loading && (
                            <div className="bg-white rounded-3xl border border-dashed border-slate-200 py-16 flex flex-col items-center justify-center text-center px-6">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                    <AlertCircle size={32} className="text-slate-300" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-700 mb-1">No notifications found</h3>
                                <p className="text-slate-500 text-sm font-medium">You don't have any {filter !== 'all' ? filter : ''} notifications at the moment.</p>
                            </div>
                        )}
                    </div>

                    {/* Notification Types Legend */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                        <h3 className="text-sm font-bold text-slate-600 mb-6">Notification Types</h3>
                        <div className="flex flex-wrap gap-8">
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
        <div className={`bg-white rounded-3xl border ${isNew ? 'border-orange-100 shadow-sm' : 'border-slate-100'} p-6 sm:p-8 flex items-start gap-4 sm:gap-6 relative group hover:shadow-md transition-all`}>
            <div className={`${isNew ? 'bg-orange-50' : 'bg-slate-50'} p-3 rounded-2xl shrink-0`}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap justify-between items-start gap-2">
                    <h4 className="font-bold text-base text-slate-900 truncate pr-2">{title}</h4>
                    {isNew && (
                        <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-full shrink-0">
                            New
                        </span>
                    )}
                </div>
                <p className="text-sm text-slate-500 mt-1 font-medium leading-relaxed">{description}</p>
                <div className="flex items-center gap-3 mt-3">
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
