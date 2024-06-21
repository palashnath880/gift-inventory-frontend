import { instance } from "./config";

export const employeeApi = {
  getAll: () => instance.get(`/employees/get-all`),
  addEmployee: (data: any) => instance.post(`admin/employee/create`, data),
};
