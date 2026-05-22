import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Building2, CheckCircle2, Loader2, Pencil, Plus, RefreshCw, Search } from "lucide-react"
import MainLayout from "../../layouts/MainLayout"
import { adminApi } from "../../services/adminApi"

type StationRow = {
    _id: string
    name?: string
    address?: string
    city?: string
    state?: string
    parkingType?: string
    maxVehicles?: number | null
    occupiedVehicles?: number
    availableVehicles?: number
    remainingCapacity?: number | null
    isFull?: boolean
    isActive?: boolean
}

export default function Stations() {
    const navigate = useNavigate()
    const [stations, setStations] = useState<StationRow[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [search, setSearch] = useState("")
    const [editing, setEditing] = useState<StationRow | null>(null)
    const [editForm, setEditForm] = useState({
        name: "",
        address: "",
        city: "",
        state: "",
        parkingType: "OPEN",
        maxVehicles: "",
        isActive: true,
    })
    const [saving, setSaving] = useState(false)

    const loadStations = async () => {
        setLoading(true)
        setError("")
        try {
            const res = (await adminApi.getStations()) as any
            const payload = res?.data ?? res
            const list = Array.isArray(payload?.stations) ? payload.stations : Array.isArray(payload) ? payload : []
            setStations(list)
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "Failed to load stations")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void loadStations()
    }, [])

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase()
        if (!term) return stations
        return stations.filter((s) =>
            [s.name, s.address, s.city, s.state].some((v) => String(v || "").toLowerCase().includes(term)),
        )
    }, [stations, search])

    const openEdit = (s: StationRow) => {
        setEditing(s)
        setEditForm({
            name: s.name || "",
            address: s.address || "",
            city: s.city || "",
            state: s.state || "",
            parkingType: String(s.parkingType || "OPEN").toUpperCase(),
            maxVehicles: s.maxVehicles != null ? String(s.maxVehicles) : "",
            isActive: s.isActive !== false,
        })
    }

    const closeEdit = () => {
        setEditing(null)
        setSaving(false)
    }

    const handleSave = async () => {
        if (!editing) return
        const maxNumber = Number(editForm.maxVehicles)
        if (!editForm.maxVehicles.trim() || !Number.isInteger(maxNumber) || maxNumber < 1) {
            setError("Max Scooty is required and must be a positive whole number.")
            return
        }
        setSaving(true)
        setError("")
        try {
            const res = (await adminApi.updateStation(editing._id, {
                name: editForm.name.trim(),
                address: editForm.address.trim(),
                city: editForm.city.trim(),
                state: editForm.state.trim(),
                parkingType: editForm.parkingType,
                maxVehicles: maxNumber,
                isActive: editForm.isActive,
            })) as any
            if (res?.code === 1 || res?.success) {
                setSuccess(res?.message || "Station updated")
                closeEdit()
                void loadStations()
            } else {
                setError(res?.message || "Failed to update station")
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "Failed to update station")
        } finally {
            setSaving(false)
        }
    }

    return (
        <MainLayout>
            {success && (
                <div className="fixed right-6 top-20 z-50">
                    <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 shadow-lg">
                        <CheckCircle2 size={18} className="mt-0.5 text-emerald-600" />
                        <div>
                            <p className="text-sm font-bold text-emerald-800">Saved</p>
                            <p className="text-xs font-medium text-emerald-700/90">{success}</p>
                        </div>
                        <button onClick={() => setSuccess("")} className="ml-2 text-xs font-bold text-emerald-700">
                            Dismiss
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Stations</h2>
                        <p className="text-sm text-slate-500 mt-1">Manage stations and their scooty capacity.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search stations..."
                                className="w-64 rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm font-medium outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                            />
                        </div>
                        <button
                            onClick={() => void loadStations()}
                            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 hover:bg-slate-50"
                            title="Refresh"
                        >
                            <RefreshCw size={16} className={loading ? "animate-spin text-orange-500" : ""} />
                        </button>
                        <button
                            onClick={() => navigate("/admin/stations/add")}
                            className="flex items-center gap-2 rounded-xl bg-[#FF6A1F] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-orange-600"
                        >
                            <Plus size={16} />
                            Add Station
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                        {error}
                    </div>
                )}

                <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50">
                            <tr className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                <th className="px-6 py-3">Station</th>
                                <th className="px-6 py-3">Location</th>
                                <th className="px-6 py-3">Parking</th>
                                <th className="px-6 py-3">Capacity</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center">
                                        <div className="inline-flex items-center gap-2 text-slate-500">
                                            <Loader2 size={16} className="animate-spin" /> Loading stations…
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-500">
                                        {search ? "No stations match your search." : "No stations yet."}
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((s) => {
                                    const max = Number(s.maxVehicles || 0)
                                    const occ = Number(s.occupiedVehicles || 0)
                                    const usagePct = max > 0 ? Math.min(100, Math.round((occ / max) * 100)) : 0
                                    const isFull = s.isFull === true
                                    return (
                                        <tr key={s._id} className="border-t border-slate-100 text-sm">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                                                        <Building2 size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">{s.name || "—"}</p>
                                                        <p className="text-xs font-medium text-slate-500">{s.address || ""}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {[s.city, s.state].filter(Boolean).join(", ") || "—"}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {String(s.parkingType || "OPEN").toUpperCase()}
                                            </td>
                                            <td className="px-6 py-4">
                                                {max > 0 ? (
                                                    <div className="space-y-1.5">
                                                        <div className="flex items-baseline gap-1">
                                                            <span className={`text-sm font-bold ${isFull ? "text-rose-600" : "text-slate-900"}`}>
                                                                {occ}
                                                            </span>
                                                            <span className="text-xs font-medium text-slate-400">/ {max}</span>
                                                            {isFull && (
                                                                <span className="ml-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-600">
                                                                    Full
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-slate-100">
                                                            <div
                                                                className={`h-full rounded-full ${isFull ? "bg-rose-500" : usagePct > 75 ? "bg-orange-500" : "bg-emerald-500"}`}
                                                                style={{ width: `${usagePct}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs font-medium text-slate-400">No cap set</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                                                        s.isActive === false
                                                            ? "bg-slate-100 text-slate-500"
                                                            : "bg-emerald-50 text-emerald-700"
                                                    }`}
                                                >
                                                    {s.isActive === false ? "Inactive" : "Active"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => openEdit(s)}
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                                                >
                                                    <Pencil size={12} />
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {editing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
                    <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <div className="border-b border-slate-100 px-6 py-4">
                            <h3 className="text-lg font-bold text-slate-900">Edit Station</h3>
                            <p className="text-xs font-medium text-slate-500">{editing.name}</p>
                        </div>
                        <div className="space-y-4 px-6 py-5">
                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">Name</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm font-medium outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">Address</label>
                                <input
                                    type="text"
                                    value={editForm.address}
                                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm font-medium outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">City</label>
                                    <input
                                        type="text"
                                        value={editForm.city}
                                        onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm font-medium outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">State</label>
                                    <input
                                        type="text"
                                        value={editForm.state}
                                        onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm font-medium outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">Parking Type</label>
                                    <select
                                        value={editForm.parkingType}
                                        onChange={(e) => setEditForm({ ...editForm, parkingType: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm font-medium outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                                    >
                                        <option value="OPEN">OPEN</option>
                                        <option value="COVERED">COVERED</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Max Scooty <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        inputMode="numeric"
                                        min={1}
                                        step={1}
                                        value={editForm.maxVehicles}
                                        onChange={(e) => {
                                            const next = e.target.value.replace(/[^0-9]/g, "")
                                            setEditForm({ ...editForm, maxVehicles: next })
                                        }}
                                        className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm font-medium outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                                    />
                                </div>
                            </div>
                            <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={editForm.isActive}
                                    onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                                    className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500/20"
                                />
                                Active Station
                            </label>
                        </div>
                        <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50 px-6 py-3">
                            <button
                                onClick={closeEdit}
                                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => void handleSave()}
                                disabled={saving}
                                className="inline-flex items-center gap-2 rounded-lg bg-[#FF6A1F] px-4 py-2 text-xs font-bold text-white hover:bg-orange-600 disabled:opacity-60"
                            >
                                {saving ? <Loader2 size={12} className="animate-spin" /> : null}
                                {saving ? "Saving…" : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    )
}
