import { axiosApi } from "@/lib/axios";
import { create } from "zustand";

interface User {
  id: string;
  email: string;
  role: string;
  isVerified: boolean;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phoneNumber?: string;
  gender?: string;
  country?: string;
  address?: string;
  zipCode?: string;
}

interface AuthStates {
  currStep: number | null;
  setCurrStep: (step: number) => void;
  loginBoxOpen: boolean;
  setLoginBoxOpen: (open: boolean) => void;
  signupBoxOpen: boolean;
  setSignupBoxOpen: (open: boolean) => void;
  isLoging: boolean;
  isSiging: boolean;
  currUser: User | null;
  hotel: {
    _id: string;
    name: string;
  };
  draft: boolean;
  userLogin: (data: Login_signup_Data) => Promise<{
    success: boolean;
    message: string;
  }>;
  userSignup: (
    data: Login_signup_Data,
  ) => Promise<{ success: boolean; message: string }>;
  verifyOTP: (data: { email: string; otp: string }) => Promise<{
    success: boolean;
    message: string;
    currentStep: number;
    status: string;
  }>;
  resendOTP: (email: string) => Promise<{ success: boolean; message: string }>;
  updateUser: (
    data: Partial<User>,
  ) => Promise<{ success: boolean; message: string }>;
  uploadFile: (file: File) => Promise<{
    success: boolean;
    url?: string;
    message: string;
    public_id?: string;
    resource_type?: string;
  }>;
}

interface Login_signup_Data {
  email: string;
  password?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  gender?: string;
  dob?: string;
  country?: string;
  address?: string;
  zipcode?: string;
}

export const useAuthStore = create<AuthStates>()((set) => ({
  loginBoxOpen: false,
  setLoginBoxOpen: (open: boolean) => set({ loginBoxOpen: open }),
  signupBoxOpen: false,
  setSignupBoxOpen: (open: boolean) => set({ signupBoxOpen: open }),
  isLoging: false,
  isSiging: false,
  currUser: null,
  currStep: null,
  setCurrStep: (step: number) => set({ currStep: step }),
  hotel: {
    _id: "",
    name: "",
  },
  draft: true,

  userLogin: async (data: Login_signup_Data) => {
    // console.log("login");

    set({ isLoging: true });
    try {
      const res = await axiosApi.post("/auth/login", data);
      if (res.data.success) {
        set({ currUser: res.data.data.user });
        const token = res.data.accessToken;
        localStorage.setItem("accessToken", token);

        // console.log("asd");
        // console.log(res);

        // console.log({
        //   success: true,
        //   message: res.data.message,
        //   currentStep: res.data.data.vendor.currentStep || 1,
        //   status: res.data.data.vendor.status,
        // });

        return {
          success: true,
          message: res.data.message,
        };
      }
      return {
        success: false,
        message: res.data.message || "Login failed",
        currentStep: 0,
        status: "draft",
      };
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
        currentStep: 0,
        status: "draft",
      };
    } finally {
      set({ isLoging: false });
    }
  },

  userSignup: async (data: Login_signup_Data) => {
    set({ isSiging: true });

    try {
      const res = await axiosApi.post("/auth/signup", data);
      return { success: res.data.success, message: res.data.message };
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return {
        success: false,
        message: err.response?.data?.message || "Signup failed",
      };
    } finally {
      set({ isSiging: false });
    }
  },

  verifyOTP: async (data: { email: string; otp: string }) => {
    set({ isSiging: true });
    try {
      const res = await axiosApi.post("/auth/verify-otp", data);
      if (res.data.success) {
        set({ currUser: res.data.data.user });
        return {
          success: true,
          message: res.data.message,
          currentStep: res.data.data.vendor?.currentStep || 0,
          status: res.data.data.vendor.status,
        };
      }
      return {
        success: false,
        message: res.data.message || "Verification failed",
        currentStep: res.data.data.vendor.currentStep,
        status: res.data.data.vendor.status,
      };
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return {
        success: false,
        message: err.response?.data?.message || "Verification failed",
        currentStep: 0,
        status: "draft",
      };
    } finally {
      set({ isSiging: false });
    }
  },

  resendOTP: async (email: string) => {
    try {
      const res = await axiosApi.post("/auth/resend-otp", { email });
      return { success: res.data.success, message: res.data.message };
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return {
        success: false,
        message: err.response?.data?.message || "Failed to resend OTP",
      };
    }
  },

  updateUser: async (data: Partial<User>) => {
    try {
      const res = await axiosApi.patch("/users/update-me", data);
      if (res.data.success) {
        set({ currUser: res.data.data });
        return { success: true, message: "Profile updated successfully" };
      }
      return {
        success: false,
        message: res.data.message || "Failed to update profile",
      };
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update profile",
      };
    }
  },

  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append("files", file);
    formData.append("folder", "profiles");

    try {
      const res = await axiosApi.post("/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.success) {
        return {
          success: true,
          url: res.data.files[0].url,
          message: "File uploaded successfully",
          public_id: res.data.files[0].public_id as string,
          resource_type: res.data.files[0].resource_type as string,
        };
      }
      return {
        success: false,
        message: res.data.message || "Upload failed",
      };
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return {
        success: false,
        message: err.response?.data?.message || "Upload failed",
      };
    }
  },
}));
