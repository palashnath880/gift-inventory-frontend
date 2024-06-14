import { instance } from "./config";

export const approvalApi = {
  create: (data: any) => instance.post(`/approval/create`, data),
  getAll: (page: number, search: string) =>
    instance.get(`/approval/get-all?page=${page}&search=${search}`),
  update: (approvalId: string, data: any) =>
    instance.put(`/approval/${approvalId}`, data),
};
