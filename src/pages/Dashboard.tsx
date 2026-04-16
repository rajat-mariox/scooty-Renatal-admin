import {
    Users,
    MapPin,
    Bike,
    CalendarCheck,
    IndianRupee,
    ClipboardCheck,
    Landmark,
    HeadphonesIcon,
    RefreshCw,
    UserCheck,
    UserX,
    ShieldCheck,
    ChevronRight,
    Clock,
    TrendingUp
} from "lucide-react"
import MainLayout from "../layouts/MainLayout"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { adminApi } from "../services/adminApi"

interface DashboardData {
    users: {
        total: number
        active: number
        blocked: number
        byRole: Record<string, number>
    }
    stations: { total: number }
    vehicles: { total: number }
    bookings: {
        total: number
        today: number
        byStatus: Record<string, number>
    }
    revenue: {
        total: number
        today: number
        asOf: string
    }
    approvals: {
        ridePlans: number
        faqs: number
    }
    settlements: { pending: number }
    support: { openTickets: number }
}

const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val)

const roleLabelMap: Record<string, string> = {
    ADMIN: "Admin",
    STATION_ADMIN: "Station Admin",
    SUB_STATION_ADMIN: "Sub Station Admin",
    OWNER: "Owner",
}

const roleColorMap: Record<string, string> = {
    ADMIN: "bg-orange-500",
    STATION_ADMIN: "bg-slate-500",
    SUB_STATION_ADMIN: "bg-slate-400",
    OWNER: "bg-slate-600",
}

