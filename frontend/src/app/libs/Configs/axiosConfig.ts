import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiHandler } from "../../api-service/ApiRequestManager";
import { SessionState } from "../SessionState";

const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
});

// a request interceptor to include the accesstoken in headers
apiClient.interceptors.request.use(
  (config) => {
    const token = SessionState.accessToken;

    if (!config.url?.includes("/users/login")) {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry: boolean;
    };

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/users/login")
    ) {
      originalRequest._retry = true;

      try {
        const response = await ApiHandler.refreshToken();
        const newAccessToken = response?.accessToken;
        apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        SessionState.accessToken = newAccessToken;
        SessionState.refreshToken = response?.refreshToken;

        return apiClient(originalRequest);
      } catch (err) {
        SessionState.removeAccessToken();
        SessionState.removeRefreshToken();
        window.location.reload();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
