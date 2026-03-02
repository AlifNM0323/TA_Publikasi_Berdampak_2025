const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config(); // Memuat variabel lingkungan dari file .env

const app = express();
const port = 4000; // Port yang sesuai untuk API Gateway Anda

const API_KEY = process.env.API_KEY; // API Key disimpan di file .env

// Endpoint proxy untuk mengambil data dari API eksternal
app.get('/graphql', async (req, res) => {
  try {
    // Lakukan permintaan ke API eksternal menggunakan API Key di server
    const response = await axios.post('https://api.example.com/graphql', {
      query: req.body.query, // Mengirim query dari frontend
      variables: req.body.variables,
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`, // Menyertakan API Key di header
      }
    });

    res.json(response.data); // Mengirimkan data ke frontend
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data' });
  }
});

// Menjalankan server di port 4000
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});