'use client'
import { AppSidebar } from "@/components/app-sidebar"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import data from "./data.json"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import LogoLoader from "@/components/loaders/logoloader"
import { useVariants } from "@/providers/main-provider/variants-provider"
import { ErrorBoundary } from 'react-error-boundary'
import { CompactFooter } from "@/components/footer/compactfooter"
import { adminAccessToken } from "@/services/auth"
export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);
  const { variant } = useVariants()
  useEffect(() => {
    if (!localStorage.getItem(adminAccessToken)) {
      router.replace("/login");
    } else {
      setOk(true);
    }
  }, [router]);

  if (!ok) return <LogoLoader />;
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 52)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant={variant} className="border-border bg-background" />
      <SidebarInset className="bg-gray-50 dark:bg-zinc-900 overflow-x-hidden">
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <SiteHeader />
        </ErrorBoundary>
        <div className="flex flex-1 flex-col overflow-x-hidden">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-2 px-1 sm:px-3 md:gap-6 md:py-6 md:px-6 rounded-xl min-h-screen">
              {children}
            </div>
            <CompactFooter />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
