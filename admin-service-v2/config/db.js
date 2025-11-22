const mongoose = require('mongoose');
require('dotenv').config();

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Terhubung ke MongoDB (Mongoose)');
  } catch (error) {
    console.error('❌ Koneksi ke MongoDB gagal:', error.message);
    process.exit(1); 
  }
}

module.exports = connectToDB;
