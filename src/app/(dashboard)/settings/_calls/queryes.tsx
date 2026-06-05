'use client'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getActiveTax, setTax } from "./tax.service";

export const useActiveTax = () => {
  return useQuery({
    queryKey: ["active_tax"],
    queryFn: () => getActiveTax(),
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useSetTax = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taxPercentage: number) => setTax(taxPercentage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["active_tax"] });
    },
  });
};
