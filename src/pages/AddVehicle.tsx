import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import PrimaryButton from "../components/PrimaryButton";
import { adminApi } from "../services/adminApi";
import {
  ArrowLeft,
  Save,
  MapPin,
  Zap,
  Hash,
  Activity,
  RefreshCw,
  X
} from "lucide-react";

export default function AddVehicle() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vehicleId: "", // Or you can let the backend generate it and leave this blank
    registrationNo: "",
    model: "Ola S1 Pro",
    station: "Station A",
    status: "Active",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.registrationNo) {
      setError("Registration Number is required");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await adminApi.addVehicle({
        registrationNo: formData.registrationNo,
        model: formData.model,
        stationId: formData.station, // Ensure this maps to what the backend expects
        status: formData.status
      });
      navigate("/fleet");
    } catch (err: any) {
      console.error("Failed to add vehicle:", err);
      setError(err.response?.data?.message || "Failed to add vehicle");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-400 hover:text-[#1E293B] font-bold text-sm mb-4 transition-colors"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <h2 className="text-2xl font-extrabold text-[#1E293B]">
              Add New Vehicle
            </h2>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Register a new scooty into the fleet system
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100/80 shadow-sm p-8">

          {error && (
            <div className="mb-8 bg-rose-50 text-rose-600 px-6 py-4 rounded-xl text-sm font-bold border border-rose-100 flex items-center justify-between">
              <span>{error}</span>
              <button type="button" onClick={() => setError(null)}><X size={16} /></button>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">
                  Vehicle Details
                </h3>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DL 03 SC 1234"
                    value={formData.registrationNo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        registrationNo: e.target.value,
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Model
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Zap size={18} className="text-slate-400" />
                    </div>
                    <select
                      value={formData.model}
                      onChange={(e) =>
                        setFormData({ ...formData, model: e.target.value })
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all appearance-none cursor-pointer"
                    >
                      <option>Ola S1 Pro</option>
                      <option>Ather 450X</option>
                      <option>TVS iQube</option>
                      <option>Bajaj Chetak</option>
                      <option>Ola S1 Air</option>
                      <option>Simple One</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">
                  Deployment Status
                </h3>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Assigned Station
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MapPin size={18} className="text-slate-400" />
                    </div>
                    <select
                      value={formData.station}
                      onChange={(e) =>
                        setFormData({ ...formData, station: e.target.value })
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all appearance-none cursor-pointer"
                    >
                      <option>Station A</option>
                      <option>Station B</option>
                      <option>Station C</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Initial Status
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Activity size={18} className="text-slate-400" />
                    </div>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all appearance-none cursor-pointer"
                    >
                      <option>Active</option>
                      <option>Maintenance</option>
                    </select>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium pt-1">
                    New vehicles are usually set to Active or Maintenance for
                    initial inspection.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-8 flex items-center justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
                className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <PrimaryButton
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 text-sm hover:-translate-y-0.5 disabled:hover:translate-y-0"
              >
                {isSubmitting ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                Save Vehicle
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
