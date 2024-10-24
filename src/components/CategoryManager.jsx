// components/CategoryManager.js
import React, { useState, useEffect } from 'react';

const CategoryManager = ({ transactions }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const uniqueCategories = [...new Set(transactions.map(t => t.category))];
    setCategories(uniqueCategories);
  }, [transactions]);

  const getCategoryTotal = (category) => {
    return transactions
      .filter(t => t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <div>
      <h2>Category Manager</h2>
      <ul className='category-list'>
        {categories.map(category => (
          <li key={category} className='category-item'>
            {category}: ₹{getCategoryTotal(category).toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryManager;