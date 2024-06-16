import { instance } from "./config";

export const stockApi = {
  getReceiveStocks: () => instance.get(`employee/stocks-receive`),
  stockStatusUpdate: (itemId: number, data: any) =>
    instance.put(`employee/stocks-receive/${itemId}`, data),
};
