import { axiosInstance } from '../lib/axios';
import { API_ENDPOINTS } from '../config/apiConfig';

const ENDPOINTS = API_ENDPOINTS.ADMIN;

const emptyListResponse = { code: 1, message: 'success', data: [] };

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

  // This endpoint is not exposed in admin routes; keep compatibility by deriving from list.
  getStationDetails: async (id: string) => {
    const response = await axiosInstance.get(ENDPOINTS.STATIONS.GET_ALL);
    const payload = (response as any)?.data?.data ?? (response as any)?.data;
    const stations = Array.isArray(payload) ? payload : (payload?.stations || []);
    const station = stations.find((s: any) => String(s?._id || s?.id || s?.stationId) === String(id));
    return { code: 1, message: 'success', data: station || null };
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

  // Backward-compatible helper used by current Settings page.
  updateUser: async (userIdOrData: any, maybeData?: any) => {
    if (typeof userIdOrData === 'string') {
      const response = await axiosInstance.patch(ENDPOINTS.USERS.UPDATE_STATUS(userIdOrData), maybeData);
      return response.data;
    }
    const userId = userIdOrData?._id || userIdOrData?.id || userIdOrData?.userId;
    const isActive = userIdOrData?.isActive ?? true;
    const note = userIdOrData?.note || 'Updated from admin panel';
    if (!userId) return { code: 0, message: 'userId is required' };
    const response = await axiosInstance.patch(ENDPOINTS.USERS.UPDATE_STATUS(userId), { isActive, note });
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

  // Backward-compatible alias
  updateSettlement: async (data: any) => {
    const settlementId = data?.settlementId || data?._id || data?.id;
    if (!settlementId) return { code: 0, message: 'settlementId is required' };
    const payload = { status: data?.status, note: data?.note };
    const response = await axiosInstance.patch(ENDPOINTS.SETTLEMENTS.UPDATE_STATUS(settlementId), payload);
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

  // Backward-compatible aliases
  refund: async (data: any) => {
    const bookingId = data?.bookingId || data?._id || data?.id;
    if (!bookingId) return { code: 0, message: 'bookingId is required' };
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

  getBookings: async (_params?: any) => emptyListResponse,
  getBookingDetails: async (_id: string) => ({ code: 1, message: 'success', data: {} }),
  approveBooking: async (_data: any) => ({ code: 1, message: 'Not available in /admin APIs' }),

  getRides: async (_params?: any) => emptyListResponse,
  getRideDetails: async (_id: string) => ({ code: 1, message: 'success', data: {} }),
  forceEndRide: async (_data: any) => ({ code: 1, message: 'Not available in /admin APIs' }),
  lockVehicle: async (_data: any) => ({ code: 1, message: 'Not available in /admin APIs' }),

  getTickets: async (_params?: any) => emptyListResponse,
  getTicketDetail: async (_id: string) => ({ code: 1, message: 'success', data: {} }),
  updateTicketStatus: async (_data: any) => ({ code: 1, message: 'Not available in /admin APIs' }),
  escalateTicket: async (_id: string) => ({ code: 1, message: 'Not available in /admin APIs' }),

};
