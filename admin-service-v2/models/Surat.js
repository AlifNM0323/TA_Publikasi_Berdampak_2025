import mongoose from 'mongoose';

const suratSchema = new mongoose.Schema({
  citizenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Citizen',
    required: true
  },
  jenisSurat: {
    type: String,
    required: true
  },
  keperluan: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'Menunggu'
  },
  tanggalPengajuan: {
    type: String
  }
});

// 👇 INI KUNCI PERBAIKANNYA: Menggunakan export default
export default mongoose.model('Surat', suratSchema);