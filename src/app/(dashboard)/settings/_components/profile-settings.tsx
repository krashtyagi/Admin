"use client";

import React, { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Upload, User as UserIcon } from "lucide-react";
import { useAdminProfile, useUpdateAdminProfile } from "../_calls/queryes";
import { useAuthStore } from "@/stores/auth.store";

export const ProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
  gender: z.string().optional(),
  country: z.string().optional(),
  address: z.string().optional(),
  zipcCode: z.string().optional(),
  bio: z.string().max(250, "Bio cannot exceed 250 characters").optional(),
});

export default function ProfileSettings({
  onProfileUpdated,
}: {
  onProfileUpdated?: (profile: { name?: string; email?: string; avatar?: string }) => void;
}) {
  const {
    data: profileData,
    isLoading: isProfileLoading,
    refetch: refetchProfile,
  } = useAdminProfile();
  const updateProfileMutation = useUpdateAdminProfile();
  const uploadFile = useAuthStore((s) => s.uploadFile);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const profileForm = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      gender: "other",
      country: "India",
      address: "",
      zipcCode: "",
      bio: "",
    },
  });

  useEffect(() => {
    const user = profileData?.data?.data || profileData?.data;
    if (user) {
      const firstName = user.firstName || user.name?.split(" ")[0] || "";
      const lastName = user.lastName || user.name?.split(" ").slice(1).join(" ") || "";
      const email = user.email || "";

      profileForm.reset({
        firstName,
        lastName,
        email,
        phoneNumber: user.phoneNumber || "",
        gender: user.gender || "other",
        country: user.country || "India",
        address: user.address || "",
        zipcCode: user.zipcCode || "",
        bio: user.bio || "",
      });

      if (user.avatar) {
        setAvatarPreview(user.avatar);
      }

      onProfileUpdated?.({
        name: `${firstName} ${lastName}`.trim() || user.name,
        email,
        avatar: user.avatar,
      });
    }
  }, [profileData, profileForm, onProfileUpdated]);

  const onProfileSubmit = async (values: z.infer<typeof ProfileSchema>) => {
    try {
      const { email, ...payload } = values;
      await updateProfileMutation.mutateAsync({
        ...payload,
        avatar: avatarPreview,
      });
      toast.success("Admin profile updated successfully");
      refetchProfile();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const res = await uploadFile(file);
      if (res.success && res.url) {
        setAvatarPreview(res.url);
        toast.success("Profile photo uploaded");
      } else {
        toast.error(res.message || "Upload failed");
      }
    } catch {
      toast.error("Error uploading profile photo");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <Card className="border border-border bg-card shadow-sm w-full">
      <CardHeader className="border-b border-border/50 pb-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              Administrator Profile
            </CardTitle>
            <CardDescription className="text-sm">
              Manage administrative identity, contact details, and display preferences.
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="bg-primary/5 text-primary border-primary/20 text-xs px-3 py-1 font-semibold"
          >
            Role: Super Administrator
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {isProfileLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-8 w-full">
            {/* Avatar Upload Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 rounded-xl border border-border/60 bg-muted/30 w-full">
              <div className="relative group shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-muted border-2 border-border shadow-sm flex items-center justify-center">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Admin Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>
                {isUploadingAvatar && (
                  <div className="absolute inset-0 bg-background/80 rounded-2xl flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                )}
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground">
                  Profile Avatar
                </h4>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, WebP or SVG format. Recommended 256x256 pixels.
                </p>
                <div className="pt-1">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium cursor-pointer shadow-xs transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Change Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                      disabled={isUploadingAvatar}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <Form {...profileForm}>
              <form
                onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                className="space-y-6 w-full"
              >
                {/* Names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                  <FormField
                    control={profileForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="First Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Last Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Email address"
                            {...field}
                            disabled
                            className="bg-muted text-muted-foreground cursor-not-allowed"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+91 9876543210" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Country & Zipcode */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                  <FormField
                    control={profileForm.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="India" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="zipcCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Zip Code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Address */}
                <FormField
                  control={profileForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Office or HQ Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Bio */}
                <FormField
                  control={profileForm.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Administrative Bio</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Brief role and responsibility description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="px-6 h-10 font-medium"
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving Profile...
                      </>
                    ) : (
                      "Save Profile Changes"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

