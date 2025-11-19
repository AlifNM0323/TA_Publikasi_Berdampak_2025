import mongoose from 'mongoose';

const HealthSchema = new mongoose.Schema({
  // Relasi: Data kesehatan ini punya siapa? (Unique biar 1 orang = 1 data)
  citizenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Citizen',
    required: true,
    unique: true 
  },
  
  bloodType: {
    type: String,
    enum: ['A', 'B', 'AB', 'O', 'UNKNOWN'],
    default: 'UNKNOWN'
  },
  
  height: Number, // cm
  weight: Number, // kg
  
  chronicDisease: { 
    type: String, 
    default: '-' 
  },
  
  disabilityStatus: {
    type: Boolean,
    default: false
  },

  lastCheckupDate: String // Kita simpan sebagai String tanggal dulu biar simpel
}, { timestamps: true });

export default mongoose.model('Health', HealthSchema);