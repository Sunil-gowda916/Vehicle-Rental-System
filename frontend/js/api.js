const API_BASE = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('vrs_token');

const request = async (path, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.errors?.[0]?.msg || 'Something went wrong');
  }
  return data;
};

window.vrsApi = {
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  getAvailableVehicles: (category) => request(`/vehicles/available${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  bookVehicle: (payload) => request('/bookings', { method: 'POST', body: JSON.stringify(payload) }),
  cancelBooking: (bookingId, payload) => request(`/bookings/${bookingId}/cancel`, { method: 'PATCH', body: JSON.stringify(payload) }),
  modifyBooking: (bookingId, payload) => request(`/bookings/${bookingId}/modify`, { method: 'PATCH', body: JSON.stringify(payload) }),
  getDashboard: () => request('/admin/dashboard'),
  getFinalBookings: () => request('/bookings/final')
};
