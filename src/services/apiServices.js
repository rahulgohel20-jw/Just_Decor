import { POST } from "./axiosInstance";

// Example: Login API Function
export const loginAPI = (data) => {
  return POST("login", data); // Use the LOGIN endpoint from apiUrls.js
};
