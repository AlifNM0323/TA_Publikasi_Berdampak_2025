const mongoose = require('mongoose');

// Schema Citizen
const citizenSchema = new mongoose.Schema({
  citizen_id: {
    type: String,
    required: true,
  },
  family_id: {
    type: String,
    required: true,
  },
  contribution_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  nik: {
    type: String,
    required: true,
    unique: true, // NIK harus unik
  },
  gender: {
    type: String,
    enum: ['L', 'P'], // L = Laki-laki, P = Perempuan
    required: true,
  },
  religion: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  profession: {
    type: String,
    required: true,
  },
  place_of_birth: {
    type: String,
    required: true,
  },
  date_of_birth: {
    type: Date,
    required: true,
  },
  date_in: {
    type: Date,
    default: Date.now,
  },
  date_up: {
    type: Date,
    default: Date.now,
  },
});

// Model Citizen yang diarahkan ke koleksi 'citizens'
module.exports = mongoose.model('Citizen', citizenSchema, 'citizens');
