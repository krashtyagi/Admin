"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  propertiesDetails,
  approveProperty,
  rejectProperty,
  markIssue,
  verifySection,
  updateBusinessRank,
} from "./dash.service";

export const usePropertyDetails = (id: string) => {
  return useQuery({
    queryKey: ["admin_property_details", id],
    queryFn: () => propertiesDetails(id),
    staleTime: 200000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    retry: false,
  });
};

export const useApproveProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approveProperty(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["admin_property_details", id] });
      queryClient.invalidateQueries({ queryKey: ["property"] });
    },
  });
};

export const useRejectProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, rejectedSteps, reasons }: { id: string; rejectedSteps: number[]; reasons: Record<number, string> }) =>
      rejectProperty(id, { rejectedSteps, reasons }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["admin_property_details", id] });
      queryClient.invalidateQueries({ queryKey: ["property"] });
    },
  });
};

export const useMarkIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ vendorId, step, reason }: { vendorId: string; step: number; reason: string }) =>
      markIssue(vendorId, step, reason),
    onSuccess: (_, { vendorId }) => {
      queryClient.invalidateQueries({ queryKey: ["admin_property_details", vendorId] });
      queryClient.invalidateQueries({ queryKey: ["property"] });
    },
  });
};

export const useVerifySection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ vendorId, step }: { vendorId: string; step: number }) =>
      verifySection(vendorId, step),
    onSuccess: (_, { vendorId }) => {
      queryClient.invalidateQueries({ queryKey: ["admin_property_details", vendorId] });
      queryClient.invalidateQueries({ queryKey: ["property"] });
    },
  });
};

export const useUpdateBusinessRank = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ businessId, serviceType, rank }: { businessId: string; serviceType: string; rank: string }) =>
      updateBusinessRank(businessId, serviceType, rank),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property"] });
    },
  });
};
