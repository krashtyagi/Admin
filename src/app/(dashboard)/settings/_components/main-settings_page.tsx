"use client";

import React, { useState, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import SettingsHeader from "./settings-header";
import SettingsSidebar from "./settings-sidebar";
import ProfileSettings from "./profile-settings";
import SecuritySettings from "./security-settings";
import TaxSettings from "./tax-settings";
import SessionsSettings from "./sessions-settings";
import PopularSectionsSettings from "./popular-sections-settings";
import { getTabFromPath } from "./settings-routes";
import { useAdminSessions, useActiveTax, useAdminProfile } from "../_calls/queryes";

export default function AdminSettingsPage({
  defaultTab,
  initialTab,
}: {
  defaultTab?: string;
  initialTab?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlTab = searchParams.get("tab") || initialTab || defaultTab;

  const activeTab = useMemo(
    () => getTabFromPath(pathname, urlTab),
    [pathname, urlTab]
  );

  // Shared state across settings
  const [isTaxUnlocked, setIsTaxUnlocked] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    name?: string;
    email?: string;
    avatar?: string;
  }>();

  // Queries for sidebar badges
  const { data: sessionsData } = useAdminSessions();
  const sessionsCount = sessionsData?.data?.data?.sessions?.length || 1;

  const { data: profileData } = useAdminProfile();
  React.useEffect(() => {
    const user = profileData?.data?.data || profileData?.data;
    if (user) {
      setUserProfile({
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.name || "Administrator",
        email: user.email || "admin@trivllo.com",
        avatar: user.avatar,
      });
    }
  }, [profileData]);

  return (
    <div className="w-full space-y-6">
      {/* Header and Breadcrumbs */}
      <SettingsHeader activeTab={activeTab} pathname={pathname} />

      {/* Main Settings Split Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
        {/* Settings Sidebar */}
        <SettingsSidebar
          activeTab={activeTab}
          sessionsCount={sessionsCount}
          isTaxUnlocked={isTaxUnlocked}
          userProfile={userProfile}
        />

        {/* Content Panel (Uniform Full Width across all tabs) */}
        <main className="flex-1 w-full min-w-0 space-y-6">
          {activeTab === "destinations" && (
            <div className="w-full animate-in fade-in-50 duration-200">
              <PopularSectionsSettings />
            </div>
          )}

          {activeTab === "tax" && (
            <div className="w-full animate-in fade-in-50 duration-200">
              <TaxSettings
                isTaxUnlocked={isTaxUnlocked}
                setIsTaxUnlocked={setIsTaxUnlocked}
              />
            </div>
          )}

          {activeTab === "profile" && (
            <div className="w-full animate-in fade-in-50 duration-200">
              <ProfileSettings onProfileUpdated={setUserProfile} />
            </div>
          )}

          {activeTab === "security" && (
            <div className="w-full animate-in fade-in-50 duration-200">
              <SecuritySettings />
            </div>
          )}

          {activeTab === "sessions" && (
            <div className="w-full animate-in fade-in-50 duration-200">
              <SessionsSettings />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
