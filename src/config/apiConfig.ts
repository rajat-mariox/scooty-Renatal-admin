export const API_BASE_URL = 'https://scooty-rental-apis.vercel.app';

export const API_ENDPOINTS = {

  STATION_ADMIN: {
    LOGIN: '/station-admin/auth/login',
    SEND_OTP: '/station-admin/auth/send-otp',
    VERIFY_OTP: '/station-admin/auth/verify-otp',
    RESEND_OTP: '/station-admin/auth/resend-otp',
    ME: '/station-admin/me',
    CHANGE_PASSWORD: '/station-admin/auth/change-password',
    FORGOT_PASSWORD: {
      SEND_OTP: '/station-admin/auth/forgot-password/send-otp',
      RESEND_OTP: '/station-admin/auth/forgot-password/resend-otp',
      RESET: '/station-admin/auth/forgot-password/reset',
    },

  },
};
