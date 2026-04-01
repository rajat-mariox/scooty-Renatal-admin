import { API_ENDPOINTS } from '../config/apiConfig';

// Mock data generator helper
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const stationAdminApi = {
  // POST login
  login: async (data: any) => {
    await wait(800);
    // Mock login success
    return {
      success: true,
      code: 1,
      message: 'Login successful',
      data: {
        token: 'mock-jwt-token-' + Date.now(),
        admin: {
          id: 'admin-123',
          name: 'Mock Admin',
          email: data.email || 'admin@example.com',
          role: 'STATION_ADMIN'
        }
      }
    };
  },

  // POST send-otp
  sendOtp: async (data: { email: string }) => {
    await wait(800);
    return {
      success: true,
      code: 1,
      message: 'OTP sent successfully to ' + data.email,
      data: { transactionId: 'mock-tx-' + Math.random().toString(36).substr(2, 9) }
    };
  },

  // POST verify-otp
  verifyOtp: async (data: { email: string; transactionId?: string; otp: string }) => {
    await wait(800);
    return {
      success: true,
      code: 1,
      message: 'OTP verified successfully',
      data: {
        token: 'mock-jwt-token-' + Date.now(),
        admin: {
          id: 'admin-123',
          name: 'Mock Admin',
          email: data.email,
          role: 'STATION_ADMIN'
        }
      }
    };
  },

  // GET getStationAdminDetails
  getStationAdminDetails: async () => {
    await wait(500);
    return {
      success: true,
      code: 1,
      data: {
        id: 'admin-123',
        name: 'Mock Admin',
        email: 'admin@example.com',
        role: 'STATION_ADMIN'
      }
    };
  },

  // PATCH updateStationAdmin
  updateStationAdmin: async (data: any) => {
    await wait(800);
    return { success: true, code: 1, message: 'Profile updated successfully', data };
  },

  // POST change-password
  changePassword: async (data: any) => {
    await wait(1000);
    return { success: true, code: 1, message: 'Password changed successfully' };
  },

  // POST resend OTP
  resendOtp: async (data: { transactionId: string }) => {
    await wait(800);
    return { success: true, code: 1, message: 'OTP resent successfully' };
  },

  // POST /auth/forgot-password/send-otp
  forgotPasswordSendOtp: async (data: any) => {
    await wait(800);
    return {
      success: true,
      code: 1,
      data: { transactionId: 'mock-fp-tx-' + Date.now() }
    };
  },

  // POST auth/forgot-password/resend-otp
  forgotPasswordResendOtp: async (data: any) => {
    await wait(800);
    return { success: true, code: 1 };
  },

  // POST forgot-password/reset
  forgotPasswordReset: async (data: any) => {
    await wait(1000);
    return { success: true, code: 1, message: 'Password reset successfully' };
  },

  // ─── Ride Plans ───
  getRidePlans: async () => {
    await wait(500);
    return {
      success: true,
      code: 1,
      data: [
        { id: '1', name: 'Student Plan', price: 99, duration: '1 Day', description: 'Discounted plan for students' },
        { id: '2', name: 'Weekly Pass', price: 499, duration: '7 Days', description: 'Best for regular commuters' },
        { id: '3', name: 'Monthly Pass', price: 1499, duration: '30 Days', description: 'Ultimate savings for power users' }
      ]
    };
  },
  addRidePlan: async (data: any) => {
    await wait(800);
    return { success: true, code: 1, data: { ...data, id: String(Date.now()) } };
  },

  // ─── FAQs ───
  getFaqs: async () => {
    await wait(500);
    return {
      success: true,
      code: 1,
      data: [
        { id: '1', question: 'How to start a ride?', answer: 'Scan the QR code on the vehicle to start.' },
        { id: '2', question: 'What if battery runs out?', answer: 'The bike will safely slow down, contact support.' }
      ]
    };
  },
  addFaq: async (data: any) => {
    await wait(800);
    return { success: true, code: 1, data: { ...data, id: String(Date.now()) } };
  },

  // ─── Vehicles ───
  getVehicles: async (params?: any) => {
    await wait(800);
    return {
      success: true,
      code: 1,
      data: {
        vehicles: [
          { vehicleId: 'SC-1001', model: 'Ola S1 Pro', batteryLevel: 85, status: 'Active', location: 'Station A', lastRide: '2 hours ago' },
          { vehicleId: 'SC-1002', model: 'Ather 450X', batteryLevel: 12, status: 'Charging', location: 'Station A', lastRide: '4 hours ago' },
          { vehicleId: 'SC-1003', model: 'TVS iQube', batteryLevel: 45, status: 'In Ride', location: 'Near Central Park', lastRide: 'ongoing' },
          { vehicleId: 'SC-1004', model: 'Bajaj Chetak', batteryLevel: 0, status: 'Maintenance', location: 'Service Center', lastRide: '1 day ago' },
          { vehicleId: 'SC-1005', model: 'Ola S1 Air', batteryLevel: 92, status: 'Active', location: 'Station A', lastRide: '1 hour ago' },
        ]
      }
    };
  },
  addVehicle: async (data: any) => {
    await wait(1000);
    return { success: true, code: 1, data: { ...data, id: 'SC-' + Math.floor(1000 + Math.random() * 9000) } };
  },
  updateVehicleStatus: async (data: any) => {
    await wait(800);
    return { success: true, code: 1, message: 'Vehicle status updated to ' + data.status };
  },
  getVehicleDetails: async (id: string) => {
    await wait(600);
    return {
      success: true,
      code: 1,
      data: {
        vehicleId: id,
        model: 'Ola S1 Pro',
        registrationNumber: 'DL 03 SC 1234',
        status: 'Active',
        batteryLevel: 85,
        location: 'Station A',
        documents: { insurance: true, registration: true, pollution: true },
        stats: { totalRides: 142, totalEarnings: 12540, totalDistance: 840 },
        rides: [
          { id: 'R-9821', user: { name: 'John Doe' }, date: new Date().toISOString(), duration: '24 mins', distance: 4.2, fare: 65 },
          { id: 'R-9815', user: { name: 'Alice Smith' }, date: new Date(Date.now() - 86400000).toISOString(), duration: '15 mins', distance: 2.8, fare: 42 }
        ],
        maintenanceLogs: [
          { id: 'L-501', date: new Date(Date.now() - 7 * 86400000).toISOString(), type: 'Routine Check', status: 'Completed', cost: 450 }
        ]
      }
    };
  },

  // ─── Dashboard ───
  getDashboardStats: async () => {
    await wait(800);
    return {
      success: true,
      code: 1,
      data: {
        stats: { total: 42, active: 28, inRide: 8, maintenance: 4, charging: 2 },
        activities: [
          { type: 'ride', title: 'Ride Started', description: 'Vehicle SC-1005 started by User #RA-42', time: '2 mins ago' },
          { type: 'alert', title: 'Low Battery', description: 'Vehicle SC-1002 reached 12% battery', time: '15 mins ago' },
          { type: 'ride', title: 'Ride Ended', description: 'Ride completed at Station B (Fare: ₹54)', time: '45 mins ago' }
        ],
        alerts: [
          { title: 'Battery Critical', description: '3 vehicles below 10%', time: 'Just now' },
          { title: 'Service Due', description: 'Vehicle SC-1004 requires monthly checkup', time: '1 hour ago' }
        ]
      }
    };
  },

  // ─── Bookings ───
  getBookings: async (params?: any) => {
    await wait(800);
    return {
      success: true,
      code: 1,
      data: [
        { id: 'BK-5001', userName: 'Rajesh Kumar', planName: 'Weekly Pass', amount: 499, status: 'Pending', createdAt: new Date().toISOString() },
        { id: 'BK-5002', userName: 'Priya Singh', planName: 'Student Plan', amount: 99, status: 'Approved', createdAt: new Date(Date.now() - 3600000).toISOString() }
      ]
    };
  },
  getBookingDetail: async (id: string) => {
    await wait(600);
    return {
      success: true,
      code: 1,
      data: {
        id,
        userName: 'Rajesh Kumar',
        planName: 'Weekly Pass',
        amount: 499,
        status: 'Pending',
        createdAt: new Date().toISOString(),
        paymentId: 'PAY-8821',
        userEmail: 'rajesh@example.com'
      }
    };
  },
  approveBooking: async (data: any) => {
    await wait(800);
    return { success: true, code: 1, message: 'Booking approved successfully' };
  },

  // ─── Rides ───
  getRides: async (params?: any) => {
    await wait(800);
    return {
      success: true,
      code: 1,
      data: [
        { id: 'R-8801', userName: 'John Doe', vehicleId: 'SC-1003', startTime: new Date().toISOString(), status: 'Ongoing', fare: 45 },
        { id: 'R-8802', userName: 'Sarah Lee', vehicleId: 'SC-1001', startTime: new Date(Date.now() - 7200000).toISOString(), status: 'Completed', fare: 85 }
      ]
    };
  },
  getRideDetails: async (id: string) => {
    await wait(600);
    return {
      success: true,
      code: 1,
      data: {
        id,
        userName: 'John Doe',
        vehicleId: 'SC-1003',
        status: 'Ongoing',
        startTime: new Date().toISOString(),
        startLocation: 'Station A',
        currentLocation: 'Sector 42, Metro Road',
        batteryUsed: '5%',
        distanceCovered: '1.2 km'
      }
    };
  },
  forceEndRide: async (data: any) => {
    await wait(800);
    return { success: true, code: 1, message: 'Ride ended forcibly' };
  },
  lockVehicle: async (data: any) => {
    await wait(800);
    return { success: true, code: 1, message: 'Vehicle locked' };
  },

  // ─── Notifications ───
  getNotifications: async () => {
    await wait(600);
    return {
      success: true,
      code: 1,
      data: [
        { id: '1', title: 'Low Battery Alert', description: 'Vehicle SC-1002 is at 12%', type: 'battery', isRead: false, createdAt: new Date().toISOString() },
        { id: '2', title: 'Maintenance Overdue', description: 'Vehicle SC-1004 checkup is delayed', type: 'maintenance', isRead: false, createdAt: new Date(Date.now() - 86400000).toISOString() },
        { id: '3', title: 'Geofence Breach', description: 'Vehicle SC-1003 left service area', type: 'geo', isRead: true, createdAt: new Date(Date.now() - 172800000).toISOString() }
      ]
    };
  },
  readNotification: async (data: any) => {
    await wait(300);
    return { success: true, code: 1 };
  },
  readAllNotifications: async () => {
    await wait(500);
    return { success: true, code: 1 };
  },

  // ─── Reports ───
  getReports: async (params?: any) => {
    await wait(1000);
    return {
      success: true,
      code: 1,
      data: {
        summary: { totalRides: 1250, revenue: 45800, activeUsers: 840 },
        dailyRevenue: [
          { date: '2026-03-20', amount: 4500 },
          { date: '2026-03-21', amount: 5200 },
          { date: '2026-03-22', amount: 4800 },
          { date: '2026-03-23', amount: 6100 },
          { date: '2026-03-24', amount: 5500 }
        ]
      }
    };
  },

  // ─── Tickets / User Support ───
  getTickets: async (params?: any) => {
    await wait(800);
    return {
      success: true,
      code: 1,
      data: [
        { id: 'TK-301', userName: 'Amit Shah', subject: 'Refund Issue', priority: 'High', status: 'Open', createdAt: new Date().toISOString() },
        { id: 'TK-302', userName: 'Vikram Das', subject: 'Vehicle Not Starting', priority: 'Medium', status: 'In Progress', createdAt: new Date(Date.now() - 3600000).toISOString() }
      ]
    };
  },
  getTicketDetail: async (id: string) => {
    await wait(600);
    return {
      success: true,
      code: 1,
      data: {
        id,
        userName: 'Amit Shah',
        subject: 'Refund Issue',
        description: 'I was charged twice for my last ride. Please refund one transaction.',
        status: 'Open',
        priority: 'High',
        createdAt: new Date().toISOString(),
        messages: [
          { sender: 'Amit Shah', text: 'I have attached the screenshot.', time: '2 hours ago' }
        ]
      }
    };
  },
  updateTicketStatus: async (data: any) => {
    await wait(800);
    return { success: true, code: 1, message: 'Ticket status updated' };
  },
  escalateTicket: async (id: string) => {
    await wait(800);
    return { success: true, code: 1, message: 'Ticket escalated to Super Admin' };
  },

  // ─── Maintenance ───
  getMaintenanceLogs: async (params?: any) => {
    await wait(800);
    return {
      success: true,
      code: 1,
      data: [
        { id: 'ML-901', vehicleId: 'SC-1004', issueType: 'Brake Failure', status: 'In Progress', reportedAt: new Date().toISOString() },
        { id: 'ML-895', vehicleId: 'SC-1002', issueType: 'Tire Pressure', status: 'Completed', reportedAt: new Date(Date.now() - 86400000).toISOString() }
      ]
    };
  },
  createMaintenanceLog: async (data: any) => {
    await wait(1000);
    return { success: true, code: 1, message: 'Maintenance request created', data: { ...data, id: 'ML-' + Date.now() } };
  },
  updateMaintenanceStatus: async (data: any) => {
    await wait(800);
    return { success: true, code: 1, message: 'Maintenance status updated' };
  },

  // ─── Station ───
  getStation: async () => {
    await wait(500);
    return {
      success: true,
      code: 1,
      data: { id: 'STN-A', name: 'Station A', location: 'Central Market', capacity: 50, currentVehicles: 32 }
    };
  },

  getStations: async () => {
    await wait(600);
    return {
      success: true,
      code: 1,
      data: [
        { id: 'STN-A', name: 'Station A' },
        { id: 'STN-B', name: 'Station B' },
        { id: 'STN-C', name: 'Station C' }
      ]
    };
  },
};
