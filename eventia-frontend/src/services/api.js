const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || 'Request failed.';
    throw new Error(message);
  }

  return data;
};

const authRequest = async (path, token, options = {}) => {
  return request(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
};

export { API_BASE_URL, request, authRequest };
