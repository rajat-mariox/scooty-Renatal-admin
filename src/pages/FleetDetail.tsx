import {
    ArrowLeft,
    FileText,
    DollarSign,
    History,
    Wrench,
    ChevronDown
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import MainLayout from "../layouts/MainLayout"
import { ReactNode } from "react"

export default function FleetDetail() {
    const navigate = useNavigate()

    return (
        <MainLayout>
            <div className="space-y-8">

                {/* Navigation & Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-4">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
                        >
                            <ArrowLeft size={16} />
                            Back to Fleet
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Vehicle Details - SC001</h2>
                            <p className="text-slate-500 text-sm font-medium">Ola S1 Pro</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-6 py-3 border-2 border-orange-600 text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-all text-sm">
                            Report Issue
                        </button>
                        <button className="px-6 py-3 bg-orange-600 shadow-lg shadow-orange-100 text-white font-bold rounded-xl hover:bg-orange-700 transition-all text-sm">
                            Update Status
                        </button>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-12 gap-8">

                    {/* Vehicle Information */}
                    <div className="col-span-4 bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
                        <h3 className="font-bold text-slate-800">Vehicle Information</h3>
                        <div className="space-y-5">
                            <InfoRow label="Vehicle ID" value="SC001" />
                            <InfoRow label="Model" value="Ola S1 Pro" />
                            <InfoRow label="Registration Number" value="DL-1A-2345" />
                            <div className="space-y-1.5">
                                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Status</span>
                                <div>
                                    <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">
                                        Active
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Battery Level</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-slate-700">85%</span>
                                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="w-[85%] h-full bg-green-500 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                            <InfoRow label="Current Location" value="Station A - Bay 3" />
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="col-span-4 bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
                        <div className="flex items-center gap-2">
                            <FileText size={18} className="text-slate-400" />
                            <h3 className="font-bold text-slate-800">Documents</h3>
                        </div>
                        <div className="space-y-6">
                            <DocRow label="Insurance" value="Valid till Dec 2026" />
                            <DocRow label="Registration" value="Valid" />
                            <DocRow label="Pollution Certificate" value="Valid till Jun 2026" />
                        </div>
                    </div>

                    {/* Performance */}
                    <div className="col-span-4 bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
                        <div className="flex items-center gap-2">
                            <DollarSign size={18} className="text-slate-400" />
                            <h3 className="font-bold text-slate-800">Performance</h3>
                        </div>
                        <div className="space-y-8">
                            <div>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Total Rides</p>
                                <p className="text-3xl font-extrabold text-slate-900 mt-1">245</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Total Earnings</p>
                                <p className="text-3xl font-extrabold text-slate-900 mt-1">₹24,500</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Avg. Earning/Ride</p>
                                <p className="text-sm font-bold text-slate-900 mt-1">₹100</p>
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
                            <RideRow id="R156" rider="Rahul Sharma" date="Feb 23, 10:30 AM" duration="25 mins" distance="8.2 km" fare="₹82" />
                            <RideRow id="R155" rider="Priya Singh" date="Feb 23, 9:15 AM" duration="18 mins" distance="5.5 km" fare="₹55" />
                        </tbody>
                    </table>
                </div>

                {/* Maintenance History */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden pb-4">
                    <div className="p-8 border-b border-slate-50 flex items-center gap-2">
                        <Wrench size={18} className="text-slate-400" />
                        <h3 className="font-bold text-slate-800 text-lg">Maintenance History</h3>
                    </div>
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
                            <MaintenanceRow id="M001" date="Feb 20, 2026" type="Full Service" status="Completed" cost="₹1,200" />
                            <MaintenanceRow id="M004" date="Jan 15, 2026" type="Brake Pad Replacement" status="Completed" cost="₹450" />
                            <MaintenanceRow id="M007" date="Dec 10, 2025" type="Battery Check" status="Completed" cost="₹200" />
                        </tbody>
                    </table>
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

function DocRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500">{label}</p>
            <p className="text-sm font-bold text-green-600">{value}</p>
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
