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

export const blockProperty = (id: string, reason?: string) => {
  return axiosApi
    .patch(`/admin/property/${id}/block`, { reason })
    .then((res) => res.data);
};

export const unblockProperty = (id: string) => {
  return axiosApi
    .patch(`/admin/property/${id}/unblock`)
    .then((res) => res.data);
};

export const deleteProperty = (id: string, reason?: string) => {
  return axiosApi
    .delete(`/admin/property/${id}`, { data: { reason } })
    .then((res) => res.data);
};

export const getDeletedProperties = (params?: any) => {
  return axiosApi
    .get(`/admin/property/deleted`, { params })
    .then((res) => res.data);
};

export const cleanAllDeletedProperties = () => {
  return axiosApi
    .delete(`/admin/property/deleted/clean-all`)
    .then((res) => res.data);
};

export const deleteDeletedPropertyRecord = (id: string) => {
  return axiosApi
    .delete(`/admin/property/deleted/${id}`)
    .then((res) => res.data);
};



