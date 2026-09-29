import { RefreshCw, Wallet, Settings, BadgePercent, Coins, Plus, X } from "lucide-react"
import { useState, useEffect } from "react"
import MainLayout from "../../layouts/MainLayout"
import PrimaryButton from "../../components/PrimaryButton"
import { adminApi } from "../../services/adminApi"

type FinanceTab = 'commission' | 'settlements' | 'transactions'

export default function Finance() {
    const [activeTab, setActiveTab] = useState<FinanceTab>('commission')
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any>(null)

    const fetchData = async () => {
        setLoading(true)
        try {
            let res;
            if (activeTab === 'commission') res = await adminApi.getCommission()
            else if (activeTab === 'settlements') res = await adminApi.getSettlements()
            else if (activeTab === 'transactions') res = await adminApi.getTransactions()

            setData((res as any).data || res)
        } catch (error) {
            console.error(`Failed to fetch ${activeTab} data:`, error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [activeTab])

    const tabs: { id: FinanceTab, label: string, icon: any }[] = [
        { id: 'commission', label: 'Commission Settings', icon: <BadgePercent size={18} /> },
        { id: 'settlements', label: 'Settlements', icon: <Coins size={18} /> },
        { id: 'transactions', label: 'Transactions', icon: <Wallet size={18} /> },
    ]

    return (
        <MainLayout>
            <div className="space-y-8">
                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Finance Control Panel</h2>
                        <p className="text-slate-500 text-sm font-medium">Manage the commission plan, settlements and transactions</p>
                    </div>
                    {loading && <RefreshCw className="animate-spin text-orange-600 mb-2" size={20} />}
                </div>

                <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-100'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="min-h-[500px] relative">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50 rounded-3xl z-10">
                            <RefreshCw className="animate-spin text-orange-600" size={32} />
                        </div>
                    ) : null}

                    {activeTab === 'commission' && <CommissionView data={data} onRefresh={fetchData} />}
                    {activeTab === 'settlements' && <SettlementsView data={data} onRefresh={fetchData} />}
                    {activeTab === 'transactions' && <TransactionsView data={data} />}
                </div>
            </div>
        </MainLayout>
    )
}

function TransactionsView({ data }: { data: any }) {
    const transactions: any[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.transactions)
        ? data.transactions
        : Array.isArray(data?.data?.transactions)
        ? data.data.transactions
        : Array.isArray(data?.items)
        ? data.items
        : []

    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b">
                    <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">ID</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Type</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Amount</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">User</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {transactions.length > 0 ? transactions.map((tx: any) => {
                        const id = tx?._id || tx?.id || tx?.transactionId
                        const type = tx?.type || tx?.method || tx?.sourceType || "—"
                        const amount = tx?.amount ?? tx?.netAmount ?? 0
                        const user = tx?.userId?.name || tx?.user?.name || tx?.userId || "—"
                        const date = tx?.createdAt || tx?.date || tx?.timestamp
                        const status = tx?.status || tx?.state || "—"
                        return (
                            <tr key={String(id)} className="hover:bg-slate-50/30">
                                <td className="px-6 py-4 text-xs font-bold text-slate-400">{id ? `#${id}` : "—"}</td>
                                <td className="px-6 py-4 text-sm font-bold text-slate-700">{String(type)}</td>
                                <td className="px-6 py-4 font-black text-slate-800">₹{amount}</td>
                                <td className="px-6 py-4 text-sm font-bold text-slate-700">{String(user)}</td>
                                <td className="px-6 py-4 text-xs text-slate-400 font-bold">{date ? new Date(date).toLocaleString() : "—"}</td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full">{String(status)}</span>
                                </td>
                            </tr>
                        )
                    }) : <tr><td colSpan={6} className="py-20 text-center text-slate-400 font-medium">No transactions found</td></tr>}
                </tbody>
            </table>
        </div>
    )
}

const PRICING_FIELDS: { key: string; label: string; suffix?: string }[] = [
    { key: 'baseFarePerHour', label: 'Base Fare Per Hour (₹)' },
    { key: 'baseFarePerDay', label: 'Base Fare Per Day (₹)' },
    { key: 'securityDepositDefault', label: 'Security Deposit (₹)' },
    { key: 'convenienceFeePercent', label: 'Convenience Fee (%)' },
    { key: 'minimumConvenienceFee', label: 'Minimum Convenience Fee (₹)' },
    { key: 'taxPercent', label: 'Tax (%)' },
    { key: 'penaltySlabs', label: 'Penalty Per Minute (₹)' },
]

