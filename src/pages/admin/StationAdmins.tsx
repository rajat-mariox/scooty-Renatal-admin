import { Search, UserPlus, RefreshCw, MoreVertical } from "lucide-react"
import { useState, useEffect } from "react"
import MainLayout from "../../layouts/MainLayout"
import { adminApi } from "../../services/adminApi"

export default function StationAdmins() {
    const [admins, setAdmins] = useState<any[]>([])
    const [stations, setStations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '', phone: '', stationId: '' })
    const [addAdminError, setAddAdminError] = useState("")

    const fetchData = async () => {
        setLoading(true)
        try {
            const [adminRes, stationRes] = await Promise.all([
                adminApi.getStationAdmins(),
                adminApi.getStations()
            ])

            const adminData = (adminRes as any).data || adminRes
            setAdmins(Array.isArray(adminData) ? adminData : (adminData.admins || []))

            const stationData = (stationRes as any).data || stationRes
            setStations(Array.isArray(stationData) ? stationData : (stationData.stations || []))
        } catch (error) {
            console.error("Failed to fetch data:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleAddAdmin = async (e: React.FormEvent) => {
        e.preventDefault()
        setAddAdminError("")
        if (!newAdmin.stationId) {
            setAddAdminError("Please select a station")
            return
        }
        try {
            // Numeric conversion for IDs (sometimes required by backend validation)
            const sid = isNaN(Number(newAdmin.stationId)) ? newAdmin.stationId : Number(newAdmin.stationId);

            const payload = {
                ...newAdmin,
                stationId: sid,
                station_id: sid // Fallback for various API naming conventions
            }

            const res = await adminApi.createStationAdmin(payload) as any
            if (res.code === 1 || res.success) {
                setIsAddModalOpen(false)
                setNewAdmin({ name: '', email: '', password: '', phone: '', stationId: '' })
                setAddAdminError("")
                fetchData()
            } else {
                setAddAdminError(res.message || "Failed to create admin")
            }
        } catch (err: any) {
            console.error("Failed to create admin:", err)
            setAddAdminError(err.response?.data?.message || err.message || "An unexpected error occurred")
        }
    }

    const filteredAdmins = admins.filter(a =>
        a.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-xl font-bold">Station Admins</h2>
                        <p className="text-slate-500 text-sm">Manage users with station-level access</p>
                    </div>
                    <button
                        onClick={() => { setIsAddModalOpen(true); setAddAdminError("") }}
                        className="bg-orange-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-orange-100 transition-all hover:bg-orange-700 active:scale-95"
                    >
                        <UserPlus size={18} />
                        Add Admin
                    </button>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-100 flex gap-4 shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/10 border-slate-200"
                        />
                    </div>
                    <button onClick={fetchData} className="p-2 text-slate-400 hover:text-orange-600 transition-colors">
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email/Phone</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Station</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-8"><div className="h-4 bg-slate-100 rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : filteredAdmins.length > 0 ? filteredAdmins.map((admin) => (
                                <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-800">{admin.name}</td>
                                    <td className="px-6 py-4 text-slate-500">
                                        <div className="text-sm font-medium text-slate-700">{admin.email}</div>
                                        <div className="text-[10px] font-bold text-slate-400">{admin.phone}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-bold">
                                            {(() => {
                                                const sId = admin.stationId || admin._stationId;
                                                const station = stations.find(s => (s._id || s.id || s.stationId) === sId);
                                                return station ? (station.name || station.stationName) : (admin.stationName || admin.stationId || 'Pending');
                                            })()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-[10px] font-extrabold rounded-full uppercase tracking-tighter ${admin.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                            {admin.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors"><MoreVertical size={16} /></button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium italic">No station admins found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                            <h3 className="text-xl font-black text-slate-800 mb-4">Create New Station Admin</h3>
                            {addAdminError && (
                                <div className="mb-4 bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded-lg">
                                    {addAdminError}
                                </div>
                            )}
                            <form onSubmit={handleAddAdmin} className="space-y-4">
                                <div>
                                    <label className="text-[11px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Full Name</label>
                                    <input
                                        type="text" required
                                        value={newAdmin.name}
                                        onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl mt-1 focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none transition-all font-medium text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Email</label>
                                    <input
                                        type="email" required
                                        value={newAdmin.email}
                                        onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl mt-1 focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none transition-all font-medium text-sm"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[11px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Password</label>
                                        <input
                                            type="password" required
                                            value={newAdmin.password}
                                            onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl mt-1 focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none transition-all font-medium text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Phone</label>
                                        <input
                                            type="text" required
                                            value={newAdmin.phone}
                                            onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl mt-1 focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none transition-all font-medium text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Assign Station</label>
                                    <select
                                        required
                                        value={newAdmin.stationId}
                                        onChange={(e) => setNewAdmin({ ...newAdmin, stationId: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl mt-1 focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none transition-all font-bold text-sm bg-white cursor-pointer"
                                    >
                                        <option value="">Select a Station...</option>
                                        {stations.map(s => {
                                            const id = s._id || s.id || s.stationId;
                                            const name = s.name || s.stationName || s.stationName;
                                            return <option key={id} value={id}>{name}</option>
                                        })}
                                    </select>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="flex-1 py-3 text-slate-400 font-bold hover:text-slate-600 transition-colors"
                                    >Cancel</button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-orange-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-orange-100 hover:bg-orange-700 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                                    >Create Account</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    )
}
