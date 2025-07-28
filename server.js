require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const kepatuhanRoutes = require('./routes/kepatuhanRoutes');
const inspectionRoutes = require('./routes/inspectionRoutes');
const incidentReportRoutes = require('./routes/incidentReportRoutes'); // ✅ Tambahan baru
const errorHandler = require('./middlewares/errorHandler');
const https = require('https');
const axios = require('axios');

const app = express();




// ✅ 1. Middleware CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

// ✅ 2. Middleware Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ 3. Static Folder untuk Upload
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ 4. Koneksi Database
connectDB();

// ✅ 5. Route API
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/kepatuhan', kepatuhanRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/incident-reports', incidentReportRoutes); // ✅ Rute baru untuk pelaporan insiden

// ✅ 6. Proxy API Lab
app.post('/api-remote/lab', async (req, res) => {
  try {
    const response = await axios.post('https://192.168.1.65/rest/Api/lab', req.body, {
      headers: { 'Content-Type': 'application/json' },
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });
    res.json(response.data);
  } catch (error) {
    console.error('Gagal mengambil data lab:', error.message);
    res.status(500).json({ error: 'Gagal mengambil data lab' });
  }
});

// ✅ 7. Proxy API Radiologi
app.post('/api-remote/rad', async (req, res) => {
  try {
    const response = await axios.post('https://192.168.1.65/rest/Api/rad', req.body, {
      headers: { 'Content-Type': 'application/json' },
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });
    res.json(response.data);
  } catch (error) {
    console.error('Gagal mengambil data radiologi:', error.message);
    res.status(500).json({ error: 'Gagal mengambil data radiologi' });
  }
});

// ✅ 8. Error Handler Middleware
app.use(errorHandler);

// ✅ 9. Jalankan Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
