import {
    ArrowLeft,
    Phone,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    XCircle
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import MainLayout from "../layouts/MainLayout"
import BookingFinanceActions from "../components/admin/BookingFinanceActions"
import { adminApi } from "../services/adminApi"

export default function BookingDetail() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const id = searchParams.get('id')

    const [booking, setBooking] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [actionLoading, setActionLoading] = useState(false)
    const [modalType, setModalType] = useState<'approve' | 'cancel' | null>(null)

    const fetchBooking = useCallback(async () => {
        if (!id) {
            setError("No booking ID provided")
            setLoading(false)
            return
        }
        setLoading(true)
        try {
            const response = await adminApi.getBookingDetails(id)
            const data = (response as any)?.data ?? response
            const record = data?.booking ?? data
            if (!record || !record._id) {
                setError("Booking not found")
            } else {
                setBooking(record)
                setError(null)
            }
        } catch (err: any) {
            console.error("Failed to fetch booking details:", err)
            setError(err.response?.data?.message || "Failed to load booking details")
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        fetchBooking()
    }, [fetchBooking])

    const handleAction = async (type: 'approve' | 'cancel') => {
        if (!id) return
        setActionLoading(true)
        try {
            if (type === 'approve') {
                await adminApi.approveBooking({ bookingId: id, status: 'CONFIRMED', note: 'Approved from admin panel' })
            } else {
                await adminApi.cancelBooking(id, { reason: 'Cancelled from admin panel' })
            }
            await fetchBooking()
        } catch (err) {
            console.error(`Failed to ${type} booking:`, err)
        } finally {
            setActionLoading(false)
            setModalType(null)
        }
    }

    if (loading) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <RefreshCw className="animate-spin text-orange-500" size={48} />
                    <span className="text-lg font-bold text-slate-500">Loading Booking Details...</span>
                </div>
            </MainLayout>
        )
    }

    if (error || !booking) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center">
                        <AlertCircle className="text-rose-500" size={40} />
                    </div>
                    <span className="text-lg font-bold text-slate-700">{error || "Booking not found"}</span>
                    <button
                        onClick={() => navigate("/booking")}
                        className="px-6 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all mt-4"
                    >
                        Back to Bookings
                    </button>
                </div>
            </MainLayout>
        )
    }

    const status = String(booking.status || "PENDING").toUpperCase()
    const userPhone = booking.user?.mobile || booking.user?.phone || "N/A"
    const paymentStatus = String(booking.payment?.status || "PENDING").toUpperCase()

    return (
        <MainLayout>
            <div className="space-y-8 max-w-7xl mx-auto">

                {/* Navigation & Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-4">
                        <button
                            onClick={() => navigate("/booking")}
                            className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-xs font-bold uppercase tracking-wider"
                        >
                            <ArrowLeft size={16} />
                            Back to Bookings
                        </button>
                        <div className="flex flex-col gap-2">
                            <h2 className="text-xl font-extrabold text-slate-900">Booking Details - {booking._id}</h2>
                            <div>
                                <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${['CONFIRMED', 'ACTIVE', 'COMPLETED'].includes(status) ? 'bg-green-50 text-green-600' :
                                    status === 'CANCELLED' ? 'bg-rose-50 text-rose-600' :
                                        'bg-yellow-50 text-yellow-600'
                                    }`}>
                                    {status}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => window.location.href = `tel:${userPhone}`}
                            className="px-6 py-2.5 border-[1.5px] border-[#FF6A1F] text-[#FF6A1F] font-bold rounded-xl hover:bg-orange-50 transition-all text-sm flex items-center gap-2"
                        >
                            <Phone size={18} />
                            Call User
                        </button>
                        {status === 'PENDING' && (
                            <button
                                onClick={() => setModalType('approve')}
                                className="px-6 py-2.5 bg-[#00D362] text-white font-bold rounded-xl hover:bg-emerald-600 transition-all text-sm flex items-center gap-2"
                            >
                                <CheckCircle2 size={18} />
                                Approve Booking
                            </button>
                        )}
                        {!['CANCELLED', 'COMPLETED'].includes(status) && (
                            <button
                                onClick={() => setModalType('cancel')}
                                className="px-6 py-2.5 bg-[#FF3B30] text-white font-bold rounded-xl hover:bg-rose-600 transition-all text-sm flex items-center gap-2"
                            >
                                <XCircle size={18} />
                                Cancel Booking
                            </button>
                        )}
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                    {/* Left Column: Booking Info */}
                    <div className="col-span-1 md:col-span-7 space-y-6">
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-6">
                            <h3 className="font-bold text-slate-800 text-sm">Booking Information</h3>
                            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                <DetailItem label="User" value={booking.user?.name || "Unknown User"} />
                                <DetailItem label="Phone" value={userPhone} />
                                <DetailItem label="Email" value={booking.user?.email || "—"} />
                                <DetailItem label="Plan" value={booking.planName || booking.planCode || "—"} />
                                <DetailItem label="Start" value={booking.schedule?.startLabel || (booking.startAt ? new Date(booking.startAt).toLocaleString() : "—")} />
                                <DetailItem label="End" value={booking.schedule?.endLabel || (booking.endAt ? new Date(booking.endAt).toLocaleString() : "—")} />
                                <DetailItem label="Pickup Station" value={booking.pickupStation?.name || "—"} />
                                <DetailItem label="Drop Station" value={booking.dropStation?.name || "—"} />
                                <DetailItem label="Payment Status" value={paymentStatus} />
                                <DetailItem label="Payment Reference" value={booking.payment?.referenceId || "—"} />
                                <DetailItem label="Total Payable" value={`₹${booking.totalPayable ?? booking.pricing?.totalPayable ?? 0}`} />
                                <DetailItem label="Created At" value={booking.createdAt ? new Date(booking.createdAt).toLocaleString() : "—"} />
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-6">
                            <h3 className="font-bold text-slate-800 text-sm">Vehicle</h3>
                            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                <DetailItem label="Model" value={booking.vehicle?.modelName || "—"} />
                                <DetailItem label="Registration No." value={booking.vehicle?.registrationNumber || "—"} />
                                <DetailItem label="Battery" value={booking.vehicle?.batteryPercent !== null && booking.vehicle?.batteryPercent !== undefined ? `${booking.vehicle.batteryPercent}%` : "—"} />
                                <DetailItem label="Status" value={booking.vehicle?.status || "—"} />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Invoice & Refund */}
                    <div className="col-span-1 md:col-span-5">
                        <BookingFinanceActions bookingId={String(booking._id)} onUpdated={fetchBooking} />
                    </div>
                </div>

                {/* Confirm Modal */}
                {modalType && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 animate-in fade-in duration-300">
                        <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-12 shadow-2xl shadow-slate-900/40 transform animate-in zoom-in-95 duration-300">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">
                                {modalType === 'approve' ? 'Approve Booking' : 'Cancel Booking'}
                            </h2>
                            <p className="text-slate-500 font-medium mb-12 leading-relaxed">
                                Are you sure you want to {modalType === 'approve' ? 'approve' : 'cancel'} booking{' '}
                                <span className="font-bold text-slate-800">{booking._id}</span>?
                            </p>
                            <div className="flex items-center justify-end gap-10">
                                <button
                                    onClick={() => setModalType(null)}
                                    disabled={actionLoading}
                                    className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => handleAction(modalType)}
                                    disabled={actionLoading}
                                    className={`flex items-center gap-2 px-10 py-4 text-white text-sm font-bold rounded-2xl transition-all shadow-lg disabled:opacity-70 ${modalType === 'approve'
                                        ? 'bg-[#00D362] hover:bg-emerald-600 shadow-emerald-100'
                                        : 'bg-[#FF3B30] hover:bg-rose-600 shadow-rose-100'
                                        }`}
                                >
                                    {actionLoading && <RefreshCw size={16} className="animate-spin" />}
                                    {modalType === 'approve' ? 'Approve' : 'Cancel Booking'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </MainLayout>
    )
}

function DetailItem({ label, value }: { label: string, value: string }) {
    return (
        <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{label}</p>
            <p className="text-sm font-bold text-slate-800 mt-1 break-words">{value}</p>
        </div>
    )
}
