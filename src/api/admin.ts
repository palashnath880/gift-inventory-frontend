import { instance } from "./config";

export const adminApi = {
  createAssets: (
    post_type: "customer_type" | "csc" | "project",
    value: string
  ) => instance.post(`admin/assets/create`, { post_type, value }),
  deleteAsset: (id: string | number) => instance.delete(`admin/assets/${id}`),
  getAssets: () => instance.get(`admin/assets/get-all`),

  // employee role api
  createRole: (data: any) => instance.post(`admin/employee-role/create`, data),
  getRoles: () => instance.get(`admin/employee-role/get-all`),
  deleteRole: (id: number) => instance.delete(`admin/employee-role/${id}`),

  //  voucher api
  createVoucher: (data: any) => instance.post(`admin/voucher/create`, data),
  getVouchers: () => instance.get(`admin/voucher/get-all`),
  deleteVoucher: (id: number) => instance.delete(`admin/voucher/${id}`),

  // sku code api
  createSKU: (data: any) => instance.post(`admin/sku-code/create`, data),
  getSKUCodes: () => instance.get(`admin/sku-code/get-all`),
  deleteSKUCode: (id: number) => instance.delete(`admin/sku-code/${id}`),

  // graph report
  getGraphReport: (from_date: string, to_date: string) =>
    instance.get(
      `admin/graph-report?from_date=${from_date}&to_date=${to_date}`
    ),
};
