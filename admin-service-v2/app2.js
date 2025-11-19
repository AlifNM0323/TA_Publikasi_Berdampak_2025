require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectToDB = require('./config/db'); // Koneksi ke MongoDB
const citizenRoutes = require('./routes/citizens'); // Rute citizen

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware untuk parsing JSON request body
app.use(cors()); // Middleware untuk mengatasi CORS

// Koneksi ke MongoDB
connectToDB();

// Menggunakan rute citizen
app.use('/citizens', citizenRoutes); // Rute untuk citizen

// Rute dasar untuk memastikan server berjalan
app.get('/', (req, res) => {
  res.json({ message: 'Server Berjalan' });
});

// Menjalankan server
app.listen(port, () => {
  console.log(`🚀 Server berjalan di port ${port}`);
});
