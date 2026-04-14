import { Search, RefreshCw, DollarSign, Wallet, ArrowUpRight, ArrowDownLeft, FileText, Settings, BadgePercent, Coins } from "lucide-react"
import { useState, useEffect } from "react"
import MainLayout from "../../layouts/MainLayout"
import { adminApi } from "../../services/adminApi"

type FinanceTab = 'pricing' | 'commission' | 'settlements' | 'ledger'

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

                    {activeTab === 'pricing' && <PricingView data={data} />}
                    {activeTab === 'commission' && <CommissionView data={data} />}
                    {activeTab === 'settlements' && <SettlementsView data={data} />}
                    {activeTab === 'ledger' && <LedgerView data={data} />}
                </div>
            </div>
        </MainLayout>
    )
}

function PricingView({ data }: { data: any }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.isArray(data) ? data.map((plan: any) => (
                <div key={plan.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-orange-200 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-blue-50 p-2.5 rounded-2xl">
                            <DollarSign className="text-blue-600" size={24} />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{plan.type || 'Standard'}</span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-800">{plan.name}</h4>
                    <p className="text-2xl font-black text-orange-600 mt-2">₹{plan.rate}<span className="text-xs text-slate-400 font-bold ml-1">/ {plan.unit || 'hr'}</span></p>
                    <div className="mt-6 space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-400">Security Deposit</span>
                            <span className="text-slate-800 font-bold">₹{plan.deposit || 0}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-400">Grace Period</span>
                            <span className="text-slate-800 font-bold">{plan.gracePeriod || 0} mins</span>
                        </div>
                    </div>
                    <button className="w-full mt-6 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-2xl transition-all text-sm">Edit Plan</button>
                </div>
            )) : <div className="col-span-full py-10 text-center text-slate-400">No pricing plans found</div>}
        </div>
    )
}

function CommissionView({ data }: { data: any }) {
    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 max-w-2xl mx-auto">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Global Commission Settings</h3>
            <div className="space-y-6">
                <div className="p-6 bg-orange-50/50 border border-orange-100 rounded-2xl flex justify-between items-center">
                    <div>
                        <h4 className="text-sm font-bold text-orange-900 uppercase tracking-wide">Platform Fee</h4>
                        <p className="text-xs text-orange-700/60 font-medium font-['Poppins']">Main admin percentage on each ride revenue</p>
                    </div>
                    <div className="text-3xl font-black text-orange-600">{data?.platformFee || 15}%</div>
                </div>
                <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-2xl flex justify-between items-center">
                    <div>
                        <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wide">Station Admin Commission</h4>
                        <p className="text-xs text-blue-700/60 font-medium font-['Poppins']">Percentage allocated to station administrators</p>
                    </div>
                    <div className="text-3xl font-black text-blue-600">{data?.stationCommission || 85}%</div>
                </div>
                <button className="w-full py-4 bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-100 hover:bg-orange-700 transition-all flex items-center justify-center gap-2">
                    <Settings size={18} />
                    Update Commissions
                </button>
            </div>
        </div>
    )
}

function SettlementsView({ data }: { data: any }) {
    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b">
                    <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Station Admin</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Pending Amount</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Last Settlement</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {Array.isArray(data) ? data.map((item: any) => (
                        <tr key={item.id} className="hover:bg-slate-50/30">
                            <td className="px-6 py-4 font-bold text-slate-800">{item.adminName || 'Admin'}</td>
                            <td className="px-6 py-4 text-orange-600 font-extrabold text-lg">₹{item.pendingAmount || 0}</td>
                            <td className="px-6 py-4 text-slate-500 text-sm font-medium">{item.lastSettlement || 'Never'}</td>
                            <td className="px-6 py-4 text-right">
                                <button className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-green-100 hover:bg-green-700 transition-all">Settle Now</button>
                            </td>
                        </tr>
                    )) : <tr><td colSpan={4} className="py-20 text-center text-slate-400">No pending settlements</td></tr>}
                </tbody>
            </table>
        </div>
    )
}

function LedgerView({ data }: { data: any }) {
    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b">
                    <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Transaction ID</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Type</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Amount</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {Array.isArray(data) ? data.map((tx: any) => (
                        <tr key={tx.id} className="hover:bg-slate-50/30">
                            <td className="px-6 py-4 text-xs font-bold text-slate-400">#{tx.id}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    {tx.type === 'credit' ? <ArrowDownLeft size={16} className="text-green-500" /> : <ArrowUpRight size={16} className="text-rose-500" />}
                                    <span className="text-sm font-bold text-slate-700 capitalize">{tx.type}</span>
                                </div>
                            </td>
                            <td className={`px-6 py-4 font-black ${tx.type === 'credit' ? 'text-green-600' : 'text-slate-800'}`}>₹{tx.amount}</td>
                            <td className="px-6 py-4 text-xs text-slate-400 font-bold">{new Date(tx.date).toLocaleDateString()}</td>
                            <td className="px-6 py-4">
                                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full">Success</span>
                            </td>
                        </tr>
                    )) : <tr><td colSpan={5} className="py-20 text-center text-slate-400 font-medium">No ledger records found</td></tr>}
                </tbody>
            </table>
        </div>
    )
}
