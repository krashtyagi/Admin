"use client"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { CirclePlusIcon, MailIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { RouterPush } from "./RouterPush"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
  }[]
}) {
  const pathname = usePathname()
  const router = useRouter()
  const handelNavigation = (url: string) => {
    if (pathname === url) return
    RouterPush(router, url)
  }
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">

        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem onClick={() => handelNavigation(item.url)} key={item.title}>
              <SidebarMenuButton className={cn(pathname === item.url && "bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground")}>
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
