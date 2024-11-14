// Use Postman, or JavaScript to get your API key
// In Workflow we will learn how to secure this information

export const API_KEY = "bf50e024-b5e9-4041-9e64-48a572ee7b6d";

export const API_BASE = "https://v2.api.noroff.dev";

export const API_AUTH = `${API_BASE}/auth`;

export const API_AUTH_LOGIN = `${API_AUTH}/login`;

export const API_AUTH_REGISTER = `${API_AUTH}/register`;

export const API_AUTH_KEY = `${API_AUTH}/create-api-key`;

export const API_ACTION = `${API_BASE}/auction`;

export const API_ACTION_LISTING = `${API_ACTION}/listings`;

export const API_ACTION_PROFILES = `${API_ACTION}/profiles`;

export const CONTENT_TYPE_JSON = 'application/json';
