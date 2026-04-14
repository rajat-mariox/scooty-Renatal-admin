import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { lazy, Suspense } from "react"

// Lazy load components
const Login = lazy(() => import("./pages/Login"))
const Dashboard = lazy(() => import("./pages/Dashboard"))
const Notifications = lazy(() => import("./pages/Notifications"))
const FleetManagement = lazy(() => import("./pages/FleetManagement"))
const FleetDetail = lazy(() => import("./pages/FleetDetail"))
const RideMonitoring = lazy(() => import("./pages/RideMonitoring"))
const RideDetail = lazy(() => import("./pages/RideDetail"))
const MaintenanceHistory = lazy(() => import("./pages/MaintenanceHistory"))
const MaintenanceLog = lazy(() => import("./pages/MaintenanceLog"))
const MaintenanceDetail = lazy(() => import("./pages/MaintenanceDetail"))
const BookingControl = lazy(() => import("./pages/BookingControl"))
const UserSupport = lazy(() => import("./pages/UserSupport"))
const ComplaintDetail = lazy(() => import("./pages/ComplaintDetail"))
const Reports = lazy(() => import("./pages/Reports"))
const Settings = lazy(() => import("./pages/Settings"))
const AddVehicle = lazy(() => import("./pages/AddVehicle"))
const StationAdmins = lazy(() => import("./pages/admin/StationAdmins"))
const AddStation = lazy(() => import("./pages/admin/AddStation"))
const UserManagement = lazy(() => import("./pages/admin/UserManagement"))
const OwnerManagement = lazy(() => import("./pages/admin/OwnerManagement"))
const UserDetail = lazy(() => import("./pages/admin/UserDetail"))
const Finance = lazy(() => import("./pages/admin/Finance"))

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen bg-slate-50">
    <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
  </div>
)

function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/booking" element={<BookingControl />} />
          <Route path="/support" element={<UserSupport />} />
          <Route path="/support/detail" element={<ComplaintDetail />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />

          {/* Fleet Management */}
          <Route path="/fleet" element={<FleetManagement />} />
          <Route path="/fleet/details" element={<FleetDetail />} />
          <Route path="/add-vehicle" element={<AddVehicle />} />

          {/* Ride Monitoring */}
          <Route path="/ride-monitoring" element={<RideMonitoring />} />
          <Route path="/ride/details" element={<RideDetail />} />

          {/* Maintenance */}
          <Route path="/maintenance" element={<MaintenanceHistory />} />
          <Route path="/maintenance/new" element={<MaintenanceLog />} />
          <Route path="/maintenance/details" element={<MaintenanceDetail />} />

          {/* Admin Specific Routes */}
          <Route path="/admin/station-admins" element={<StationAdmins />} />
          <Route path="/admin/stations/add" element={<AddStation />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/owners" element={<OwnerManagement />} />
          <Route path="/admin/users/:userId" element={<UserDetail />} />
          <Route path="/admin/owners/:userId" element={<UserDetail />} />
          <Route path="/admin/finance" element={<Finance />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
