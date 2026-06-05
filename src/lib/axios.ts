// // import axios from "axios";
// // import { API_BASE_URL } from "@/config/env";

// // export const axiosApi = axios.create({
// //   baseURL: `${API_BASE_URL}/api/v1` || "http://localhost:5000/api/v1",
// //   withCredentials: true,
// // });

// import axios from "axios";
// import { API_BASE_URL } from "@/config/env";
// const token = localStorage.getItem("accessToken");
// export const axiosApi = axios.create({
//   baseURL: API_BASE_URL
//     ? `${API_BASE_URL}/api/v1`
//     : "http://localhost:5000/api/v1",
//   withCredentials: true,
//   headers: {
//     contentType: "application/json",
//     Authorization: `Bearer ${token}`,
//   },
//   // headers: {
//   //   "Content-Type": "application/json",

//   //   Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//   // },
// });

// // axiosApi.interceptors.request.use(
// //   (config) => {
// //     if (typeof window !== "undefined") {
// //       const token = localStorage.getItem("accessToken");

// //       if (token) {
// //         config.headers.Authorization = `Bearer ${token}`;
// //       }
// //     }

// //     return config;
// //   },
// //   (error) => Promise.reject(error),
// // );
// import axios from "axios";
// import { API_BASE_URL } from "@/config/env";
// const token = localStorage.getItem("accessToken");
// export const axiosApi = axios.create({
//   baseURL: `${API_BASE_URL}/api/v1`,
//   headers: {
//     Authorization: `Bearer ${token}`,
//   },
// });
import axios from "axios";
// import { API_BASE_URL } from "@/config/env";

export const axiosApi = axios.create({

  baseURL: `${ process.env.NEXT_PUBLIC_API_URL}/api/v1`,
});

axiosApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});