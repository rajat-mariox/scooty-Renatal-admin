import { Search, RefreshCw, MoreVertical, Filter, User } from "lucide-react"
import { useState, useEffect } from "react"
import MainLayout from "../../layouts/MainLayout"
import { adminApi } from "../../services/adminApi"

export default function UserManagement() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const response = await adminApi.getUsers()
            const data = (response as any).data || response
            setUsers(Array.isArray(data) ? data : (data.users || []))
        } catch (error) {
            console.error("Failed to fetch users:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const filteredUsers = users.filter(u => 
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.phone?.includes(searchQuery)
    )

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold">User Management</h2>
                        <p className="text-slate-500 text-sm font-medium">Manage and monitor all rental platform users</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-100 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by name, email, or phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm font-medium"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-4 min-h-[500px] relative">
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                            <RefreshCw className="animate-spin text-orange-600" size={32} />
                        </div>
                    )}
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">User Profile</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Phone</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Joined Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 group transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                                                <User className="text-slate-400 group-hover:text-orange-600" size={20} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 text-sm">{user.name}</div>
                                                <div className="text-xs text-slate-400 font-medium">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-bold text-slate-600">
                                        {user.phone}
                                    </td>
                                    <td className="px-6 py-5 text-sm text-slate-400 font-medium">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 text-[10px] font-bold rounded-full ${user.isActive ? 'bg-green-50 text-green-600' : 'bg-rose-50 text-rose-600'}`}>
                                            {user.isActive ? 'Active' : 'Locked'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors"><MoreVertical size={18} /></button>
                                    </td>
                                </tr>
                            )) : !loading && (
                                <tr><td colSpan={5} className="py-20 text-center text-slate-400 font-medium">No users found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </MainLayout>
    )
}
