const VITE_API_URL = import.meta.env.VITE_API_URL;

const FALLBACK_URL = import.meta.env.PROD
  ? "https://bulk-email-app-backend-two.vercel.app/api/send"
  : "http://localhost:3001/api/send";

export const API_SEND_URL = VITE_API_URL || FALLBACK_URL;

export const API_BASE_URL = API_SEND_URL.replace(/\/api\/send\/?$/, "") || "/";
