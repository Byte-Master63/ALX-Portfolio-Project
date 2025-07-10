import React, { createContext, useState, useEffect } from 'react';
import { 
  getTransactions, 
  createTransaction as apiCreateTransaction,
  deleteTransaction as apiDeleteTransaction,
  getBudgets,
  createOrUpdateBudget as apiCreateOrUpdateBudget,
  getSummary
} from '../services/api';

export const FinanceContext = createContext();

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [transactionsData, budgetsData, summaryData] = await Promise.all([
        getTransactions(),
        getBudgets(),
        getSummary()
      ]);
      
      setTransactions(transactionsData);
      setBudgets(budgetsData);
      setSummary(summaryData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (transactionData) => {
    try {
      setLoading(true);
      const result = await apiCreateTransaction(transactionData);
      if (result.success) {
        await loadData();
        return { success: true };
      }
      return { success: false, message: result.message };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      setLoading(true);
      const result = await apiDeleteTransaction(id);
      if (result.success) {
        await loadData();
        return { success: true };
      }
      return { success: false, message: result.message };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const createOrUpdateBudget = async (budgetData) => {
    try {
      setLoading(true);
      const result = await apiCreateOrUpdateBudget(budgetData);
      if (result.success) {
        await loadData();
        return { success: true };
      }
      return { success: false, message: result.message };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <FinanceContext.Provider value={{
      transactions,
      budgets,
      summary,
      loading,
      error,
      loadData,
      createTransaction,
      deleteTransaction,
      createOrUpdateBudget
    }}>
      {children}
    </FinanceContext.Provider>
  );
}
