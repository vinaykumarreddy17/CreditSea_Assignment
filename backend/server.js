const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const loanRoutes = require('./routes/loanRoutes');
const adminRoutes = require('./routes/adminRoutes');
const verifierRoutes = require('./routes/verifierRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Could not connect to SQLite database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

app.use((req, res, next) => {
  req.db = db;
  next();
});

db.run(`CREATE TABLE IF NOT EXISTS loans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fullName TEXT,
  amount REAL,
  status TEXT,
  dateApplied TEXT
)`);

app.use('/api/loans', loanRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/verifier', verifierRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));