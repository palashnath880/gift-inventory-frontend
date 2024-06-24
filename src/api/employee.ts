import { instance } from "./config";

export const employeeApi = {
  getAll: () => instance.get(`/employees/get-all`),
  addEmployee: (data: any) => instance.post(`admin/employee/create`, data),
  getMyBranchEmployees: () => instance.get(`employee/get-my-employees`),
  getEmployeeById: (employeeId: string | undefined) =>
    instance.get(`employee/get-by-id?employee_id=${employeeId}`),
};
