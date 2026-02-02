/**
 * Centralized API configuration for BucketMail.
 * This handles the backend URL for both development and production.
 */

const VITE_API_URL = import.meta.env.VITE_API_URL;

// Fallback logic for production vs development
const FALLBACK_URL = import.meta.env.PROD
  ? "https://bulk-email-app-backend-two.vercel.app/api/send"
  : "http://localhost:3001/api/send";

// The full endpoint for sending emails
export const API_SEND_URL = VITE_API_URL || FALLBACK_URL;

// The base URL used for health checks (removes the /api/send suffix if present)
export const API_BASE_URL = API_SEND_URL.replace(/\/api\/send\/?$/, "") || "/";
