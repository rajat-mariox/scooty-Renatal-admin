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
    SEND_OTP: '/admin/auth/send-otp',
    VERIFY_OTP: '/admin/auth/verify-otp',
    RESEND_OTP: '/admin/auth/resend-otp',
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
      UPDATE_STATUS: '/admin/station-admins/status',
    },

    STATIONS: {
      GET_ALL: '/admin/stations',
      ADD: '/admin/stations',
      DETAILS: (id: string) => `/admin/stations/${id}`,
      UPDATE: '/admin/stations',
    },

    RIDE_PLANS: {
      GET: '/admin/ride-plans',
      ADD: '/admin/ride-plans',
      UPDATE: (id: string) => `/admin/ride-plans/${id}`,
    },

    FAQS: {
      GET: '/admin/faqs',
      ADD: '/admin/faqs',
      UPDATE: (id: string) => `/admin/faqs/${id}`,
    },

    VEHICLES: {
      GET: '/admin/vehicle',
      ADD: '/admin/vehicle',
      UPDATE_STATUS: '/admin/vehicle/status',
      DETAILS: (id: string) => `/admin/vehicle/${id}`,
    },

    DASHBOARD: '/admin/dashboard',

    USERS: {
      GET_ALL: '/admin/users',
      UPDATE: '/admin/users',
      DETAILS: (id: string) => `/admin/users/${id}`,
    },

    COMMISSION: {
      GET: '/admin/commission',
      UPDATE: '/admin/commission',
    },

    RIDES: {
      GET: '/admin/ride',
      DETAILS: (id: string) => `/admin/ride/${id}`,
      FORCE_END: '/admin/ride/force-end',
      LOCK_VEHICLE: '/admin/ride/lock-vehicle',
    },

    NOTIFICATIONS: {
      GET: '/admin/notifications',
      READ: '/admin/notifications/read',
      READ_ALL: '/admin/notifications/read-all',
    },

    REPORTS: '/admin/reports',

    TICKETS: {
      GET: '/admin/support/tickets',
      DETAILS: (id: string) => `/admin/support/tickets/${id}`,
      UPDATE_STATUS: '/admin/support/tickets/status',
      ESCALATE: '/admin/support/tickets/escalate',
    },

    MAINTENANCE: {
      GET_LOGS: '/admin/maintenance',
      CREATE_LOG: '/admin/maintenance',
      UPDATE_STATUS: '/admin/maintenance/status',
    },

    ADMIN_MANAGEMENT: {
      CREATE: '/admin/sub-admins',
      GET_ALL: '/admin/sub-admins',
      UPDATE: '/admin/sub-admins',
    },

    AUDIT_LOGS: '/admin/audit-logs',
    PRICING: {
      GET: '/admin/pricing',
      UPDATE: '/admin/pricing',
    },

    SETTLEMENTS: {
      GET_ALL: '/admin/settlements',
      ADD: '/admin/settlements',
      UPDATE: '/admin/settlements',
    },

    TRANSACTIONS: '/admin/transactions',
    BOOKINGS: {
       GET: '/admin/bookings',
      DETAILS: (id: string) => `/admin/bookings/${id}`,
       APPROVE: '/admin/bookings/approve',
    },
    REFUND: '/admin/refund',
    LEDGER: '/admin/ledger',
  },
};
