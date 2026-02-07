import mongoose from 'mongoose';

const TrashBankSchema = new mongoose.Schema({
  // BERUBAH: Basis data sekarang adalah KELUARGA (KK)
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family',
    required: true
  },
  
  // Info tambahan: Siapa perwakilan keluarga yang setor/tarik (String saja cukup)
  depositorName: { type: String }, 

  // Jenis Transaksi
  trashType: { 
    type: String,
    // Tambahkan 'PENCAIRAN_DANA' untuk log penarikan uang
    enum: ['Plastik', 'Kertas/Kardus', 'Logam/Besi', 'Kaca', 'PENCAIRAN_DANA'],
    required: true
  },
  
  weight: { type: Number, default: 0 },      // Berat (Kg)
  pricePerKg: { type: Number, default: 0 },  // Harga saat transaksi terjadi
  
  // --- SISTEM LEDGER (Buku Tabungan) ---
  debit: { type: Number, default: 0 },       // Uang Masuk (Hasil Jual Sampah)
  credit: { type: Number, default: 0 },      // Uang Keluar (Pencairan Dana)
  balance: { type: Number, default: 0 },     // Saldo Keluarga saat transaksi ini dicatat
  
  txnDate: { type: Date, default: Date.now },
  operator: { type: String, default: 'Admin RT' }

}, { timestamps: true });

export default mongoose.model('TrashBank', TrashBankSchema);