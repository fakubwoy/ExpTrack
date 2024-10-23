// server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = 'data.json';

// Load existing data from JSON file
const loadData = () => {
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
  }
  return { balance: 0, transactions: [], debts: [] }; // Default structure
};

// Save data to JSON file
const saveData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Get data
app.get('/api/data', (req, res) => {
  const data = loadData();
  res.json(data);
});

// Update data
app.post('/api/data', (req, res) => {
  const data = req.body;
  saveData(data);
  res.status(200).send('Data saved successfully');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
