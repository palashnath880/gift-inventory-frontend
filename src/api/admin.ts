import { instance } from "./config";

export const adminApi = {
  createAssets: (
    post_type: "customer_type" | "csc" | "project",
    value: string
  ) => instance.post(`admin/assets/create`, { post_type, value }),
  deleteAsset: (id: string | number) => instance.delete(`admin/assets/${id}`),
  getAssets: () => instance.get(`admin/assets/get-all`),
  createRole: (data: any) => instance.post(`admin/employee-role/create`, data),
  getRoles: () => instance.get(`admin/employee-role/get-all`),
  deleteRole: (id: number) => instance.delete(`admin/employee-role/${id}`),
  createVoucher: (data: any) => instance.post(`admin/voucher/create`, data),
  getVouchers: () => instance.get(`admin/voucher/get-all`),
  deleteVoucher: (id: number) => instance.delete(`admin/voucher/${id}`),
};
