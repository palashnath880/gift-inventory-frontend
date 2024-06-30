import { instance } from "./config";

export const authApi = {
  login: (data: { login: string; password: string }) =>
    instance.post(`/auth/login`, data),
  verify: () => instance.get(`/auth/verify`),
  sendResetLink: (userLogin: string) =>
    instance.post(`/auth/forgot-password`, { user_login: userLogin }),
  updateResetPWD: (token: string | undefined, password: string) =>
    instance.put(`/auth/forgot-password-update`, { token, password }),
  updatePWD: (data: object) => instance.put(`/auth/update-pass`, data),
};
