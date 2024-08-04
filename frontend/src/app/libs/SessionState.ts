export const SessionState = {
  get refreshToken(): string | null {
    const value = window.sessionStorage.getItem("refreshToken");
    return value;
  },

  set refreshToken(value: string | undefined) {
    window.sessionStorage.setItem("refreshToken", value ? value : "");
  },

  removeRefreshToken() {
    window.sessionStorage.removeItem("refreshToken");
  },

  get accessToken(): string | null {
    const value = window.sessionStorage.getItem("accessToken");
    return value;
  },

  set accessToken(value: string | undefined) {
    window.sessionStorage.setItem("accessToken", value ? value : "");
  },

  removeAccessToken() {
    window.sessionStorage.removeItem("accessToken");
  },
};
