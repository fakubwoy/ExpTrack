// components/OweBook.js
import React, { useState, useEffect } from 'react';

const OweBook = () => {
  const [debts, setDebts] = useState([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [isOwed, setIsOwed] = useState(true);
  const [editingDebt, setEditingDebt] = useState(null); // New state for editing

  useEffect(() => {
    const savedDebts = localStorage.getItem('debts');
    if (savedDebts) setDebts(JSON.parse(savedDebts));
  }, []);

  useEffect(() => {
    localStorage.setItem('debts', JSON.stringify(debts));
  }, [debts]);

  const addDebt = (e) => {
    e.preventDefault();
    const newDebt = {
      id: Date.now(),
      name,
      amount: parseFloat(amount),
      isOwed,
      date: new Date().toISOString(),
    };
    setDebts([...debts, newDebt]);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setAmount('');
    setIsOwed(true);
    setEditingDebt(null); // Reset editing state
  };

  const deleteDebt = (id) => {
    const updatedDebts = debts.filter(debt => debt.id !== id);
    setDebts(updatedDebts);
  };

  const editDebt = (debt) => {
    setName(debt.name);
    setAmount(debt.amount);
    setIsOwed(debt.isOwed);
    setEditingDebt(debt.id); // Set the ID of the debt being edited
  };

  const updateDebt = (e) => {
    e.preventDefault();
    const updatedDebts = debts.map(debt => 
      debt.id === editingDebt ? { ...debt, name, amount: parseFloat(amount), isOwed } : debt
    );
    setDebts(updatedDebts);
    resetForm();
  };

  return (
    <div>
      <h2>Owe Book</h2>
      <form onSubmit={editingDebt ? updateDebt : addDebt}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
        />
        <select value={isOwed} onChange={(e) => setIsOwed(e.target.value === 'true')}>
          <option value="true">They owe me</option>
          <option value="false">I owe them</option>
        </select>
        <button type="submit">{editingDebt ? 'Update Debt' : 'Add Debt'}</button>
      </form>

      <ul>
  {debts.map((debt) => (
    <li key={debt.id}>
      {debt.name} - ₹{debt.amount.toFixed(2)} - 
      {debt.isOwed ? "They owe me" : "I owe them"}
      <button onClick={() => editDebt(debt)} style={{ marginLeft: '10px', color: 'lightblue' }}>
        Edit
      </button>
      <button onClick={() => deleteDebt(debt.id)} style={{ marginLeft: '10px', color: 'red' }}>
        Delete
      </button>
    </li>
  ))}
</ul>

    </div>
  );
};

export default OweBook;
