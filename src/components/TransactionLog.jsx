// components/TransactionLog.js
import React, { useState } from 'react';

const TransactionLog = ({ balance, transactions, addTransaction }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addTransaction(parseFloat(amount), category, description);
    setAmount('');
    setCategory('');
    setDescription('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit', 
      hour12: false 
    };
    return date.toLocaleString('en-GB', options); // Use 'en-GB' for dd-mm-yyyy format
  };

  return (
    <div>
      <h2>Transaction Log</h2>
      <p>Current Balance: ₹{balance.toFixed(2)}</p>
      
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          required
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <button type="submit">Add Transaction</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{formatDate(transaction.date)}</td>
              <td>{transaction.amount.toFixed(2)}</td>
              <td>{transaction.category}</td>
              <td>{transaction.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionLog;
