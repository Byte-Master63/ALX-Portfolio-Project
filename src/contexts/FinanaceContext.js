import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from './AuthContext';
import { 
  getTransactions, 
  createTransaction as apiCreateTransaction,
  updateTransaction as apiUpdateTransaction,
  deleteTransaction as apiDeleteTransaction,
  getBudgets,
  createBudget as apiCreateBudget,
  updateBudget as apiUpdateBudget,
  deleteBudget as apiDeleteBudget,
  getSummary,
  getMonthlySummary,
  getCategorySummary,
  isAuthenticated
} from '../services/api';

export const FinanceContext = createContext();

export function FinanceProvider({ children }) {
  const { isAuth } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Transaction filters
  const [transactionFilters, setTransactionFilters] = useState({});
  
  // Debounce timer for background refresh
  const refreshTimerRef = useRef(null);

  /**
   * Load all financial data
   */
  const loadData = async (filters = {}) => {
    // Don't load if not authenticated
    if (!isAuthenticated()) {
      // Clear data when not authenticated
      setTransactions([]);
      setBudgets([]);
      setSummary({});
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const [transactionsData, budgetsData, summaryData] = await Promise.all([
        getTransactions(filters),
        getBudgets(),
        getSummary(filters)
      ]);
      
      setTransactions(transactionsData);
      setBudgets(budgetsData);
      setSummary(summaryData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
      // Don't clear data on error, keep showing old data
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh data with current filters (silently in background)
   * Debounced to prevent multiple simultaneous calls
   */
  const refreshData = () => {
    if (!isAuthenticated()) {
      return;
    }

    // Clear existing timer
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    // Debounce the refresh by 500ms
    refreshTimerRef.current = setTimeout(async () => {
      try {
        // Refresh silently without setting loading state
        const [transactionsData, budgetsData, summaryData] = await Promise.all([
          getTransactions(transactionFilters),
          getBudgets(),
          getSummary(transactionFilters)
        ]);
        
        setTransactions(transactionsData);
        setBudgets(budgetsData);
        setSummary(summaryData);
      } catch (err) {
        console.error('Error refreshing data:', err);
        // Don't show error to user on background refresh
      }
    }, 500);
  };

  // ==================== TRANSACTION FUNCTIONS ====================

  /**
   * Create a new transaction
   */
  const createTransaction = async (transactionData) => {
    try {
      setError(null);
      const result = await apiCreateTransaction(transactionData);
      
      if (result.success) {
        // Optimistic update - add to local state immediately
        setTransactions(prev => [result.data, ...prev]);
        
        // Refresh in background without blocking
        refreshData();
        return { success: true, data: result.data };
      }
      
      return { success: false, message: result.message };
    } catch (err) {
      console.error('Error creating transaction:', err);
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  /**
   * Update an existing transaction
   */
  const updateTransaction = async (id, transactionData) => {
    try {
      setError(null);
      const result = await apiUpdateTransaction(id, transactionData);
      
      if (result.success) {
        // Optimistic update - update local state immediately
        setTransactions(prev => 
          prev.map(t => t.id === id ? result.data : t)
        );
        
        // Refresh in background without blocking
        refreshData();
        return { success: true, data: result.data };
      }
      
      return { success: false, message: result.message };
    } catch (err) {
      console.error('Error updating transaction:', err);
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  /**
   * Delete a transaction
   */
  const deleteTransaction = async (id) => {
    try {
      setError(null);
      const result = await apiDeleteTransaction(id);
      
      if (result.success) {
        // Optimistic update - remove from local state immediately
        setTransactions(prev => prev.filter(t => t.id !== id));
        
        // Refresh in background without blocking
        refreshData();
        return { success: true };
      }
      
      return { success: false, message: result.message };
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  /**
   * Filter transactions
   */
  const filterTransactions = async (filters) => {
    setTransactionFilters(filters);
    await loadData(filters);
  };

  // ==================== BUDGET FUNCTIONS ====================

  /**
   * Create a new budget
   */
  const createBudget = async (budgetData) => {
    try {
      setError(null);
      const result = await apiCreateBudget(budgetData);
      
      if (result.success) {
        // Optimistic update - add to local state immediately
        setBudgets(prev => [...prev, result.data]);
        
        // Refresh in background without blocking
        refreshData();
        return { success: true, data: result.data };
      }
      
      return { success: false, message: result.message };
    } catch (err) {
      console.error('Error creating budget:', err);
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  /**
   * Update an existing budget
   */
  const updateBudget = async (id, budgetData) => {
    try {
      setError(null);
      const result = await apiUpdateBudget(id, budgetData);
      
      if (result.success) {
        // Optimistic update - update local state immediately
        setBudgets(prev => 
          prev.map(b => b.id === id ? result.data : b)
        );
        
        // Refresh in background without blocking
        refreshData();
        return { success: true, data: result.data };
      }
      
      return { success: false, message: result.message };
    } catch (err) {
      console.error('Error updating budget:', err);
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  /**
   * Delete a budget
   */
  const deleteBudget = async (id) => {
    try {
      setError(null);
      const result = await apiDeleteBudget(id);
      
      if (result.success) {
        // Optimistic update - remove from local state immediately
        setBudgets(prev => prev.filter(b => b.id !== id));
        
        // Refresh in background without blocking
        refreshData();
        return { success: true };
      }
      
      return { success: false, message: result.message };
    } catch (err) {
      console.error('Error deleting budget:', err);
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  // ==================== SUMMARY FUNCTIONS ====================

  /**
   * Get monthly summary
   */
  const getMonthly = async (year) => {
    try {
      setLoading(true);
      const data = await getMonthlySummary(year);
      return { success: true, data };
    } catch (err) {
      console.error('Error getting monthly summary:', err);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get category summary
   */
  const getCategory = async (filters) => {
    try {
      setLoading(true);
      const data = await getCategorySummary(filters);
      return { success: true, data };
    } catch (err) {
      console.error('Error getting category summary:', err);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Load data when authentication status changes
  useEffect(() => {
    if (isAuth) {
      loadData();
    } else {
      // Clear data when logged out
      setTransactions([]);
      setBudgets([]);
      setSummary({});
    }
  }, [isAuth]);
  
  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, []);

  const contextValue = {
    // State
    transactions,
    budgets,
    summary,
    loading,
    error,
    transactionFilters,
    
    // Data loading
    loadData,
    refreshData,
    
    // Transaction operations
    createTransaction,
    updateTransaction,
    deleteTransaction,
    filterTransactions,
    
    // Budget operations
    createBudget,
    updateBudget,
    deleteBudget,
    
    // Summary operations
    getMonthly,
    getCategory
  };

  return (
    <FinanceContext.Provider value={contextValue}>
      {children}
    </FinanceContext.Provider>
  );
}
