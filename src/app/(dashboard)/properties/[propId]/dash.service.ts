import { axiosApi } from "@/lib/axios";

export const propertiesDetails = (id: string) => {
  return axiosApi.get(`/admin/property/${id}`).then((res) => res.data);
};

export const approveProperty = (id: string) => {
  return axiosApi
    .patch(`/admin/property/${id}/approve`)
    .then((res) => res.data);
};

export const rejectProperty = (id: string, data: { rejectedSteps: number[]; reasons: Record<number, string> }) => {
  return axiosApi
    .patch(`/admin/property/${id}/reject`, data)
    .then((res) => res.data);
};

export const markIssue = (vendorId: string, step: number, reason: string) => {
  return axiosApi
    .patch(`/admin/property/${vendorId}/mark-issue`, { step, reason })
    .then((res) => res.data);
};

export const verifySection = (vendorId: string, step: number) => {
  return axiosApi
    .patch(`/admin/property/${vendorId}/verify`, { step })
    .then((res) => res.data);
};

export const updateBusinessRank = (businessId: string, serviceType: string, rank: string) => {
  return axiosApi
    .patch(`/admin/property/${businessId}/rank`, { serviceType, rank })
    .then((res) => res.data);
};

export const assignPromotion = (data: {
  vendorId: string;
  serviceType: string;
  serviceId: string;
  rank: string;
  startDate?: string | Date;
  endDate?: string | Date;
}) => {
  return axiosApi
    .post(`/admin/promotions/assign`, data)
    .then((res) => res.data);
};

export const getPropertyListings = (vendorId: string) => {
  return axiosApi
    .get(`/admin/property/${vendorId}/listings`)
    .then((res) => res.data);
};

