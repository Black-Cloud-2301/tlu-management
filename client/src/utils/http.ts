import axios from "axios";
import { redirect } from "react-router-dom";

const BASE_URL = "http://localhost/auth/";

const http = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

http.defaults.headers.common["Content-Type"] = "application/json";

http.interceptors.response.use((response) => {
  return response;
});

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      // Configure this as per your backend requirements
      config.headers!["Authorization"] = token;
    }
    return config;
  },
  (error) => {
    if (error.response.status === 401) {
      redirect("/login");
    }
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (originalConfig.url !== "signin" && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const rs = await axios.post("refresh", {
            headers: {
              Authorization: localStorage.getItem("refresh_token")!,
            },
          });

          const access = rs.data.access_token;
          const refresh = rs.data.refresh_token;

          localStorage.setItem("access_token", access);
          localStorage.setItem("refresh_token", refresh);

          return http(originalConfig);
        } catch (_error) {
          console.log("Session time out. Please login again.", {
            id: "sessionTimeOut",
          });
          // Logging out the user by removing all the tokens from local
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          // Redirecting the user to the landing page
          window.location.href = window.location.origin;
          return Promise.reject(_error);
        }
      }
    }

    return Promise.reject(err);
  }
);

export default http;
