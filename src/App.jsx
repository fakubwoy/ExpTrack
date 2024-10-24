import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import TransactionLog from './components/TransactionLog';
import ExpensePlot from './components/ExpensePlot';
import CategoryManager from './components/CategoryManager';
import OweBook from './components/OweBook';
import ExpenseCalendar from './components/ExpenseCalendar';
import "./App.css";

const App = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [debts, setDebts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState('light');

const toggleTheme = () => {
  const newTheme = theme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  document.documentElement.setAttribute('data-theme', newTheme);
};
  useEffect(() => {
    // Load data from the server
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/data');
        const data = await response.json();
        setBalance(data.balance);
        setTransactions(data.transactions);
        setDebts(data.debts);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Only save data after initial load and when data actually changes
    if (!isLoading) {
      const saveData = async () => {
        try {
          await fetch('http://localhost:5000/api/data', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ balance, transactions, debts }),
          });
        } catch (error) {
          console.error('Error saving data:', error);
        }
      };

      saveData();
    }
  }, [balance, transactions, debts, isLoading]);

  const addTransaction = (amount, category, description) => {
    const newTransaction = {
      id: Date.now(),
      amount,
      category,
      description,
      date: new Date().toISOString(),
    };
    setTransactions([...transactions, newTransaction]);
    setBalance(balance + amount);
  };

  const addDebt = (debt) => {
    setDebts([...debts, debt]);
  };

  const updateDebt = (updatedDebt) => {
    setDebts(debts.map(debt => (debt.id === updatedDebt.id ? updatedDebt : debt)));
  };

  const deleteDebt = (id) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };

  if (isLoading) {
    return (
      <div className="loading-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Loading your financial data...</p>
      </div>
    );
  }

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Transaction Log</Link></li>
            <li><Link to="/plot">Expense Plot</Link></li>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/owebook">Owe Book</Link></li>
            <li><Link to="/calendar">Calendar</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={
            <TransactionLog
              balance={balance}
              transactions={transactions}
              addTransaction={addTransaction}
            />
          } />
          <Route path="/plot" element={<ExpensePlot transactions={transactions} />} />
          <Route path="/categories" element={<CategoryManager transactions={transactions} />} />
          <Route path="/owebook" element={
            <OweBook
              debts={debts}
              addDebt={addDebt}
              updateDebt={updateDebt}
              deleteDebt={deleteDebt}
            />
          } />
          <Route path="/calendar" element={<ExpenseCalendar transactions={transactions} />} />
        </Routes>
        <button 
  className="theme-toggle" 
  onClick={toggleTheme}
  aria-label="Toggle dark mode"
>
  {theme === 'light' ? '🌙' : '☀️'}
</button>
      </div>
    </Router>
  );
};

export default App;