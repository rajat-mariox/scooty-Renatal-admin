import { axiosInstance } from '../lib/axios';
import { API_ENDPOINTS } from '../config/apiConfig';

const ENDPOINTS = API_ENDPOINTS.STATION_ADMIN;

export const stationAdminApi = {
  // POST login
  login: async (data: any) => {
    const response = await axiosInstance.post(ENDPOINTS.LOGIN, data);
    return response.data;
  },

  // POST send-otp
  sendOtp: async (data: { email: string }) => {
    const response = await axiosInstance.post(ENDPOINTS.SEND_OTP, data);
    return response.data;
  },

  // POST verify-otp
  verifyOtp: async (data: { email: string; transactionId?: string; otp: string }) => {
    const response = await axiosInstance.post(ENDPOINTS.VERIFY_OTP, data);
    return response.data;
  },

  // GET getStationAdminDetails
  getStationAdminDetails: async () => {
    const response = await axiosInstance.get(ENDPOINTS.ME);
    return response.data;
  },

  // PATCH updateStationAdmin
  updateStationAdmin: async (data: any) => {
    const response = await axiosInstance.patch(ENDPOINTS.ME, data);
    return response.data;
  },

  // POST change-password
  changePassword: async (data: any) => {
    const response = await axiosInstance.post(ENDPOINTS.CHANGE_PASSWORD, data);
    return response.data;
  },

  // POST resend OTP
  resendOtp: async (data: { transactionId: string }) => {
    const response = await axiosInstance.post(ENDPOINTS.RESEND_OTP, data);
    return response.data;
  },

  // POST /auth/forgot-password/send-otp
  forgotPasswordSendOtp: async (data: any) => {
    const response = await axiosInstance.post(ENDPOINTS.FORGOT_PASSWORD.SEND_OTP, data);
    return response.data;
  },

  // POST auth/forgot-password/resend-otp
  forgotPasswordResendOtp: async (data: any) => {
    const response = await axiosInstance.post(ENDPOINTS.FORGOT_PASSWORD.RESEND_OTP, data);
    return response.data;
  },

  // POST forgot-password/reset
  forgotPasswordReset: async (data: any) => {
    const response = await axiosInstance.post(ENDPOINTS.FORGOT_PASSWORD.RESET, data);
    return response.data;
  },

  // ─── Ride Plans ───
  getRidePlans: async () => {
    const response = await axiosInstance.get(ENDPOINTS.RIDE_PLANS.GET);
    return response.data;
  },
  addRidePlan: async (data: any) => {
    const response = await axiosInstance.post(ENDPOINTS.RIDE_PLANS.ADD, data);
    return response.data;
  },

  // ─── FAQs ───
  getFaqs: async () => {
    const response = await axiosInstance.get(ENDPOINTS.FAQS.GET);
    return response.data;
  },
  addFaq: async (data: any) => {
    const response = await axiosInstance.post(ENDPOINTS.FAQS.ADD, data);
    return response.data;
  },

  // ─── Vehicles ───
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

  // ─── Dashboard ───
  getDashboardStats: async () => {
    const response = await axiosInstance.get(ENDPOINTS.DASHBOARD);
    return response.data;
  },

  // ─── Bookings ───
  getBookings: async (params?: any) => {
    const response = await axiosInstance.get(ENDPOINTS.BOOKINGS.GET, { params });
    return response.data;
  },
  getBookingDetail: async (id: string) => {
    const response = await axiosInstance.get(ENDPOINTS.BOOKINGS.DETAILS(id));
    return response.data;
  },
  approveBooking: async (data: any) => {
    const response = await axiosInstance.patch(ENDPOINTS.BOOKINGS.APPROVE, data);
    return response.data;
  },

  // ─── Rides ───
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

  // ─── Notifications ───
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

  // ─── Reports ───
  getReports: async (params?: any) => {
    const response = await axiosInstance.get(ENDPOINTS.REPORTS, { params });
    return response.data;
  },

  // ─── Tickets / User Support ───
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

  // ─── Maintenance ───
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

