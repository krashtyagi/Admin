"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useActiveTax, useSetTax } from "../_calls/queryes";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const TaxSchema = z.object({
  taxPercentage: z.coerce.number().min(0, "Rate cannot be negative").max(100, "Rate cannot exceed 100%"),
});

export const ProfileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  bio: z.string().max(160).optional(),
});

export const PasswordSchema = z.object({
  currentPassword: z.string().min(1, "Required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function AdminSettingsPage() {
  const { data: taxData, isLoading: isTaxLoading } = useActiveTax();
  const setTaxMutation = useSetTax();

  // 1. Tax Form
  const taxForm = useForm<z.infer<typeof TaxSchema>>({
    resolver: zodResolver(TaxSchema) as any,
    defaultValues: { taxPercentage: 0 },
  });

  useEffect(() => {
    if (taxData?.data?.data?.taxPercentage !== undefined) {
      taxForm.reset({ taxPercentage: taxData.data.data.taxPercentage });
    }
  }, [taxData, taxForm]);

  // 2. Profile Form
  const profileForm = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: { name: "", email: "", bio: "" },
  });

  // 3. Password Form
  const passwordForm = useForm({
    resolver: zodResolver(PasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onTaxSubmit = async (values: z.infer<typeof TaxSchema>) => {
    try {
      await setTaxMutation.mutateAsync(values.taxPercentage);
      toast.success("Tax percentage updated successfully");
    } catch {
      toast.error("Failed to update tax configuration");
    }
  };

  const onSubmitPlaceholders = (data: any) => {
    toast.success("Settings updated (Demo)");
  };

  return (
    <div className="max-w-full mx-auto p-3">
      <h1 className="text-3xl font-bold mb-6 tracking-tight text-foreground">Admin Settings</h1>

      <Tabs defaultValue="tax" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-[400px] mb-6">
          <TabsTrigger value="tax">Tax Configurations</TabsTrigger>
          <TabsTrigger value="profile">Admin Profile</TabsTrigger>
          <TabsTrigger value="password">Security</TabsTrigger>
        </TabsList>

        {/* --- Tax Configurations Tab --- */}
        <TabsContent value="tax">
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Tax Commission Settings</CardTitle>
              <CardDescription>Adjust the global tax percentage configuration applied to all bookings.</CardDescription>
            </CardHeader>
            <CardContent>
              {isTaxLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <Form {...taxForm}>
                  <form onSubmit={taxForm.handleSubmit(onTaxSubmit)} className="space-y-4 max-w-[400px]">
                    <FormField
                      control={taxForm.control}
                      name="taxPercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax Rate Percentage (%)</FormLabel>
                          <FormControl>
                            <Input type="number" step="any" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={setTaxMutation.isPending}>
                      {setTaxMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Tax Settings
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Profile Tab --- */}
        <TabsContent value="profile">
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Admin Profile</CardTitle>
              <CardDescription>Update your public information.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onSubmitPlaceholders)} className="space-y-4 max-w-[400px]">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input type="email" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Update Profile</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Password Tab --- */}
        <TabsContent value="password">
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Ensure your account is using a long, random password.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onSubmitPlaceholders)} className="space-y-4 max-w-[400px]">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl><Input type="password" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl><Input type="password" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl><Input type="password" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" variant="destructive">Update Password</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}