import React, { useContext, useState } from 'react';
import { FinanceContext } from '../../contexts/FinanceContext';
import Card from '../../components/Card/Card';
import SummaryCards from '../../components/SummaryCards/SummaryCards';
import TransactionForm from '../../components/TransactionForm/TransactionForm';
import TransactionList from '../../components/TransactionList/TransactionList';
import BudgetForm from '../../components/BudgetForm/BudgetForm';
import BudgetList from '../../components/BudgetList/BudgetList';
import CategoryChart from '../../components/CategoryChart/CategoryChart';
import RecentTransactions from '../../components/RecentTransactions/RecentTransactions';
import Loading from '../../components/Loading/Loading';
import ExportButton from '../../components/ExportButton/ExportButton';
import { exportBudgetsToCSV, exportSummaryToCSV } from '../../utils/export';
import './Dashboard.css';

function Dashboard() {
  const {
    transactions,
    budgets,
    summary,
    loading,
    error,
    deleteTransaction,
    updateTransaction,
    deleteBudget,
    updateBudget
  } = useContext(FinanceContext);

  const [activeTab, setActiveTab] = useState('overview');

  const handleDeleteTransaction = async (id) => {
    await deleteTransaction(id);
  };

  const handleEditTransaction = async (id, data) => {
    const result = await updateTransaction(id, data);
    return result.success;
  };

  const handleDeleteBudget = async (id) => {
    await deleteBudget(id);
  };

  const handleEditBudget = async (id, data) => {
    const result = await updateBudget(id, data);
    return result.success;
  };

  const handleExportBudgets = () => {
    const dataToExport = (summary.budgetStatus || budgets).map(b => ({
      category: b.category,
      limit: b.limit,
      spent: b.spent || 0,
      remaining: b.remaining || b.limit,
      percentage: b.percentage || 0,
      status: b.status || 'good'
    }));

    const timestamp = new Date().toISOString().split('T')[0];
    exportBudgetsToCSV(dataToExport, `budgets-${timestamp}.csv`);
  };

  const handleExportSummary = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    exportSummaryToCSV(summary, `summary-${timestamp}.csv`);
  };

  if (loading && transactions.length === 0) {
    return <Loading message="Loading your financial data..." />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Financial Dashboard</h1>
        <p className="dashboard-subtitle">Track your income, expenses, and budgets</p>
      </div>

      {error && (
        <div className="dashboard-error">
          <p>⚠️ {error}</p>
        </div>
      )}

      {/* Summary Cards */}
      <SummaryCards summary={summary} />

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          💳 Transactions
        </button>
        <button
          className={`tab-button ${activeTab === 'budgets' ? 'active' : ''}`}
          onClick={() => setActiveTab('budgets')}
        >
          📈 Budgets
        </button>
      </div>

      {/* Tab Content */}
      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div>
            <div className="dashboard-export-section">
              <ExportButton 
                onExport={handleExportSummary}
                disabled={!summary.totalIncome && !summary.totalExpenses}
              >
                Export Summary
              </ExportButton>
            </div>
            
            <div className="overview-grid">
              <Card title="Recent Transactions" className="overview-card">
                <RecentTransactions transactions={transactions} limit={5} />
              </Card>

              <Card title="Expense Breakdown" className="overview-card">
                <CategoryChart data={summary.spendingByCategory} type="expense" />
              </Card>

              <Card title="Income Sources" className="overview-card">
                <CategoryChart data={summary.incomeByCategory} type="income" />
              </Card>

              <Card title="Quick Add Transaction" className="overview-card">
                <TransactionForm />
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="transactions-grid">
            <Card title="Add New Transaction" className="form-card">
              <TransactionForm />
            </Card>

            <Card title="All Transactions" className="list-card">
              <TransactionList
                transactions={transactions}
                onDelete={handleDeleteTransaction}
                onEdit={handleEditTransaction}
              />
            </Card>
          </div>
        )}

        {activeTab === 'budgets' && (
          <div>
            <div className="dashboard-export-section">
              <ExportButton 
                onExport={handleExportBudgets}
                disabled={budgets.length === 0}
              >
                Export Budgets
              </ExportButton>
            </div>
            
            <div className="budgets-grid">
              <Card title="Create Budget" className="form-card">
                <BudgetForm />
              </Card>

              <Card title="Your Budgets" className="list-card">
                <BudgetList
                  budgets={summary.budgetStatus || budgets}
                  onDelete={handleDeleteBudget}
                  onEdit={handleEditBudget}
                />
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
