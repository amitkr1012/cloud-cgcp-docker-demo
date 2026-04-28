const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// DB config from env (K8s secrets)
const pool = new Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.send(`DB Connected ✅ Time: ${result.rows[0].now}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('DB Connection Failed ❌');
  }
});

app.get('/health', (req, res) => {
  res.send('OK');
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
