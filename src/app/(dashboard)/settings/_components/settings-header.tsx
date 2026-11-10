"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import { SETTINGS_ROUTES, SettingsTab } from "./settings-routes";

export default function SettingsHeader({
  activeTab,
  pathname,
}: {
  activeTab: SettingsTab;
  pathname: string;
}) {
  return (
    <div className="w-full space-y-4">
      {/* Top Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            Admin Settings & Control Center
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Global platform governance, protected financial commission rates, security keys, and active administrative sessions.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge
            variant="outline"
            className="px-3 py-1 bg-primary/10 text-primary border-primary/20 text-xs font-semibold flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5" /> High Privilege Role
          </Badge>
          <Badge variant="secondary" className="px-3 py-1 text-xs font-medium">
            Trivllo Engine v2.4
          </Badge>
        </div>
      </div>

      {/* Breadcrumb Header Bar */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-card border border-border shadow-2xs w-full">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium flex-wrap">
          <Link
            href={SETTINGS_ROUTES.destinations}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Settings
          </Link>
          <span>/</span>
          {activeTab === "profile" && (
            <span className="font-semibold text-foreground">Profile</span>
          )}
          {activeTab === "sessions" && (
            <>
              <span className="text-muted-foreground/80">Network</span>
              <span>/</span>
              <span className="font-semibold text-foreground">Sessions</span>
            </>
          )}
          {activeTab === "security" && (
            <span className="font-semibold text-foreground">Security</span>
          )}
          {activeTab === "tax" && (
            <>
              <span className="text-muted-foreground/80">Business</span>
              <span>/</span>
              <span className="font-semibold text-foreground">Tax Rates & Commission</span>
            </>
          )}
          {activeTab === "destinations" && (
            <>
              <span className="text-muted-foreground/80">Business</span>
              <span>/</span>
              <span className="text-muted-foreground/80">Preference</span>
              <span>/</span>
              <span className="font-semibold text-foreground">Destinations & Carousels</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="hidden sm:inline-flex text-[11px] py-0.5 px-2 bg-muted/40 font-mono text-muted-foreground"
          >
            {pathname}
          </Badge>
        </div>
      </div>
    </div>
  );
}

