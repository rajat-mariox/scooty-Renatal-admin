import { Search, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import MainLayout from "../layouts/MainLayout"
import { stationAdminApi } from "../services/stationAdminApi"

export default function BookingControl() {
    const [bookingList, setBookingList] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)
    const [modalType, setModalType] = useState<'approve' | 'cancel' | null>(null)

    const fetchBookings = async () => {
        setLoading(true)
        try {
            const response = await stationAdminApi.getBookings()
            const data = (response as any).data || response
            const bookings = Array.isArray(data.bookings) ? data.bookings : (Array.isArray(data) ? data : [])
            
            const mappedBookings = bookings.map((b: any) => ({
                id: b.bookingId || b.id || "N/A",
                user: b.userName || b.user?.name || "Unknown User",
                phone: b.phone || b.user?.phone || "N/A",
                slotTime: b.slotTime || b.createdAt || "N/A",
                vehicle: b.vehicleId || b.vehicle?.id || "Not Assigned",
                status: b.status || "Pending",
                payment: b.paymentStatus || b.payment || "Pending"
            }))
            
            setBookingList(mappedBookings)
        } catch (error) {
            console.error("Failed to fetch bookings:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBookings()
    }, [])

    const filteredBookings = bookingList.filter((booking) => {
        const query = searchQuery.toLowerCase()
        return (
            booking.id.toLowerCase().includes(query) ||
            booking.user.toLowerCase().includes(query) ||
            booking.status.toLowerCase().includes(query)
        )
    })

    const handleAction = async (id: string, type: 'approve' | 'cancel') => {
        setActionLoading(true)
        try {
            await stationAdminApi.approveBooking({
                bookingId: id,
                status: type === 'approve' ? 'Confirmed' : 'Cancelled'
            })
            await fetchBookings()
        } catch (error) {
            console.error(`Failed to ${type} booking:`, error)
        } finally {
            setActionLoading(false)
            setModalType(null)
            setSelectedBookingId(null)
        }
    }

    return (
        <MainLayout>
            <div className="space-y-6 max-w-[1500px] font-['Poppins']">

                {/* Header title section */}
                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                        <h2 className="text-[24px] font-bold text-slate-800 tracking-tight">Booking Control</h2>
                        <p className="text-slate-400 font-medium text-[15px]">Manage all ride bookings and reservations</p>
                    </div>
                    {loading && <RefreshCw className="animate-spin text-orange-500 mb-2" size={20} />}
                </div>

                {/* Search Input Card */}
                <div className="bg-white px-8 py-10 rounded-[1.5rem] border border-slate-100 shadow-sm shadow-slate-200/20">
                    <div className="relative max-w-[700px] border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all focus-within:border-orange-500/50 focus-within:ring-4 focus-within:ring-orange-500/10">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300">
                            <Search size={22} strokeWidth={2.5} />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by Booking ID or User name..."
                            className="w-full pl-16 pr-6 py-4 bg-white text-[15px] focus:outline-none font-medium text-slate-700 placeholder:text-slate-300 placeholder:font-normal"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm shadow-slate-200/20 relative min-h-[300px]">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                            <div className="flex flex-col items-center gap-3">
                                <RefreshCw className="animate-spin text-orange-500" size={32} />
                                <span className="text-sm font-bold text-slate-500">Loading Bookings...</span>
                            </div>
                        </div>
                    ) : null}
                    <div className="">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100/50">
                                    <th className="px-6 py-6 text-[13px] font-semibold text-slate-600 uppercase tracking-wider">Booking ID</th>
                                    <th className="px-6 py-6 text-[13px] font-semibold text-slate-600 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-6 text-[13px] font-semibold text-slate-600 uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-6 text-[13px] font-semibold text-slate-600 uppercase tracking-wider">Slot Time</th>
                                    <th className="px-6 py-6 text-[13px] font-semibold text-slate-600 uppercase tracking-wider">Vehicle</th>
                                    <th className="px-6 py-6 text-[13px] font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-6 text-[13px] font-semibold text-slate-600 uppercase tracking-wider">Payment</th>
                                    <th className="px-6 py-6 text-[13px] font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100/50">
                                {filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <span className="text-[14px] font-bold text-slate-900">{booking.id}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[14px] font-medium text-slate-700">{booking.user}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[14px] font-medium text-slate-700">{booking.phone}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[14px] font-medium text-slate-700 whitespace-nowrap">{booking.slotTime}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`text-[14px] font-medium ${booking.vehicle === 'Not Assigned' ? 'text-slate-300' : 'text-slate-700'}`}>
                                                {booking.vehicle}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-4 py-1 text-[11px] font-bold rounded-full inline-block ${booking.status === 'Confirmed' ? 'bg-green-50 text-green-600' :
                                                booking.status === 'Cancelled' ? 'bg-rose-50 text-rose-600' :
                                                    'bg-yellow-50 text-yellow-600'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-4 py-1 text-[11px] font-bold rounded-full inline-block ${(booking.payment === 'Paid' || booking.payment === 'Success') ? 'bg-green-50 text-green-600' :
                                                'bg-yellow-50 text-yellow-600'
                                                }`}>
                                                {booking.payment}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex gap-3">
                                                {booking.status === 'Pending' && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedBookingId(booking.id)
                                                            setModalType('approve')
                                                        }}
                                                        className="px-4 py-1.5 bg-[#00D362] hover:bg-emerald-600 text-white text-[12px] font-bold rounded-full transition-all shadow-sm hover:shadow-md active:scale-95"
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                                {booking.status !== 'Cancelled' && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedBookingId(booking.id)
                                                            setModalType('cancel')
                                                        }}
                                                        className="px-4 py-1.5 bg-[#FF3B30] hover:bg-rose-600 text-white text-[12px] font-bold rounded-full transition-all shadow-sm hover:shadow-md active:scale-95"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : !loading && (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center text-slate-400 font-medium border-2 border-dashed border-slate-50 rounded-2xl">
                                            No bookings found matching your criteria
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Cancel Booking Modal */}
                {modalType === 'cancel' && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 animate-in fade-in duration-300">
                        <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-12 shadow-2xl shadow-slate-900/40 transform animate-in zoom-in-95 duration-300">
                            <h2 className="text-[20px] font-bold text-slate-900 mb-6">Cancel Booking</h2>

                            <p className="text-slate-500 font-medium text-[16px] mb-12 leading-relaxed">
                                Are you sure you want to cancel booking <span className="font-bold text-slate-800">{selectedBookingId}</span>?
                            </p>

                            <div className="flex items-center justify-end gap-10">
                                <button
                                    onClick={() => {
                                        setModalType(null)
                                        setSelectedBookingId(null)
                                    }}
                                    disabled={actionLoading}
                                    className="text-[14px] font-bold text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => selectedBookingId && handleAction(selectedBookingId, 'cancel')}
                                    disabled={actionLoading}
                                    className="px-8 py-4 bg-[#FF3B30] text-white text-[14px] font-bold rounded-2xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-100 flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {actionLoading ? <RefreshCw size={16} className="animate-spin" /> : null}
                                    Cancel Booking
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Approve Booking Modal */}
                {modalType === 'approve' && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 animate-in fade-in duration-300">
                        <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-12 shadow-2xl shadow-slate-900/40 transform animate-in zoom-in-95 duration-300">
                            <h2 className="text-[20px] font-bold text-slate-900 mb-6">Approve Booking</h2>

                            <p className="text-slate-500 font-medium text-[16px] mb-12 leading-relaxed">
                                Are you sure you want to confirm booking <span className="font-bold text-slate-800">{selectedBookingId}</span>?
                            </p>

                            <div className="flex items-center justify-end gap-10">
                                <button
                                    onClick={() => {
                                        setModalType(null)
                                        setSelectedBookingId(null)
                                    }}
                                    disabled={actionLoading}
                                    className="text-[14px] font-bold text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => selectedBookingId && handleAction(selectedBookingId, 'approve')}
                                    disabled={actionLoading}
                                    className="px-10 py-4 bg-[#00D362] text-white text-[14px] font-bold rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {actionLoading ? <RefreshCw size={16} className="animate-spin" /> : null}
                                    Approve
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </MainLayout>
    )
}

