import { instance } from "./config";

export const customerApi = {
  create: (data: any) => instance.post(`/customer/create`, data),
  getAll: (page: number, search: string) =>
    instance.get(`/customer/get-all?page=${page}&search=${search}`),
  getCustomerById: (customerId: string | undefined) =>
    instance.get(`/customer/${customerId}`),
  getCustomerReport: (
    reportType: "gift" | "voucher" | "approval",
    customerId: string | undefined,
    page: string,
    fromDate: string,
    toDate: string
  ) =>
    instance.get(
      `customer/${customerId}/report?report=${reportType}&page=${page}&from_date=${fromDate}&to_date=${toDate}`
    ),
};
