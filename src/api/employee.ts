import { instance } from "./config";

export const employeeApi = {
  getAll: () => instance.get(`/employees/get-all`),
};
