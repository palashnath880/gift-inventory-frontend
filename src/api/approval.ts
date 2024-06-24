import { instance } from "./config";

export const approvalApi = {
  create: (data: any) => instance.post(`/approval/create`, data),
  getAll: (page: number, search: string) =>
    instance.get(`/approval/my-approval?page=${page}&search=${search}`),
  getById: (id: string | undefined) => instance.get(`/approval/${id}`),
  getReceiveApproval: (page: number, search: string) =>
    instance.get(`/approval/receive-approval?page=${page}&search=${search}`),
  update: (approvalId: number, data: any) =>
    instance.put(`/approval/${approvalId}`, data),
  redeemApproval: (id: string | undefined, data: any) =>
    instance.put(`/approval/redeem/${id}`, data),
  getApprovalReport: (page: string, fromDate: string, toDate: string) =>
    instance.get(
      `/approval/report?page=${page}&from_date=${fromDate}&to_date=${toDate}`
    ),
};
