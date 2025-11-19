const mongoose = require('mongoose');
require('dotenv').config();

// Fungsi untuk menghubungkan ke MongoDB
async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Terhubung ke MongoDB (Mongoose)');
  } catch (error) {
    console.error('❌ Koneksi ke MongoDB gagal:', error.message);
    process.exit(1); // Keluar jika gagal koneksi
  }
}

module.exports = connectToDB;
