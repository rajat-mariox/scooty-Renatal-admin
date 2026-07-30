import { RefreshCw, Filter, X } from "lucide-react"
import { useState, useEffect } from "react"
import MainLayout from "../../layouts/MainLayout"
import Pagination from "../../components/admin/Pagination"
import { adminApi } from "../../services/adminApi"

export default function AuditLogs() {
    const [logs, setLogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(20)
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
    })
    const [filters, setFilters] = useState({ action: "", entityType: "", from: "", to: "" })
    const [expandedId, setExpandedId] = useState<string | null>(null)

    const fetchLogs = async (targetPage = page, targetLimit = limit) => {
        setLoading(true)
        try {
            const response = await adminApi.getAuditLogs({
                page: targetPage,
                limit: targetLimit,
                action: filters.action.trim() || undefined,
                entityType: filters.entityType.trim() || undefined,
                from: filters.from || undefined,
                to: filters.to || undefined,
            })
            const data = (response as any)?.data ?? response
            const list = Array.isArray(data) ? data : (data?.logs || [])
            setLogs(list)
            setPagination(data?.pagination || {
                page: targetPage,
                limit: targetLimit,
                total: list.length,
                totalPages: 1,
                hasNextPage: false,
                hasPrevPage: false,
            })
        } catch (error) {
            console.error("Failed to fetch audit logs:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLogs(page, limit)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit])

    const applyFilters = (e: React.FormEvent) => {
        e.preventDefault()
        setPage(1)
        fetchLogs(1, limit)
    }

    const clearFilters = () => {
        setFilters({ action: "", entityType: "", from: "", to: "" })
        setPage(1)
        setLoading(true)
        adminApi.getAuditLogs({ page: 1, limit })
            .then((response) => {
                const data = (response as any)?.data ?? response
                const list = Array.isArray(data) ? data : (data?.logs || [])
                setLogs(list)
                setPagination(data?.pagination || {
                    page: 1,
                    limit,
                    total: list.length,
                    totalPages: 1,
                    hasNextPage: false,
                    hasPrevPage: false,
                })
            })
            .catch((error) => console.error("Failed to fetch audit logs:", error))
            .finally(() => setLoading(false))
    }

    return (
        <MainLayout>
            <div className="space-y-6 max-w-[1500px]">

                {/* Header */}
                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Audit Logs</h2>
                        <p className="text-slate-500 text-sm font-medium">Track all administrative actions across the platform</p>
                    </div>
                    {loading && <RefreshCw className="animate-spin text-orange-500 mb-2" size={20} />}
                </div>

                {/* Filters */}
                <form onSubmit={applyFilters} className="bg-white px-6 py-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20">
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="flex-1 min-w-[180px]">
                            <label className="block text-xs font-bold text-slate-500 mb-1.5">Action</label>
                            <input
                                type="text"
                                value={filters.action}
                                onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                                placeholder="e.g. PRICING_UPDATED"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-300"
                            />
                        </div>
                        <div className="flex-1 min-w-[180px]">
                            <label className="block text-xs font-bold text-slate-500 mb-1.5">Entity Type</label>
                            <input
                                type="text"
                                value={filters.entityType}
                                onChange={(e) => setFilters({ ...filters, entityType: e.target.value })}
                                placeholder="e.g. Booking, User"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-300"
                            />
                        </div>
                        <div className="min-w-[160px]">
                            <label className="block text-xs font-bold text-slate-500 mb-1.5">From</label>
                            <input
                                type="date"
                                value={filters.from}
                                onChange={(e) => setFilters({ ...filters, from: e.target.value })}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10"
                            />
                        </div>
                        <div className="min-w-[160px]">
                            <label className="block text-xs font-bold text-slate-500 mb-1.5">To</label>
                            <input
                                type="date"
                                value={filters.to}
                                onChange={(e) => setFilters({ ...filters, to: e.target.value })}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10"
                            />
                        </div>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all text-sm shadow-lg shadow-orange-100"
                        >
                            <Filter size={16} />
                            Apply
                        </button>
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="flex items-center gap-2 px-5 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all text-sm"
                        >
                            <X size={16} />
                            Clear
                        </button>
                    </div>
                </form>

                {/* Table */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20 relative min-h-[300px] overflow-hidden">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                            <div className="flex flex-col items-center gap-3">
                                <RefreshCw className="animate-spin text-orange-500" size={32} />
                                <span className="text-sm font-bold text-slate-500">Loading Audit Logs...</span>
                            </div>
                        </div>
                    ) : null}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100/50">
                                    <th className="px-6 py-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</th>
                                    <th className="px-6 py-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actor</th>
                                    <th className="px-6 py-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                                    <th className="px-6 py-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Entity</th>
                                    <th className="px-6 py-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100/50">
                                {logs.length > 0 ? logs.map((log: any) => {
                                    const logId = String(log?._id || log?.id)
                                    const actor = log?.actorId && typeof log.actorId === "object" ? log.actorId : null
                                    const isExpanded = expandedId === logId
                                    return (
                                        <tr key={logId} className="hover:bg-slate-50/50 transition-colors align-top">
                                            <td className="px-6 py-5">
                                                <span className="text-sm font-medium text-slate-600 whitespace-nowrap">
                                                    {log?.createdAt ? new Date(log.createdAt).toLocaleString() : "—"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-900">{actor?.name || "System"}</span>
                                                    <span className="text-[11px] font-medium text-slate-400">{actor?.email || actor?.role || ""}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[11px] font-bold rounded-full whitespace-nowrap">
                                                    {log?.action || "—"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-700">{log?.entityType || "—"}</span>
                                                    <span className="text-[11px] font-medium text-slate-400 break-all">{log?.entityId ? String(log.entityId) : ""}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                {log?.meta && Object.keys(log.meta).length > 0 ? (
                                                    <div>
                                                        <button
                                                            onClick={() => setExpandedId(isExpanded ? null : logId)}
                                                            className="text-xs font-bold text-orange-600 hover:underline"
                                                        >
                                                            {isExpanded ? 'Hide meta' : 'View meta'}
                                                        </button>
                                                        {isExpanded && (
                                                            <pre className="mt-2 p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 font-mono max-w-[360px] overflow-x-auto">
                                                                {JSON.stringify(log.meta, null, 2)}
                                                            </pre>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs font-medium text-slate-300">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                }) : !loading && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                                            No audit logs found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Pagination
                    pagination={pagination}
                    loading={loading}
                    onPageChange={(nextPage) => setPage(nextPage)}
                    onLimitChange={(nextLimit) => {
                        setLimit(nextLimit)
                        setPage(1)
                    }}
                    label="logs"
                />

            </div>
        </MainLayout>
    )
}
