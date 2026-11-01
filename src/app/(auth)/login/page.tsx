"use client";

import Auth07 from "@/components/watermelon-ui/auth-07";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/services/queryes";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect } from "react";
import { adminAccessToken } from "@/services/auth";

export default function LoginPage() {
  const router = useRouter();
  const { data } = useCurrentUser();
  const { draft } = useAuthStore();

  useEffect(() => {
    if (localStorage.getItem(adminAccessToken) !== null) {
      if (data?.data?.role === "vendor" && draft) {
        router.push("/signup/process");
      } else if (
        data?.data?.role === "blog_author" ||
        data?.data?.role === "blog_editor" ||
        data?.data?.role === "seo_manager"
      ) {
        router.push("/blog");
      } else {
        router.push("/dashboard");
      }
    }
  }, [data, draft, router]);

  return <Auth07 />;
}