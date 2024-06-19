import { instance } from "./config";

export const stockApi = {
  getReceiveStocks: () => instance.get(`employee/stocks-receive`),
  getReceivedReports: (fromDate: string, toDate: string) =>
    instance.get(
      `employee/stocks-receive/report?from_date=${fromDate}&to_date=${toDate}`
    ),
  stockStatusUpdate: (itemId: number, data: any) =>
    instance.put(`employee/stocks-receive/${itemId}`, data),
  getBranchStock: (skuCode: string = "") =>
    instance.get(`employee/branch-stocks?sku_code=${skuCode}`),
  getStockBySKU: (skuCode: string) =>
    instance.get(`employee/branch-stocks/${skuCode}`),
};
