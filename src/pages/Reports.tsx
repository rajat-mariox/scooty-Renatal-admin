import { 
    Upload,
    TrendingUp,
    TrendingDown,
    IndianRupee,
    Navigation,
    Clock,
    AlertTriangle
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

const revenueData = [
    { name: 'Mon', value: 4500 },
    { name: 'Tue', value: 5200 },
    { name: 'Wed', value: 4800 },
    { name: 'Thu', value: 6100 },
    { name: 'Fri', value: 7200 },
    { name: 'Sat', value: 8700 },
    { name: 'Sun', value: 7900 },
]

const rideData = [
    { name: 'Mon', value: 45 },
    { name: 'Tue', value: 52 },
    { name: 'Wed', value: 48 },
    { name: 'Thu', value: 62 },
    { name: 'Fri', value: 75 },
    { name: 'Sat', value: 88 },
    { name: 'Sun', value: 81 },
]

export default function Reports() {
    return (
        <MainLayout>
            <div className="space-y-8 max-w-[1600px] mx-auto">
                {/* Header Section */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Reports & Analytics</h2>
                    <p className="text-slate-500 text-sm mt-1">View performance metrics and generate reports</p>
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-4">
                    <div className="flex flex-wrap items-end gap-6">
                        <div className="flex-1 min-w-[240px]">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Date Range</label>
                            <div className="h-14 bg-white border border-slate-100 rounded-xl px-4 flex items-center">
                                {/* Date Input Placeholder */}
                            </div>
                        </div>
                        <div className="flex-1 min-w-[240px]">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Vehicle</label>
                            <div className="h-14 bg-white border border-slate-100 rounded-xl px-4 flex items-center">
                                {/* Vehicle Select Placeholder */}
                            </div>
                        </div>
                        <button className="h-14 px-8 border-2 border-orange-500 text-orange-500 font-bold rounded-2xl flex items-center gap-2 hover:bg-orange-50 transition-all">
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
                                <h3 className="text-3xl font-bold text-slate-900">₹43,200</h3>
                                <div className="flex items-center gap-1 mt-2 text-emerald-500 font-bold text-xs">
                                    <TrendingUp size={14} />
                                    <span>+12.5%</span>
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
                                <p className="text-sm font-medium text-slate-400 mb-1">Total Rides</p>
                                <h3 className="text-3xl font-bold text-slate-900">441</h3>
                                <div className="flex items-center gap-1 mt-2 text-emerald-500 font-bold text-xs">
                                    <TrendingUp size={14} />
                                    <span>+8.2%</span>
                                </div>
                            </div>
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                                <Navigation size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Avg Duration Card */}
                    <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-sm font-medium text-slate-400 mb-1">Avg. Ride Duration</p>
                                <h3 className="text-3xl font-bold text-slate-900">18 min</h3>
                                <p className="text-[10px] text-slate-400 mt-2 font-medium">±0.5 min</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                                <Clock size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Complaints Card */}
                    <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-sm font-medium text-slate-400 mb-1">Complaints</p>
                                <h3 className="text-3xl font-bold text-slate-900">35</h3>
                                <div className="flex items-center gap-1 mt-2 text-rose-500 font-bold text-xs">
                                    <TrendingDown size={14} />
                                    <span>-15.3%</span>
                                </div>
                            </div>
                            <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500">
                                <AlertTriangle size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Daily Revenue Chart */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Daily Revenue</h3>
                        <div className="h-[300px] w-full">
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
                        </div>
                    </div>

                    {/* Daily Ride Count Chart */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Daily Ride Count</h3>
                        <div className="h-[300px] w-full">
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
                        </div>
                    </div>
                </div>

                {/* Additional Stats Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 min-h-[300px]">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Fleet Utilization</h3>
                        {/* Placeholder for utilization chart */}
                        <div className="h-full flex items-center justify-center text-slate-300">
                             <TrendingUp size={48} opacity={0.2} />
                        </div>
                    </div>
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 min-h-[300px]">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Complaint Trend</h3>
                        {/* Placeholder for complaint trend chart */}
                         <div className="h-full flex items-center justify-center text-slate-300">
                             <AlertTriangle size={48} opacity={0.2} />
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}
