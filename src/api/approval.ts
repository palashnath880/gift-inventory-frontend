import { instance } from "./config";

export const approvalApi = {
  create: (data: any) => instance.post(`/approval/create`, data),
  getAll: (page: number, search: string) =>
    instance.get(`/approval/my-approval?page=${page}&search=${search}`),
  getReceiveApproval: (page: number, search: string) =>
    instance.get(`/approval/receive-approval?page=${page}&search=${search}`),
  update: (approvalId: number, data: any) =>
    instance.put(`/approval/${approvalId}`, data),
};
