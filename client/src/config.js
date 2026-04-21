/**
 * Centralized API configuration.
 * When deploying, VITE_API_URL should be set in the production environment variables.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default API_BASE_URL;
