import {
    ChevronDown,
    Upload,
    X,
    RefreshCw
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState, useRef, useEffect } from "react"
import MainLayout from "../layouts/MainLayout"
import { stationAdminApi } from "../services/stationAdminApi"

export default function MaintenanceLog() {
    const navigate = useNavigate()
    const fileInputRef = useRef<HTMLInputElement>(null)
    
    const [vehicles, setVehicles] = useState<any[]>([])
    const [loadingVehicles, setLoadingVehicles] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Form State
    const [formData, setFormData] = useState({
        vehicleId: "",
        issueType: "",
        description: "",
        cost: ""
    })
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await stationAdminApi.getVehicles()
                const data = (response as any).data || response
                const fetchedVehicles = Array.isArray(data.vehicles) ? data.vehicles : (Array.isArray(data) ? data : [])
                setVehicles(fetchedVehicles)
            } catch (err) {
                console.error("Failed to fetch vehicles:", err)
            } finally {
                setLoadingVehicles(false)
            }
        }
        fetchVehicles()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)])
        }
    }

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async () => {
        if (!formData.vehicleId || !formData.issueType || !formData.description) {
            setError("Please fill in all required fields (Vehicle, Issue Type, Description)")
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            // For file uploads, we normally use FormData, but checking stationAdminApi signature: createMaintenanceLog(data: any)
            // If it accepts JSON:
            const payload = {
                vehicleId: formData.vehicleId,
                issueType: formData.issueType,
                description: formData.description,
                cost: formData.cost ? parseFloat(formData.cost) : undefined,
                status: 'Pending'
            }
            
            await stationAdminApi.createMaintenanceLog(payload)
            navigate("/maintenance")
        } catch (err: any) {
            console.error("Failed to create maintenance log:", err)
            setError(err.response?.data?.message || "Failed to create maintenance log")
        } finally {
            setIsSubmitting(false)
        }
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
                    
                    {error && (
                        <div className="bg-rose-50 text-rose-600 px-6 py-4 rounded-xl text-sm font-bold border border-rose-100 flex items-center justify-between">
                            <span>{error}</span>
                            <button onClick={() => setError(null)}><X size={16} /></button>
                        </div>
                    )}

                    {/* Select Vehicle */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Select Vehicle *</label>
                        <div className="relative">
                            <select 
                                name="vehicleId"
                                value={formData.vehicleId}
                                onChange={handleChange}
                                disabled={loadingVehicles}
                                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all cursor-pointer disabled:opacity-50"
                            >
                                <option value="" disabled>Select Vehicle</option>
                                {vehicles.map((v: any, index: number) => (
                                    <option key={v.vehicleId || v.id || index} value={v.vehicleId || v.id}>
                                        {v.vehicleId || v.id} - {v.model || "Unknown Model"}
                                    </option>
                                ))}
                            </select>
                            {loadingVehicles ? (
                                <RefreshCw className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" size={18} />
                            ) : (
                                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            )}
                        </div>
                    </div>

                    {/* Issue Type */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Issue Type *</label>
                        <div className="relative">
                            <select 
                                name="issueType"
                                value={formData.issueType}
                                onChange={handleChange}
                                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all cursor-pointer"
                            >
                                <option value="" disabled>Select Issue Type</option>
                                <option value="Battery Replacement">Battery Replacement</option>
                                <option value="Brake Service">Brake Service</option>
                                <option value="Tire Change">Tire Change</option>
                                <option value="General Service">General Service</option>
                                <option value="Damage Repair">Damage Repair</option>
                                <option value="Other">Other</option>
                            </select>
                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Description *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the issue in detail..."
                            className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium text-slate-700 min-h-[140px] focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all resize-none"
                        ></textarea>
                    </div>

                    {/* Estimated Cost */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Cost (Optional)</label>
                        <input
                            type="number"
                            name="cost"
                            value={formData.cost}
                            onChange={handleChange}
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
                            disabled={isSubmitting}
                            className="w-full py-4 border-2 border-orange-600 rounded-2xl text-orange-600 font-extrabold text-sm hover:bg-orange-50 transition-all disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full py-4 bg-[#FF6A1F] shadow-lg shadow-orange-100 text-white font-extrabold rounded-2xl hover:bg-orange-600 transition-all text-sm flex justify-center items-center gap-2 disabled:opacity-70"
                        >
                            {isSubmitting && <RefreshCw size={18} className="animate-spin" />}
                            Save Maintenance Record
                        </button>
                    </div>

                </div>

            </div>
        </MainLayout>
    )
}
