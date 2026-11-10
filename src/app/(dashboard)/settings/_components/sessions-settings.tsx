"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Server,
  RefreshCw,
  LogOut,
  Laptop,
  Smartphone,
  Tablet,
  Globe,
  Clock,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import {
  useAdminSessions,
  useRevokeSession,
  useRevokeOtherSessions,
} from "../_calls/queryes";

export default function SessionsSettings() {
  const {
    data: sessionsData,
    isLoading: isSessionsLoading,
    refetch: refetchSessions,
    isFetching: isSessionsFetching,
  } = useAdminSessions();
  const revokeSessionMutation = useRevokeSession();
  const revokeOtherSessionsMutation = useRevokeOtherSessions();

  const sessionsList = React.useMemo(() => {
    return sessionsData?.data?.data?.sessions || [];
  }, [sessionsData]);

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await revokeSessionMutation.mutateAsync(sessionId);
      toast.success("Device session revoked successfully");
      refetchSessions();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to revoke session");
    }
  };

  const handleRevokeAllOtherSessions = async () => {
    try {
      const res = await revokeOtherSessionsMutation.mutateAsync();
      const count =
        res.data?.data?.revokedCount ?? res.data?.message ?? "All other";
      toast.success(
        `Successfully terminated other active sessions (${count})`
      );
      refetchSessions();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to terminate sessions"
      );
    }
  };

  return (
    <Card className="border border-border bg-card shadow-sm w-full">
      <CardHeader className="border-b border-border/50 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Server className="w-5 h-5 text-primary" /> Active Administrator Sessions
            </CardTitle>
            <CardDescription className="text-sm">
              Manage and inspect devices, browsers, and IP addresses authenticated into this admin portal.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchSessions()}
              disabled={isSessionsFetching}
              className="text-xs h-9 px-3 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isSessionsFetching ? "animate-spin" : ""
                }`}
              />
              <span>Refresh</span>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRevokeAllOtherSessions}
              disabled={
                revokeOtherSessionsMutation.isPending ||
                sessionsList.length <= 1
              }
              className="text-xs h-9 px-3 flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Terminate Other Sessions</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6 w-full">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          <div className="p-4 rounded-xl border border-border/60 bg-muted/30">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Active Devices
            </div>
            <div className="text-2xl font-extrabold text-foreground mt-1">
              {sessionsList.length || 1}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border/60 bg-muted/30">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Current Device
            </div>
            <div className="text-sm font-bold text-foreground mt-1 truncate">
              {sessionsList.find((s: any) => s.isCurrent)?.device?.browser || "Web Browser"} on{" "}
              {sessionsList.find((s: any) => s.isCurrent)?.device?.os || "Windows"}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border/60 bg-muted/30">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Portal Isolation
            </div>
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Enforced
            </div>
          </div>
        </div>

        {/* Sessions List */}
        {isSessionsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : sessionsList.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-xl w-full">
            <Laptop className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">
              Current browser session active
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              No other concurrent administrative devices recorded.
            </p>
          </div>
        ) : (
          <div className="space-y-3 w-full">
            {sessionsList.map((session: any) => {
              const isCurrent = session.isCurrent;
              const deviceType = session.device?.deviceType?.toLowerCase();
              const browser = session.device?.browser || "Browser";
              const os = session.device?.os || "Desktop OS";
              const ip = session.ipAddress || "127.0.0.1";
              const lastActive = session.updatedAt || session.createdAt;

              return (
                <div
                  key={session._id || session.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full ${
                    isCurrent
                      ? "border-emerald-500/40 bg-emerald-500/5 shadow-xs"
                      : "border-border/70 bg-card hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        isCurrent
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {deviceType === "mobile" ? (
                        <Smartphone className="w-5 h-5" />
                      ) : deviceType === "tablet" ? (
                        <Tablet className="w-5 h-5" />
                      ) : (
                        <Laptop className="w-5 h-5" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-foreground">
                          {browser} on {os}
                        </span>
                        {isCurrent && (
                          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px] font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Current Device (This Session)
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 font-mono">
                          <Globe className="w-3 h-3" /> {ip}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {lastActive
                            ? new Date(lastActive).toLocaleString(undefined, {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Active now"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!isCurrent && (
                    <div className="self-end sm:self-center shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleRevokeSession(session._id || session.id)
                        }
                        disabled={revokeSessionMutation.isPending}
                        className="text-xs h-8 text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive/20 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 mr-1" />
                        Revoke Access
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

