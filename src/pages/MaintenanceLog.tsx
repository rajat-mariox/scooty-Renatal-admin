import {
    Plus,
    ChevronDown,
    Upload,
    X
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState, useRef } from "react"
import MainLayout from "../layouts/MainLayout"

export default function MaintenanceLog() {
    const navigate = useNavigate()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)])
        }
    }

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <MainLayout>
            <div className="p-8 max-w-4xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="space-y-1">
                    <h2 className="text-xl font-bold text-slate-900">Add Maintenance Record</h2>
                    <p className="text-slate-500 text-sm font-medium">Report a new maintenance issue or service</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10 space-y-8">

                    {/* Select Vehicle */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Select Vehicle</label>
                        <div className="relative">
                            <select className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all cursor-pointer">
                                <option>SC001 - Ola S1 Pro</option>
                                <option>SC002 - TVS iQube</option>
                                <option>SC003 - TVS iQube</option>
                            </select>
                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        </div>
                    </div>

                    {/* Issue Type */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Issue Type</label>
                        <div className="relative">
                            <select className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-400 appearance-none focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all cursor-pointer">
                                <option value="" disabled selected>Select Issue Type</option>
                                <option>Battery Replacement</option>
                                <option>Brake Service</option>
                                <option>Tire Change</option>
                                <option>General Service</option>
                            </select>
                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Description</label>
                        <textarea
                            placeholder="Describe the issue in detail..."
                            className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium text-slate-700 min-h-[140px] focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all resize-none"
                        ></textarea>
                    </div>

                    {/* Estimated Cost */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Cost (Optional)</label>
                        <input
                            type="text"
                            placeholder="Enter cost in ₹"
                            className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all"
                        />
                    </div>

                    {/* Upload Photos */}
                    <div className="space-y-4">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Upload Photos (Optional)</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-100 rounded-3xl p-10 flex flex-col items-center justify-center gap-4 hover:border-orange-100 hover:bg-orange-50/10 transition-all cursor-pointer group"
                        >
                            <div className="bg-slate-50 p-4 rounded-full group-hover:bg-white group-hover:shadow-lg transition-all">
                                <Upload className="text-slate-300 group-hover:text-orange-500" size={32} />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-bold text-slate-400">Click to upload or drag and drop</p>
                                <p className="text-[10px] text-slate-300 mt-1 font-bold">PNG, JPG up to 10MB</p>
                            </div>
                        </div>

                        {selectedFiles.length > 0 && (
                            <div className="flex flex-wrap gap-3 mt-4">
                                {selectedFiles.map((file, index) => (
                                    <div key={index} className="flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-xl text-xs font-bold border border-orange-100">
                                        <span className="truncate max-w-[150px]">{file.name}</span>
                                        <button onClick={(e) => { e.stopPropagation(); removeFile(index); }}>
                                            <X size={14} className="hover:text-orange-800" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Form Actions */}
                    <div className="grid grid-cols-2 gap-6 pt-4">
                        <button
                            onClick={() => navigate("/maintenance")}
                            className="w-full py-4 border-2 border-orange-600 rounded-2xl text-orange-600 font-extrabold text-sm hover:bg-orange-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button className="w-full py-4 bg-[#FF6A1F] shadow-lg shadow-orange-100 text-white font-extrabold rounded-2xl hover:bg-orange-600 transition-all text-sm">
                            Save Maintenance Record
                        </button>
                    </div>

                </div>

            </div>
        </MainLayout>
    )
}
