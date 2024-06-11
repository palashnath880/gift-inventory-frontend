import { instance } from "./config";

export const customerApi = {
  create: (data: any) => instance.post(`/customer/create`, data),
  getAll: (page: number, search: string) =>
    instance.get(`/customer/get-all?page=${page}&search=${search}`),
};
