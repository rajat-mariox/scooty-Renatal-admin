import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Notifications from "./pages/Notifications"
import FleetManagement from "./pages/FleetManagement"
import FleetDetail from "./pages/FleetDetail"
import RideMonitoring from "./pages/RideMonitoring"
import RideDetail from "./pages/RideDetail"
import MaintenanceHistory from "./pages/MaintenanceHistory"
import MaintenanceLog from "./pages/MaintenanceLog"
import MaintenanceDetail from "./pages/MaintenanceDetail"
import BookingControl from "./pages/BookingControl"
import UserSupport from "./pages/UserSupport"
import ComplaintDetail from "./pages/ComplaintDetail"
import Reports from "./pages/Reports"
import Settings from "./pages/Settings"




function App() {
  return (
    <Router>
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

        {/* Ride Monitoring */}
        <Route path="/ride-monitoring" element={<RideMonitoring />} />
        <Route path="/ride/details" element={<RideDetail />} />

        {/* Maintenance */}
        <Route path="/maintenance" element={<MaintenanceHistory />} />
        <Route path="/maintenance/new" element={<MaintenanceLog />} />
        <Route path="/maintenance/details" element={<MaintenanceDetail />} />
      </Routes>
    </Router>
  )
}

export default App