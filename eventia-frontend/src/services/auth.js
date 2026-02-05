import { request } from './api';

const TOKEN_KEY = 'eventia_token';
const ROLE_KEY = 'eventia_role';

const login = async ({ email, password }) => {
  const data = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(ROLE_KEY, data.user.role);

  return data.user;
};

const getRole = () => localStorage.getItem(ROLE_KEY);
const getToken = () => localStorage.getItem(TOKEN_KEY);

const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
};

export { login, getRole, getToken, clearAuth };
