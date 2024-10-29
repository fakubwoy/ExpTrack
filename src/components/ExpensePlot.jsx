import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceDot } from 'recharts';

const ExpensePlot = ({ transactions }) => {
  const [timeframe, setTimeframe] = useState('daily');

  const processData = () => {
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    
    let runningBalance = 0;
    const allPoints = [];
    
    if (sortedTransactions.length > 0) {
      const firstDate = new Date(sortedTransactions[0].date);
      firstDate.setMinutes(firstDate.getMinutes() - 1);
      allPoints.push({
        timestamp: firstDate.toISOString(),
        balance: runningBalance,
        formattedTime: firstDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        formattedDate: firstDate.toLocaleDateString(),
        change: 0
      });
    }

    sortedTransactions.forEach(transaction => {
      runningBalance += transaction.amount;
      const txDate = new Date(transaction.date);
      
      allPoints.push({
        timestamp: txDate.toISOString(),
        balance: runningBalance,
        formattedTime: txDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        formattedDate: txDate.toLocaleDateString(),
        change: transaction.amount
      });
    });

    if (timeframe === 'daily') {
      const today = new Date();
      return allPoints.filter(point => 
        new Date(point.timestamp).toDateString() === today.toDateString()
      );
    } else if (timeframe === 'weekly') {
      const weeklyData = {};
      allPoints.forEach(point => {
        const date = new Date(point.timestamp);
        const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
        const key = weekStart.toISOString().split('T')[0];
        weeklyData[key] = {
          balance: point.balance,
          change: point.change
        };
      });
      return Object.entries(weeklyData).map(([key, data]) => ({
        timestamp: key,
        balance: data.balance,
        change: data.change,
        formattedDate: new Date(key).toLocaleDateString()
      }));
    } else if (timeframe === 'monthly') {
      const monthlyData = {};
      allPoints.forEach(point => {
        const date = new Date(point.timestamp);
        const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        monthlyData[key] = {
          balance: point.balance,
          change: point.change
        };
      });
      return Object.entries(monthlyData).map(([key, data]) => ({
        timestamp: key,
        balance: data.balance,
        change: data.change,
        formattedDate: new Date(key + '-01').toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short'
        })
      }));
    }

    return allPoints;
  };

  const chartData = processData();

  const getYAxisDomain = () => {
    if (chartData.length === 0) return [0, 100];
    
    const minBalance = Math.min(...chartData.map(d => d.balance));
    const maxBalance = Math.max(...chartData.map(d => d.balance));
    const range = maxBalance - minBalance;
    
    const padding = range * 0.1;
    return [
      Math.floor((minBalance - padding) / 100) * 100, 
      Math.ceil((maxBalance + padding) / 100) * 100  
    ];
  };

  const CustomizedLine = ({ points }) => {
    return points.map((point, index) => {
      if (index === 0) return null;
      
      const prev = points[index - 1];
      const current = point;
      const isIncrease = current.payload.balance > prev.payload.balance;
      const color = isIncrease ? "#22c55e" : "#ef4444";
      
      return (
        <line
          key={index}
          x1={prev.x}
          y1={prev.y}
          x2={current.x}
          y2={current.y}
          stroke={color}
          strokeWidth={2}
        />
      );
    });
  };

  return (
    <div className="w-full max-w-4xl p-4">
      <h2 className="text-xl font-bold mb-4">Balance History</h2>
      <div className="mb-4">
        <label htmlFor="timeframe" className="mr-2">Select Timeframe: </label>
        <select
          id="timeframe"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="expense-plot-select"
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
          dataKey={timeframe === 'daily' ? 'formattedTime' : 'formattedDate'}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          domain={getYAxisDomain()}
          tick={{ fontSize: 12 }}
          label={{
            value: 'Balance (₹)',
            angle: -90,
            position: 'insideLeft',
          }}
        />
        <Tooltip
          content={({ active, payload, label }) =>
            active && payload && payload.length ? (
              <div className="bg-white p-2 border rounded shadow">
                <p className="text-sm">
                  {timeframe === 'daily'
                    ? `Time: ${label}`
                    : `Date: ${label}`}
                </p>
                <p className="text-sm font-semibold">
                  Balance: ₹{payload[0].value.toFixed(2)}
                </p>
                {payload[0].payload.change !== 0 && (
                  <p className={`text-sm ${payload[0].payload.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Change: ₹{payload[0].payload.change.toFixed(2)}
                  </p>
                )}
              </div>
            ) : null
          }
        />
        <Legend />
        <Line
          type="linear"
          dataKey="balance"
          name="Balance"
          dot={{ stroke: '#4f46e5', strokeWidth: 2, r: 4 }}
          activeDot={{ stroke: '#4f46e5', strokeWidth: 2, r: 6 }}
          stroke='#4f46e5'
          shape={<CustomizedLine />}
        />
      </LineChart>
    </div>
  );
};

export default ExpensePlot;