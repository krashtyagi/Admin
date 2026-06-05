"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, ListIcon, ChartBarIcon, FolderIcon, UsersIcon, CameraIcon, FileTextIcon, Settings2Icon, CircleHelpIcon, SearchIcon, DatabaseIcon, FileChartColumnIcon, FileIcon, CommandIcon, Home, CalendarHeartIcon, DollarSignIcon, Tag, Star, IndianRupee } from "lucide-react"
import LOGO from "./logo/logo"
import { usePathname, useRouter } from "next/navigation"
import { InstallPrompt } from "./pwa"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: (
        <LayoutDashboardIcon
        />
      ),
    },
    {
      title: "Users",
      url: "/users",
      icon: (
        <UsersIcon
        />
      ),
    },
    {
      title: "Properties",
      url: "/properties",
      icon: (
        <Home
        />
      ),
    },
    {
      title: "Bookings",
      url: "/bookings",
      icon: (
        <CalendarHeartIcon
        />
      ),
    },
    {
      title: "Payments",
      url: "/payments",
      icon: (
        <IndianRupee
        />
      ),
    },
    {
      title: "Promotions",
      url: "/promotions",
      icon: (
        <Tag
        />
      ),
    },
    {
      title: "Reviews",
      url: "/reviews",
      icon: (
        <Star
        />
      ),
    },
    {
      title: "Support",
      url: "/support",
      icon: (
        <CircleHelpIcon
        />
      ),
    },
    {
      title: "Requests",
      url: "/Requests",
      icon: (
        <ListIcon
        />
      ),
    },
    {
      title: "Settings",
      url: "/settings",
      icon: (
        <Settings2Icon
        />
      ),
    },

  ],

}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  //useEffect is used here to close the sidebar when the user navigates to a different page
  React.useEffect(() => {

    if (isMobile) {
      setOpenMobile(false);
    }
  }, [pathname, isMobile, setOpenMobile]);
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader >
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <LOGO className="w-20" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="">
        <NavMain items={data.navMain} />
      </SidebarContent>
      {/* <InstallPrompt/> */}
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
