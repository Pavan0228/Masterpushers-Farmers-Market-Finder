export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? '' // Use relative URLs in production (same domain)
    : 'http://localhost:3000');