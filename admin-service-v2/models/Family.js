import mongoose from 'mongoose';

const FamilySchema = new mongoose.Schema({
  kepalaKeluarga: { type: String, required: true },
  noKK: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  ownershipStatus: {
    type: String,
    enum: ['OWNED', 'RENT', 'OFFICIAL'],
    default: 'OWNED'
  },
  
  // Total Berat Sampah (Kg)
  totalTabungan: { type: Number, default: 0 },

  // BARU: Total Saldo Uang (Rupiah)
  balance: { type: Number, default: 0 },

  // BARU: Kode QR Unik untuk Scan Pencairan
  qrCode: { type: String, unique: true }

}, { timestamps: true });

// Middleware: Otomatis bikin QR Code unik sebelum simpan (Format: RT14-NOKK)
FamilySchema.pre('save', function(next) {
  if (!this.qrCode) {
    this.qrCode = `RT14-${this.noKK}`;
  }
  next();
});

export default mongoose.model('Family', FamilySchema);