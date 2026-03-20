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
  sendOtp: async (data: { phone: string }) => {
    const response = await axiosInstance.post(ENDPOINTS.SEND_OTP, data);
    return response.data;
  },

  // POST verify-otp
  verifyOtp: async (data: { phone: string; otp: string }) => {
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

  // PATCH change-password
  changePassword: async (data: any) => {
    const response = await axiosInstance.patch(ENDPOINTS.CHANGE_PASSWORD, data);
    return response.data;
  },

  // POST sesendotp (resend OTP)
  resendOtp: async (data: { phone: string }) => {
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
};
