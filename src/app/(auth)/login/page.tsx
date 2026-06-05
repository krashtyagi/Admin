"use client"

import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "./login-form"
import LOGO from "@/components/logo/logo"
import { useRouter } from "next/navigation"
import { useCurrentUser } from "@/services/queryes"
import { useAuthStore } from "@/stores/auth.store"
import { useEffect } from "react"

export default function LoginPage() {
    const router = useRouter()
    const { data } = useCurrentUser()
    const { draft } = useAuthStore()
    useEffect(() => {
        if (data?.data?.role === "vendor" && localStorage.getItem("accessToken") !== null) {
            if (draft) {
                router.push("/signup/process")
            } else {
                router.push("/dashboard")
            }
        }
    }, [data])
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-5">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a
                        href="#"
                        className="group flex items-center gap-2 font-medium transition-all duration-300"
                    >
                        <div
                            className={`
                relative flex size-10 md:size-32 items-center justify-center rounded-xl
                
                shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]
                overflow-hidden
                animate-logo-float
                group-hover:scale-110 group-hover:shadow-[0_0_35px_rgba(var(--primary-rgb),0.7)]
                transition-all duration-500 ease-out
              `}
                        >


                            <LOGO

                            />


                        </div>


                    </a>
                </div>

                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <LoginForm />
                    </div>
                </div>
            </div>

            <div className="hidden bg-muted lg:flex items-center justify-center w-full h-full">
                <img
                    src="/admin-dash.png"
                    alt="Acme Inc. Branding"
                    className={`
            h-32 md:h-100 lg:h-108 object-contain
            drop-shadow-2xl
            animate-hero-float
            dark:brightness-[0.25] dark:grayscale
            transition-transform duration-700
            hover:scale-105
          `}
                />
            </div>
        </div>
    )
}