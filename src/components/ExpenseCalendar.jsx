// components/ExpenseCalendar.js
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const ExpenseCalendar = ({ transactions }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getDayExpenses = (date) => {
    return transactions.filter(t => 
      new Date(t.date).toDateString() === date.toDateString()
    );
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayExpenses = getDayExpenses(date);
      const total = dayExpenses.reduce((sum, t) => sum + t.amount, 0);
      return total !== 0 ? <p>₹{total.toFixed(2)}</p> : null;
    }
  };

  return (
    <div>
      <h2>Expense Calendar</h2>
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileContent={tileContent}
      />
      <div>
        <h3>Expenses for {selectedDate.toDateString()}</h3>
        <ul className='calendar-list'>
          {getDayExpenses(selectedDate).map(expense => (
            <li key={expense.id} className='calendar-item'>
              ₹{expense.amount} : {expense.category}  {expense.description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExpenseCalendar;