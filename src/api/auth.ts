import { instance } from "./config";

export const authApi = {
  login: (data: { login: string; password: string }) =>
    instance.post(`/auth/login`, data),
  verify: () => instance.get(`/auth/verify`),
  sendResetLink: (userLogin: string) =>
    instance.post(`/auth/forgot-password`, { user_login: userLogin }),
  updatePWD: (data: object) => instance.put(`/auth/update-pass`, data),
};
