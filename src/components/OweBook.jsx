import React, { useState } from 'react';

const OweBook = ({ debts, addDebt, updateDebt, deleteDebt }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [isOwed, setIsOwed] = useState(true);
  const [editingDebt, setEditingDebt] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const debt = {
      id: Date.now(),
      name,
      amount: parseFloat(amount),
      isOwed,
      date: new Date().toISOString(),
    };

    if (editingDebt) {
      updateDebt({ ...debt, id: editingDebt });
    } else {
      addDebt(debt);
    }
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setAmount('');
    setIsOwed(true);
    setEditingDebt(null);
  };

  const editDebt = (debt) => {
    setName(debt.name);
    setAmount(debt.amount);
    setIsOwed(debt.isOwed);
    setEditingDebt(debt.id);
  };

  return (
    <div>
      <h2>Owe Book</h2>
      <form onSubmit={handleSubmit}>
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
        <select value={isOwed} onChange={(e) => setIsOwed(e.target.value === 'true')} className='owebook-select'>
          <option value="true">They owe me</option>
          <option value="false">I owe them</option>
        </select>
        <button type="submit">{editingDebt ? 'Update Debt' : 'Add Debt'}</button>
      </form>

      <ul className='debt-list'>
        {debts.map((debt) => (
          <li key={debt.id} className='debt-item'>
            {debt.name} : ₹{debt.amount.toFixed(2)} :
            {debt.isOwed ? " They owe me" : " I owe them"}
            <button onClick={() => editDebt(debt)} style={{ marginLeft: '10px', color: 'white' }} className='debt-actions' id='edit-debt'>
              Edit
            </button>
            <button onClick={() => deleteDebt(debt.id)} style={{ marginLeft: '10px', color: 'white' }} className='debt-actions' id='del-debt'>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OweBook;
