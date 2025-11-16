const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

/**
 * Get auth token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get auth headers with token
 */
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

/**
 * Handle API response and errors
 */
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    // Handle specific error cases
    if (response.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
};

// ==================== AUTH ENDPOINTS ====================

export const register = async (name, email, password) => {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  const data = await handleResponse(response);
  
  // Store token
  if (data.success && data.data.token) {
    localStorage.setItem('token', data.data.token);
  }
  
  return data;
};

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await handleResponse(response);
  
  // Store token
  if (data.success && data.data.token) {
    localStorage.setItem('token', data.data.token);
  }
  
  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

export const getProfile = async () => {
  const response = await fetch(`${API_BASE}/auth/profile`, {
    headers: getAuthHeaders()
  });
  return await handleResponse(response);
};

export const verifyToken = async () => {
  const response = await fetch(`${API_BASE}/auth/verify`, {
    headers: getAuthHeaders()
  });
  return await handleResponse(response);
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

// ==================== TRANSACTION ENDPOINTS ====================

export const getTransactions = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const url = queryParams ? `${API_BASE}/transactions?${queryParams}` : `${API_BASE}/transactions`;
  
  const response = await fetch(url, {
    headers: getAuthHeaders()
  });
  const data = await handleResponse(response);
  return data.success ? data.data : [];
};

export const getTransactionById = async (id) => {
  const response = await fetch(`${API_BASE}/transactions/${id}`, {
    headers: getAuthHeaders()
  });
  const data = await handleResponse(response);
  return data.success ? data.data : null;
};

export const createTransaction = async (transactionData) => {
  const response = await fetch(`${API_BASE}/transactions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(transactionData)
  });
  return await handleResponse(response);
};

export const updateTransaction = async (id, transactionData) => {
  const response = await fetch(`${API_BASE}/transactions/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(transactionData)
  });
  return await handleResponse(response);
};

export const deleteTransaction = async (id) => {
  const response = await fetch(`${API_BASE}/transactions/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return await handleResponse(response);
};

// ==================== BUDGET ENDPOINTS ====================

export const getBudgets = async () => {
  const response = await fetch(`${API_BASE}/budgets`, {
    headers: getAuthHeaders()
  });
  const data = await handleResponse(response);
  return data.success ? data.data : [];
};

export const getBudgetById = async (id) => {
  const response = await fetch(`${API_BASE}/budgets/${id}`, {
    headers: getAuthHeaders()
  });
  const data = await handleResponse(response);
  return data.success ? data.data : null;
};

export const createBudget = async (budgetData) => {
  const response = await fetch(`${API_BASE}/budgets`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(budgetData)
  });
  return await handleResponse(response);
};

export const updateBudget = async (id, budgetData) => {
  const response = await fetch(`${API_BASE}/budgets/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(budgetData)
  });
  return await handleResponse(response);
};

export const deleteBudget = async (id) => {
  const response = await fetch(`${API_BASE}/budgets/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return await handleResponse(response);
};

// ==================== SUMMARY ENDPOINTS ====================

export const getSummary = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const url = queryParams ? `${API_BASE}/summary?${queryParams}` : `${API_BASE}/summary`;
  
  const response = await fetch(url, {
    headers: getAuthHeaders()
  });
  const data = await handleResponse(response);
  return data.success ? data.data : {};
};

export const getMonthlySummary = async (year) => {
  const url = year ? `${API_BASE}/summary/monthly?year=${year}` : `${API_BASE}/summary/monthly`;
  
  const response = await fetch(url, {
    headers: getAuthHeaders()
  });
  const data = await handleResponse(response);
  return data.success ? data.data : {};
};

export const getCategorySummary = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const url = queryParams ? `${API_BASE}/summary/category?${queryParams}` : `${API_BASE}/summary/category`;
  
  const response = await fetch(url, {
    headers: getAuthHeaders()
  });
  const data = await handleResponse(response);
  return data.success ? data.data : {};
};
