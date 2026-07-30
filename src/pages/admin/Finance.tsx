import { RefreshCw, DollarSign, Wallet, ArrowUpRight, ArrowDownLeft, FileText, Settings, BadgePercent, Coins, Plus, X } from "lucide-react"
import { useState, useEffect } from "react"
import MainLayout from "../../layouts/MainLayout"
import PrimaryButton from "../../components/PrimaryButton"
import { adminApi } from "../../services/adminApi"

type FinanceTab = 'pricing' | 'commission' | 'settlements' | 'ledger' | 'transactions'

export default function Finance() {
    const [activeTab, setActiveTab] = useState<FinanceTab>('pricing')
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any>(null)

    const fetchData = async () => {
        setLoading(true)
        try {
            let res;
            if (activeTab === 'pricing') res = await adminApi.getPricing()
            else if (activeTab === 'commission') res = await adminApi.getCommission()
            else if (activeTab === 'settlements') res = await adminApi.getSettlements()
            else if (activeTab === 'transactions') res = await adminApi.getTransactions()
            else if (activeTab === 'ledger') res = await adminApi.getLedger()

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
        { id: 'pricing', label: 'Pricing Plans', icon: <DollarSign size={18} /> },
        { id: 'commission', label: 'Commission Settings', icon: <BadgePercent size={18} /> },
        { id: 'settlements', label: 'Settlements', icon: <Coins size={18} /> },
        { id: 'transactions', label: 'Transactions', icon: <Wallet size={18} /> },
        { id: 'ledger', label: 'Ledger', icon: <FileText size={18} /> },
    ]

    return (
        <MainLayout>
            <div className="space-y-8">
                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Finance Control Panel</h2>
                        <p className="text-slate-500 text-sm font-medium">Configure rates, commissions, and track all transactions</p>
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

                    {activeTab === 'pricing' && <PricingView data={data} onRefresh={fetchData} />}
                    {activeTab === 'commission' && <CommissionView data={data} onRefresh={fetchData} />}
                    {activeTab === 'settlements' && <SettlementsView data={data} onRefresh={fetchData} />}
                    {activeTab === 'transactions' && <TransactionsView data={data} />}
                    {activeTab === 'ledger' && <LedgerView data={data} />}
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

function PricingView({ data, onRefresh }: { data: any; onRefresh: () => void }) {
    const pricing = data?.pricing ?? (Array.isArray(data) ? null : data)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")
    const [form, setForm] = useState<Record<string, string>>({})

    const openEdit = () => {
        setError("")
        setForm({
            currency: String(pricing?.currency ?? 'INR'),
            baseFarePerHour: String(pricing?.baseFarePerHour ?? 0),
            baseFarePerDay: String(pricing?.baseFarePerDay ?? 0),
            securityDepositDefault: String(pricing?.securityDepositDefault ?? 0),
            convenienceFeePercent: String(pricing?.convenienceFeePercent ?? 0),
            minimumConvenienceFee: String(pricing?.minimumConvenienceFee ?? 0),
            taxPercent: String(pricing?.taxPercent ?? 0),
            penaltySlabs: String(pricing?.penaltySlabs ?? 0),
        })
        setIsEditOpen(true)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSaving(true)
        try {
            const payload: Record<string, any> = { currency: form.currency }
            PRICING_FIELDS.forEach(({ key }) => {
                payload[key] = Number(form[key] || 0)
            })
            const response = await adminApi.updatePricing(payload)
            const code = (response as any)?.code
            if (code !== undefined && code !== 1) {
                setError((response as any)?.message || "Failed to update pricing")
            } else {
                setIsEditOpen(false)
                onRefresh()
            }
        } catch (err: any) {
            console.error("Failed to update pricing:", err)
            setError(err?.response?.data?.message || "Failed to update pricing")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {pricing ? (
                <>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <div className="bg-blue-50 p-2.5 rounded-2xl">
                                <DollarSign className="text-blue-600" size={24} />
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{pricing.currency || "INR"}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-500">Base Fare (Per Hour)</h4>
                        <div className="text-3xl font-black text-slate-900 mt-2">₹{pricing.baseFarePerHour ?? pricing.hourlyRate ?? 0}</div>
                        <div className="text-xs text-slate-400 font-medium mt-2">Convenience Fee: {pricing.convenienceFeePercent ?? 0}% (min ₹{pricing.minimumConvenienceFee ?? 0})</div>
                        <button onClick={openEdit} className="w-full mt-6 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-2xl transition-all text-sm">Edit Plan</button>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <div className="bg-blue-50 p-2.5 rounded-2xl">
                                <DollarSign className="text-blue-600" size={24} />
                            </div>
                        </div>
                        <h4 className="text-sm font-bold text-slate-500">Base Fare (Per Day)</h4>
                        <div className="text-3xl font-black text-slate-900 mt-2">₹{pricing.baseFarePerDay ?? pricing.dailyRate ?? 0}</div>
                        <div className="text-xs text-slate-400 font-medium mt-2">Tax: {pricing.taxPercent ?? 0}%</div>
                        <button onClick={openEdit} className="w-full mt-6 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-2xl transition-all text-sm">Edit Plan</button>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <div className="bg-blue-50 p-2.5 rounded-2xl">
                                <Wallet className="text-blue-600" size={24} />
                            </div>
                        </div>
                        <h4 className="text-sm font-bold text-slate-500">Security Deposit</h4>
                        <div className="text-3xl font-black text-slate-900 mt-2">₹{pricing.securityDepositDefault ?? pricing.securityDeposit ?? 0}</div>
                        <div className="text-xs text-slate-400 font-medium mt-2">Penalty: ₹{pricing.penaltySlabs ?? 0}/min after grace</div>
                        <button onClick={openEdit} className="w-full mt-6 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-2xl transition-all text-sm">Edit Plan</button>
                    </div>
                </>
            ) : <div className="col-span-full py-10 text-center text-slate-400">No pricing data found</div>}

            {/* Edit Pricing Modal */}
            {isEditOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-xl rounded-3xl p-10 shadow-2xl shadow-slate-900/40 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-slate-900">Edit Pricing Plan</h2>
                            <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={22} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5">Currency</label>
                                <input
                                    type="text"
                                    value={form.currency || ''}
                                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {PRICING_FIELDS.map(({ key, label }) => (
                                    <div key={key}>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5">{label}</label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={form[key] || ''}
                                            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10"
                                        />
                                    </div>
                                ))}
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
                                <PrimaryButton type="submit" disabled={saving} className="px-8 py-3.5 text-sm">
                                    {saving && <RefreshCw size={16} className="animate-spin" />}
                                    Save Pricing
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

function CommissionView({ data, onRefresh }: { data: any; onRefresh: () => void }) {
    const commission = data?.commission ?? data
    const platformCommissionPercent = commission?.platformCommissionPercent ?? commission?.platformCommission ?? commission?.platformFee ?? 0
    const ownerSharePercent = commission?.ownerSharePercent ?? commission?.ownerShare ?? 0
    const franchiseSharePercent = commission?.franchiseSharePercent ?? commission?.stationCommission ?? 0

    const [isEditOpen, setIsEditOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")
    const [form, setForm] = useState({ platformCommissionPercent: '0', ownerSharePercent: '0', franchiseSharePercent: '0' })

    const openEdit = () => {
        setError("")
        setForm({
            platformCommissionPercent: String(platformCommissionPercent),
            ownerSharePercent: String(ownerSharePercent),
            franchiseSharePercent: String(franchiseSharePercent),
        })
        setIsEditOpen(true)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSaving(true)
        try {
            const response = await adminApi.updateCommission({
                platformCommissionPercent: Number(form.platformCommissionPercent || 0),
                ownerSharePercent: Number(form.ownerSharePercent || 0),
                franchiseSharePercent: Number(form.franchiseSharePercent || 0),
            })
            const code = (response as any)?.code
            if (code !== undefined && code !== 1) {
                setError((response as any)?.message || "Failed to update commissions")
            } else {
                setIsEditOpen(false)
                onRefresh()
            }
        } catch (err: any) {
            console.error("Failed to update commissions:", err)
            setError(err?.response?.data?.message || "Failed to update commissions")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 max-w-2xl mx-auto">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Global Commission Settings</h3>
            <div className="space-y-6">
                <div className="p-6 bg-orange-50/50 border border-orange-100 rounded-2xl flex justify-between items-center">
                    <div>
                        <h4 className="text-sm font-bold text-orange-900 uppercase tracking-wide">Platform Fee</h4>
                        <p className="text-xs text-orange-700/60 font-medium font-['Poppins']">Main admin percentage on each ride revenue</p>
                    </div>
                    <div className="text-3xl font-black text-orange-600">{platformCommissionPercent}%</div>
                </div>
                <div className="p-6 bg-green-50/50 border border-green-100 rounded-2xl flex justify-between items-center">
                    <div>
                        <h4 className="text-sm font-bold text-green-900 uppercase tracking-wide">Owner Share</h4>
                        <p className="text-xs text-green-700/60 font-medium font-['Poppins']">Percentage allocated to owners</p>
                    </div>
                    <div className="text-3xl font-black text-green-600">{ownerSharePercent}%</div>
                </div>
                <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-2xl flex justify-between items-center">
                    <div>
                        <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wide">Franchise/Station Share</h4>
                        <p className="text-xs text-blue-700/60 font-medium font-['Poppins']">Percentage allocated to franchise/station admins</p>
                    </div>
                    <div className="text-3xl font-black text-blue-600">{franchiseSharePercent}%</div>
                </div>
                <PrimaryButton className="w-full py-4" onClick={openEdit}>
                    <Settings size={18} />
                    Update Commissions
                </PrimaryButton>
            </div>

            {/* Edit Commission Modal */}
            {isEditOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-3xl p-10 shadow-2xl shadow-slate-900/40 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-slate-900">Update Commissions</h2>
                            <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={22} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5">Platform Fee (%)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={form.platformCommissionPercent}
                                    onChange={(e) => setForm({ ...form, platformCommissionPercent: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5">Owner Share (%)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={form.ownerSharePercent}
                                    onChange={(e) => setForm({ ...form, ownerSharePercent: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5">Franchise/Station Share (%)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={form.franchiseSharePercent}
                                    onChange={(e) => setForm({ ...form, franchiseSharePercent: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10"
                                />
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
                                <PrimaryButton type="submit" disabled={saving} className="px-8 py-3.5 text-sm">
                                    {saving && <RefreshCw size={16} className="animate-spin" />}
                                    Save Commissions
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

function LedgerView({ data }: { data: any }) {
    const entries: any[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.entries)
        ? data.entries
        : Array.isArray(data?.ledger)
        ? data.ledger
        : Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data?.data)
        ? data.data
        : []
    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b">
                    <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Transaction ID</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Source</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Amount</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {entries.length > 0 ? entries.map((tx: any) => (
                        <tr key={tx._id || tx.id || tx.transactionId} className="hover:bg-slate-50/30">
                            <td className="px-6 py-4 text-xs font-bold text-slate-400">#{tx._id || tx.id || tx.transactionId || "â€”"}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    {String(tx.type || tx.direction || '').toLowerCase() === 'credit' ? <ArrowDownLeft size={16} className="text-green-500" /> : <ArrowUpRight size={16} className="text-rose-500" />}
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-700">{tx.sourceType || tx.entityType || tx.refType || tx.type || "â€”"}</span>
                                        <span className="text-[10px] font-bold text-slate-400">{tx.sourceId || tx.entityId || tx.refId || "â€”"}</span>
                                    </div>
                                </div>
                            </td>
                            <td className={`px-6 py-4 font-black ${String(tx.type || tx.direction || '').toLowerCase() === 'credit' ? 'text-green-600' : 'text-slate-800'}`}>₹{tx.amount ?? tx.netAmount ?? 0}</td>
                            <td className="px-6 py-4 text-xs text-slate-400 font-bold">{new Date(tx.createdAt || tx.date || Date.now()).toLocaleString()}</td>
                            <td className="px-6 py-4">
                                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full">{tx.status || tx.state || "Success"}</span>
                            </td>
                        </tr>
                    )) : <tr><td colSpan={5} className="py-20 text-center text-slate-400 font-medium">No ledger records found</td></tr>}
                </tbody>
            </table>
        </div>
    )
}
