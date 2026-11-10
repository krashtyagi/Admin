"use client";

import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Key,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useChangeAdminPassword } from "../_calls/queryes";

export const PasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

export default function SecuritySettings() {
  const changePasswordMutation = useChangeAdminPassword();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const passwordForm = useForm<z.infer<typeof PasswordSchema>>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const watchedNewPassword = passwordForm.watch("newPassword") || "";

  // Dynamic Password Variety Checklist & Strength
  const passwordStats = useMemo(() => {
    const hasMinLength = watchedNewPassword.length >= 8;
    const hasLower = /[a-z]/.test(watchedNewPassword);
    const hasUpper = /[A-Z]/.test(watchedNewPassword);
    const hasDigit = /[0-9]/.test(watchedNewPassword);
    const hasSpecial = /[^a-zA-Z0-9]/.test(watchedNewPassword);

    let score = 0;
    if (hasMinLength) score++;
    if (hasLower) score++;
    if (hasUpper) score++;
    if (hasDigit) score++;
    if (hasSpecial) score++;

    let label = "Very Weak";
    let color = "bg-red-500 text-red-500";
    let percent = 20;

    if (score >= 5) {
      label = "Extremely Strong";
      color = "bg-emerald-500 text-emerald-500";
      percent = 100;
    } else if (score >= 4) {
      label = "Strong";
      color = "bg-green-500 text-green-500";
      percent = 80;
    } else if (score === 3) {
      label = "Moderate";
      color = "bg-blue-500 text-blue-500";
      percent = 60;
    } else if (score === 2) {
      label = "Fair";
      color = "bg-amber-500 text-amber-500";
      percent = 40;
    }

    return {
      score,
      label,
      color,
      percent,
      checks: {
        hasMinLength,
        hasLower,
        hasUpper,
        hasDigit,
        hasSpecial,
      },
    };
  }, [watchedNewPassword]);

  const onPasswordSubmit = async (values: z.infer<typeof PasswordSchema>) => {
    try {
      const res = await changePasswordMutation.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success(
        res.data?.message || "Admin password changed successfully"
      );
      passwordForm.reset();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to change password. Please verify current password."
      );
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full">
      {/* Password Form Card */}
      <Card className="xl:col-span-2 border border-border bg-card shadow-sm w-full">
        <CardHeader className="border-b border-border/50 pb-5">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" /> Change Admin Password
          </CardTitle>
          <CardDescription className="text-sm">
            Update administrative credentials. All characters (uppercase, lowercase, numbers, special symbols) are accepted and securely hashed with 12-round bcrypt.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="space-y-5 w-full"
            >
              {/* Current Password */}
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Enter your current password"
                          className="pr-10 h-11"
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          tabIndex={-1}
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* New Password */}
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter strong new password"
                          className="pr-10 h-11"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          tabIndex={-1}
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showConfirmNewPassword ? "text" : "password"}
                          placeholder="Re-enter new password"
                          className="pr-10 h-11"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmNewPassword(!showConfirmNewPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          tabIndex={-1}
                        >
                          {showConfirmNewPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={
                    changePasswordMutation.isPending ||
                    !passwordForm.formState.isValid
                  }
                  className="px-6 h-10 font-medium"
                >
                  {changePasswordMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Password Strength Card */}
      <Card className="xl:col-span-1 border border-border bg-card shadow-sm h-fit w-full">
        <CardHeader className="border-b border-border/50 pb-4">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Password Security Criteria
          </CardTitle>
          <CardDescription className="text-xs">
            Admin accounts enforce strict credential standards.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-5 space-y-5">
          {/* Strength Meter Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Strength:</span>
              <span className={`font-semibold ${passwordStats.color}`}>
                {watchedNewPassword ? passwordStats.label : "Enter password"}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${passwordStats.color}`}
                style={{ width: `${watchedNewPassword ? passwordStats.percent : 0}%` }}
              />
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              {passwordStats.checks.hasMinLength ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-muted-foreground/40" />
              )}
              <span className={passwordStats.checks.hasMinLength ? "text-foreground font-medium" : ""}>
                At least 8 characters
              </span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              {passwordStats.checks.hasUpper ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-muted-foreground/40" />
              )}
              <span className={passwordStats.checks.hasUpper ? "text-foreground font-medium" : ""}>
                Uppercase letter (A-Z)
              </span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              {passwordStats.checks.hasLower ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-muted-foreground/40" />
              )}
              <span className={passwordStats.checks.hasLower ? "text-foreground font-medium" : ""}>
                Lowercase letter (a-z)
              </span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              {passwordStats.checks.hasDigit ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-muted-foreground/40" />
              )}
              <span className={passwordStats.checks.hasDigit ? "text-foreground font-medium" : ""}>
                Number (0-9)
              </span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              {passwordStats.checks.hasSpecial ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-muted-foreground/40" />
              )}
              <span className={passwordStats.checks.hasSpecial ? "text-foreground font-medium" : ""}>
                Special symbol (!@#$%^&*)
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground space-y-1">
            <span className="font-semibold text-foreground block">
              Security Protocol
            </span>
            Password changes automatically revoke expired session tokens across other devices for isolation safety.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

