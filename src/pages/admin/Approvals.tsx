import { ClipboardCheck, RefreshCw, CheckCircle, XCircle } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import MainLayout from "../../layouts/MainLayout"
import { adminApi } from "../../services/adminApi"

type ApprovalTab = "ride-plans" | "faqs"

function unwrapList(payload: any): any[] {
    if (!payload) return []
    if (Array.isArray(payload)) return payload
    if (Array.isArray(payload?.data)) return payload.data
    if (Array.isArray(payload?.ridePlans)) return payload.ridePlans
    if (Array.isArray(payload?.faqs)) return payload.faqs
    if (Array.isArray(payload?.items)) return payload.items
    return []
}

export default function Approvals() {
    const [activeTab, setActiveTab] = useState<ApprovalTab>("ride-plans")
    const [loading, setLoading] = useState(true)
    const [items, setItems] = useState<any[]>([])
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

    const fetchData = async () => {
        setLoading(true)
        try {
            const res =
                activeTab === "ride-plans"
                    ? await adminApi.getRidePlans({ status: "PENDING" })
                    : await adminApi.getFaqs({ status: "PENDING" })
            const payload = (res as any)?.data ?? res
            setItems(unwrapList(payload))
        } catch (err) {
            console.error("Failed to fetch approvals:", err)
            setItems([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab])

    const title = useMemo(() => (activeTab === "ride-plans" ? "Ride Plans" : "FAQs"), [activeTab])

    const review = async (id: string, status: "APPROVED" | "REJECTED") => {
        setActionLoadingId(id)
        try {
            if (activeTab === "ride-plans") {
                await adminApi.reviewRidePlan(id, status === "APPROVED" ? { status: "APPROVED" } : { status: "REJECTED" })
            } else {
                await adminApi.reviewFaq(id, status === "APPROVED" ? { status: "APPROVED" } : { status: "REJECTED" })
            }
            await fetchData()
        } catch (err) {
            console.error("Failed to review item:", err)
        } finally {
            setActionLoadingId(null)
        }
    }

    return (
        <MainLayout>
            <div className="space-y-8 max-w-[1500px] font-['Poppins']">
                <div className="flex items-end justify-between">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Pending Approvals</h2>
                        <p className="text-slate-500 text-sm font-medium">Review and approve content before it goes live</p>
                    </div>
                    {loading ? <RefreshCw className="animate-spin text-orange-600 mb-1" size={20} /> : null}
                </div>

                <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm w-fit">
                    <button
                        onClick={() => setActiveTab("ride-plans")}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            activeTab === "ride-plans" ? "bg-orange-600 text-white shadow-lg shadow-orange-100" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                        }`}
                    >
                        <ClipboardCheck size={18} />
                        Ride Plans
                    </button>
                    <button
                        onClick={() => setActiveTab("faqs")}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            activeTab === "faqs" ? "bg-orange-600 text-white shadow-lg shadow-orange-100" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                        }`}
                    >
                        <ClipboardCheck size={18} />
                        FAQs
                    </button>
                </div>

                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
                        <div className="text-sm font-bold text-slate-800">{title}</div>
                        <button
                            onClick={fetchData}
                            className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-2"
                        >
                            <RefreshCw size={14} />
                            Refresh
                        </button>
                    </div>

                    {items.length === 0 && !loading ? (
                        <div className="py-20 text-center text-slate-400 font-medium">No pending {activeTab === "ride-plans" ? "ride plans" : "FAQs"}.</div>
                    ) : (
                        <div className="divide-y">
                            {items.map((item) => {
                                const id = String(item?._id || item?.id || "")
                                const heading = item?.title || item?.question || item?.name || "—"
                                const sub = item?.description || item?.answer || item?.summary || ""
                                const disabled = actionLoadingId === id
                                return (
                                    <div key={id} className="px-6 py-5 flex items-start justify-between gap-6 hover:bg-slate-50/30">
                                        <div className="min-w-0">
                                            <div className="text-sm font-bold text-slate-900 truncate">{heading}</div>
                                            {sub ? <div className="text-xs text-slate-500 font-medium mt-1 line-clamp-2">{sub}</div> : null}
                                        </div>
                                        <div className="shrink-0 flex items-center gap-2">
                                            <button
                                                onClick={() => review(id, "APPROVED")}
                                                disabled={disabled}
                                                className="px-4 h-10 rounded-xl bg-emerald-600 text-white text-xs font-extrabold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all disabled:opacity-70 flex items-center gap-2"
                                            >
                                                {disabled ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => review(id, "REJECTED")}
                                                disabled={disabled}
                                                className="px-4 h-10 rounded-xl bg-rose-600 text-white text-xs font-extrabold shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all disabled:opacity-70 flex items-center gap-2"
                                            >
                                                {disabled ? <RefreshCw size={14} className="animate-spin" /> : <XCircle size={14} />}
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    )
}

