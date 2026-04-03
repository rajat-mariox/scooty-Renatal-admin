import { Search, UserPlus, RefreshCw, MoreVertical } from "lucide-react"
import { useState, useEffect } from "react"
import MainLayout from "../../layouts/MainLayout"
import { adminApi } from "../../services/adminApi"

export default function StationAdmins() {
    const [admins, setAdmins] = useState<any[]>([])
    const [stations, setStations] = useState<any[]>([])
    const [stationNameById, setStationNameById] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '', phone: '', stationId: '', role: 'STATION_ADMIN' })
    const [addAdminError, setAddAdminError] = useState("")

    const normalizeId = (value: any) => (value === undefined || value === null ? "" : String(value).trim())
    const isLikelyId = (value: string) => {
        const v = value.trim()
        if (!v) return false
        if (/^[a-f0-9]{16,}$/i.test(v)) return true
        if (/^\d{10,}$/.test(v)) return true
        if (/^[A-Za-z0-9_-]{12,}$/.test(v) && !v.includes("@") && !/\s/.test(v)) return true
        return false
    }
    const getStationName = (station: any) =>
        station?.name || station?.stationName || station?.station?.name || station?.station?.stationName || ""

    const fetchData = async () => {
        setLoading(true)
        try {
            const [adminRes, stationRes] = await Promise.all([
                adminApi.getStationAdmins(),
                adminApi.getStations()
            ])

            const adminData = (adminRes as any).data || adminRes
            const adminList = Array.isArray(adminData) ? adminData : (adminData.admins || [])
            setAdmins(adminList)

            const stationData = (stationRes as any).data || stationRes
            const stationList = Array.isArray(stationData) ? stationData : (stationData.stations || [])
            setStations(stationList)

            const nameMap: Record<string, string> = {}

            stationList.forEach((s: any) => {
                const name = getStationName(s)
                if (!name || isLikelyId(name)) return

                const ids = [s?._id, s?.id, s?.stationId, s?.station_id]
                    .map(normalizeId)
                    .filter((id): id is string => Boolean(id))
                ids.forEach((id) => {
                    nameMap[id] = name
                })
            })

            const unresolvedStationIdCandidates = adminList
                .map((a: any) => normalizeId(a?.stationId || a?._stationId || a?.station_id))
                .filter((id: string): id is string => Boolean(id))
                .filter((id: string) => !nameMap[id])

            const unresolvedStationIds = Array.from(new Set<string>(unresolvedStationIdCandidates))

            if (unresolvedStationIds.length > 0) {
                const details = await Promise.allSettled(
                    unresolvedStationIds.map((id) => adminApi.getStationDetails(id))
                )

                details.forEach((result, idx) => {
                    if (result.status !== "fulfilled") return

                    const id = unresolvedStationIds[idx]
                    const raw = (result.value as any)?.data ?? result.value
                    const station = raw?.station ?? raw?.data ?? raw
                    const name = getStationName(station)
                    if (!name || isLikelyId(name)) return

                    nameMap[id] = name
                    const ids = [station?._id, station?.id, station?.stationId, station?.station_id]
                        .map(normalizeId)
                        .filter((sid): sid is string => Boolean(sid))
                    ids.forEach((sid) => {
                        nameMap[sid] = name
                    })
                })
            }

            setStationNameById(nameMap)
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
        const stationIdRaw = String(newAdmin.stationId || "").trim()
        if (!stationIdRaw) {
            setAddAdminError("Please select a station")
            return
        }
        if (!newAdmin.role) {
            setAddAdminError("Please select a role")
            return
        }
        try {
            const isNumericStationId = /^\d+$/.test(stationIdRaw)
            const sidNumeric = isNumericStationId ? Number(stationIdRaw) : undefined

            const payload = {
                name: newAdmin.name.trim(),
                fullName: newAdmin.name.trim(),
                email: newAdmin.email.trim(),
                password: newAdmin.password,
                phone: newAdmin.phone.trim(),
                mobile: newAdmin.phone.trim(),
                phoneNumber: newAdmin.phone.trim(),
                role: newAdmin.role,
                adminType: newAdmin.role,
                stationId: stationIdRaw,
                station_id: stationIdRaw,
                station: stationIdRaw,
                assignedStationId: stationIdRaw,
                ...(isNumericStationId ? { stationIdNumeric: sidNumeric } : {})
            }

            const res = await adminApi.createStationAdmin(payload) as any
            const explicitFailure = res?.success === false || res?.status === false || res?.code === 0
            if (!explicitFailure) {
                setIsAddModalOpen(false)
                setNewAdmin({ name: '', email: '', password: '', phone: '', stationId: '', role: 'STATION_ADMIN' })
                setAddAdminError("")
                fetchData()
            } else {
                setAddAdminError(res.message || "Failed to create admin")
            }
        } catch (err: any) {
            console.error("Failed to create admin:", err)
            const apiError = err?.response?.data
            const details = Array.isArray(apiError?.errors)
                ? apiError.errors.map((x: any) => x?.msg || x?.message).filter(Boolean).join(", ")
                : ""
            setAddAdminError(
                apiError?.message ||
                apiError?.error ||
                details ||
                err?.message ||
                "An unexpected error occurred"
            )
        }
    }

    const filteredAdmins = admins.filter(a =>
        a.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const resolveAdminStationName = (admin: any) => {
        const directName = admin?.stationName || admin?.station?.name || admin?.station?.stationName
        if (directName && !isLikelyId(String(directName))) return directName

        const stationId = normalizeId(admin?.stationId || admin?._stationId || admin?.station_id)
        if (stationId && stationNameById[stationId]) return stationNameById[stationId]

        return "Station Not Assigned"
    }

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
                    <div className="overflow-x-auto">
                    <table className="w-full min-w-[860px] text-left">
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
                                <tr key={admin.id || admin._id || admin.email} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 text-[15px] font-semibold text-slate-800">{admin.name || "N/A"}</td>
                                    <td className="px-6 py-4 text-slate-500">
                                        <div className="text-sm font-medium text-slate-700">{admin.email || "N/A"}</div>
                                        <div className="text-xs font-medium text-slate-400 mt-0.5">{admin.phone || "-"}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
                                            {resolveAdminStationName(admin)}
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
                                    <label className="text-[11px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Role</label>
                                    <select
                                        required
                                        value={newAdmin.role}
                                        onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl mt-1 focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none transition-all font-bold text-sm bg-white cursor-pointer"
                                    >
                                        <option value="STATION_ADMIN">Station Admin</option>
                                        <option value="SUB_STATION_ADMIN">Sub Admin</option>
                                    </select>
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
                                            const name = s.name || s.stationName || "Unnamed Station";
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