type CommissionPlans = {
    slydoOwned: { adminPercent: number; stationPercent: number }
    ownerListed: { ownerPercent: number; adminPercent: number; stationPercent: number }
}

const num = (value: any, fallback: number) => {
    const n = Number(value)
    return Number.isFinite(n) ? n : fallback
}

// Reads the nested plans; falls back to the legacy flat keys for old responses.
const readCommissionPlans = (raw: any): CommissionPlans => {
    const c = raw?.commission ?? raw ?? {}
    return {
        slydoOwned: {
            adminPercent: num(c?.slydoOwned?.adminPercent, 20),
            stationPercent: num(c?.slydoOwned?.stationPercent, 80),
        },
        ownerListed: {
            ownerPercent: num(c?.ownerListed?.ownerPercent ?? c?.ownerSharePercent, 60),
            adminPercent: num(c?.ownerListed?.adminPercent ?? c?.platformCommissionPercent, 20),
            stationPercent: num(c?.ownerListed?.stationPercent ?? c?.franchiseSharePercent, 20),
        },
    }
}

const sumPct = (...parts: (string | number)[]) =>
    Math.round(parts.reduce((total: number, p) => total + num(p, 0), 0) * 100) / 100

function ShareRow({ label, hint, value, tone }: { label: string; hint: string; value: number; tone: 'orange' | 'green' | 'blue' }) {
    const tones = {
        orange: 'bg-orange-50/50 border-orange-100 text-orange-900 [&_p]:text-orange-700/60 [&_.v]:text-orange-600',
        green: 'bg-green-50/50 border-green-100 text-green-900 [&_p]:text-green-700/60 [&_.v]:text-green-600',
        blue: 'bg-blue-50/50 border-blue-100 text-blue-900 [&_p]:text-blue-700/60 [&_.v]:text-blue-600',
    }[tone]
    return (
        <div className={`p-5 border rounded-2xl flex justify-between items-center ${tones}`}>
            <div>
                <h4 className="text-sm font-bold uppercase tracking-wide">{label}</h4>
                <p className="text-xs font-medium font-['Poppins']">{hint}</p>
            </div>
            <div className="v text-3xl font-black">{value}%</div>
        </div>
    )
}

function PercentInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
    return (
        <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">{label}</label>
            <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10"
            />
        </div>
    )
}

