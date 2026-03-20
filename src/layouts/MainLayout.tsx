import {
    LayoutDashboard,
    Bike,
    Navigation,
    Calendar,
    Wrench,
    Headset,
    BarChart3,
    Bell,
    Settings,
    LogOut,
    Zap,
    X,
    ChevronDown
} from "lucide-react"
import { useState, ReactNode } from "react"
import { useNavigate, useLocation } from "react-router-dom"

interface MainLayoutProps {
    children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
    const navigate = useNavigate()
    const location = useLocation()
    const [selectedStation, setSelectedStation] = useState("Station A")
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const stations = ["Station A", "Station B", "Station C"];

    const sidebarItems = [
        { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} strokeWidth={2.5} /> },
        { name: "Fleet Management", path: "/fleet", icon: <Bike size={20} strokeWidth={2.5} /> },
        { name: "Ride Monitoring", path: "/ride-monitoring", icon: <Navigation size={20} strokeWidth={2.5} /> },
        { name: "Booking Control", path: "/booking", icon: <Calendar size={20} strokeWidth={2.5} /> },
        { name: "Maintenance Logs", path: "/maintenance", icon: <Wrench size={20} strokeWidth={2.5} /> },
        { name: "User Support", path: "/support", icon: <Headset size={20} strokeWidth={2.5} /> },
        { name: "Reports", path: "/reports", icon: <BarChart3 size={20} strokeWidth={2.5} /> },
        { name: "Notifications", path: "/notifications", icon: <Bell size={20} strokeWidth={2.5} />, badge: 1 },
        { name: "Settings", path: "/settings", icon: <Settings size={20} strokeWidth={2.5} /> },
    ]

    return (
        <div className="flex h-screen bg-white text-slate-900 selection:bg-orange-100">
            {/* Sidebar */}
            <aside className="w-60 border-r border-slate-100 flex flex-col h-full bg-white z-20 shrink-0">
                <div className="p-6 flex items-center gap-3">
                    <div className="bg-[#FF6A1F] p-2 rounded-2xl shadow-sm shadow-orange-100">
                        <Bike className="text-white" size={24} strokeWidth={2.5} />
                    </div>
                    {/* <span className="font-bold text-xl tracking-tight text-slate-900">Station Admin</span> */}
                    <span className="text-lg font-bold text-gray-800">
                        Station Admin
                    </span>
                </div>

                <nav className="flex-1 px-3 py-2 space-y-1">
                    {sidebarItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
                        return (
                            <button
                                key={item.name}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all relative group ${isActive
                                    ? "bg-orange-50 text-orange-600 font-bold"
                                    : "text-slate-600 hover:bg-slate-50 font-semibold"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {item.icon}
                                    <span className="text-sm tracking-tight">{item.name}</span>
                                </div>
                                {item.badge && (
                                    <span className="bg-orange-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                                {isActive && (
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#FF6A1F] rounded-l-full"></div>
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
                <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-4 text-slate-400 cursor-pointer hover:text-slate-600">
                        <X size={24} />
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-100 transition-all"
                            >
                                {selectedStation} <ChevronDown size={16} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>

                            {isDropdownOpen && (
                                <div className="absolute top-full mt-2 left-0 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 overflow-hidden shadow-orange-500/5">
                                    {stations.map((station) => (
                                        <button
                                            key={station}
                                            onClick={() => {
                                                setSelectedStation(station);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-6 py-2.5 text-sm font-bold transition-all ${selectedStation === station
                                                ? "text-slate-900 bg-slate-50"
                                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                                }`}
                                        >
                                            {station}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={() => navigate("/notifications")}
                            className="relative text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <Bell size={20} />
                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="flex items-center gap-3 pl-2 border-l border-slate-100 cursor-pointer group">
                            <div className="text-right">
                                <p className="text-sm font-bold leading-none text-slate-900">Admin User</p>
                                <p className="text-[10px] text-slate-400 mt-1 font-medium">Station Admin</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-sm">
                                A
                            </div>
                            <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
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
