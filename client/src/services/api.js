import axios from 'axios';

const API_BASE = "http://localhost:5000/api";

export const resolveCatalogImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (/^(https?:)?\/\//i.test(imagePath)) return imagePath;
  if (imagePath.startsWith('/uploads')) {
    try {
      const apiOrigin = new URL(API_BASE, window.location.origin).origin;
      return `${apiOrigin}${imagePath}`;
    } catch {
      return imagePath;
    }
  }
  // Client static assets in /images or /
  return imagePath;
};

// Create configured Axios client instance
const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach superadmin JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kashif_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to return response data directly
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.data) {
      return error.response.data;
    }
    return Promise.reject(error);
  }
);

// 1. Auth & Superadmin Endpoints
export const checkSetupStatus = async () => {
  try {
    return await apiClient.get('/auth/setup-status');
  } catch (error) {
    console.error('Failed to check setup status:', error);
    return { success: false, isSetupComplete: true };
  }
};

export const setupSuperadmin = async (payload) => {
  return await apiClient.post('/auth/setup-superadmin', payload);
};

export const loginAdmin = async (credentials) => {
  return await apiClient.post('/auth/login', credentials);
};

export const getAdminProfile = async () => {
  return await apiClient.get('/auth/me');
};

// 2. Orders & Client Bookings
export const submitBookingOrder = async (orderData) => {
  return await apiClient.post('/orders', orderData);
};

export const lookupClientOrder = async (orderId) => {
  return await apiClient.get(`/orders/lookup/${orderId}`);
};

export const fetchAdminOrders = async (status = 'All', search = '') => {
  const params = {};
  if (status && status !== 'All') params.status = status;
  if (search) params.search = search;
  return await apiClient.get('/orders', { params });
};

export const updateOrderStatus = async (orderId, status, paymentStatus, notes) => {
  return await apiClient.patch(`/orders/${orderId}/status`, { status, paymentStatus, notes });
};

export const fetchMonthlyStats = async () => {
  return await apiClient.get('/orders/stats/monthly');
};

// 3. Public Service Catalog & Superadmin Management
export const fetchPublicCatalog = async () => {
  return await apiClient.get('/catalog');
};

export const fetchAdminCatalog = async () => {
  return await apiClient.get('/catalog/admin');
};

export const createCatalogService = (service) => apiClient.post('/catalog/admin/services', service);
export const updateCatalogService = (id, service) => apiClient.patch(`/catalog/admin/services/${id}`, service);
export const deleteCatalogService = (id) => apiClient.delete(`/catalog/admin/services/${id}`);

export const uploadCatalogServiceImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return await apiClient.post('/catalog/admin/services/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const createCatalogCategory = (name) => apiClient.post('/catalog/admin/categories', { name });
export const updateCatalogCategory = (id, name) => apiClient.patch(`/catalog/admin/categories/${id}`, { name });
export const deleteCatalogCategory = (id) => apiClient.delete(`/catalog/admin/categories/${id}`);

// 4. Contact Form & Email
export const submitContactInquiry = async (formData) => {
  return await apiClient.post('/contact', formData);
};

export const fetchContactMessages = async () => {
  return await apiClient.get('/contact');
};

export const sendDiagnosticEmail = async (email) => {
  return await apiClient.post('/contact/test-email', { email });
};

// 5. PayPal Payment
export const initiatePayPalPayment = async (orderId, amount) => {
  return await apiClient.post('/payments/create-order', { orderId, amount });
};

export const capturePayPalPayment = async (orderId, paypalOrderId) => {
  return await apiClient.post('/payments/capture-order', { orderId, paypalOrderId });
};

// 6. Time Slots & Multi-Country Availability Endpoints
export const fetchTimeSlots = async ({ date, status, timezone } = {}) => {
  const params = {};
  if (date) params.date = date;
  if (status) params.status = status;
  if (timezone) params.timezone = timezone;
  return await apiClient.get('/slots', { params });
};

export const createTimeSlot = async (slotData) => {
  return await apiClient.post('/slots', slotData);
};

export const updateTimeSlot = async (id, slotData) => {
  return await apiClient.put(`/slots/${id}`, slotData);
};

export const deleteTimeSlot = async (id) => {
  return await apiClient.delete(`/slots/${id}`);
};

export const batchGenerateTimeSlots = async (payload) => {
  return await apiClient.post('/slots/batch-generate', payload);
};

export const fetchAvailabilitySettings = async () => {
  return await apiClient.get('/slots/availability');
};

export const updateAvailabilitySettings = async (settings) => {
  return await apiClient.put('/slots/availability', settings);
};

export const autoGenerateWeeklySlots = async (payload = {}) => {
  return await apiClient.post('/slots/auto-generate-weekly', payload);
};
