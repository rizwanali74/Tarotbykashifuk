const configuredApiBase = import.meta.env.VITE_API_BASE_URL;
const API_BASE = (
  import.meta.env.PROD
    ? 'https://tarotbykashifuk-server.vercel.app/api'
    : configuredApiBase || '/api'
).replace(/\/$/, '');

export const resolveCatalogImageUrl = (imagePath) => {
  if (!imagePath || /^(https?:)?\/\//i.test(imagePath)) return imagePath;
  try {
    const apiOrigin = new URL(API_BASE, window.location.origin).origin;
    return new URL(imagePath, apiOrigin).toString();
  } catch {
    return imagePath;
  }
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('kashif_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// 1. Auth & Superadmin Endpoints
export const checkSetupStatus = async () => {
  try {
    const res = await fetch(`${API_BASE}/auth/setup-status`);
    return await res.json();
  } catch (error) {
    console.error('Failed to check setup status:', error);
    return { success: false, isSetupComplete: true };
  }
};

export const setupSuperadmin = async (payload) => {
  const res = await fetch(`${API_BASE}/auth/setup-superadmin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return await res.json();
};

export const loginAdmin = async (credentials) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return await res.json();
};

export const getAdminProfile = async () => {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: getAuthHeaders(),
  });
  return await res.json();
};

// 2. Orders & Client Bookings
export const submitBookingOrder = async (orderData) => {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  return await res.json();
};

export const lookupClientOrder = async (orderId) => {
  const res = await fetch(`${API_BASE}/orders/lookup/${orderId}`);
  return await res.json();
};

export const fetchAdminOrders = async (status = 'All', search = '') => {
  const query = new URLSearchParams();
  if (status && status !== 'All') query.append('status', status);
  if (search) query.append('search', search);

  const res = await fetch(`${API_BASE}/orders?${query.toString()}`, {
    headers: getAuthHeaders(),
  });
  return await res.json();
};

export const updateOrderStatus = async (orderId, status, paymentStatus, notes) => {
  const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status, paymentStatus, notes }),
  });
  return await res.json();
};

export const fetchMonthlyStats = async () => {
  const res = await fetch(`${API_BASE}/orders/stats/monthly`, {
    headers: getAuthHeaders(),
  });
  return await res.json();
};

// 3. Public Service Catalog & Superadmin Management
export const fetchPublicCatalog = async () => {
  const res = await fetch(`${API_BASE}/catalog`);
  return await res.json();
};

export const fetchAdminCatalog = async () => {
  const res = await fetch(`${API_BASE}/catalog/admin`, {
    headers: getAuthHeaders(),
  });
  return await res.json();
};

const adminCatalogRequest = async (path, method = 'POST', payload) => {
  const res = await fetch(`${API_BASE}/catalog/admin${path}`, {
    method,
    headers: getAuthHeaders(),
    ...(payload ? { body: JSON.stringify(payload) } : {}),
  });
  return await res.json();
};

export const createCatalogService = (service) => adminCatalogRequest('/services', 'POST', service);
export const updateCatalogService = (id, service) => adminCatalogRequest(`/services/${id}`, 'PATCH', service);
export const deleteCatalogService = (id) => adminCatalogRequest(`/services/${id}`, 'DELETE');
export const uploadCatalogServiceImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const token = localStorage.getItem('kashif_admin_token');
  const res = await fetch(`${API_BASE}/catalog/admin/services/image`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  return await res.json();
};
export const createCatalogCategory = (name) => adminCatalogRequest('/categories', 'POST', { name });
export const updateCatalogCategory = (id, name) => adminCatalogRequest(`/categories/${id}`, 'PATCH', { name });
export const deleteCatalogCategory = (id) => adminCatalogRequest(`/categories/${id}`, 'DELETE');

// 4. Contact Form & Email
export const submitContactInquiry = async (formData) => {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  return await res.json();
};

export const fetchContactMessages = async () => {
  const res = await fetch(`${API_BASE}/contact`, {
    headers: getAuthHeaders(),
  });
  return await res.json();
};

export const sendDiagnosticEmail = async (email) => {
  const res = await fetch(`${API_BASE}/contact/test-email`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ email }),
  });
  return await res.json();
};

// 5. PayPal Payment
export const initiatePayPalPayment = async (orderId, amount) => {
  const res = await fetch(`${API_BASE}/payments/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, amount }),
  });
  return await res.json();
};

export const capturePayPalPayment = async (orderId, paypalOrderId) => {
  const res = await fetch(`${API_BASE}/payments/capture-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, paypalOrderId }),
  });
  return await res.json();
};
