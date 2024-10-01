// components/ExpensePlot.js
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const ExpensePlot = ({ transactions }) => {
  const [timeframe, setTimeframe] = useState('daily');

  const processData = () => {
    const data = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for accurate comparison

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      let key;

      // Grouping data based on the selected timeframe
      if (timeframe === 'today') {
        if (date.toDateString() === today.toDateString()) {
          key = today.toISOString().split('T')[0]; // Today
        } else {
          return; // Skip if the date is not today
        }
      } else {
        // Handle other timeframes
        if (timeframe === 'daily') {
          key = date.toISOString().split('T')[0]; // Daily
        } else if (timeframe === 'weekly') {
          // Get the start of the week (Sunday)
          const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
          key = weekStart.toISOString().split('T')[0]; // Weekly
        } else if (timeframe === 'monthly') {
          key = `${date.getFullYear()}-${date.getMonth() + 1}`; // Monthly (YYYY-MM)
        }
      }

      if (!data[key]) {
        data[key] = 0;
      }
      data[key] += transaction.amount; // Accumulate the amount
    });

    // Convert the data object into an array suitable for the chart
    return Object.keys(data).map(key => ({
      date: key,
      amount: data[key]
    }));
  };

  const chartData = processData();

  return (
    <div>
      <h2>Expense Plot</h2>
      <div>
        <label htmlFor="timeframe">Select Timeframe: </label>
        <select
          id="timeframe"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
        >
          <option value="today">Today</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <LineChart width={600} height={300} data={chartData}>
        <XAxis dataKey="date" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="amount" stroke="#8884d8" />
      </LineChart>
    </div>
  );
};

export default ExpensePlot;
