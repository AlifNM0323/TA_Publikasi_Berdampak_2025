require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectToDB = require('./config/db'); 
const citizenRoutes = require('./routes/citizens'); 

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); 
app.use(cors()); 

// Koneksi ke MongoDB
connectToDB();

// Menggunakan rute citizen
app.use('/citizens', citizenRoutes);

// Rute dasar untuk memastikan server berjalan
app.get('/', (req, res) => {
  res.json({ message: 'Server Berjalan' });
});

// Menjalankan server
app.listen(port, () => {
  console.log(`🚀 Server berjalan di port ${port}`);
});
