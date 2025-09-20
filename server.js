require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');
const morgan = require('morgan');
const cors = require('cors');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({ origin: true, credentials: true }));

// connect DB
connectDB().catch(err => { console.error(err); process.exit(1); });

// routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/shows', require('./src/routes/shows'));
app.use('/api/watchlist', require('./src/routes/watchlist'));
app.use('/api/clubs', require('./src/routes/clubs'));

app.get('/', (req, res) => res.send('Anime Tracker API running'));

// final error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
