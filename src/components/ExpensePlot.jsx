import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const ExpensePlot = ({ transactions }) => {
  const [timeframe, setTimeframe] = useState('daily');

  const processData = () => {
    const data = [];
    let runningBalance = 0;
    
    if (timeframe === 'daily') {
      // Sort transactions by timestamp for the current day
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todaysTransactions = transactions
        .filter(transaction => {
          const txDate = new Date(transaction.date);
          return txDate >= today;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      // Create initial balance point at start of day
      data.push({
        timestamp: today.toISOString(),
        balance: runningBalance,
        formattedTime: '00:00'
      });

      // Add a point for each transaction showing running balance
      todaysTransactions.forEach(transaction => {
        const txDate = new Date(transaction.date);
        runningBalance += transaction.amount;
        
        data.push({
          timestamp: txDate.toISOString(),
          balance: runningBalance,
          formattedTime: txDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          })
        });
      });
    } else {
      // Handle other timeframes using the original logic
      const groupedData = {};
      
      transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        let key;

        if (timeframe === 'weekly') {
          const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
          key = weekStart.toISOString().split('T')[0];
        } else if (timeframe === 'monthly') {
          key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        } else if (timeframe === 'today') {
          const today = new Date();
          if (date.toDateString() === today.toDateString()) {
            key = today.toISOString().split('T')[0];
          } else {
            return;
          }
        }

        if (!groupedData[key]) {
          groupedData[key] = 0;
        }
        groupedData[key] += transaction.amount;
      });

      // Convert grouped data to array format
      return Object.keys(groupedData).map(key => ({
        timestamp: key,
        balance: groupedData[key],
        formattedTime: key
      }));
    }

    return data;
  };

  const chartData = processData();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow">
          <p className="text-sm">
            {timeframe === 'daily' 
              ? `Time: ${payload[0].payload.formattedTime}`
              : `Date: ${label}`}
          </p>
          <p className="text-sm font-semibold">
            Balance: ${payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-4xl p-4">
      <h2 className="text-xl font-semibold mb-4">Balance History</h2>
      <div className="mb-4">
        <label htmlFor="timeframe" className="mr-2">Select Timeframe: </label>
        <select
          id="timeframe"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <LineChart 
        width={600} 
        height={300} 
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey={timeframe === 'daily' ? 'formattedTime' : 'timestamp'}
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          label={{ 
            value: 'Balance (₹)', 
            angle: -90, 
            position: 'insideLeft'
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line 
          type="stepAfter"
          dataKey="balance"
          stroke="#8884d8"
          dot={timeframe === 'daily'}
          name="Balance"
        />
      </LineChart>
    </div>
  );
};

export default ExpensePlot;