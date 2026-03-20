import {
    User,
    Lock
} from "lucide-react"
import MainLayout from "../layouts/MainLayout"

export default function Settings() {
    return (
        <MainLayout>
            <div className="space-y-8 max-w-[1100px] ml-4 font-['Poppins']">

                {/* Header Section */}
                <div className="space-y-1">
                    <h2 className="text-[22px] font-bold text-slate-800 tracking-tight">Settings</h2>
                    <p className="text-slate-400 font-medium text-[14px]">Manage your account and preferences</p>
                </div>

                {/* Profile Information Card */}
                <div className="bg-white rounded-[1.2rem] border border-slate-100 shadow-sm shadow-slate-200/20 p-10">
                    <div className="flex items-center gap-3 mb-8">
                        <User size={20} className="text-slate-400" />
                        <h3 className="text-[16px] font-bold text-slate-800">Profile Information</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[13px] font-semibold text-slate-400 ml-1">Full Name</label>
                            <input
                                type="text"
                                defaultValue="Admin User"
                                className="w-full h-[52px] bg-white border border-slate-200 rounded-xl px-6 text-[14px] font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-orange-200 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[13px] font-semibold text-slate-400 ml-1">Email Address</label>
                            <input
                                type="email"
                                defaultValue="admin@evstation.com"
                                className="w-full h-[52px] bg-white border border-slate-200 rounded-xl px-6 text-[14px] font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-orange-200 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[13px] font-semibold text-slate-400 ml-1">Phone Number</label>
                            <input
                                type="text"
                                defaultValue="+91 98765 43210"
                                className="w-full h-[52px] bg-white border border-slate-200 rounded-xl px-6 text-[14px] font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-orange-200 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[13px] font-semibold text-slate-400 ml-1">Station</label>
                            <input
                                type="text"
                                defaultValue="Station A"
                                className="w-full h-[52px] bg-white border border-slate-200 rounded-xl px-6 text-[14px] font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-orange-200 transition-all"
                            />
                        </div>

                        <div className="pt-2">
                            <button className="px-10 h-12 bg-[#FF6A1F] text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 text-[14px]">
                                Update Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Change Password Card */}
                <div className="bg-white rounded-[1.2rem] border border-slate-100 shadow-sm shadow-slate-200/20 p-10">
                    <div className="flex items-center gap-3 mb-8">
                        <Lock size={20} className="text-slate-400" />
                        <h3 className="text-[16px] font-bold text-slate-800">Change Password</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[13px] font-semibold text-slate-400 ml-1">Current Password</label>
                            <input
                                type="password"
                                placeholder="Enter current password"
                                className="w-full h-[52px] bg-white border border-slate-200 rounded-xl px-6 text-[14px] font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-orange-200 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[13px] font-semibold text-slate-400 ml-1">New Password</label>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                className="w-full h-[52px] bg-white border border-slate-200 rounded-xl px-6 text-[14px] font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-orange-200 transition-all"
                            />
                        </div>

                        <div className="pt-2">
                            <button className="px-10 h-12 bg-[#FF6A1F] text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 text-[14px]">
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}
