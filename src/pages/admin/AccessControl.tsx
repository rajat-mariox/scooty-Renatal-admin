import { Search, UserPlus, RefreshCw, Edit2, X, ShieldCheck } from "lucide-react"
import { useState, useEffect } from "react"
import MainLayout from "../../layouts/MainLayout"
import PrimaryButton from "../../components/PrimaryButton"
import Pagination from "../../components/admin/Pagination"
import { adminApi } from "../../services/adminApi"

// Permission keys enforced by the backend admin routes (empty list = full access, "*" = all).
const PERMISSION_OPTIONS = [
    "dashboard",
    "users",
    "pricing",
    "commission",
    "settlements",
    "reports",
    "access-control",
    "audit-logs",
]

type AdminForm = {
    name: string
    email: string
    mobile: string
    password: string
    isActive: boolean
    permissions: string[]
}

const emptyForm: AdminForm = { name: "", email: "", mobile: "", password: "", isActive: true, permissions: [] }

export default function AccessControl() {
    const [admins, setAdmins] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
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

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editTarget, setEditTarget] = useState<any>(null)
    const [form, setForm] = useState<AdminForm>(emptyForm)
    const [formError, setFormError] = useState("")
    const [saving, setSaving] = useState(false)
    const [togglingId, setTogglingId] = useState<string | null>(null)

    const fetchAdmins = async (targetPage = page, q = searchQuery, targetLimit = limit) => {
        setLoading(true)
        try {
            const response = await adminApi.getSubAdmins({
                page: targetPage,
                limit: targetLimit,
                q: q.trim() || undefined,
            })
            const data = (response as any)?.data ?? response
            const list = Array.isArray(data) ? data : (data?.admins || [])
            setAdmins(list)
            setPagination(data?.pagination || {
                page: targetPage,
                limit: targetLimit,
                total: list.length,
                totalPages: 1,
                hasNextPage: false,
                hasPrevPage: false,
            })
        } catch (error) {
            console.error("Failed to fetch admins:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAdmins(page, searchQuery, limit)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit])

    const openCreate = () => {
        setEditTarget(null)
        setForm(emptyForm)
        setFormError("")
        setIsModalOpen(true)
    }

    const openEdit = (admin: any) => {
        setEditTarget(admin)
        setForm({
            name: admin?.name || "",
            email: admin?.email || "",
            mobile: admin?.mobile || "",
            password: "",
            isActive: admin?.isActive !== false,
            permissions: Array.isArray(admin?.adminPermissions) ? admin.adminPermissions : [],
        })
        setFormError("")
        setIsModalOpen(true)
    }

    const togglePermission = (permission: string) => {
        setForm((prev) => ({
            ...prev,
            permissions: prev.permissions.includes(permission)
                ? prev.permissions.filter((p) => p !== permission)
                : [...prev.permissions, permission],
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormError("")

        if (!form.name.trim()) {
            setFormError("Name is required")
            return
        }
        if (!form.email.trim()) {
            setFormError("Email is required")
            return
        }
        if (!editTarget && !form.password.trim()) {
            setFormError("Password is required")
            return
        }

        setSaving(true)
        try {
            let response: any
            if (editTarget) {
                const payload: any = {
                    name: form.name.trim(),
                    email: form.email.trim(),
                    mobile: form.mobile.trim(),
                    isActive: form.isActive,
                    permissions: form.permissions,
                }
                if (form.password.trim()) payload.password = form.password
                response = await adminApi.updateSubAdmin(String(editTarget._id || editTarget.id), payload)
            } else {
                response = await adminApi.createSubAdmin({
                    name: form.name.trim(),
                    email: form.email.trim(),
                    mobile: form.mobile.trim() || undefined,
                    password: form.password,
                    isActive: form.isActive,
                    permissions: form.permissions,
                })
            }
            const code = response?.code
            if (code !== undefined && code !== 1) {
                setFormError(response?.message || "Request failed")
            } else {
                setIsModalOpen(false)
                await fetchAdmins()
            }
        } catch (err: any) {
            console.error("Failed to save admin:", err)
            setFormError(err?.response?.data?.message || "Request failed")
        } finally {
            setSaving(false)
        }
    }

    const toggleActive = async (admin: any) => {
        const adminId = String(admin?._id || admin?.id || "")
        if (!adminId) return
        setTogglingId(adminId)
        try {
            await adminApi.updateSubAdmin(adminId, { isActive: admin?.isActive === false })
            await fetchAdmins()
        } catch (err) {
            console.error("Failed to toggle admin status:", err)
        } finally {
            setTogglingId(null)
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setPage(1)
        fetchAdmins(1, searchQuery, limit)
    }

    return (
        <MainLayout>
            <div className="space-y-6 max-w-[1500px]">

                {/* Header */}
                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Access Control</h2>
                        <p className="text-slate-500 text-sm font-medium">Manage sub-admins and their permissions</p>
                    </div>
                    <PrimaryButton onClick={openCreate} className="px-6 py-3 text-sm">
                        <UserPlus size={18} />
                        Add Sub-Admin
                    </PrimaryButton>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="bg-white px-6 py-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20">
                    <div className="relative max-w-[700px] border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all focus-within:border-orange-500/50 focus-within:ring-4 focus-within:ring-orange-500/10">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">
                            <Search size={20} strokeWidth={2.5} />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name, email, or mobile..."
                            className="w-full pl-14 pr-6 py-3.5 bg-white text-sm focus:outline-none font-medium text-slate-700 placeholder:text-slate-300 placeholder:font-normal"
                        />
                    </div>
                </form>

                {/* Table */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20 relative min-h-[300px] overflow-hidden">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                            <div className="flex flex-col items-center gap-3">
                                <RefreshCw className="animate-spin text-orange-500" size={32} />
                                <span className="text-sm font-bold text-slate-500">Loading Admins...</span>
                            </div>
                        </div>
                    ) : null}
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100/50">
                                <th className="px-6 py-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Mobile</th>
                                <th className="px-6 py-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Permissions</th>
                                <th className="px-6 py-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/50">
                            {admins.length > 0 ? admins.map((admin: any) => {
                                const adminId = String(admin?._id || admin?.id)
                                const permissions: string[] = Array.isArray(admin?.adminPermissions) ? admin.adminPermissions : []
                                const isActive = admin?.isActive !== false
                                return (
                                    <tr key={adminId} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-bold text-slate-900">{admin?.name || "—"}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-medium text-slate-600">{admin?.email || "—"}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-medium text-slate-600">{admin?.mobile || "—"}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-wrap gap-1.5 max-w-[280px]">
                                                {permissions.length > 0 ? permissions.map((p) => (
                                                    <span key={p} className="px-2.5 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-full">
                                                        {p}
                                                    </span>
                                                )) : (
                                                    <span className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full">
                                                        <ShieldCheck size={12} />
                                                        Full Access
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-4 py-1 text-[11px] font-bold rounded-full inline-block ${isActive ? 'bg-green-50 text-green-600' : 'bg-rose-50 text-rose-600'}`}>
                                                {isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => openEdit(admin)}
                                                    className="flex items-center gap-1.5 px-4 py-1.5 border border-slate-200 hover:border-orange-300 hover:text-orange-600 text-slate-600 text-xs font-bold rounded-full transition-all"
                                                >
                                                    <Edit2 size={12} />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => toggleActive(admin)}
                                                    disabled={togglingId === adminId}
                                                    className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all disabled:opacity-50 ${isActive
                                                        ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                                                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                        }`}
                                                >
                                                    {togglingId === adminId ? '...' : (isActive ? 'Deactivate' : 'Activate')}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }) : !loading && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                                        No sub-admins found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    pagination={pagination}
                    loading={loading}
                    onPageChange={(nextPage) => setPage(nextPage)}
                    onLimitChange={(nextLimit) => {
                        setLimit(nextLimit)
                        setPage(1)
                    }}
                    label="admins"
                />

                {/* Create / Edit Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 animate-in fade-in duration-300">
                        <div className="bg-white w-full max-w-xl rounded-3xl p-10 shadow-2xl shadow-slate-900/40 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold text-slate-900">
                                    {editTarget ? 'Edit Sub-Admin' : 'Add Sub-Admin'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <X size={22} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5">Name</label>
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            placeholder="Full name"
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5">Mobile</label>
                                        <input
                                            type="text"
                                            value={form.mobile}
                                            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                                            placeholder="Optional"
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-300"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1.5">Email</label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        placeholder="admin@example.com"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1.5">
                                        Password {editTarget && <span className="text-slate-400 font-medium">(leave blank to keep current)</span>}
                                    </label>
                                    <input
                                        type="password"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        placeholder={editTarget ? "New password" : "Password"}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-2">
                                        Permissions <span className="text-slate-400 font-medium">(none selected = full access)</span>
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {PERMISSION_OPTIONS.map((permission) => (
                                            <label
                                                key={permission}
                                                className={`flex items-center gap-2.5 px-4 py-2.5 border rounded-xl cursor-pointer transition-all text-sm font-semibold ${form.permissions.includes(permission)
                                                    ? 'border-orange-400 bg-orange-50 text-orange-700'
                                                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={form.permissions.includes(permission)}
                                                    onChange={() => togglePermission(permission)}
                                                    className="accent-orange-600"
                                                />
                                                {permission}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <label className="flex items-center gap-3 text-sm font-semibold text-slate-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.isActive}
                                        onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                                        className="accent-orange-600 w-4 h-4"
                                    />
                                    Active
                                </label>

                                {formError && <p className="text-xs font-bold text-rose-500">{formError}</p>}

                                <div className="flex items-center justify-end gap-6 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        disabled={saving}
                                        className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <PrimaryButton type="submit" disabled={saving} className="px-8 py-3.5 text-sm">
                                        {saving && <RefreshCw size={16} className="animate-spin" />}
                                        {editTarget ? 'Save Changes' : 'Create Sub-Admin'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </MainLayout>
    )
}
