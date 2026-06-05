import { axiosApi } from "@/lib/axios";

export const currentUser = async () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("No access token found");
  }

  try {
    const res = await axiosApi.get("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("currentUser service - API call failed:", error);
    throw error;
  }
};
