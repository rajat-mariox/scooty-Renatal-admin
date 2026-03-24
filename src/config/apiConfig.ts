export const API_BASE_URL = 'https://mira-ai.marioxsoftware.net/scooty/v1/api';
// dev pupose
export const API_ENDPOINTS = {

  STATION_ADMIN: {
    LOGIN: '/station-admin/auth/login',
    SEND_OTP: '/station-admin/auth/send-otp',
    VERIFY_OTP: '/station-admin/auth/verify-otp',
    RESEND_OTP: '/station-admin/auth/resend-otp',
    ME: '/station-admin/me',
    CHANGE_PASSWORD: '/station-admin/change-password',
    FORGOT_PASSWORD: {
      SEND_OTP: '/station-admin/auth/forgot-password/send-otp',
      RESEND_OTP: '/station-admin/auth/forgot-password/resend-otp',
      RESET: '/station-admin/auth/forgot-password/reset',
    },
    RIDE_PLANS: {
      GET: '/station-admin/ride-plans',
      ADD: '/station-admin/ride-plans',
    },
    FAQS: {
      GET: '/station-admin/faqs',
      ADD: '/station-admin/faqs',
    },
    VEHICLES: {
      GET: '/station-admin/vehicles',
      ADD: '/station-admin/vehicles',
      UPDATE_STATUS: '/station-admin/vehicles/status',
      DETAILS: (id: string) => `/station-admin/vehicles/${id}`,
    },
    DASHBOARD: '/station-admin/dashboard',
    BOOKINGS: {
      GET: '/station-admin/bookings',
      DETAILS: (id: string) => `/station-admin/bookings/${id}`,
      APPROVE: '/station-admin/bookings/approve',
    },
    RIDES: {
      GET: '/station-admin/rides',
      DETAILS: (id: string) => `/station-admin/rides/${id}`,
      FORCE_END: '/station-admin/rides/force-end',
      LOCK_VEHICLE: '/station-admin/rides/lock-vehicle',
    },
    NOTIFICATIONS: {
      GET: '/station-admin/notifications',
      READ: '/station-admin/notifications/read',
      READ_ALL: '/station-admin/notifications/read-all',
    },
    REPORTS: '/station-admin/reports',
    TICKETS: {
      GET: '/station-admin/tickets',
      DETAILS: (id: string) => `/station-admin/tickets/${id}`,
      UPDATE_STATUS: '/station-admin/tickets/status',
      ESCALATE: '/station-admin/tickets/escalate',
    },
    MAINTENANCE: {
      GET_LOGS: '/station-admin/maintenance-logs',
      CREATE_LOG: '/station-admin/maintenance-logs',
      UPDATE_STATUS: '/station-admin/maintenance-logs/status',
    },
  },
};
