import mongoose from 'mongoose';

const trashBankSchema = new mongoose.Schema({
  familyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Family', required: true },
  citizenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Citizen', required: true },
  depositorName: String, // Nama anggota yang menyetor
  trashType: { 
    type: String, 
    enum: ['Campuran', 'Botol Bersih', 'Kardus', 'Besi'],
    required: true 
  },
  weight: { type: Number, required: true },
  pricePerKg: { type: Number, required: true },
  deposit: { type: Number, default: 0 }, // Total uang masuk (weight * price)
  withdrawal: { type: Number, default: 0 },
  balance: { type: Number, required: true }, // Saldo KK setelah transaksi ini
  txnDate: { type: Date, default: Date.now },
  operator: { type: String, default: "Admin RT" }
});

export default mongoose.model('TrashBank', trashBankSchema);