// Commission plan per scooty ownership type. Both plans are edited here and
// applied by the backend when a ride completes (Slydo fleet vs. owner-listed).
function CommissionView({ data, onRefresh }: { data: any; onRefresh: () => void }) {
    const plans = readCommissionPlans(data)
    const updatedAt = (data?.commission ?? data)?.updatedAt

    const [isEditOpen, setIsEditOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")
    const [form, setForm] = useState({
        slydoAdmin: '20', slydoStation: '80',
        ownerOwner: '60', ownerAdmin: '20', ownerStation: '20',
    })

    const openEdit = () => {
        setError("")
        setForm({
            slydoAdmin: String(plans.slydoOwned.adminPercent),
            slydoStation: String(plans.slydoOwned.stationPercent),
            ownerOwner: String(plans.ownerListed.ownerPercent),
            ownerAdmin: String(plans.ownerListed.adminPercent),
            ownerStation: String(plans.ownerListed.stationPercent),
        })
        setIsEditOpen(true)
    }

    const slydoTotal = sumPct(form.slydoAdmin, form.slydoStation)
    const ownerTotal = sumPct(form.ownerOwner, form.ownerAdmin, form.ownerStation)
    const totalsOk = Math.abs(slydoTotal - 100) < 0.01 && Math.abs(ownerTotal - 100) < 0.01

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        if (!totalsOk) {
            setError("Each plan must add up to exactly 100%.")
            return
        }
        setSaving(true)
        try {
            const response = await adminApi.updateCommission({
                slydoOwned: {
                    adminPercent: num(form.slydoAdmin, 0),
                    stationPercent: num(form.slydoStation, 0),
                },
                ownerListed: {
                    ownerPercent: num(form.ownerOwner, 0),
                    adminPercent: num(form.ownerAdmin, 0),
                    stationPercent: num(form.ownerStation, 0),
                },
            })
            const code = (response as any)?.code
            if (code !== undefined && code !== 1) {
                setError((response as any)?.message || "Failed to update commission plan")
            } else {
                setIsEditOpen(false)
                onRefresh()
            }
        } catch (err: any) {
            console.error("Failed to update commission plan:", err)
            setError(err?.response?.data?.message || err?.message || "Failed to update commission plan")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                <h3 className="text-lg font-bold text-slate-800">Slydo-Owned Scooters</h3>
                <p className="text-xs text-slate-400 font-medium mb-6">Company fleet. Revenue is split between the Admin panel and the Station panel.</p>
                <div className="space-y-4">
                    <ShareRow label="Admin Panel" hint="Platform share of each completed ride" value={plans.slydoOwned.adminPercent} tone="orange" />
                    <ShareRow label="Station Panel" hint="Station share of each completed ride" value={plans.slydoOwned.stationPercent} tone="blue" />
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                <h3 className="text-lg font-bold text-slate-800">Owner-Listed Scooters</h3>
                <p className="text-xs text-slate-400 font-medium mb-6">Scooters listed by individual vehicle owners. Revenue is split three ways.</p>
                <div className="space-y-4">
                    <ShareRow label="Vehicle Owner" hint="Credited to the owner's wallet on ride completion" value={plans.ownerListed.ownerPercent} tone="green" />
                    <ShareRow label="Admin Panel" hint="Platform share of each completed ride" value={plans.ownerListed.adminPercent} tone="orange" />
                    <ShareRow label="Station Admin Panel" hint="Station share of each completed ride" value={plans.ownerListed.stationPercent} tone="blue" />
                </div>
            </div>

            <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <p className="text-xs text-slate-400 font-medium">
                    Applied to the ride fare (fare + convenience fee, minus discounts). Security deposit and GST are excluded.
                    {updatedAt ? ` Last updated ${new Date(updatedAt).toLocaleString()}.` : ""}
                </p>
                <PrimaryButton className="px-8 py-3.5" onClick={openEdit}>
                    <Settings size={18} />
                    Edit Commission Plan
                </PrimaryButton>
            </div>

            {isEditOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-3xl p-10 shadow-2xl shadow-slate-900/40 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-slate-900">Edit Commission Plan</h2>
                            <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={22} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-8">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-bold text-slate-800">Slydo-Owned Scooters</h4>
                                    <span className={`text-xs font-bold ${Math.abs(slydoTotal - 100) < 0.01 ? 'text-emerald-600' : 'text-rose-500'}`}>Total {slydoTotal}%</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <PercentInput label="Admin Panel (%)" value={form.slydoAdmin} onChange={(v) => setForm({ ...form, slydoAdmin: v })} />
                                    <PercentInput label="Station Panel (%)" value={form.slydoStation} onChange={(v) => setForm({ ...form, slydoStation: v })} />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-bold text-slate-800">Owner-Listed Scooters</h4>
                                    <span className={`text-xs font-bold ${Math.abs(ownerTotal - 100) < 0.01 ? 'text-emerald-600' : 'text-rose-500'}`}>Total {ownerTotal}%</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <PercentInput label="Vehicle Owner (%)" value={form.ownerOwner} onChange={(v) => setForm({ ...form, ownerOwner: v })} />
                                    <PercentInput label="Admin Panel (%)" value={form.ownerAdmin} onChange={(v) => setForm({ ...form, ownerAdmin: v })} />
                                    <PercentInput label="Station Admin Panel (%)" value={form.ownerStation} onChange={(v) => setForm({ ...form, ownerStation: v })} />
                                </div>
                            </div>
                            {error && <p className="text-xs font-bold text-rose-500">{error}</p>}
                            <div className="flex items-center justify-end gap-6 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditOpen(false)}
                                    disabled={saving}
                                    className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <PrimaryButton type="submit" disabled={saving || !totalsOk} className="px-8 py-3.5 text-sm">
                                    {saving && <RefreshCw size={16} className="animate-spin" />}
                                    Save Commission Plan
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

function SettlementsView({ data, onRefresh }: { data: any; onRefresh: () => void }) {
    const settlements: any[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.settlements)
        ? data.settlements
        : Array.isArray(data?.data?.settlements)
        ? data.data.settlements
        : []

    const [isAddOpen, setIsAddOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")
    const [owners, setOwners] = useState<any[]>([])
    const [form, setForm] = useState({ userId: '', amount: '', note: '' })

    const openAdd = async () => {
        setError("")
        setForm({ userId: '', amount: '', note: '' })
        setIsAddOpen(true)
        try {
            const response = await adminApi.getUsers({ role: 'OWNER', limit: 100 })
            const payload = (response as any)?.data ?? response
            const list = Array.isArray(payload) ? payload : (payload?.users || payload?.owners || [])
            setOwners(list)
        } catch (err) {
            console.error("Failed to fetch owners:", err)
            setOwners([])
        }
    }

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        if (!form.userId.trim()) {
            setError("User is required")
            return
        }
        if (!Number(form.amount) || Number(form.amount) <= 0) {
            setError("Amount must be greater than 0")
            return
        }
        setSaving(true)
        try {
            const response = await adminApi.addSettlement({
                userId: form.userId.trim(),
                amount: Number(form.amount),
                note: form.note.trim(),
            })
            const code = (response as any)?.code
            if (code !== undefined && code !== 1) {
                setError((response as any)?.message || "Failed to create settlement")
            } else {
                setIsAddOpen(false)
                onRefresh()
            }
        } catch (err: any) {
            console.error("Failed to create settlement:", err)
            setError(err?.response?.data?.message || "Failed to create settlement")
        } finally {
            setSaving(false)
        }
    }

    const markProcessing = async (settlementId: string) => {
        try {
            await adminApi.updateSettlementStatus(settlementId, { status: "PROCESSING" })
            onRefresh()
        } catch (err) {
            console.error("Failed to update settlement status:", err)
        }
    }
    return (
        <div className="space-y-4">
        <div className="flex justify-end">
            <PrimaryButton onClick={openAdd} className="px-6 py-3 text-sm">
                <Plus size={18} />
                Add Settlement
            </PrimaryButton>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b">
                    <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Owner</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Amount</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Created</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {settlements.length > 0 ? settlements.map((item: any) => (
                        <tr key={item._id || item.id} className="hover:bg-slate-50/30">
                            <td className="px-6 py-4">
                                <div className="font-bold text-slate-800">{item?.userId?.name || item?.owner?.name || "—"}</div>
                                <div className="text-xs text-slate-400 font-medium">{[item?.userId?.mobile || item?.userId?.phone, item?.userId?.email].filter(Boolean).join(" · ")}</div>
                            </td>
                            <td className="px-6 py-4 text-orange-600 font-extrabold text-lg">₹{item?.amount ?? 0}</td>
                            <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider ${String(item?.status || "").toUpperCase() === "PENDING" ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-700"}`}>
                                    {item?.status || "—"}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-slate-500 text-sm font-medium">
                                {item?.createdAt ? new Date(item.createdAt).toLocaleString() : "—"}
                            </td>
                            <td className="px-6 py-4 text-right">
                                {String(item?.status || "").toUpperCase() === "PENDING" ? (
                                    <button
                                        onClick={() => markProcessing(String(item?._id || item?.id))}
                                        className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-green-100 hover:bg-green-700 transition-all"
                                    >
                                        Mark Processing
                                    </button>
                                ) : (
                                    <span className="text-xs font-bold text-slate-400">—</span>
                                )}
                            </td>
                        </tr>
                    )) : <tr><td colSpan={5} className="py-20 text-center text-slate-400">No settlements found</td></tr>}
                </tbody>
            </table>
        </div>

        {/* Add Settlement Modal */}
        {isAddOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 animate-in fade-in duration-300">
                <div className="bg-white w-full max-w-md rounded-3xl p-10 shadow-2xl shadow-slate-900/40 animate-in zoom-in-95 duration-300">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-slate-900">Add Settlement</h2>
                        <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                            <X size={22} />
                        </button>
                    </div>
                    <form onSubmit={handleAdd} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1.5">Owner / User</label>
                            {owners.length > 0 ? (
                                <select
                                    value={form.userId}
                                    onChange={(e) => setForm({ ...form, userId: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 bg-white"
                                >
                                    <option value="">Select a user</option>
                                    {owners.map((o: any) => (
                                        <option key={o._id || o.id} value={o._id || o.id}>
                                            {o.name || o.email || o._id}{o.role ? ` (${o.role})` : ''}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    value={form.userId}
                                    onChange={(e) => setForm({ ...form, userId: e.target.value })}
                                    placeholder="User ID"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-300"
                                />
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1.5">Amount (₹)</label>
                            <input
                                type="number"
                                min="1"
                                step="0.01"
                                value={form.amount}
                                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                placeholder="0.00"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-300"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1.5">Note</label>
                            <input
                                type="text"
                                value={form.note}
                                onChange={(e) => setForm({ ...form, note: e.target.value })}
                                placeholder="Optional note"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-300"
                            />
                        </div>
                        {error && <p className="text-xs font-bold text-rose-500">{error}</p>}
                        <div className="flex items-center justify-end gap-6 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsAddOpen(false)}
                                disabled={saving}
                                className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <PrimaryButton type="submit" disabled={saving} className="px-8 py-3.5 text-sm">
                                {saving && <RefreshCw size={16} className="animate-spin" />}
                                Create Settlement
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        )}
        </div>
    )
}

