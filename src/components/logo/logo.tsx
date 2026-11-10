"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export interface LogoProps extends React.ComponentProps<"div"> {}

const LOGO = React.forwardRef<HTMLDivElement, LogoProps>(
  ({ className, onClick, ...props }, ref) => {
    const navigate = useRouter()
    const pathname = usePathname()

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(e)
      if (!e.defaultPrevented && pathname !== "/dashboard") {
        navigate.push("/dashboard")
      }
    }

    return (
      <div
        ref={ref}
        onClick={handleClick}
        className={cn(
          "flex items-center cursor-pointer select-none transition-all duration-200 outline-none",
          className
        )}
        {...props}
      >
        {/* Full wordmark for expanded sidebar and general pages */}
        <div className="flex items-center h-8 w-[120px] shrink-0 group-data-[collapsible=icon]:hidden transition-all">
          <img
            src="/logo.png"
            alt="Trivllo"
            className="h-full w-auto max-w-[120px] object-contain object-left"
          />
        </div>

        {/* Single word/letter logo mark for shrinked/collapsed sidebar */}
        <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center size-8 rounded-lg shrink-0 overflow-hidden transition-all">
          <img
            src="/tri-logo.svg"
            alt="Trivllo"
            className="size-7 object-contain shrink-0 rounded-md"
          />
        </div>
      </div>
    )
  }
)

LOGO.displayName = "LOGO"

export default LOGO
