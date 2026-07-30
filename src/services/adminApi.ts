import { axiosInstance } from '../lib/axios';
import { API_ENDPOINTS } from '../config/apiConfig';

const ENDPOINTS = API_ENDPOINTS.ADMIN;

export const adminApi = {
  // Auth
  login: async (data: any) => {
    const response = await axiosInstance.post(ENDPOINTS.LOGIN, data);
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

  // Station admins
  getStationAdmins: async (params?: any) => {
    const response = await axiosInstance.get(ENDPOINTS.STATION_ADMINS.GET_ALL, { params });
    return response.data;
  },

  createStationAdmin: async (data: any) => {
    const response = await axiosInstance.post(ENDPOINTS.STATION_ADMINS.CREATE, data);
    return response.data;
  },

  updateStationAdmin: async (id: string, data: any) => {
    const response = await axiosInstance.patch(ENDPOINTS.STATION_ADMINS.UPDATE(id), data);
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

  updateStation: async (id: string, data: any) => {
    const response = await axiosInstance.patch(ENDPOINTS.STATIONS.UPDATE(id), data);
    return response.data;
  },

  getStationDetails: async (id: string) => {
    const response = await axiosInstance.get(ENDPOINTS.STATIONS.DETAILS(id));
    return response.data;
  },

  // Content moderation
  getRidePlans: async (params?: any) => {
    const response = await axiosInstance.get(ENDPOINTS.RIDE_PLANS.GET, { params });
    return response.data;
  },

  reviewRidePlan: async (id: string, data: any) => {
    const response = await axiosInstance.patch(ENDPOINTS.RIDE_PLANS.REVIEW(id), data);
    return response.data;
  },

  getFaqs: async (params?: any) => {
    const response = await axiosInstance.get(ENDPOINTS.FAQS.GET, { params });
    return response.data;
  },

  reviewFaq: async (id: string, data: any) => {
    const response = await axiosInstance.patch(ENDPOINTS.FAQS.REVIEW(id), data);
    return response.data;
  },

  // Dashboard
  getDashboardStats: async (params?: any) => {
    const response = await axiosInstance.get(ENDPOINTS.DASHBOARD, { params });
    return response.data;
  },

  // Vehicles
  getVehicles: async (params?: any) => {
    const response = await axiosInstance.get(ENDPOINTS.VEHICLES.GET, { params });
    return response.data;
  },

  addVehicle: async (data: any) => {
    const response = await axiosInstance.post(ENDPOINTS.VEHICLES.CREATE, data);
    return response.data;
  },

  getVehicleDetails: async (vehicleId: string) => {
    const response = await axiosInstance.get(ENDPOINTS.VEHICLES.DETAILS(vehicleId));
    return response.data;
  },

  updateVehicleStatus: async (vehicleId: string, data: any) => {
    const response = await axiosInstance.patch(ENDPOINTS.VEHICLES.UPDATE_STATUS(vehicleId), data);
    return response.data;
  },

  getMaintenanceLogs: async (params?: any) => {
    const response = await axiosInstance.get(ENDPOINTS.MAINTENANCE.GET_LOGS, { params });
    return response.data;
  },

  createMaintenanceLog: async (data: any) => {
    const response = await axiosInstance.post(ENDPOINTS.MAINTENANCE.CREATE_LOG, data);
    return response.data;
  },

  getMaintenanceDetail: async (requestId: string) => {
    const response = await axiosInstance.get(ENDPOINTS.MAINTENANCE.DETAILS(requestId));
    return response.data;
  },

  updateMaintenanceStatus: async (requestId: string, data: any) => {
    const response = await axiosInstance.patch(ENDPOINTS.MAINTENANCE.UPDATE_STATUS(requestId), data);
    return response.data;
  },

  // Users
  getUsers: async (params?: any) => {
    const response = await axiosInstance.get(ENDPOINTS.USERS.GET_ALL, { params });
    return response.data;
  },

  getUserById: async (userId: string) => {
    const response = await axiosInstance.get(`${ENDPOINTS.USERS.GET_ALL}/${userId}`);
    return response.data;
  },

  updateUserStatus: async (userId: string, data: any) => {
    const response = await axiosInstance.patch(ENDPOINTS.USERS.UPDATE_STATUS(userId), data);
    return response.data;
  },

  updateKycStatus: async (userId: string, data: any) => {
    const response = await axiosInstance.patch(ENDPOINTS.USERS.KYC_STATUS(userId), data);
    return response.data;
  },

  // Pricing and commission
  getPricing: async () => {
    const response = await axiosInstance.get(ENDPOINTS.PRICING.GET);
    return response.data;
  },

  updatePricing: async (data: any) => {
    const response = await axiosInstance.patch(ENDPOINTS.PRICING.UPDATE, data);
    return response.data;
  },

  getCommission: async () => {
    const response = await axiosInstance.get(ENDPOINTS.COMMISSION.GET);
    return response.data;
  },

  updateCommission: async (data: any) => {
    const response = await axiosInstance.patch(ENDPOINTS.COMMISSION.UPDATE, data);
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

  updateSettlementStatus: async (settlementId: string, data: any) => {
    const response = await axiosInstance.patch(ENDPOINTS.SETTLEMENTS.UPDATE_STATUS(settlementId), data);
    return response.data;
  },

  // Reports, transactions, ledger
  getReports: async (params?: any) => {
    const response = await axiosInstance.get(ENDPOINTS.REPORTS, { params });
    return response.data;
  },

  getTransactions: async (params?: any) => {
    const response = await axiosInstance.get(ENDPOINTS.TRANSACTIONS, { params });
    return response.data;
  },

  getLedger: async (params?: any) => {
    const response = await axiosInstance.get(ENDPOINTS.LEDGER, { params });
    return response.data;
  },

  getBookingInvoice: async (bookingId: string) => {
    const response = await axiosInstance.get(ENDPOINTS.BOOKINGS.INVOICE(bookingId));
    return response.data;
  },

  getBookingInvoicePdf: async (bookingId: string) => {
    const response = await axiosInstance.get(ENDPOINTS.BOOKINGS.INVOICE_PDF(bookingId), {
      responseType: 'blob',
    });
    return response.data;
  },

  bookingRefund: async (bookingId: string, data: any) => {
    const response = await axiosInstance.patch(ENDPOINTS.BOOKINGS.REFUND(bookingId), data);
    return response.data;
  },

  // Access control and audit logs
  getSubAdmins: async (params?: any) => {
    const response = await axiosInstance.get(ENDPOINTS.ADMIN_MANAGEMENT.GET_ALL, { params });
    return response.data;
  },

  createSubAdmin: async (data: any) => {
    const response = await axiosInstance.post(ENDPOINTS.ADMIN_MANAGEMENT.CREATE, data);
    return response.data;
  },

  updateSubAdmin: async (idOrData: any, maybeData?: any) => {
    if (typeof idOrData === 'string') {
      const response = await axiosInstance.patch(ENDPOINTS.ADMIN_MANAGEMENT.UPDATE(idOrData), maybeData);
      return response.data;
    }
    const adminId = idOrData?.adminId || idOrData?._id || idOrData?.id;
    if (!adminId) return { code: 0, message: 'adminId is required' };
    const response = await axiosInstance.patch(ENDPOINTS.ADMIN_MANAGEMENT.UPDATE(adminId), idOrData);
    return response.data;
  },

  getAuditLogs: async (params?: any) => {
    const response = await axiosInstance.get(ENDPOINTS.AUDIT_LOGS, { params });
    return response.data;
  },

  // Legacy non-admin screens still call these methods.
  // They are not part of /admin APIs, so return safe empty payloads.
  getNotifications: async (params?: any) => {
    const response = await axiosInstance.get(ENDPOINTS.NOTIFICATIONS.GET, { params });
    return response.data;
  },

  readNotification: async (notificationId: string, data?: any) => {
    const response = await axiosInstance.patch(ENDPOINTS.NOTIFICATIONS.READ(notificationId), data);
    return response.data;
  },

  readAllNotifications: async (data?: any) => {
    const response = await axiosInstance.patch(ENDPOINTS.NOTIFICATIONS.READ_ALL, data);
    return response.data;
  },

  // Booking control
  getBookings: async (params?: any) => {
    const response = await axiosInstance.get(ENDPOINTS.BOOKINGS.GET_ALL, { params });
    return response.data;
  },

  getBookingDetails: async (bookingId: string) => {
    const response = await axiosInstance.get(ENDPOINTS.BOOKINGS.DETAILS(bookingId));
    return response.data;
  },

  // Backward-compatible signature: accepts { bookingId, status, note/reason }.
  approveBooking: async (data: any) => {
    const bookingId = data?.bookingId || data?._id || data?.id;
    if (!bookingId) return { code: 0, message: 'bookingId is required' };
    const status = String(data?.status || '').trim().toUpperCase();
    if (status === 'CANCELLED') {
      const response = await axiosInstance.patch(ENDPOINTS.BOOKINGS.CANCEL(bookingId), {
        reason: data?.reason || data?.note || '',
      });
      return response.data;
    }
    const response = await axiosInstance.patch(ENDPOINTS.BOOKINGS.APPROVE(bookingId), {
      note: data?.note || '',
    });
    return response.data;
  },

  cancelBooking: async (bookingId: string, data?: any) => {
    const response = await axiosInstance.patch(ENDPOINTS.BOOKINGS.CANCEL(bookingId), {
      reason: data?.reason || '',
    });
    return response.data;
  },

  // Ride monitoring (list responds with the same bookings/pagination shape as bookings)
  getRides: async (params?: any) => {
    const response = await axiosInstance.get(ENDPOINTS.RIDES.GET_ALL, { params });
    return response.data;
  },

  getRideDetails: async (rideId: string) => {
    const response = await axiosInstance.get(ENDPOINTS.RIDES.DETAILS(rideId));
    return response.data;
  },

  forceEndRide: async (rideId: string, data?: any) => {
    const response = await axiosInstance.post(ENDPOINTS.RIDES.FORCE_END(rideId), {
      note: data?.note || '',
    });
    return response.data;
  },

  lockVehicle: async (rideId: string, data?: any) => {
    const response = await axiosInstance.post(ENDPOINTS.RIDES.LOCK_VEHICLE(rideId), {
      note: data?.note || '',
    });
    return response.data;
  },

  // Support tickets
  getTickets: async (params?: any) => {
    const response = await axiosInstance.get(ENDPOINTS.TICKETS.GET_ALL, { params });
    return response.data;
  },

  getTicketDetail: async (ticketId: string) => {
    const response = await axiosInstance.get(ENDPOINTS.TICKETS.DETAILS(ticketId));
    return response.data;
  },

  updateTicketStatus: async (ticketId: string, data: any) => {
    const response = await axiosInstance.patch(ENDPOINTS.TICKETS.UPDATE_STATUS(ticketId), {
      status: String(data?.status || '').trim().toUpperCase(),
    });
    return response.data;
  },

  escalateTicket: async (ticketId: string, data?: any) => {
    const response = await axiosInstance.patch(ENDPOINTS.TICKETS.ESCALATE(ticketId), {
      note: data?.note || '',
    });
    return response.data;
  },

};
