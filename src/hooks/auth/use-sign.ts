"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth.store";
import { useCurrentUser } from "@/services/queryes";
import { LoginFormProps, LoginScshema } from "@/schema/user";

export const useLogin = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const navigate = useRouter();
  const { userLogin } = useAuthStore();
  const { refetch } = useCurrentUser();
  const methods = useForm<LoginFormProps>({
    resolver: zodResolver(LoginScshema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });
  const router = useRouter();
  const onHandleSubmit = methods.handleSubmit(async (data) => {
    setLoading(true);

    try {
      const result = await userLogin(data);
      if (result.success) {
        toast.success(result.message || "Login successful!");

        router.push("/dashboard");
      } else {
        toast.error(result.message || "Login failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  });

  return {
    loading,
    methods,
    onHandleSubmit,
  };
};
