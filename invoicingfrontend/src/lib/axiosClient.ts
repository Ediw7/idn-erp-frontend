import axios from "axios";

// Configure Axios with defaults for Odoo API
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  // CRITICAL: withCredentials ensures the frontend automatically sends and
  // receives the Odoo `session_id` cookie on every request.
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Response Interceptor for global error handling
axiosClient.interceptors.response.use(
  (response) => {
    // Return a successful response directly
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle known HTTP errors from Odoo backend
      if (error.response.status === 401) {
        console.error("Session expired or unauthorized. Please log in again.");
        // Note: We can integrate Zustand here to clear user session state globally
        // e.g., useAuthStore.getState().logout()
      } else if (error.response.status === 400) {
        console.error("Bad Request:", error.response.data);
      } else if (error.response.status === 500) {
        console.error("Odoo Server Error:", error.response.data);
      }
    } else if (error.request) {
      console.error(
        "Network Error: Could not reach the Odoo server.",
        error.request,
      );
    } else {
      console.error("Error:", error.message);
    }

    // Always reject the promise so the calling feature block can handle it as well
    return Promise.reject(error);
  },
);

export default axiosClient;
