import { instance } from "./config";

export const allocateApi = {
  create: (data: any) => instance.post(`/allocate/create`, data),
};
