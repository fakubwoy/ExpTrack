// App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import TransactionLog from './components/TransactionLog';
import ExpensePlot from './components/ExpensePlot';
import CategoryManager from './components/CategoryManager';
import OweBook from './components/OweBook';
import ExpenseCalendar from './components/ExpenseCalendar';
import "./App.css"

const App = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Load data from localStorage
    const savedBalance = localStorage.getItem('balance');
    const savedTransactions = localStorage.getItem('transactions');

    if (savedBalance) setBalance(parseFloat(savedBalance));
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
  }, []);

  useEffect(() => {
    // Save data to localStorage whenever it changes
    localStorage.setItem('balance', balance.toString());
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [balance, transactions]);

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
          <Route path="/owebook" element={<OweBook />} />
          <Route path="/calendar" element={<ExpenseCalendar transactions={transactions} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;