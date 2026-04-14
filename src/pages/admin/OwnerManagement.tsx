import { Eye, RefreshCw, Search, User } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import MainLayout from "../../layouts/MainLayout"
import Pagination from "../../components/admin/Pagination"
import { adminApi } from "../../services/adminApi"

type OwnerRecord = {
    id?: string
    _id?: string
    name?: string
    companyName?: string
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

const OWNER_STATUS_FILTERS = [
    { label: "All", value: "ALL" },
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "BLOCKED" },
]

const normalizeKycStatus = (owner: OwnerRecord) =>
    String(owner?.kycStatus || owner?.kyc_status || "").toUpperCase()

const getKycLabel = (status: string) => {
    if (status === "APPROVED") return "Approved"
    if (status === "REJECTED") return "Rejected"
    if (status === "PENDING") return "Pending"
    return "Not Submitted"
}

export default function OwnerManagement() {
    const navigate = useNavigate()
    const [owners, setOwners] = useState<OwnerRecord[]>([])
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

    const fetchOwners = async (targetPage = page, q = searchQuery, targetLimit = limit, targetStatus = statusFilter) => {
        setLoading(true)
        try {
            const params: Record<string, any> = {
                role: "OWNER",
                page: targetPage,
                limit: targetLimit,
            }

            if (q.trim()) params.q = q.trim()
            if (targetStatus !== "ALL") params.status = targetStatus

            const response = await adminApi.getUsers(params)
            const rawData = (response as any)?.data ?? response
            const payload = rawData?.data ?? rawData
            const ownerList = Array.isArray(payload) ? payload : payload?.users || []
            const paginationData = payload?.pagination || {
                page: targetPage,
                limit: targetLimit,
                total: ownerList.length,
                totalPages: 1,
                hasNextPage: false,
                hasPrevPage: false,
            }

            setOwners(ownerList)
            setPagination(paginationData)
        } catch (error) {
            console.error("Failed to fetch owners:", error)
            setStatusMessage("Failed to load owners. Try again.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOwners(page, searchQuery, limit, statusFilter)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit, statusFilter])

    const handleSearch = () => {
        setPage(1)
        fetchOwners(1, searchQuery, limit, statusFilter)
    }

    const handleLimitChange = (nextLimit: number) => {
        setLimit(nextLimit)
        setPage(1)
    }

    const updateOwnerStatus = async (owner: OwnerRecord) => {
        const ownerId = owner.id || owner._id
        if (!ownerId) return

        setLoading(true)
        try {
            const nextIsActive = !owner.isActive
            const response = await adminApi.updateUserStatus(ownerId, {
                isActive: nextIsActive,
                note: `Changed from admin owner management`,
            })

            const rawData = (response as any)?.data ?? response
            const updatedOwner = rawData?.user || rawData

            setOwners((prevOwners) =>
                prevOwners.map((item) => {
                    const currentId = item.id || item._id
                    if (String(currentId) !== String(ownerId)) return item
                    return {
                        ...item,
                        isActive: updatedOwner?.isActive ?? updatedOwner?.is_active ?? nextIsActive,
                    }
                }),
            )

            setStatusMessage(`Owner ${nextIsActive ? "activated" : "deactivated"} successfully.`)
            await fetchOwners(page, searchQuery, limit, statusFilter)
        } catch (error) {
            console.error("Failed to update owner status:", error)
            setStatusMessage("Failed to update owner status. Try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                        {OWNER_STATUS_FILTERS.map((filter) => (
                            <button
                                key={filter.value}
                                type="button"
                                onClick={() => {
                                    setStatusFilter(filter.value as "ALL" | "ACTIVE" | "BLOCKED")
                                    setPage(1)
                                }}
                                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                                    statusFilter === filter.value
                                        ? "bg-orange-600 text-white shadow-sm shadow-orange-200"
                                        : "border border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:text-orange-600"
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}

                        <button
                            type="button"
                            onClick={() => fetchOwners(page, searchQuery, limit, statusFilter)}
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
                        <table className="min-w-[1100px] w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Owner Profile</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Company</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Phone</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Joined Date</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">KYC</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {owners.length > 0 ? (
                                    owners.map((owner) => {
                                        const ownerId = owner.id || owner._id
                                        const kycStatus = normalizeKycStatus(owner)
                                        const rejectionReason = String(owner?.kycRejectionReason || owner?.kyc_rejection_reason || "").trim()

                                        return (
                                            <tr key={ownerId} className="group transition-colors hover:bg-slate-50/60">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-100 transition-colors group-hover:bg-orange-50">
                                                            {owner.profilePhotoUrl ? (
                                                                <img
                                                                    src={owner.profilePhotoUrl}
                                                                    alt={owner.name || "Owner"}
                                                                    className="h-full w-full rounded-full object-cover"
                                                                />
                                                            ) : (
                                                                <User className="text-slate-400 group-hover:text-orange-600" size={20} />
                                                            )}
                                                        </div>

                                                        <div>
                                                            <div className="text-sm font-bold text-slate-800">
                                                                {owner.name || "No Name"}
                                                            </div>
                                                            <div className="text-xs font-medium text-slate-400">
                                                                {owner.email || "No email"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-sm font-semibold text-slate-600">
                                                    {owner.companyName || "N/A"}
                                                </td>
                                                <td className="px-6 py-5 text-sm font-semibold text-slate-600">
                                                    {owner.mobile || owner.phone || "-"}
                                                </td>
                                                <td className="px-6 py-5 text-sm font-medium text-slate-400">
                                                    {owner.createdAt ? new Date(owner.createdAt).toLocaleDateString() : "N/A"}
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold ${owner.isActive ? "bg-green-50 text-green-600" : "bg-rose-50 text-rose-600"}`}>
                                                        {owner.isActive ? "Active" : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="space-y-1">
                                                        <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold ${kycStatus === "APPROVED" ? "bg-green-50 text-green-600" : kycStatus === "REJECTED" ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-600"}`}>
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
                                                            onClick={() => navigate(`/admin/owners/${ownerId}`)}
                                                            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-slate-600 transition-colors hover:border-orange-200 hover:bg-orange-50"
                                                            title="View details"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => updateOwnerStatus(owner)}
                                                            className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                                                                owner.isActive
                                                                    ? "bg-rose-600 text-white hover:bg-rose-700"
                                                                    : "bg-green-600 text-white hover:bg-green-700"
                                                            }`}
                                                        >
                                                            {owner.isActive ? "Deactivate" : "Activate"}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : !loading ? (
                                    <tr>
                                        <td colSpan={7} className="py-20 text-center text-slate-400 font-medium">
                                            No owners found
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
                        label="owners"
                    />
                </div>
            </div>
        </MainLayout>
    )
}
