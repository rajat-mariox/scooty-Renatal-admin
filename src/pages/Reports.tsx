import {
    Upload,
    TrendingUp,
    TrendingDown,
    IndianRupee,
    Navigation,
    CheckCircle2,
    XCircle,
    RefreshCw,
    Landmark,
    Wallet,
    BadgePercent,
    Coins
} from "lucide-react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts'
import MainLayout from "../layouts/MainLayout"
import { useCallback, useEffect, useState } from "react"
import { adminApi } from "../services/adminApi"

const dayOverDayTrend = (rows: { value: number }[]) => {
    if (rows.length < 2) return 0
    const last = rows[rows.length - 1].value
    const prev = rows[rows.length - 2].value
    if (!prev) return 0
    return Math.round(((last - prev) / prev) * 1000) / 10
}

const escapeCsv = (value: any) => {
    const s = String(value ?? "")
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export default function Reports() {
    const [loading, setLoading] = useState(true)
    const [report, setReport] = useState<any>(null)
    const [revenueData, setRevenueData] = useState<any[]>([])
    const [rideData, setRideData] = useState<any[]>([])
    const [stations, setStations] = useState<any[]>([])
    const [filters, setFilters] = useState({ from: "", to: "", stationId: "" })
    const [stats, setStats] = useState({
        totalRevenue: 0,
        revenueTrend: 0,
        totalRides: 0,
        ridesTrend: 0,
        completed: 0,
        cancelled: 0
    })

    const fetchReports = useCallback(async (activeFilters = filters) => {
        setLoading(true)
        try {
            const response = await adminApi.getReports({
                from: activeFilters.from || undefined,
                to: activeFilters.to || undefined,
                stationId: activeFilters.stationId || undefined,
            })
            const payload = (response as any)?.data ?? response
            const fetchedReport = payload?.report ?? payload?.data?.report ?? null
            const summary = fetchedReport?.summary ?? {}

            const mappedRevenueData = Array.isArray(fetchedReport?.dailyRevenue)
                ? fetchedReport.dailyRevenue.map((r: any) => ({
                      name: String(r?.date ?? ""),
                      value: Number(r?.revenue ?? 0),
                  }))
                : []

            const mappedRideData = Array.isArray(fetchedReport?.dailyBookings)
                ? fetchedReport.dailyBookings.map((r: any) => ({
                      name: String(r?.date ?? ""),
                      value: Number(r?.total ?? 0),
                  }))
                : []

            setReport(fetchedReport)
            setRevenueData(mappedRevenueData)
            setRideData(mappedRideData)
            setStats({
                totalRevenue: Number(summary?.totalRevenue ?? 0),
                revenueTrend: dayOverDayTrend(mappedRevenueData),
                totalRides: Number(summary?.totalBookings ?? 0),
                ridesTrend: dayOverDayTrend(mappedRideData),
                completed: Number(summary?.completed ?? 0),
                cancelled: Number(summary?.cancelled ?? 0),
            })
        } catch (error) {
            console.error("Failed to fetch reports:", error)
        } finally {
            setLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        fetchReports()

        adminApi.getStations()
            .then((response) => {
                const data = (response as any)?.data ?? response
                const list = Array.isArray(data) ? data : (data?.stations || [])
                setStations(list)
            })
            .catch((err) => console.error("Failed to fetch stations:", err))
    }, [fetchReports])

    const applyFilters = (next: Partial<typeof filters>) => {
        const merged = { ...filters, ...next }
        setFilters(merged)
        fetchReports(merged)
    }

    const handleExport = () => {
        if (!report) return

        const finance = report.finance || {}
        const settlements = report.settlements || {}
        const lines: string[] = []

        lines.push("Section,Metric,Value")
        lines.push(`Summary,Total Bookings,${escapeCsv(report.summary?.totalBookings ?? 0)}`)
        lines.push(`Summary,Total Revenue,${escapeCsv(report.summary?.totalRevenue ?? 0)}`)
        lines.push(`Summary,Completed,${escapeCsv(report.summary?.completed ?? 0)}`)
        lines.push(`Summary,Cancelled,${escapeCsv(report.summary?.cancelled ?? 0)}`)
        lines.push(`Finance,GST Collected,${escapeCsv(finance.gstCollected ?? 0)}`)
        lines.push(`Finance,Platform Commission,${escapeCsv(finance.platformCommission ?? 0)}`)
        lines.push(`Finance,Owner Earnings,${escapeCsv(finance.ownerEarnings ?? 0)}`)
        lines.push(`Finance,Payouts,${escapeCsv(finance.payouts ?? 0)}`)
        Object.entries(settlements).forEach(([status, row]: [string, any]) => {
            lines.push(`Settlements,${escapeCsv(status)} Count,${escapeCsv(row?.count ?? 0)}`)
            lines.push(`Settlements,${escapeCsv(status)} Amount,${escapeCsv(row?.amount ?? 0)}`)
        })

        lines.push("")
        lines.push("Daily Revenue")
        lines.push("Date,Revenue,Bookings")
        ;(report.dailyRevenue || []).forEach((row: any) => {
            lines.push(`${escapeCsv(row.date)},${escapeCsv(row.revenue)},${escapeCsv(row.bookings)}`)
        })

        lines.push("")
        lines.push("Daily Bookings")
        lines.push("Date,Total")
        ;(report.dailyBookings || []).forEach((row: any) => {
            lines.push(`${escapeCsv(row.date)},${escapeCsv(row.total)}`)
        })

        lines.push("")
        lines.push("Top Stations")
        lines.push("Station,Revenue,Bookings")
        ;(report.topStations || []).forEach((row: any) => {
            lines.push(`${escapeCsv(row.station?.name || row.stationId)},${escapeCsv(row.totalRevenue)},${escapeCsv(row.totalBookings)}`)
        })

        lines.push("")
        lines.push("Top Users")
        lines.push("User,Email,Revenue,Bookings")
        ;(report.topUsers || []).forEach((row: any) => {
            lines.push(`${escapeCsv(row.user?.name || row.userId)},${escapeCsv(row.user?.email || "")},${escapeCsv(row.totalRevenue)},${escapeCsv(row.totalBookings)}`)
        })

        const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        const suffix = [filters.from, filters.to].filter(Boolean).join("_to_") || new Date().toISOString().split("T")[0]
        link.href = url
        link.download = `report_${suffix}.csv`
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
    }

    const finance = report?.finance || {}
    const settlements: [string, any][] = Object.entries(report?.settlements || {})
    const topStations: any[] = Array.isArray(report?.topStations) ? report.topStations : []
    const topUsers: any[] = Array.isArray(report?.topUsers) ? report.topUsers : []

    return (
        <MainLayout>
            <div className="space-y-8 max-w-[1600px] mx-auto">
                {/* Header Section */}
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Reports & Analytics</h2>
                        <p className="text-slate-500 text-sm mt-1">View performance metrics and generate reports</p>
                    </div>
                    {loading && <RefreshCw className="animate-spin text-orange-500 mb-2" size={20} />}
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-4">
                    <div className="flex flex-wrap items-end gap-6">
                        <div className="min-w-[180px]">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">From</label>
                            <input
                                type="date"
                                value={filters.from}
                                onChange={(e) => applyFilters({ from: e.target.value })}
                                className="w-full h-14 bg-white border border-slate-100 rounded-xl px-4 text-sm font-medium text-slate-700 focus:outline-none focus:border-orange-500/50"
                            />
                        </div>
                        <div className="min-w-[180px]">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">To</label>
                            <input
                                type="date"
                                value={filters.to}
                                onChange={(e) => applyFilters({ to: e.target.value })}
                                className="w-full h-14 bg-white border border-slate-100 rounded-xl px-4 text-sm font-medium text-slate-700 focus:outline-none focus:border-orange-500/50"
                            />
                        </div>
                        <div className="flex-1 min-w-[240px]">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Station</label>
                            <select
                                value={filters.stationId}
                                onChange={(e) => applyFilters({ stationId: e.target.value })}
                                className="w-full h-14 bg-white border border-slate-100 rounded-xl px-4 text-sm font-medium text-slate-700 focus:outline-none focus:border-orange-500/50"
                            >
                                <option value="">All Stations</option>
                                {stations.map((s: any) => (
                                    <option key={s._id || s.id} value={s._id || s.id}>
                                        {s.name || s.stationName || "Unknown Station"}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleExport}
                            disabled={loading || !report}
                            className="h-14 px-8 border-2 border-orange-500 text-orange-500 font-bold rounded-2xl flex items-center gap-2 hover:bg-orange-50 transition-all disabled:opacity-50"
                        >
                            <Upload size={20} />
                            Export Report
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Revenue Card */}
                    <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-sm font-medium text-slate-400 mb-1">Total Revenue</p>
                                <h3 className="text-3xl font-bold text-slate-900">
                                    {loading ? "..." : `₹${stats.totalRevenue.toLocaleString()}`}
                                </h3>
                                <div className={`flex items-center gap-1 mt-2 font-bold text-xs ${stats.revenueTrend >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                                    {stats.revenueTrend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                    <span>{stats.revenueTrend >= 0 ? "+" : ""}{stats.revenueTrend}% day over day</span>
                                </div>
                            </div>
                            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                                <IndianRupee size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Rides Card */}
                    <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-sm font-medium text-slate-400 mb-1">Total Bookings</p>
                                <h3 className="text-3xl font-bold text-slate-900">
                                    {loading ? "..." : stats.totalRides.toLocaleString()}
                                </h3>
                                <div className={`flex items-center gap-1 mt-2 font-bold text-xs ${stats.ridesTrend >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                                    {stats.ridesTrend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                    <span>{stats.ridesTrend >= 0 ? "+" : ""}{stats.ridesTrend}% day over day</span>
                                </div>
                            </div>
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                                <Navigation size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Completed Card */}
                    <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-sm font-medium text-slate-400 mb-1">Completed Rides</p>
                                <h3 className="text-3xl font-bold text-slate-900">
                                    {loading ? "..." : stats.completed.toLocaleString()}
                                </h3>
                                <p className="text-[10px] text-slate-400 mt-2 font-medium">In selected period</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                                <CheckCircle2 size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Cancelled Card */}
                    <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-sm font-medium text-slate-400 mb-1">Cancelled Bookings</p>
                                <h3 className="text-3xl font-bold text-slate-900">
                                    {loading ? "..." : stats.cancelled.toLocaleString()}
                                </h3>
                                <p className="text-[10px] text-slate-400 mt-2 font-medium">In selected period</p>
                            </div>
                            <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500">
                                <XCircle size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Finance Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FinanceStat icon={<Landmark size={20} />} label="GST Collected" value={finance.gstCollected} loading={loading} />
                    <FinanceStat icon={<BadgePercent size={20} />} label="Platform Commission" value={finance.platformCommission} loading={loading} />
                    <FinanceStat icon={<Wallet size={20} />} label="Owner Earnings" value={finance.ownerEarnings} loading={loading} />
                    <FinanceStat icon={<Coins size={20} />} label="Payouts" value={finance.payouts} loading={loading} />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Daily Revenue Chart */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Daily Revenue</h3>
                        <div className="h-[300px] w-full">
                            {loading ? (
                                <div className="w-full h-full bg-slate-50 animate-pulse rounded-xl" />
                            ) : revenueData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={revenueData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                                            tickFormatter={(value) => `${value}`}
                                        />
                                        <Tooltip
                                            cursor={{ fill: '#f8fafc' }}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Bar
                                            dataKey="value"
                                            fill="#FF6A1F"
                                            radius={[6, 6, 0, 0]}
                                            barSize={32}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-50 rounded-xl">No data available</div>
                            )}
                        </div>
                    </div>

                    {/* Daily Ride Count Chart */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Daily Booking Count</h3>
                        <div className="h-[300px] w-full">
                            {loading ? (
                                <div className="w-full h-full bg-slate-50 animate-pulse rounded-xl" />
                            ) : rideData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={rideData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                                        />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#3B82F6"
                                            strokeWidth={2}
                                            dot={{ fill: '#fff', stroke: '#3B82F6', strokeWidth: 2, r: 4 }}
                                            activeDot={{ r: 6, strokeWidth: 0, fill: '#3B82F6' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-50 rounded-xl">No data available</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Top Stations / Top Users */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 min-h-[300px]">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Top Stations</h3>
                        {topStations.length > 0 ? (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase">Station</th>
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase text-right">Bookings</th>
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase text-right">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {topStations.map((row: any) => (
                                        <tr key={String(row.stationId)}>
                                            <td className="py-4">
                                                <div className="text-sm font-bold text-slate-800">{row.station?.name || String(row.stationId || "Unknown")}</div>
                                                <div className="text-[11px] font-medium text-slate-400">{row.station?.address || ""}</div>
                                            </td>
                                            <td className="py-4 text-sm font-bold text-slate-600 text-right">{row.totalBookings ?? 0}</td>
                                            <td className="py-4 text-sm font-black text-orange-600 text-right">₹{Number(row.totalRevenue ?? 0).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="h-[200px] flex items-center justify-center text-slate-300 font-bold">No station data</div>
                        )}
                    </div>
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 min-h-[300px]">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Top Users</h3>
                        {topUsers.length > 0 ? (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase">User</th>
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase text-right">Bookings</th>
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase text-right">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {topUsers.map((row: any) => (
                                        <tr key={String(row.userId)}>
                                            <td className="py-4">
                                                <div className="text-sm font-bold text-slate-800">{row.user?.name || String(row.userId || "Unknown")}</div>
                                                <div className="text-[11px] font-medium text-slate-400">{row.user?.email || ""}</div>
                                            </td>
                                            <td className="py-4 text-sm font-bold text-slate-600 text-right">{row.totalBookings ?? 0}</td>
                                            <td className="py-4 text-sm font-black text-orange-600 text-right">₹{Number(row.totalRevenue ?? 0).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="h-[200px] flex items-center justify-center text-slate-300 font-bold">No user data</div>
                        )}
                    </div>
                </div>

                {/* Settlements Summary */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Settlements Summary</h3>
                    {settlements.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {settlements.map(([status, row]) => (
                                <div key={status} className="p-5 bg-slate-50 rounded-2xl">
                                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{status}</p>
                                    <p className="text-2xl font-black text-slate-900 mt-1">₹{Number(row?.amount ?? 0).toLocaleString()}</p>
                                    <p className="text-xs font-bold text-slate-500 mt-1">{row?.count ?? 0} settlements</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-8 text-center text-slate-300 font-bold">No settlement data</div>
                    )}
                </div>
            </div>
        </MainLayout>
    )
}

function FinanceStat({ icon, label, value, loading }: { icon: React.ReactNode; label: string; value: any; loading: boolean }) {
    return (
        <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500 shrink-0">
                {icon}
            </div>
            <div>
                <p className="text-xs font-medium text-slate-400">{label}</p>
                <p className="text-xl font-black text-slate-900 mt-0.5">
                    {loading ? "..." : `₹${Number(value ?? 0).toLocaleString()}`}
                </p>
            </div>
        </div>
    )
}
