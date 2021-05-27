const express = require('express');
const connectDB = require('./db');

// Load .env config
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();

// Connect to MongoDB
connectDB();

// Init Middleware
app.use(express.json({ extended: false, limit: '50mb' }));

// Define routes
app.use('/api/user', require('./api/user'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));