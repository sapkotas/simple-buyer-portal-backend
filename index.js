const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

require('./config/db'); // initializes DB + seeds data

const authRoutes = require('./routes/authRoutes');
const favouriteRoutes = require('./routes/favouriteRoutes');

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', favouriteRoutes);

app.get('/', (req, res) => res.send('✅ Real-Estate Buyer Portal API is running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));