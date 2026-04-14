export const API_BASE_URL = 'https://mira-ai.marioxsoftware.net/scooty/v1/api';
// dev pupose
export const API_ENDPOINTS = {

  // STATION_ADMIN: {
  //   LOGIN: '/station-admin/auth/login',
  //   SEND_OTP: '/station-admin/auth/send-otp',
  //   VERIFY_OTP: '/station-admin/auth/verify-otp',
  //   RESEND_OTP: '/station-admin/auth/resend-otp',
  //   ME: '/station-admin/me',
  //   CHANGE_PASSWORD: '/station-admin/change-password',
  //   FORGOT_PASSWORD: {
  //     SEND_OTP: '/station-admin/auth/forgot-password/send-otp',
  //     RESEND_OTP: '/station-admin/auth/forgot-password/resend-otp',
  //     RESET: '/station-admin/auth/forgot-password/reset',
  //   },
  //   RIDE_PLANS: {
  //     GET: '/station-admin/ride-plans',
  //     ADD: '/station-admin/ride-plans',
  //   },
  //   FAQS: {
  //     GET: '/station-admin/faqs',
  //     ADD: '/station-admin/faqs',
  //   },
  //   VEHICLES: {
  //     GET: '/station-admin/vehicles',
  //     ADD: '/station-admin/vehicles',
  //     UPDATE_STATUS: '/station-admin/vehicles/status',
  //     DETAILS: (id: string) => `/station-admin/vehicles/${id}`,
  //   },
  //   DASHBOARD: '/station-admin/dashboard',
  //   BOOKINGS: {
  //     GET: '/station-admin/bookings',
  //     DETAILS: (id: string) => `/station-admin/bookings/${id}`,
  //     APPROVE: '/station-admin/bookings/approve',
  //   },
  //   RIDES: {
  //     GET: '/station-admin/rides',
  //     DETAILS: (id: string) => `/station-admin/rides/${id}`,
  //     FORCE_END: '/station-admin/rides/force-end',
  //     LOCK_VEHICLE: '/station-admin/rides/lock-vehicle',
  //   },
  //   NOTIFICATIONS: {
  //     GET: '/station-admin/notifications',
  //     READ: '/station-admin/notifications/read',
  //     READ_ALL: '/station-admin/notifications/read-all',
  //   },
  //   REPORTS: '/station-admin/reports',
  //   TICKETS: {
  //     GET: '/station-admin/support/tickets',
  //     DETAILS: (id: string) => `/station-admin/support/tickets/${id}`,
  //     UPDATE_STATUS: '/station-admin/support/tickets/status',
  //     ESCALATE: '/station-admin/support/tickets/escalate',
  //   },
  //   MAINTENANCE: {
  //     GET_LOGS: '/station-admin/maintenance-logs',
  //     CREATE_LOG: '/station-admin/maintenance-logs',
  //     UPDATE_STATUS: '/station-admin/maintenance-logs/status',
  //   },
  //   STATION: {
  //     GET: '/station-admin/station',
  //     GET_ALL: '/stations',
  //   },
  // },

  ADMIN: {
    LOGIN: '/admin/auth/login',
    ME: '/admin/me',
    CHANGE_PASSWORD: '/admin/change-password',
    
    FORGOT_PASSWORD: {
      SEND_OTP: '/admin/auth/forgot-password/send-otp',
      RESEND_OTP: '/admin/auth/forgot-password/resend-otp',
      RESET: '/admin/auth/forgot-password/reset',
    },

    STATION_ADMINS: {
      GET_ALL: '/admin/station-admins',
      CREATE: '/admin/station-admins',
    },

    STATIONS: {
      GET_ALL: '/admin/stations',
      ADD: '/admin/stations',
    },

    RIDE_PLANS: {
      GET: '/admin/ride-plans',
      REVIEW: (id: string) => `/admin/ride-plans/${id}/review`,
    },

    FAQS: {
      GET: '/admin/faqs',
      REVIEW: (id: string) => `/admin/faqs/${id}/review`,
    },

    DASHBOARD: '/admin/dashboard',

    USERS: {
      GET_ALL: '/admin/users',
      UPDATE_STATUS: (id: string) => `/admin/users/${id}/status`,
      KYC_STATUS: (id: string) => `/admin/users/${id}/kyc-status`,
    },

    COMMISSION: {
      GET: '/admin/commission',
      UPDATE: '/admin/commission',
    },

    REPORTS: '/admin/reports',

    ADMIN_MANAGEMENT: {
      CREATE: '/admin/access-control/admins',
      GET_ALL: '/admin/access-control/admins',
      UPDATE: (id: string) => `/admin/access-control/admins/${id}`,
    },

    AUDIT_LOGS: '/admin/audit-logs',
    PRICING: {
      GET: '/admin/pricing',
      UPDATE: '/admin/pricing',
    },

    SETTLEMENTS: {
      GET_ALL: '/admin/settlements',
      ADD: '/admin/settlements',
      UPDATE_STATUS: (id: string) => `/admin/settlements/${id}/status`,
    },

    TRANSACTIONS: '/admin/transactions',
    BOOKINGS: {
      INVOICE: (id: string) => `/admin/bookings/${id}/invoice`,
      INVOICE_PDF: (id: string) => `/admin/bookings/${id}/invoice/pdf`,
      REFUND: (id: string) => `/admin/bookings/${id}/refund`,
    },
    LEDGER: '/admin/ledger',
  },
};
