import mongoose from 'mongoose';

const citizenSchema = new mongoose.Schema({
  // HAPUS 'citizen_id', karena MongoDB sudah otomatis punya '_id'
  
  // PENTING: family_id harus ObjectId biar bisa relasi ke tabel Family
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family',
    required: true,
  },
  
  // contribution_id nanti dulu kalau tabelnya belum ada, kita skip biar ga error
  
  name: { type: String, required: true },
  
  nik: {
    type: String,
    required: true,
    unique: true, 
  },
  
  gender: {
    type: String,
    enum: ['L', 'P'],
    required: true,
  },
  
  religion: { type: String, required: true },
  address: { type: String, required: true },
  profession: { type: String, required: true },
  placeOfBirth: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },

}, { timestamps: true }); // timestamps otomatis bikin date_in (createdAt) & date_up (updatedAt)

export default mongoose.model('Citizen', citizenSchema);