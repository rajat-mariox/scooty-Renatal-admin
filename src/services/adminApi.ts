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
    const response = await axiosInstance.get(ENDPOINTS.BOOKINGS.DETAILS(id));
    return response.data;
  },
  refund: async (data: any) => {
    const response = await axiosInstance.patch(ENDPOINTS.REFUND, data);
    return response.data;
  },
  getLedger: async (params?: any) => {
    const response = await axiosInstance.get(ENDPOINTS.LEDGER, { params });
    return response.data;
  },

  // Vehicles
  getVehicles: async (params?: any) => {
    const response = await axiosInstance.get(ENDPOINTS.VEHICLES.GET, { params });
    return response.data;
  },
  addVehicle: async (data: any) => {
    const response = await axiosInstance.post(ENDPOINTS.VEHICLES.ADD, data);
    return response.data;
  },
  updateVehicleStatus: async (data: any) => {
    const response = await axiosInstance.patch(ENDPOINTS.VEHICLES.UPDATE_STATUS, data);
    return response.data;
  },
  getVehicleDetails: async (id: string) => {
    const response = await axiosInstance.get(ENDPOINTS.VEHICLES.DETAILS(id));
    return response.data;
  },

  // Rides
  getRides: async (params?: any) => {
    const response = await axiosInstance.get(ENDPOINTS.RIDES.GET, { params });
    return response.data;
  },
  getRideDetails: async (id: string) => {
    const response = await axiosInstance.get(ENDPOINTS.RIDES.DETAILS(id));
    return response.data;
  },
  forceEndRide: async (data: any) => {
    const response = await axiosInstance.post(ENDPOINTS.RIDES.FORCE_END, data);
    return response.data;
  },
  lockVehicle: async (data: any) => {
    const response = await axiosInstance.get(ENDPOINTS.RIDES.LOCK_VEHICLE, { params: data });
    return response.data;
  },

  // Notifications
  getNotifications: async () => {
    const response = await axiosInstance.get(ENDPOINTS.NOTIFICATIONS.GET);
    return response.data;
  },
  readNotification: async (data: any) => {
    const response = await axiosInstance.patch(ENDPOINTS.NOTIFICATIONS.READ, data);
    return response.data;
  },
  readAllNotifications: async () => {
    const response = await axiosInstance.patch(ENDPOINTS.NOTIFICATIONS.READ_ALL);
    return response.data;
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
    const response = await axiosInstance.get(ENDPOINTS.MAINTENANCE.GET_LOGS, { params });
    return response.data;
  },
  createMaintenanceLog: async (data: any) => {
    const response = await axiosInstance.post(ENDPOINTS.MAINTENANCE.CREATE_LOG, data);
    return response.data;
  },
  updateMaintenanceStatus: async (data: any) => {
    const response = await axiosInstance.patch(ENDPOINTS.MAINTENANCE.UPDATE_STATUS, data);
    return response.data;
  },
};
