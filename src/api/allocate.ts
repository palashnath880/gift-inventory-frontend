import { instance } from "./config";

export const allocateApi = {
  create: (data: any) => instance.post(`/allocate/create`, data),
  getAllocatedItems: (type: any, page: string = "1", search: string) =>
    instance.get(
      `/allocate/get-all/?type=${type}&page=${page}&search=${search}`
    ),
};
