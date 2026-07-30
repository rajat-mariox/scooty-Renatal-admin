import { Download, FileText, RefreshCw, Undo2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { adminApi } from "../../services/adminApi"

const REFUND_STATUSES = ["PENDING", "INITIATED", "PROCESSING", "COMPLETED", "FAILED", "NOT_APPLICABLE"]
const REFUND_METHODS = ["WALLET", "BANK"]

type Props = {
    bookingId: string
    onUpdated?: () => void
}

export default function BookingFinanceActions({ bookingId, onUpdated }: Props) {
    const [invoice, setInvoice] = useState<any>(null)
    const [invoiceLoading, setInvoiceLoading] = useState(true)
    const [pdfLoading, setPdfLoading] = useState(false)
    const [refundLoading, setRefundLoading] = useState(false)
    const [refundError, setRefundError] = useState("")
    const [refundSuccess, setRefundSuccess] = useState("")
    const [refundForm, setRefundForm] = useState({
        status: "INITIATED",
        method: "WALLET",
        note: "",
        failureReason: "",
        referenceId: "",
    })

    const fetchInvoice = useCallback(async () => {
        if (!bookingId) return
        setInvoiceLoading(true)
        try {
            const response = await adminApi.getBookingInvoice(bookingId)
            const data = (response as any)?.data ?? response
            setInvoice(data?.invoice ?? null)
        } catch (err) {
            console.error("Failed to fetch invoice:", err)
            setInvoice(null)
        } finally {
            setInvoiceLoading(false)
        }
    }, [bookingId])

    useEffect(() => {
        fetchInvoice()
    }, [fetchInvoice])

    const handleDownloadPdf = async () => {
        setPdfLoading(true)
        try {
            const blob = (await adminApi.getBookingInvoicePdf(bookingId)) as BlobPart
            const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.download = `${invoice?.invoiceNumber || `invoice-${bookingId}`}.pdf`
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        } catch (err) {
            console.error("Failed to download invoice PDF:", err)
        } finally {
            setPdfLoading(false)
        }
    }

    const handleRefund = async (e: React.FormEvent) => {
        e.preventDefault()
        setRefundError("")
        setRefundSuccess("")
        setRefundLoading(true)
        try {
            const response = await adminApi.bookingRefund(bookingId, {
                status: refundForm.status,
                note: refundForm.note.trim() || undefined,
                failureReason: refundForm.status === "FAILED" ? refundForm.failureReason.trim() : undefined,
                referenceId: refundForm.referenceId.trim() || undefined,
                method: refundForm.method,
            })
            const code = (response as any)?.code
            if (code !== undefined && code !== 1) {
                setRefundError((response as any)?.message || "Failed to update refund")
            } else {
                setRefundSuccess("Refund status updated")
                await fetchInvoice()
                onUpdated?.()
            }
        } catch (err: any) {
            console.error("Failed to update refund:", err)
            setRefundError(err?.response?.data?.message || "Failed to update refund")
        } finally {
            setRefundLoading(false)
        }
    }

    const totals = invoice?.totals || {}

    return (
        <div className="space-y-6">
            {/* Invoice Card */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <FileText size={18} className="text-slate-400" />
                        <h3 className="font-bold text-slate-800 text-sm">Invoice</h3>
                    </div>
                    <button
                        onClick={handleDownloadPdf}
                        disabled={pdfLoading || !invoice}
                        className="flex items-center gap-2 px-4 py-2 border-[1.5px] border-[#FF6A1F] text-[#FF6A1F] font-bold rounded-xl hover:bg-orange-50 transition-all text-xs disabled:opacity-50"
                    >
                        {pdfLoading ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
                        Download Invoice PDF
                    </button>
                </div>

                {invoiceLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <RefreshCw className="animate-spin text-orange-500" size={24} />
                    </div>
                ) : invoice ? (
                    <div className="space-y-3">
                        <InvoiceRow label="Invoice No." value={invoice.invoiceNumber || "—"} />
                        <InvoiceRow label="Payment Status" value={invoice.paymentStatus || "—"} />
                        <InvoiceRow label="Payment Method" value={invoice.paymentMethod || "—"} />
                        <InvoiceRow label="Base Fare" value={`₹${totals.baseFare ?? 0}`} />
                        <InvoiceRow label="Security Deposit" value={`₹${totals.securityDeposit ?? 0}`} />
                        <InvoiceRow label="Convenience Fee" value={`₹${totals.convenienceFee ?? 0}`} />
                        <InvoiceRow label="GST" value={`₹${totals.taxAmount ?? 0}`} />
                        <InvoiceRow label="Penalty" value={`₹${totals.penaltyAmount ?? 0}`} />
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-700">Grand Total</span>
                            <span className="text-xl font-black text-[#FF6A1F]">₹{totals.grandTotal ?? totals.totalPayable ?? 0}</span>
                        </div>
                        <InvoiceRow
                            label="Refund"
                            value={`${invoice.refund?.status || "NOT_APPLICABLE"} (₹${invoice.refund?.amount ?? 0})`}
                        />
                    </div>
                ) : (
                    <p className="text-sm text-slate-400 font-medium py-4 text-center">Invoice not available</p>
                )}
            </div>

            {/* Refund Card */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-6">
                <div className="flex items-center gap-3">
                    <Undo2 size={18} className="text-slate-400" />
                    <h3 className="font-bold text-slate-800 text-sm">Refund</h3>
                </div>
                <form onSubmit={handleRefund} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">Status</label>
                            <select
                                value={refundForm.status}
                                onChange={(e) => setRefundForm({ ...refundForm, status: e.target.value })}
                                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-orange-500/50 bg-white"
                            >
                                {REFUND_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">Method</label>
                            <select
                                value={refundForm.method}
                                onChange={(e) => setRefundForm({ ...refundForm, method: e.target.value })}
                                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-orange-500/50 bg-white"
                            >
                                {REFUND_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">Note</label>
                        <input
                            type="text"
                            value={refundForm.note}
                            onChange={(e) => setRefundForm({ ...refundForm, note: e.target.value })}
                            placeholder="Optional note"
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-orange-500/50 placeholder:text-slate-300"
                        />
                    </div>
                    {refundForm.status === "FAILED" && (
                        <div>
                            <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">Failure Reason</label>
                            <input
                                type="text"
                                value={refundForm.failureReason}
                                onChange={(e) => setRefundForm({ ...refundForm, failureReason: e.target.value })}
                                placeholder="Reason for failure"
                                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-orange-500/50 placeholder:text-slate-300"
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">Reference ID</label>
                        <input
                            type="text"
                            value={refundForm.referenceId}
                            onChange={(e) => setRefundForm({ ...refundForm, referenceId: e.target.value })}
                            placeholder="Optional payment reference"
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-orange-500/50 placeholder:text-slate-300"
                        />
                    </div>
                    {refundError && <p className="text-xs font-bold text-rose-500">{refundError}</p>}
                    {refundSuccess && <p className="text-xs font-bold text-emerald-500">{refundSuccess}</p>}
                    <button
                        type="submit"
                        disabled={refundLoading}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#FF6A1F] text-white font-bold rounded-2xl hover:bg-orange-600 transition-all text-sm shadow-sm disabled:opacity-60"
                    >
                        {refundLoading && <RefreshCw size={16} className="animate-spin" />}
                        Update Refund
                    </button>
                </form>
            </div>
        </div>
    )
}

function InvoiceRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">{label}</span>
            <span className="text-sm font-bold text-slate-800">{value}</span>
        </div>
    )
}
