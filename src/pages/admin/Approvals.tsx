import { ClipboardCheck, RefreshCw, CheckCircle, XCircle, X, MapPin, Clock, IndianRupee, Tag, BadgeInfo, User, CalendarDays } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import MainLayout from "../../layouts/MainLayout"
import { adminApi } from "../../services/adminApi"

type ApprovalTab = "ride-plans" | "faqs"
type ViewMode = "pending" | "all"
type ReviewStatus = "APPROVED" | "REJECTED"

function unwrapList(payload: any): any[] {
    if (!payload) return []
    if (Array.isArray(payload)) return payload
    if (Array.isArray(payload?.data)) return payload.data
    if (Array.isArray(payload?.plans)) return payload.plans
    if (Array.isArray(payload?.data?.plans)) return payload.data.plans
    if (Array.isArray(payload?.ridePlans)) return payload.ridePlans
    if (Array.isArray(payload?.faqs)) return payload.faqs
    if (Array.isArray(payload?.items)) return payload.items
    return []
}

function isPendingStatus(value: unknown): boolean {
    const s = String(value ?? "").trim().toLowerCase()
    return s === "pending" || s === "pending_approval" || s === "awaiting_approval"
}

function formatDate(value: any): string {
    if (!value) return "—"
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return "—"
    return d.toLocaleString()
}

function money(value: any): string {
    const n = Number(value)
    if (!Number.isFinite(n)) return "—"
    return String(n)
}

function safeArray(value: any): any[] {
    return Array.isArray(value) ? value : []
}

