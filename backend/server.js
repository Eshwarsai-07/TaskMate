// server.js
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');

const tasksRouter = require('./routes/tasks');
const logsRouter = require('./routes/logs');
const basicAuth = require('./middleware/basicAuth');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(express.json());
app.use(cors()); // front-end origin can be restricted if needed

// All API routes require Basic Auth
app.use('/api', basicAuth);

// routes
app.use('/api/tasks', tasksRouter);
app.use('/api/logs', logsRouter);

// error handler (no raw stack traces)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
