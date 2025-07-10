const API_BASE = process.env.REACT_APP_API_URL || '/api';

export const getTransactions = async () => {
  const response = await fetch(`${API_BASE}/transactions`);
  const data = await response.json();
  return data.success ? data.data : [];
};

export const createTransaction = async (transactionData) => {
  const response = await fetch(`${API_BASE}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transactionData)
  });
  return await response.json();
};

export const deleteTransaction = async (id) => {
  const response = await fetch(`${API_BASE}/transactions/${id}`, {
    method: 'DELETE'
  });
  return await response.json();
};

export const getBudgets = async () => {
  const response = await fetch(`${API_BASE}/budgets`);
  const data = await response.json();
  return data.success ? data.data : [];
};

export const createOrUpdateBudget = async (budgetData) => {
  const response = await fetch(`${API_BASE}/budgets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(budgetData)
  });
  return await response.json();
};

export const getSummary = async () => {
  const response = await fetch(`${API_BASE}/summary`);
  const data = await response.json();
  return data.success ? data.data : {};
};
