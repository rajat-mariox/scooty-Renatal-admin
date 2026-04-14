import {
    LayoutDashboard,
    Bike,
    Navigation,
    Calendar,
    Wrench,
    Headset,
    UserCog,
    BarChart3,
    Bell,
    Settings,
    LogOut,
    Zap,
    MapPin,
    ChevronDown
} from "lucide-react"
import { useState, ReactNode, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { adminApi } from "../services/adminApi"

interface MainLayoutProps {
    children: ReactNode
}

function parseRoleLabel(rawRole: string): string {
    const r = rawRole.toLowerCase().replace(/[_\s-]/g, "")
    if (r === "superadmin" || r === "super") return "Super Admin"
    if (r === "stationadmin" || r === "station") return "Station Admin"
    return rawRole || "Admin"
}

export default function MainLayout({ children }: MainLayoutProps) {
    const navigate = useNavigate()
    const location = useLocation()
    const [selectedStation, setSelectedStation] = useState("All Stations")
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [stations, setStations] = useState<any[]>([])
    const [unreadCount, setUnreadCount] = useState(0)

    // Seed from localStorage immediately so there's no flicker
    const [adminProfile, setAdminProfile] = useState<{ name: string; role: string }>(() => {
        try {
            const stored = localStorage.getItem("admin_details")
            if (stored) {
                const d = JSON.parse(stored)
                return {
                    name: d?.name || d?.fullName || "Admin",
                    role: parseRoleLabel(d?.role || d?.adminType || "")
                }
            }
        } catch { /* ignore */ }
        return { name: "Admin", role: "" }
    })

    useEffect(() => {
        // Fetch stations independently so other failures don't block it
        const fetchStations = async () => {
            try {
                const stationRes = await adminApi.getStations()
                console.log("[MainLayout] raw stationRes:", stationRes)
                const sData = (stationRes as any).data ?? stationRes
                const list = Array.isArray(sData)
                    ? sData
                    : Array.isArray(sData?.stations)
                    ? sData.stations
                    : Array.isArray(sData?.data)
                    ? sData.data
                    : []
                console.log("[MainLayout] parsed stations:", list)
                setStations(list)
            } catch (err) {
                console.error("[MainLayout] stations fetch failed:", err)
            }
        }

        // Fetch notifications independently
        const fetchNotifications = async () => {
            try {
                const notifyRes = await adminApi.getNotifications()
                const nData = (notifyRes as any).data ?? notifyRes
                const nList = Array.isArray(nData) ? nData : (nData?.notifications || [])
                setUnreadCount(nList.filter((n: any) => !n.isRead).length)
            } catch (err) {
                console.error("[MainLayout] notifications fetch failed:", err)
            }
        }

        // Fetch admin profile independently
        const fetchAdminProfile = async () => {
            try {
                const meRes = await adminApi.getAdminDetails()
                const me = (meRes as any)?.data ?? meRes
                const name = me?.name || me?.fullName || "Admin"
                const role = parseRoleLabel(me?.role || me?.adminType || "")
                setAdminProfile({ name, role })
                localStorage.setItem("admin_details", JSON.stringify(me))
            } catch (err) {
                console.error("[MainLayout] admin profile fetch failed:", err)
            }
        }

        fetchStations()
        fetchNotifications()
        fetchAdminProfile()
    }, [])

    const sidebarItems = [
        { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} strokeWidth={2.5} /> },
        { name: "Station Admins", path: "/admin/station-admins", icon: <Settings size={20} strokeWidth={2.5} /> },
        { name: "Add Station", path: "/admin/stations/add", icon: <MapPin size={20} strokeWidth={2.5} /> },
        { name: "User Management", path: "/admin/users", icon: <Headset size={20} strokeWidth={2.5} /> },
        { name: "Owner Management", path: "/admin/owners", icon: <UserCog size={20} strokeWidth={2.5} /> },
        { name: "Fleet Management", path: "/fleet", icon: <Bike size={20} strokeWidth={2.5} /> },
        { name: "Ride Monitoring", path: "/ride-monitoring", icon: <Navigation size={20} strokeWidth={2.5} /> },
        { name: "Booking Control", path: "/booking", icon: <Calendar size={20} strokeWidth={2.5} /> },
        { name: "Maintenance", path: "/maintenance", icon: <Wrench size={20} strokeWidth={2.5} /> },
        { name: "Finance & Ledger", path: "/admin/finance", icon: <Zap size={20} strokeWidth={2.5} /> },
        { name: "Reports", path: "/reports", icon: <BarChart3 size={20} strokeWidth={2.5} /> },
        { name: "Notifications", path: "/notifications", icon: <Bell size={20} strokeWidth={2.5} />, badge: unreadCount > 0 ? unreadCount : undefined },
        { name: "Settings", path: "/settings", icon: <Settings size={20} strokeWidth={2.5} /> },
    ]

    return (
        <div className="flex h-screen bg-white text-slate-900 selection:bg-orange-100">
            {/* Sidebar */}
            <aside className="w-60 border-r border-slate-100 flex flex-col h-full bg-white z-20 shrink-0">
                <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="h-16 w-full px-6 border-b border-slate-100 flex items-center gap-3 shrink-0 text-left hover:bg-slate-50/80 transition-colors"
                >
                    <div className="bg-[#FF6A1F] p-2 rounded-2xl shadow-sm shadow-orange-100">
                        <Bike className="text-white" size={24} strokeWidth={2.5} />
                    </div>
                    <span className="text-lg font-bold text-gray-800">
                        Admin Portal
                    </span>
                </button>

                <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
                    {sidebarItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
                        return (
                            <button
                                key={item.name}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all relative group ${isActive
                                    ? "bg-orange-50 text-orange-600 font-bold shadow-sm shadow-orange-100"
                                    : "text-slate-600 hover:bg-slate-50 font-semibold"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {item.icon}
                                    <span className="text-[13px] tracking-tight">{item.name}</span>
                                </div>
                                {item.badge && (
                                    <span className="bg-orange-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                                {isActive && (
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#FF6A1F] rounded-l-full"></div>
                                )}
                            </button>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-slate-50">
                    <button
                        onClick={() => navigate("/")}
                        className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all font-semibold text-sm"
                    >
                        <LogOut size={20} strokeWidth={2.5} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col bg-slate-50 overflow-hidden relative">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-end px-6 shrink-0">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-100 transition-all"
                            >
                                {selectedStation} <ChevronDown size={16} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>

                            {isDropdownOpen && (
                                <div className="absolute top-full mt-2 left-0 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 overflow-hidden shadow-orange-500/5">
                                    <button
                                        onClick={() => {
                                            setSelectedStation("All Stations");
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-6 py-2.5 text-sm font-bold transition-all ${selectedStation === "All Stations"
                                            ? "text-orange-600 bg-orange-50"
                                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                            }`}
                                    >
                                        All Stations
                                    </button>
                                    <div className="h-px bg-slate-50 my-2 mx-4" />
                                    {stations.map((s) => {
                                        const name = s.name || s.stationName || "Unknown Station";
                                        return (
                                            <button
                                                key={s._id || s.id}
                                                onClick={() => {
                                                    setSelectedStation(name);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={`w-full text-left px-6 py-2.5 text-sm font-bold transition-all ${selectedStation === name
                                                    ? "text-orange-600 bg-orange-50"
                                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                                    }`}
                                            >
                                                {name}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => navigate("/notifications")}
                            className="relative text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                            )}
                        </button>

                        <div className="flex items-center gap-3 pl-2 border-l border-slate-100 cursor-pointer">
                            <div className="text-right">
                                <p className="text-sm font-bold leading-none text-slate-900">{adminProfile?.name ?? "Admin"}</p>
                                <p className="text-[10px] text-slate-400 mt-1 font-medium">{adminProfile?.role ?? "—"}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-sm">
                                {(adminProfile?.name?.[0] ?? "A").toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6">
                    {children}
                </div>
            </main>
        </div>
    )
}
