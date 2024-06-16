import { instance } from "./config";

export const inventoryApi = {
  getMeta: () => instance.get(`/inventory/meta`),
  getImages: () => instance.get(`inventory/images`),
};