export default function Dashboard() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<DashboardData | null>(null)
    const [lastUpdated, setLastUpdated] = useState<string>("")

    const fetchDashboard = async () => {
        setLoading(true)
        try {
            const response = await adminApi.getDashboardStats()
            const payload = (response as any)?.data ?? response
            const dashboard: DashboardData | undefined = (payload as any)?.dashboard ?? payload
            if (dashboard) {
                setData(dashboard)
                setLastUpdated(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }))
            }
        } catch (error) {
            console.error("Failed to fetch dashboard stats:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboard()
    }, [])

    const primaryCards = [
        {
            label: "Total Users",
            value: data?.users.total ?? 0,
            sub: `${data?.users.active ?? 0} active · ${data?.users.blocked ?? 0} blocked`,
            icon: <Users size={20} className="text-orange-500" />,
        },
        {
            label: "Stations",
            value: data?.stations.total ?? 0,
            sub: "Total registered stations",
            icon: <MapPin size={20} className="text-orange-500" />,
        },
        {
            label: "Vehicles",
            value: data?.vehicles.total ?? 0,
            sub: "Total registered vehicles",
            icon: <Bike size={20} className="text-orange-500" />,
        },
        {
            label: "Bookings",
            value: data?.bookings.total ?? 0,
            sub: `${data?.bookings.today ?? 0} today`,
            icon: <CalendarCheck size={20} className="text-orange-500" />,
        },
    ]

    const actionCards = [
        {
            label: "Pending Approvals",
            value: (data?.approvals.ridePlans ?? 0) + (data?.approvals.faqs ?? 0),
            sub: `${data?.approvals.ridePlans ?? 0} ride plans · ${data?.approvals.faqs ?? 0} FAQs`,
            icon: <ClipboardCheck size={18} className="text-slate-500" />,
            route: "/admin/approvals",
        },
        {
            label: "Pending Settlements",
            value: data?.settlements.pending ?? 0,
            sub: "Awaiting processing",
            icon: <Landmark size={18} className="text-slate-500" />,
            route: "/admin/finance",
        },
        {
            label: "Open Support Tickets",
            value: data?.support.openTickets ?? 0,
            sub: "Unresolved tickets",
            icon: <HeadphonesIcon size={18} className="text-slate-500" />,
            route: "/support",
        },
    ]

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
                        <p className="text-slate-400 text-sm mt-1 flex items-center gap-1.5">
                            <Clock size={12} />
                            {new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                            {lastUpdated && (
                                <span className="ml-2 text-orange-500 font-medium">· Updated {lastUpdated}</span>
                            )}
                        </p>
                    </div>
                    <button
                        onClick={fetchDashboard}
                        disabled={loading}
                        className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium px-4 py-2 rounded-xl hover:bg-slate-50 transition-all shadow-sm disabled:opacity-60"
                    >
                        <RefreshCw size={14} className={loading ? "animate-spin text-orange-500" : ""} />
                        Refresh
                    </button>
                </div>

                {/* Primary Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {primaryCards.map((card) => (
                        <div
                            key={card.label}
                            className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-left"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-orange-50 p-2.5 rounded-xl">
                                    {card.icon}
                                </div>
                            </div>
                            {loading ? (
                                <div className="h-8 w-16 bg-slate-100 animate-pulse rounded-lg mb-1" />
                            ) : (
                                <div className="text-3xl font-bold text-slate-800">{card.value}</div>
                            )}
                            <div className="text-sm font-semibold text-slate-700 mt-0.5">{card.label}</div>
                            <div className="text-xs text-slate-400 mt-1">{card.sub}</div>
                        </div>
                    ))}
                </div>

                {/* Revenue + User Roles */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Revenue */}
                    <div className="col-span-12 lg:col-span-5">
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 h-full">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-base font-bold text-slate-800">Revenue Overview</h3>
                                <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                                    As of {data?.revenue.asOf
                                        ? new Date(data.revenue.asOf).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
                                        : "--"}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-5">
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp size={16} className="text-slate-400" />
                                        <span className="text-xs text-slate-500 font-medium">Total Revenue</span>
                                    </div>
                                    {loading ? (
                                        <div className="h-6 w-20 bg-slate-200 animate-pulse rounded" />
                                    ) : (
                                        <div className="text-lg font-bold text-slate-800">{formatCurrency(data?.revenue.total ?? 0)}</div>
                                    )}
                                </div>
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <IndianRupee size={16} className="text-slate-400" />
                                        <span className="text-xs text-slate-500 font-medium">Today's Revenue</span>
                                    </div>
                                    {loading ? (
                                        <div className="h-6 w-20 bg-slate-200 animate-pulse rounded" />
                                    ) : (
                                        <div className="text-lg font-bold text-slate-800">{formatCurrency(data?.revenue.today ?? 0)}</div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2 pt-4 border-t border-slate-50">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 font-medium">Today's Bookings</span>
                                    <span className="font-bold text-slate-800">{loading ? "—" : data?.bookings.today ?? 0}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 font-medium">Total Bookings</span>
                                    <span className="font-bold text-slate-800">{loading ? "—" : data?.bookings.total ?? 0}</span>
                                </div>
                                {data?.bookings.byStatus && Object.keys(data.bookings.byStatus).length > 0 && (
                                    Object.entries(data.bookings.byStatus).map(([status, count]) => (
                                        <div key={status} className="flex justify-between text-xs text-slate-400">
                                            <span className="capitalize">{status.toLowerCase().replace(/_/g, " ")}</span>
                                            <span className="font-semibold text-slate-600">{count}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* User Breakdown */}
                    <div className="col-span-12 lg:col-span-7">
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 h-full">
                            <h3 className="text-base font-bold text-slate-800 mb-5">User Breakdown</h3>

                            {/* Status overview */}
                            <div className="grid grid-cols-3 gap-3 mb-5">
                                {[
                                    { label: "Total", value: data?.users.total ?? 0, icon: <ShieldCheck size={18} className="text-slate-500" /> },
                                    { label: "Active", value: data?.users.active ?? 0, icon: <UserCheck size={18} className="text-slate-500" /> },
                                    { label: "Blocked", value: data?.users.blocked ?? 0, icon: <UserX size={18} className="text-slate-500" /> },
                                ].map((item) => (
                                    <div key={item.label} className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
                                        <div className="flex justify-center mb-1">{item.icon}</div>
                                        {loading ? (
                                            <div className="h-7 w-10 bg-slate-200 animate-pulse rounded mx-auto my-1" />
                                        ) : (
                                            <div className="text-2xl font-bold text-slate-800">{item.value}</div>
                                        )}
                                        <div className="text-xs text-slate-400 mt-0.5">{item.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Role breakdown */}
                            <div>
                                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">By Role</h4>
                                <div className="space-y-3">
                                    {loading ? (
                                        [...Array(4)].map((_, i) => (
                                            <div key={i} className="h-8 bg-slate-50 animate-pulse rounded-xl" />
                                        ))
                                    ) : (
                                        Object.entries(data?.users.byRole ?? {}).map(([role, count]) => {
                                            const total = data?.users.total || 1
                                            const pct = Math.round((count / total) * 100)
                                            return (
                                                <div key={role} className="flex items-center gap-3">
                                                    <div className="w-32 text-xs text-slate-600 font-medium shrink-0">
                                                        {roleLabelMap[role] ?? role}
                                                    </div>
                                                    <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                        <div
                                                            className={`${roleColorMap[role] ?? "bg-slate-400"} h-full rounded-full transition-all duration-700`}
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                    <div className="text-xs font-bold text-slate-700 shrink-0 w-6 text-right">{count}</div>
                                                    <div className="text-xs text-slate-400 shrink-0 w-8">{pct}%</div>
                                                </div>
                                            )
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Required Cards */}
                <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Action Required</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {actionCards.map((card) => (
                            <button
                                key={card.label}
                                onClick={() => navigate(card.route)}
                                className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 text-left hover:shadow-md hover:border-slate-200 transition-all group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors">
                                        {card.icon}
                                    </div>
                                    <ChevronRight size={16} className="text-slate-300 group-hover:text-orange-400 transition-colors" />
                                </div>
                                {loading ? (
                                    <div className="h-8 w-12 bg-slate-100 animate-pulse rounded-lg mb-1" />
                                ) : (
                                    <div className="text-3xl font-bold text-slate-800">{card.value}</div>
                                )}
                                <div className="text-sm font-semibold text-slate-700 mt-0.5">{card.label}</div>
                                <div className="text-xs text-slate-400 mt-1">{card.sub}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}
