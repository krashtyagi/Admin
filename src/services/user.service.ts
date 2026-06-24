// import { axiosApi } from "@/lib/axios";

// export const currentUser = async () => {
//   const token = localStorage.getItem(
//     (process.env.ADMIN_ACCESS_TOKEN as string) ||
//       "__%^&__@@a%d^m^i*nt%%oken%__",
//   );

//   if (!token) {
//     throw new Error("No access token found");
//   }

//   try {
//     const res = await axiosApi.get("/users/me", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     return res.data;
//   } catch (error) {
//     console.error("currentUser service - API call failed:", error);
//     throw error;
//   }
// };
import { axiosApi } from "@/lib/axios";
import { adminAccessToken } from "./auth";

const isTokenExpired = (token: string): boolean => {
  if (!token) return true;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    const payload = JSON.parse(jsonPayload);
    if (!payload.exp) return false;
    return payload.exp < Date.now() / 1000;
  } catch (error) {
    return true;
  }
};

export const currentUser = async () => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(adminAccessToken)
      : null;

  if (!token) {
    throw new Error("No access token found");
  }

  if (typeof window !== "undefined" && isTokenExpired(token)) {
    localStorage.removeItem(adminAccessToken);
    window.location.reload();
    throw new Error("Access token expired");
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
