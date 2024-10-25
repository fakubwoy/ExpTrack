import React, { useState, useEffect, useRef } from 'react';

const TransactionLog = ({ balance, transactions, addTransaction }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

  // Get unique categories from existing transactions
  const existingCategories = [...new Set(transactions.map(t => t.category))];

  useEffect(() => {
    // Handle clicking outside suggestions box
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);
    
    if (value.trim()) {
      const filtered = existingCategories.filter(cat =>
        cat.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setCategory(suggestion);
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTransaction(parseFloat(amount), category, description);
    setAmount('');
    setCategory('');
    setDescription('');
    setSuggestions([]);
    setShowSuggestions(false);
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
    return date.toLocaleString('en-GB', options);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Transaction Log</h2>
      <p className="text-lg mb-4" id='balance'>Current Balance: ₹{balance.toFixed(2)}</p>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            required
            className="p-2 border rounded"
          />
          <div className="relative">
            <input
              type="text"
              value={category}
              onChange={handleCategoryChange}
              placeholder="Category"
              required
              className="p-2 border rounded"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div 
                ref={suggestionsRef}
                className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg"
              >
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    id='suggestion'
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="p-2 border rounded"
          />
          <button 
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Transaction
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left border">Date & Time</th>
              <th className="p-2 text-left border">Amount (₹)</th>
              <th className="p-2 text-left border">Category</th>
              <th className="p-2 text-left border">Description</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b">
                <td className="p-2 border">{formatDate(transaction.date)}</td>
                <td className="p-2 border">{transaction.amount.toFixed(2)}</td>
                <td className="p-2 border">{transaction.category}</td>
                <td className="p-2 border">{transaction.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionLog;