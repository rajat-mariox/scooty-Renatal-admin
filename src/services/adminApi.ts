import { axiosInstance } from '../lib/axios';
import { API_ENDPOINTS } from '../config/apiConfig';

const ENDPOINTS = API_ENDPOINTS.ADMIN;

export const adminApi = {
  // Auth
  login: async (data: any) => {
    const response = await axiosInstance.post(ENDPOINTS.LOGIN, data);
    return response.data;
  },

  sendOtp: async (data: { email: string }) => {
    const response = await axiosInstance.post(ENDPOINTS.SEND_OTP, data);
    return response.data;
  },

  verifyOtp: async (data: { email: string; transactionId?: string; otp: string }) => {
    const response = await axiosInstance.post(ENDPOINTS.VERIFY_OTP, data);
    return response.data;
  },

  getAdminDetails: async () => {
    const response = await axiosInstance.get(ENDPOINTS.ME);
    return response.data;
  },

  updateAdminDetails: async (data: any) => {
    const response = await axiosInstance.patch(ENDPOINTS.ME, data);
    return response.data;
  },

  changePassword: async (data: any) => {
    const response = await axiosInstance.post(ENDPOINTS.CHANGE_PASSWORD, data);
    return response.data;
  },

  resendOtp: async (data: { transactionId: string }) => {
    const response = await axiosInstance.post(ENDPOINTS.RESEND_OTP, data);
    return response.data;
  },

  forgotPasswordSendOtp: async (data: any) => {
    const response = await axiosInstance.post(ENDPOINTS.FORGOT_PASSWORD.SEND_OTP, data);
    return response.data;
  },

  forgotPasswordResendOtp: async (data: any) => {
    const response = await axiosInstance.post(ENDPOINTS.FORGOT_PASSWORD.RESEND_OTP, data);
    return response.data;
  },

  forgotPasswordReset: async (data: any) => {
    const response = await axiosInstance.post(ENDPOINTS.FORGOT_PASSWORD.RESET, data);
    return response.data;
  },

  // Station Admins
  getStationAdmins: async (params?: any) => {
    const response = await axiosInstance.get(ENDPOINTS.STATION_ADMINS.GET_ALL, { params });
    return response.data;
  },
  createStationAdmin: async (data: any) => {
    const response = await axiosInstance.post(ENDPOINTS.STATION_ADMINS.CREATE, data);
    return response.data;
  },
  updateStationAdminStatus: async (data: any) => {
    const response = await axiosInstance.patch(ENDPOINTS.STATION_ADMINS.UPDATE_STATUS, data);
    return response.data;
  },

  // Stations
  getStations: async (params?: any) => {
    const response = await axiosInstance.get(ENDPOINTS.STATIONS.GET_ALL, { params });
    return response.data;
  },
  addStation: async (data: any) => {
    const response = await axiosInstance.post(ENDPOINTS.STATIONS.ADD, data);
    return response.data;
  },
  updateStation: async (data: any) => {
    const response = await axiosInstance.patch(ENDPOINTS.STATIONS.UPDATE, data);
    return response.data;
  },
  getStationDetails: async (id: string) => {
    const response = await axiosInstance.get(ENDPOINTS.STATIONS.DETAILS(id));
    return response.data;
  },

  // Ride Plans
  getRidePlans: async () => {
    const response = await axiosInstance.get(ENDPOINTS.RIDE_PLANS.GET);
    return response.data;
  },
  addRidePlan: async (data: any) => {
    const response = await axiosInstance.post(ENDPOINTS.RIDE_PLANS.ADD, data);
    return response.data;
  },
  updateRidePlan: async (id: string, data: any) => {
    const response = await axiosInstance.patch(ENDPOINTS.RIDE_PLANS.UPDATE(id), data);
    return response.data;
  },

  // FAQs
  getFaqs: async () => {
    const response = await axiosInstance.get(ENDPOINTS.FAQS.GET);
    return response.data;
  },
  addFaq: async (data: any) => {
    const response = await axiosInstance.post(ENDPOINTS.FAQS.ADD, data);
    return response.data;
  },
  updateFaq: async (id: string, data: any) => {
    const response = await axiosInstance.patch(ENDPOINTS.FAQS.UPDATE(id), data);
    return response.data;
  },

  // Dashboard
  getDashboardStats: async () => {
    const response = await axiosInstance.get(ENDPOINTS.DASHBOARD);
    return response.data;
  },

  // Users
  getUsers: async (params?: any) => {
    const response = await axiosInstance.get(ENDPOINTS.USERS.GET_ALL, { params });
    return response.data;
  },
  updateUser: async (data: any) => {
    const response = await axiosInstance.patch(ENDPOINTS.USERS.UPDATE, data);
    return response.data;
  },

  // Commission
  getCommission: async () => {
    const response = await axiosInstance.get(ENDPOINTS.COMMISSION.GET);
    return response.data;
  },
  updateCommission: async (data: any) => {
    const response = await axiosInstance.patch(ENDPOINTS.COMMISSION.UPDATE, data);
    return response.data;
  },

  // Reports
  getReports: async (params?: any) => {
    const response = await axiosInstance.get(ENDPOINTS.REPORTS, { params });
    return response.data;
  },

  // Settlements
  getSettlements: async (params?: any) => {
    const response = await axiosInstance.get(ENDPOINTS.SETTLEMENTS.GET_ALL, { params });
    return response.data;
  },
  addSettlement: async (data: any) => {
    const response = await axiosInstance.post(ENDPOINTS.SETTLEMENTS.ADD, data);
    return response.data;
  },
  updateSettlement: async (data: any) => {
    const response = await axiosInstance.patch(ENDPOINTS.SETTLEMENTS.UPDATE, data);
    return response.data;
  },

  // Others
  getAuditLogs: async (params?: any) => {
    const response = await axiosInstance.get(ENDPOINTS.AUDIT_LOGS, { params });
    return response.data;
  },
  getPricing: async () => {
    const response = await axiosInstance.get(ENDPOINTS.PRICING.GET);
    return response.data;
  },
  updatePricing: async (data: any) => {
    const response = await axiosInstance.patch(ENDPOINTS.PRICING.UPDATE, data);
    return response.data;
  },
  getTransactions: async (params?: any) => {
    const response = await axiosInstance.get(ENDPOINTS.TRANSACTIONS, { params });
    return response.data;
  },
  getBookingDetails: async (id: string) => {
    throw new Error('Endpoint not available in admin/super-admin panel');
  },
  getBookings: async (params?: any) => {
    throw new Error('Endpoint not available in admin/super-admin panel');
  },
  approveBooking: async (data: any) => {
    throw new Error('Endpoint not available in admin/super-admin panel');
  },
  refund: async (data: any) => {
    throw new Error('Endpoint not available in admin/super-admin panel');
  },
  getLedger: async (params?: any) => {
    const response = await axiosInstance.get(ENDPOINTS.LEDGER, { params });
    return response.data;
  },

  // Vehicles
  getVehicles: async (params?: any) => {
    throw new Error('Endpoint not available in admin/super-admin panel');
  },
  addVehicle: async (data: any) => {
    throw new Error('Endpoint not available in admin/super-admin panel');
  },
  updateVehicleStatus: async (data: any) => {
    throw new Error('Endpoint not available in admin/super-admin panel');
  },
  getVehicleDetails: async (id: string) => {
    throw new Error('Endpoint not available in admin/super-admin panel');
  },

  // Rides
  getRides: async (params?: any) => {
    throw new Error('Endpoint not available in admin/super-admin panel');
  },
  getRideDetails: async (id: string) => {
    throw new Error('Endpoint not available in admin/super-admin panel');
  },
  forceEndRide: async (data: any) => {
    throw new Error('Endpoint not available in admin/super-admin panel');
  },
  lockVehicle: async (data: any) => {
    throw new Error('Endpoint not available in admin/super-admin panel');
  },

  // Notifications
  getNotifications: async () => {
    throw new Error('Endpoint not available in admin/super-admin panel');
  },
  readNotification: async (data: any) => {
    throw new Error('Endpoint not available in admin/super-admin panel');
  },
  readAllNotifications: async () => {
    throw new Error('Endpoint not available in admin/super-admin panel');
  },

  // Tickets / User Support
  getTickets: async (params?: any) => {
    const response = await axiosInstance.get(ENDPOINTS.TICKETS.GET, { params });
    return response.data;
  },
  getTicketDetail: async (id: string) => {
    const response = await axiosInstance.get(ENDPOINTS.TICKETS.DETAILS(id));
    return response.data;
  },
  updateTicketStatus: async (data: any) => {
    const response = await axiosInstance.patch(ENDPOINTS.TICKETS.UPDATE_STATUS, data);
    return response.data;
  },
  escalateTicket: async (id: string) => {
    const response = await axiosInstance.patch(ENDPOINTS.TICKETS.ESCALATE, { ticketId: id });
    return response.data;
  },

  // Maintenance
  getMaintenanceLogs: async (params?: any) => {
    throw new Error('Endpoint not available in admin/super-admin panel');
  },
  createMaintenanceLog: async (data: any) => {
    throw new Error('Endpoint not available in admin/super-admin panel');
  },
  updateMaintenanceStatus: async (data: any) => {
    throw new Error('Endpoint not available in admin/super-admin panel');
  },
  // Admin Management (sub-admins)
  createSubAdmin: async (data: any) => {
    const response = await axiosInstance.post(ENDPOINTS.ADMIN_MANAGEMENT.CREATE, data);
    return response.data;
  },
  getSubAdmins: async (params?: any) => {
    const response = await axiosInstance.get(ENDPOINTS.ADMIN_MANAGEMENT.GET_ALL, { params });
    return response.data;
  },
  updateSubAdmin: async (data: any) => {
    const response = await axiosInstance.patch(ENDPOINTS.ADMIN_MANAGEMENT.UPDATE, data);
    return response.data;
  },
};
