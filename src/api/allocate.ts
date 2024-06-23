import { instance } from "./config";

export const allocateApi = {
  create: (data: any) => instance.post(`/allocate/create`, data),
  getAllocatedItems: (type: any, page: string = "1", search: string) =>
    instance.get(
      `/allocate/get-all/?type=${type}&page=${page}&search=${search}`
    ),
  getItemById: (itemId: string) => instance.get(`/allocate/${itemId}`),
  redeemItem: (itemId: number | undefined, data: any) =>
    instance.put(`/allocate/redeem/${itemId}`, data),
  getAllocationReport: (page: string, fromDate: string, toDate: string) =>
    instance.get(
      `/allocate/allocation-report?page=${page}&from_date=${fromDate}&to_date=${toDate}`
    ),
  getRedemptionReport: (page: string, fromDate: string, toDate: string) =>
    instance.get(
      `/allocate/redemption-report?page=${page}&from_date=${fromDate}&to_date=${toDate}`
    ),
};