export default function Approvals() {
    const [activeTab, setActiveTab] = useState<ApprovalTab>("ride-plans")
    const [viewMode, setViewMode] = useState<ViewMode>("pending")
    const [loading, setLoading] = useState(true)
    const [items, setItems] = useState<any[]>([])
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
    const [selected, setSelected] = useState<any | null>(null)
    const [rejectReason, setRejectReason] = useState("")

    const fetchData = async () => {
        setLoading(true)
        try {
            const wantsPending = viewMode === "pending"
            const params = wantsPending ? { status: "PENDING" } : undefined

            const res = activeTab === "ride-plans" ? await adminApi.getRidePlans(params) : await adminApi.getFaqs(params)
            const payload = (res as any)?.data ?? res
            const list = unwrapList(payload)

            if (!wantsPending) {
                setItems(list)
                return
            }

            if (list.length > 0) {
                setItems(list)
                return
            }

            // Fallback: some backends ignore/expect different status casing/keys.
            const resAll = activeTab === "ride-plans" ? await adminApi.getRidePlans() : await adminApi.getFaqs()
            const payloadAll = (resAll as any)?.data ?? resAll
            const listAll = unwrapList(payloadAll)
            setItems(listAll.filter((x) => isPendingStatus(x?.status)))
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
    }, [activeTab, viewMode])

    const title = useMemo(() => (activeTab === "ride-plans" ? "Ride Plans" : "FAQs"), [activeTab])

    const review = async (id: string, status: ReviewStatus, rejectionReason?: string) => {
        setActionLoadingId(id)
        try {
            if (activeTab === "ride-plans") {
                await adminApi.reviewRidePlan(id, status === "APPROVED" ? { status: "APPROVED" } : { status: "REJECTED", rejectionReason: rejectionReason || "" })
            } else {
                await adminApi.reviewFaq(id, status === "APPROVED" ? { status: "APPROVED" } : { status: "REJECTED", rejectionReason: rejectionReason || "" })
            }
            setSelected(null)
            setRejectReason("")
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
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-xl p-1">
                                <button
                                    onClick={() => setViewMode("pending")}
                                    className={`px-3 h-8 rounded-lg text-xs font-extrabold transition-all ${
                                        viewMode === "pending" ? "bg-orange-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                                    }`}
                                >
                                    Pending
                                </button>
                                <button
                                    onClick={() => setViewMode("all")}
                                    className={`px-3 h-8 rounded-lg text-xs font-extrabold transition-all ${
                                        viewMode === "all" ? "bg-orange-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                                    }`}
                                >
                                    All
                                </button>
                            </div>
                            <button onClick={fetchData} className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-2">
                                <RefreshCw size={14} />
                                Refresh
                            </button>
                        </div>
                    </div>

                    {items.length === 0 && !loading ? (
                        <div className="py-20 text-center text-slate-400 font-medium">
                            {viewMode === "pending" ? "No pending " : "No "}
                            {activeTab === "ride-plans" ? "ride plans" : "FAQs"}.
                        </div>
                    ) : (
                        <div className="divide-y">
                            {items.map((item) => {
                                const id = String(item?._id || item?.id || "")
                                const heading = item?.title || item?.question || item?.name || "—"
                                const sub = item?.description || item?.answer || item?.summary || ""
                                const status = String(item?.status ?? "")
                                const pending = isPendingStatus(status)
                                const disabled = actionLoadingId === id
                                const isPlan = activeTab === "ride-plans"
                                return (
                                    <div
                                        key={id}
                                        className="px-6 py-5 flex items-start justify-between gap-6 hover:bg-slate-50/30 cursor-pointer"
                                        onClick={() => setSelected(item)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") setSelected(item)
                                        }}
                                    >
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <div className="text-sm font-bold text-slate-900 truncate">{heading}</div>
                                                {status ? (
                                                    <span
                                                        className={`shrink-0 text-[10px] font-extrabold px-2 py-1 rounded-full border ${
                                                            pending ? "bg-orange-50 text-orange-700 border-orange-100" : "bg-slate-50 text-slate-600 border-slate-100"
                                                        }`}
                                                    >
                                                        {status}
                                                    </span>
                                                ) : null}
                                            </div>
                                            {sub ? <div className="text-xs text-slate-500 font-medium mt-1 line-clamp-2">{sub}</div> : null}
                                            {isPlan ? (
                                                <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-extrabold text-slate-500">
                                                    {item?.code ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-50 border border-slate-100">
                                                            <Tag size={12} />
                                                            {String(item.code)}
                                                        </span>
                                                    ) : null}
                                                    {item?.type ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-50 border border-slate-100">
                                                            <BadgeInfo size={12} />
                                                            {String(item.type)}
                                                        </span>
                                                    ) : null}
                                                    {item?.durationHours !== undefined ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-50 border border-slate-100">
                                                            <Clock size={12} />
                                                            {money(item.durationHours)}h
                                                        </span>
                                                    ) : null}
                                                    {item?.price !== undefined ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-50 border border-slate-100">
                                                            <IndianRupee size={12} />
                                                            {money(item.price)}
                                                        </span>
                                                    ) : null}
                                                </div>
                                            ) : null}
                                        </div>
                                        {pending ? (
                                            <div className="shrink-0 flex items-center gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        void review(id, "APPROVED")
                                                    }}
                                                    disabled={disabled}
                                                    className="px-4 h-10 rounded-xl bg-emerald-600 text-white text-xs font-extrabold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all disabled:opacity-70 flex items-center gap-2"
                                                >
                                                    {disabled ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setSelected(item)
                                                        setRejectReason(String(item?.rejectionReason || ""))
                                                    }}
                                                    disabled={disabled}
                                                    className="px-4 h-10 rounded-xl bg-rose-600 text-white text-xs font-extrabold shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all disabled:opacity-70 flex items-center gap-2"
                                                >
                                                    {disabled ? <RefreshCw size={14} className="animate-spin" /> : <XCircle size={14} />}
                                                    Reject
                                                </button>
                                            </div>
                                        ) : null}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {selected ? (
                <div className="fixed inset-0 z-40">
                    <div className="absolute inset-0 bg-slate-900/40" onClick={() => setSelected(null)} />
                    <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl border-l border-slate-100 animate-in slide-in-from-right duration-300">
                        <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <div className="text-xs font-extrabold tracking-wider text-slate-400 uppercase">Approval Details</div>
                                <div className="text-xl font-black text-slate-900 truncate">
                                    {activeTab === "ride-plans" ? (selected?.name || "Ride Plan") : (selected?.question || selected?.title || "Item")}
                                </div>
                                <div className="mt-1 text-xs font-semibold text-slate-500">
                                    Status: <span className="font-extrabold text-slate-700">{String(selected?.status || "—")}</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelected(null)}
                                className="p-2 rounded-2xl hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors"
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-5 space-y-5 overflow-y-auto h-[calc(100vh-168px)]">
                            {activeTab === "ride-plans" ? (
                                <>
                                    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-3">
                                        <div className="text-xs font-extrabold tracking-wide text-slate-600 uppercase">What to check</div>
                                        <ul className="text-xs font-semibold text-slate-600 list-disc pl-4 space-y-1">
                                            <li>Code unique & readable (ex: DAY_PASS)</li>
                                            <li>Type/duration/price make sense (no negative values)</li>
                                            <li>Description/perks are clean (no spam/abuse)</li>
                                            <li>Badge is short & meaningful (optional)</li>
                                        </ul>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="rounded-2xl border border-slate-100 p-4">
                                            <div className="text-[11px] font-extrabold tracking-wide text-slate-500 uppercase flex items-center gap-2">
                                                <Tag size={14} /> Code
                                            </div>
                                            <div className="mt-1 text-sm font-black text-slate-900">{selected?.code || "—"}</div>
                                        </div>
                                        <div className="rounded-2xl border border-slate-100 p-4">
                                            <div className="text-[11px] font-extrabold tracking-wide text-slate-500 uppercase flex items-center gap-2">
                                                <BadgeInfo size={14} /> Type
                                            </div>
                                            <div className="mt-1 text-sm font-black text-slate-900">{selected?.type || "—"}</div>
                                        </div>
                                        <div className="rounded-2xl border border-slate-100 p-4">
                                            <div className="text-[11px] font-extrabold tracking-wide text-slate-500 uppercase flex items-center gap-2">
                                                <Clock size={14} /> Duration
                                            </div>
                                            <div className="mt-1 text-sm font-black text-slate-900">{money(selected?.durationHours)}h</div>
                                        </div>
                                        <div className="rounded-2xl border border-slate-100 p-4">
                                            <div className="text-[11px] font-extrabold tracking-wide text-slate-500 uppercase flex items-center gap-2">
                                                <IndianRupee size={14} /> Price
                                            </div>
                                            <div className="mt-1 text-sm font-black text-slate-900">₹{money(selected?.price)}</div>
                                        </div>
                                        <div className="rounded-2xl border border-slate-100 p-4 col-span-2">
                                            <div className="text-[11px] font-extrabold tracking-wide text-slate-500 uppercase flex items-center gap-2">
                                                <IndianRupee size={14} /> Security Deposit
                                            </div>
                                            <div className="mt-1 text-sm font-black text-slate-900">₹{money(selected?.securityDeposit ?? 0)}</div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="text-[11px] font-extrabold tracking-wide text-slate-500 uppercase">Description</div>
                                        <div className="rounded-2xl border border-slate-100 p-4 text-sm font-semibold text-slate-700 whitespace-pre-wrap">
                                            {String(selected?.description || "—")}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="text-[11px] font-extrabold tracking-wide text-slate-500 uppercase">Perks</div>
                                        <div className="rounded-2xl border border-slate-100 p-4">
                                            {safeArray(selected?.perks).length ? (
                                                <ul className="text-sm font-semibold text-slate-700 list-disc pl-4 space-y-1">
                                                    {safeArray(selected?.perks).slice(0, 20).map((p: any, idx: number) => (
                                                        <li key={idx}>{String(p)}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div className="text-sm font-semibold text-slate-400">—</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="rounded-2xl border border-slate-100 p-4">
                                            <div className="text-[11px] font-extrabold tracking-wide text-slate-500 uppercase flex items-center gap-2">
                                                <BadgeInfo size={14} /> Badge
                                            </div>
                                            <div className="mt-1 text-sm font-black text-slate-900">{selected?.badge || "—"}</div>
                                        </div>
                                        <div className="rounded-2xl border border-slate-100 p-4">
                                            <div className="text-[11px] font-extrabold tracking-wide text-slate-500 uppercase flex items-center gap-2">
                                                <MapPin size={14} /> Station ID
                                            </div>
                                            <div className="mt-1 text-sm font-black text-slate-900">{selected?.stationId || "—"}</div>
                                        </div>
                                        <div className="rounded-2xl border border-slate-100 p-4">
                                            <div className="text-[11px] font-extrabold tracking-wide text-slate-500 uppercase flex items-center gap-2">
                                                <User size={14} /> Created By
                                            </div>
                                            <div className="mt-1 text-sm font-black text-slate-900">{selected?.createdBy || "—"}</div>
                                        </div>
                                        <div className="rounded-2xl border border-slate-100 p-4">
                                            <div className="text-[11px] font-extrabold tracking-wide text-slate-500 uppercase flex items-center gap-2">
                                                <CalendarDays size={14} /> Submitted
                                            </div>
                                            <div className="mt-1 text-sm font-black text-slate-900">{formatDate(selected?.createdAt)}</div>
                                        </div>
                                    </div>

                                    {String(selected?.status || "").toUpperCase() === "REJECTED" ? (
                                        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4">
                                            <div className="text-[11px] font-extrabold tracking-wide text-rose-700 uppercase">Rejection reason</div>
                                            <div className="mt-1 text-sm font-semibold text-rose-800 whitespace-pre-wrap">{String(selected?.rejectionReason || "—")}</div>
                                        </div>
                                    ) : null}
                                </>
                            ) : (
                                <>
                                    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-2">
                                        <div className="text-[11px] font-extrabold tracking-wide text-slate-500 uppercase">Question</div>
                                        <div className="text-sm font-black text-slate-900">{selected?.question || selected?.title || "—"}</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-[11px] font-extrabold tracking-wide text-slate-500 uppercase">Answer</div>
                                        <div className="rounded-2xl border border-slate-100 p-4 text-sm font-semibold text-slate-700 whitespace-pre-wrap">
                                            {String(selected?.answer || selected?.description || "—")}
                                        </div>
                                    </div>
                                    {String(selected?.status || "").toUpperCase() === "REJECTED" ? (
                                        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4">
                                            <div className="text-[11px] font-extrabold tracking-wide text-rose-700 uppercase">Rejection reason</div>
                                            <div className="mt-1 text-sm font-semibold text-rose-800 whitespace-pre-wrap">{String(selected?.rejectionReason || "—")}</div>
                                        </div>
                                    ) : null}
                                </>
                            )}

                            {isPendingStatus(selected?.status) ? (
                                <div className="rounded-2xl border border-slate-100 p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="text-[11px] font-extrabold tracking-wide text-slate-500 uppercase">Actions</div>
                                        <div className="text-[11px] font-semibold text-slate-400">Approve or reject</div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[11px] font-extrabold tracking-wide text-slate-500 uppercase">Rejection reason (optional)</label>
                                        <textarea
                                            value={rejectReason}
                                            onChange={(e) => setRejectReason(e.target.value)}
                                            placeholder="Write reason for rejection..."
                                            className="w-full min-h-20 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-300 resize-y"
                                        />
                                    </div>

                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => void review(String(selected?._id || selected?.id || ""), "APPROVED")}
                                            disabled={actionLoadingId === String(selected?._id || selected?.id || "")}
                                            className="px-4 h-10 rounded-xl bg-emerald-600 text-white text-xs font-extrabold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all disabled:opacity-70 flex items-center gap-2"
                                        >
                                            {actionLoadingId === String(selected?._id || selected?.id || "") ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                                            Approve
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => void review(String(selected?._id || selected?.id || ""), "REJECTED", rejectReason)}
                                            disabled={actionLoadingId === String(selected?._id || selected?.id || "")}
                                            className="px-4 h-10 rounded-xl bg-rose-600 text-white text-xs font-extrabold shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all disabled:opacity-70 flex items-center gap-2"
                                        >
                                            {actionLoadingId === String(selected?._id || selected?.id || "") ? <RefreshCw size={14} className="animate-spin" /> : <XCircle size={14} />}
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            ) : null}
        </MainLayout>
    )
}
