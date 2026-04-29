import { Eye, RefreshCw, Search, User } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import MainLayout from "../../layouts/MainLayout"
import { adminApi } from "../../services/adminApi"
import Pagination from "../../components/admin/Pagination"

type UserRecord = {
    id?: string
    _id?: string
    name?: string
    email?: string
    mobile?: string
    phone?: string
    profilePhotoUrl?: string
    createdAt?: string
    isActive?: boolean
    kycStatus?: string
    kyc_status?: string
    kycRejectionReason?: string
    kyc_rejection_reason?: string
}

const normalizeKycStatus = (user: UserRecord) =>
    String(user?.kycStatus || user?.kyc_status || "").toUpperCase()

const getKycLabel = (status: string) => {
    if (status === "APPROVED") return "Approved"
    if (status === "REJECTED") return "Rejected"
    if (status === "PENDING") return "Pending"
    return "Not Submitted"
}

const STATUS_FILTERS = [
    { label: "All", value: "ALL" },
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "BLOCKED" },
]

const normalizeUsers = (payload: any) => {
    const list = Array.isArray(payload) ? payload : payload?.users || []
    return list as UserRecord[]
}

export default function UserManagement() {
    const navigate = useNavigate()
    const [users, setUsers] = useState<UserRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "BLOCKED">("ALL")
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
    })
    const [statusMessage, setStatusMessage] = useState("")

    const fetchUsers = async (targetPage = page, q = searchQuery, targetLimit = limit, targetStatus = statusFilter) => {
        setLoading(true)
        try {
            const params: Record<string, any> = {
                role: "USER",
                page: targetPage,
                limit: targetLimit,
            }

            if (q.trim()) params.q = q.trim()
            if (targetStatus !== "ALL") params.status = targetStatus

            const response = await adminApi.getUsers(params)
            const rawData = (response as any)?.data ?? response
            const payload = rawData?.data ?? rawData
            const usersData = normalizeUsers(payload)
            const paginationData = payload?.pagination || {
                page: targetPage,
                limit: targetLimit,
                total: usersData.length,
                totalPages: 1,
                hasNextPage: false,
                hasPrevPage: false,
            }

            setUsers(usersData)
            setPagination(paginationData)
        } catch (error) {
            console.error("Failed to fetch users:", error)
            setStatusMessage("Failed to load users. Try again.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers(page, searchQuery, limit, statusFilter)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit, statusFilter])

    const handleSearch = () => {
        setPage(1)
        fetchUsers(1, searchQuery, limit, statusFilter)
    }

    const handleLimitChange = (nextLimit: number) => {
        setLimit(nextLimit)
        setPage(1)
    }

    const updateUserStatus = async (user: UserRecord) => {
        const userId = user.id || user._id
        if (!userId) return

        setLoading(true)
        try {
            const nextIsActive = !user.isActive
            const response = await adminApi.updateUserStatus(userId, {
                isActive: nextIsActive,
                note: `Changed from admin user management`,
            })

            const rawData = (response as any)?.data ?? response
            const updatedUser = rawData?.user || rawData

            setUsers((prevUsers) =>
                prevUsers.map((item) => {
                    const currentId = item.id || item._id
                    if (String(currentId) !== String(userId)) return item
                    return {
                        ...item,
                        isActive: updatedUser?.isActive ?? updatedUser?.is_active ?? nextIsActive,
                    }
                }),
            )

            setStatusMessage(`User ${nextIsActive ? "activated" : "deactivated"} successfully.`)
            await fetchUsers(page, searchQuery, limit, statusFilter)
        } catch (error) {
            console.error("Failed to update user status:", error)
            setStatusMessage("Failed to update user status. Try again.")
        } finally {
            setLoading(false)
        }
    }

    const activeFilterClass = (value: string) =>
        `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            statusFilter === value
                ? "bg-orange-600 text-white shadow-sm shadow-orange-200"
                : "bg-white text-slate-600 border border-slate-200 hover:border-orange-200 hover:text-orange-600"
        }`

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                        {STATUS_FILTERS.map((filter) => (
                            <button
                                key={filter.value}
                                type="button"
                                onClick={() => {
                                    setStatusFilter(filter.value as "ALL" | "ACTIVE" | "BLOCKED")
                                    setPage(1)
                                }}
                                className={activeFilterClass(filter.value)}
                            >
                                {filter.label}
                            </button>
                        ))}

                        <button
                            type="button"
                            onClick={() => fetchUsers(page, searchQuery, limit, statusFilter)}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-orange-200 hover:text-orange-600"
                        >
                            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                            Refresh
                        </button>
                    </div>

                    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center xl:w-auto xl:justify-end">
                        <div className="relative w-full sm:w-[320px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name, email, or phone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSearch()
                                }}
                                className="w-full rounded-full border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleSearch}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-700"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {statusMessage && (
                    <div className="rounded-3xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-orange-700">
                        {statusMessage}
                    </div>
                )}

                <div className="relative min-h-[560px] overflow-hidden rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
                    {loading && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
                            <RefreshCw className="animate-spin text-orange-600" size={32} />
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="min-w-[920px] w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">User Profile</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Phone</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Joined Date</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">KYC</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {users.length > 0 ? (
                                    users.map((user) => {
                                        const userId = user.id || user._id
                                        const kycStatus = normalizeKycStatus(user)
                                        const rejectionReason = String(user?.kycRejectionReason || user?.kyc_rejection_reason || "").trim()
                                        return (
                                            <tr key={userId} className="group transition-colors hover:bg-slate-50/60">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-100 transition-colors group-hover:bg-orange-50">
                                                            {user.profilePhotoUrl ? (
                                                                <img
                                                                    src={user.profilePhotoUrl}
                                                                    alt={user.name || "User"}
                                                                    className="h-full w-full rounded-full object-cover"
                                                                />
                                                            ) : (
                                                                <User className="text-slate-400 group-hover:text-orange-600" size={20} />
                                                            )}
                                                        </div>

                                                        <div>
                                                            <div className="text-sm font-bold text-slate-800">
                                                                {user.name || "No Name"}
                                                            </div>
                                                            <div className="text-xs font-medium text-slate-400">
                                                                {user.email || "No email"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-sm font-semibold text-slate-600">
                                                    {user.mobile || user.phone || "-"}
                                                </td>
                                                <td className="px-6 py-5 text-sm font-medium text-slate-400">
                                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold ${user.isActive ? "bg-green-50 text-green-600" : "bg-rose-50 text-rose-600"}`}>
                                                        {user.isActive ? "Active" : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="space-y-1">
                                                        <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold ${kycStatus === "APPROVED" ? "bg-green-50 text-green-600" : kycStatus === "REJECTED" ? "bg-rose-50 text-rose-600" : kycStatus === "PENDING" ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-600"}`}>
                                                            {getKycLabel(kycStatus)}
                                                        </span>
                                                        {kycStatus === "REJECTED" && rejectionReason && (
                                                            <p className="text-[11px] font-medium text-rose-600">
                                                                Reason: {rejectionReason}
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex flex-wrap items-center justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => navigate(`/admin/users/${userId}`)}
                                                            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-slate-600 transition-colors hover:border-orange-200 hover:bg-orange-50"
                                                            title="View details"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => updateUserStatus(user)}
                                                            className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                                                                user.isActive
                                                                    ? "bg-rose-600 text-white hover:bg-rose-700"
                                                                    : "bg-green-600 text-white hover:bg-green-700"
                                                            }`}
                                                        >
                                                            {user.isActive ? "Deactivate" : "Activate"}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : !loading ? (
                                    <tr>
                                        <td colSpan={6} className="py-20 text-center text-slate-400 font-medium">
                                            No users found
                                        </td>
                                    </tr>
                                ) : null}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        pagination={pagination}
                        loading={loading}
                        onPageChange={setPage}
                        onLimitChange={handleLimitChange}
                        label="users"
                    />
                </div>
            </div>
        </MainLayout>
    )
}
