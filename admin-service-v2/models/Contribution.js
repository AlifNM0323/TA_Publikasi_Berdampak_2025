import mongoose from 'mongoose';

const ContributionSchema = new mongoose.Schema({
  // Relasi: Siapa yang bayar? (Wajib ID Keluarga)
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family',
    required: true
  },

  // Jenis Iuran (Sesuai ERD: contribution_type)
  type: {
    type: String,
    enum: ['KEAMANAN', 'SAMPAH', 'PHBI', 'SOSIAL', 'LAINNYA'], 
    required: true
  },

  // Jumlah Uang
  amount: { 
    type: Number, 
    required: true 
  },

  // Tanggal Bayar (Default hari ini)
  paymentDate: { 
    type: Date, 
    default: Date.now 
  },

  // Catatan Tambahan
  notes: { type: String, default: '-' }

}, { timestamps: true });

export default mongoose.model('Contribution', ContributionSchema);