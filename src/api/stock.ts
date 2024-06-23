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

  // admin stock
  adminStockEntry: (data: any[]) =>
    instance.post(`admin/stock-entry`, { stock: data }),
  adminStockEntryList: (
    page: number,
    fromDate: string = "",
    toDate: string = ""
  ) =>
    instance.get(
      `admin/stock-entry-list?page=${page}&from_date=${fromDate}&to_date=${toDate}`
    ),
  getAdminStockBySKU: (sku: string) =>
    instance.get(`admin/stock-by-sku?sku=${sku}`),
  adminStockTransfer: (data: any) =>
    instance.post(`admin/stock-transfer`, { data: data }),
  adminStock: (sku: string) => instance.get(`admin/get-stock?sku=${sku}`),
  branchStockByAdmin: (branchId: string | undefined, sku: string | undefined) =>
    instance.get(`admin/get-branch-stock?branch_id=${branchId}&sku=${sku}`),
};
