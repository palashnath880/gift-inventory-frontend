import { instance } from "./config";

export const inventoryApi = {
  getMeta: () => instance.get(`/inventory/meta`),
};
