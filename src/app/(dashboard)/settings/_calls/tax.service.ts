import { axiosApi } from "@/lib/axios"

export const getActiveTax = () => {
  return axiosApi.get(`admin/tax/active`);
}

export const setTax = (taxPercentage: number) => {
  return axiosApi.post(`admin/tax/set-tax`, { taxPercentage });
}
