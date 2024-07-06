import { instance } from "./config";

export const customerApi = {
  create: (data: any) => instance.post(`/customer/create`, data),
  update: (id: number, data: any) => instance.put(`admin/customer/${id}`, data),
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
  getCustomersReport: (page: string, from_date: string, to_date: string) =>
    instance.get(
      `customer/reports?page=${page}&from_date=${from_date}&to_date=${to_date}`
    ),
  getGiftVoucherReport: (
    id: string | undefined,
    page: string,
    fromDate: string,
    toDate: string
  ) =>
    instance.get(
      `admin/customer/gift-voucher-report?customer_id=${id}&page=${page}&from_date=${fromDate}&to_date=${toDate}`
    ),
  getApprovalReport: (
    id: string | undefined,
    page: string,
    fromDate: string,
    toDate: string
  ) =>
    instance.get(
      `admin/customer/approval-report?customer_id=${id}&page=${page}&from_date=${fromDate}&to_date=${toDate}`
    ),
};
