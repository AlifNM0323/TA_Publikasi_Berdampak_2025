import mongoose from 'mongoose';

const TrashBankSchema = new mongoose.Schema({
  // Relasi: Siapa yang setor? (Wajib ID Warga)
  citizenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Citizen',
    required: true
  },

  // Tanggal Transaksi (txn_date)
  txnDate: { 
    type: Date, 
    default: Date.now 
  },

  // Jenis Sampah (trash_type)
  trashType: {
    type: String,
    enum: ['PLASTIK', 'KERTAS', 'BOTOL', 'LOGAM', 'MINYAK'],
    required: true
  },

  weightKg: { type: Number, required: true }, // Berat (amount_per_kg)
  pricePerKg: { type: Number, required: true }, // Harga satuan
  
  deposit: { type: Number, default: 0 }, // Uang Masuk
  withdrawal: { type: Number, default: 0 }, // Uang Keluar (opsional)
  operator: { type: String, default: 'Admin' }

}, { timestamps: true });

export default mongoose.model('TrashBank', TrashBankSchema);