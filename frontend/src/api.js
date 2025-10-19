// src/api.js
import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

const authHeader = () => {
  // Basic Auth credentials (frontend uses hardcoded per assignment)
  const credentials = btoa('admin:password123');
  return { Authorization: 'Basic ' + credentials };
};

export const api = axios.create({
  baseURL: BASE,
  headers: {
    ...authHeader(),
    'Content-Type': 'application/json',
  },
});

// helper to update headers if needed
export function setAuth(user, pass) {
  const credentials = btoa(`${user}:${pass}`);
  api.defaults.headers.common.Authorization = `Basic ${credentials}`;
}
