"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User as UserIcon,
  Globe,
  Server,
  ShieldCheck,
  Briefcase,
  Percent,
  SlidersHorizontal,
  Layers,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { SETTINGS_ROUTES, SettingsTab } from "./settings-routes";

export default function SettingsSidebar({
  activeTab,
  sessionsCount = 1,
  isTaxUnlocked = false,
  userProfile,
}: {
  activeTab: SettingsTab;
  sessionsCount?: number;
  isTaxUnlocked?: boolean;
  userProfile?: {
    name?: string;
    email?: string;
    avatar?: string;
  };
}) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    network: true,
    business: true,
    preferences: true,
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  useEffect(() => {
    if (activeTab === "sessions") {
      setExpandedGroups((prev) => ({ ...prev, network: true }));
    } else if (activeTab === "tax") {
      setExpandedGroups((prev) => ({ ...prev, business: true }));
    } else if (activeTab === "destinations") {
      setExpandedGroups((prev) => ({ ...prev, business: true, preferences: true }));
    }
  }, [activeTab]);

  return (
    <aside className="w-full lg:w-72 shrink-0">
      {/* Mobile Reflexive Header Bar */}
      <div className="lg:hidden p-3 rounded-2xl bg-card border border-border shadow-xs flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
            {activeTab === "profile" && <UserIcon className="w-4 h-4" />}
            {activeTab === "sessions" && <Server className="w-4 h-4" />}
            {activeTab === "security" && <ShieldCheck className="w-4 h-4" />}
            {activeTab === "tax" && <Percent className="w-4 h-4" />}
            {activeTab === "destinations" && <Layers className="w-4 h-4" />}
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate">
              Current Tab
            </div>
            <div className="text-sm font-bold text-foreground truncate">
              {activeTab === "profile" && "Profile"}
              {activeTab === "sessions" && "Network → Sessions"}
              {activeTab === "security" && "Security"}
              {activeTab === "tax" && "Business → Tax Rates"}
              {activeTab === "destinations" && "Business → Preference → Destinations"}
            </div>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-xs h-8 px-2.5 shrink-0 flex items-center gap-1.5"
        >
          {isMobileMenuOpen ? (
            <>
              <X className="w-3.5 h-3.5" />
              <span>Close</span>
            </>
          ) : (
            <>
              <Menu className="w-3.5 h-3.5" />
              <span>Menu</span>
            </>
          )}
        </Button>
      </div>

      {/* Navigation Card */}
      <div
        className={`${
          isMobileMenuOpen ? "block" : "hidden lg:block"
        } bg-card border border-border rounded-2xl p-3 shadow-xs space-y-3 sticky top-20`}
      >
        <div className="px-3 pt-1 pb-2 border-b border-border/50 flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
            Settings Navigation
          </span>
          <Badge
            variant="outline"
            className="text-[10px] py-0 px-2 font-mono border-border bg-muted/40"
          >
            Admin Controls
          </Badge>
        </div>

        {/* Tree Menu */}
        <nav className="space-y-1.5" aria-label="Settings categories">
          {/* 1. Profile */}
          <Link
            href={SETTINGS_ROUTES.profile}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === "profile"
                ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                : "text-foreground hover:bg-muted/70 hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <UserIcon className="w-4 h-4" />
              <span>Profile</span>
            </div>
            <Badge
              className={`text-[10px] px-1.5 py-0 border-none font-normal ${
                activeTab === "profile"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              Personal
            </Badge>
          </Link>

          {/* 2. Network Group */}
          <div className="rounded-xl border border-border/50 bg-muted/15 p-1.5 space-y-1">
            <button
              type="button"
              onClick={() => toggleGroup("network")}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                <span className="uppercase tracking-wider">Network</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono text-muted-foreground">
                  {sessionsCount}
                </span>
                {expandedGroups.network ? (
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </div>
            </button>

            {expandedGroups.network && (
              <div className="ml-2 pl-2.5 border-l-2 border-primary/20 space-y-1 pt-0.5">
                {/* Sessions inside Network */}
                <Link
                  href={SETTINGS_ROUTES.sessions}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeTab === "sessions"
                      ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                      : "text-foreground hover:bg-muted/70"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Server className="w-3.5 h-3.5" />
                    <span>Sessions</span>
                  </div>
                  <Badge
                    className={`text-[10px] px-1.5 py-0 border-none font-normal ${
                      activeTab === "sessions"
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {sessionsCount} Active
                  </Badge>
                </Link>
              </div>
            )}
          </div>

          {/* 3. Security */}
          <Link
            href={SETTINGS_ROUTES.security}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === "security"
                ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                : "text-foreground hover:bg-muted/70 hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Security</span>
            </div>
            <Badge
              className={`text-[10px] px-1.5 py-0 border-none font-normal ${
                activeTab === "security"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              Protected
            </Badge>
          </Link>

          {/* 4. Business Group */}
          <div className="rounded-xl border border-border/50 bg-muted/15 p-1.5 space-y-1">
            <button
              type="button"
              onClick={() => toggleGroup("business")}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" />
                <span className="uppercase tracking-wider">Business</span>
              </div>
              {expandedGroups.business ? (
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </button>

            {expandedGroups.business && (
              <div className="ml-2 pl-2.5 border-l-2 border-primary/20 space-y-1 pt-0.5">
                {/* Tax inside Business */}
                <Link
                  href={SETTINGS_ROUTES.tax}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeTab === "tax"
                      ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                      : "text-foreground hover:bg-muted/70"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Percent className="w-3.5 h-3.5" />
                    <span>Tax Rates</span>
                  </div>
                  <Badge
                    className={`text-[10px] px-1.5 py-0 border-none font-normal ${
                      activeTab === "tax"
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : isTaxUnlocked
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {isTaxUnlocked ? "Unlocked" : "Locked"}
                  </Badge>
                </Link>

                {/* Preference inside Business */}
                <div className="pt-0.5 space-y-1">
                  <button
                    type="button"
                    onClick={() => toggleGroup("preferences")}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Preference</span>
                    </div>
                    {expandedGroups.preferences ? (
                      <ChevronDown className="w-3 h-3 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-muted-foreground" />
                    )}
                  </button>

                  {expandedGroups.preferences && (
                    <div className="ml-2 pl-2.5 border-l-2 border-border/80 space-y-1 pt-0.5">
                      {/* Destination inside Preference */}
                      <Link
                        href={SETTINGS_ROUTES.destinations}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          activeTab === "destinations"
                            ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                            : "text-foreground hover:bg-muted/70"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5" />
                          <span>Destinations</span>
                        </div>
                        <Badge
                          className={`text-[10px] px-1.5 py-0 border-none font-normal ${
                            activeTab === "destinations"
                              ? "bg-primary-foreground/20 text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          Carousels
                        </Badge>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Sidebar Footer User Card */}
        <div className="pt-2 border-t border-border/50">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-muted/40">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              {userProfile?.avatar ? (
                <img
                  src={userProfile.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-4 h-4 text-primary" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-foreground truncate">
                {userProfile?.name || "Administrator"}
              </div>
              <div className="text-[10px] text-muted-foreground truncate">
                {userProfile?.email || "admin@trivllo.com"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

