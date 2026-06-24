'use client'
import { SpinnerCustom } from "@/components/loaders/smallSpinner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/services/queryes";
import { useAuthStore } from "@/stores/auth.store";
import { PageSkeleton } from "@/components/loaders/loader/skeleton";
import { adminAccessToken } from "@/services/auth";

export default function Home() {
  const { data, isLoading } = useCurrentUser();

  const router = useRouter()
  const { setCurrStep } = useAuthStore()

  useEffect(() => {
    if (data) {
      if (localStorage.getItem("status") === "draft") {
        setCurrStep(data?.data?.vendor.currentStep)
        router.replace("/signup/process")
      } else {
        router.replace("/dashboard")
      }
    } else if (localStorage.getItem(adminAccessToken) === null) {
      router.replace("/login")
    }
  }, [data])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // If not mounted, return the EXACT same skeleton the server does
  // or return null to let the browser handle it quietly
  if (!isMounted) {
    return <PageSkeleton />
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <SpinnerCustom /> loading
    </div>
  );
}
