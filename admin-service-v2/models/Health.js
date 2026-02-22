import mongoose from 'mongoose';

const HealthSchema = new mongoose.Schema({
  citizenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Citizen',
    required: true,
    index: true    
  },
  healthStatus: {
    type: String,
    enum: ['SEHAT', 'PANTAUAN', 'DARURAT'],
    default: 'SEHAT'
  },
  bloodType: {
    type: String,
    enum: ['A', 'B', 'AB', 'O', 'UNKNOWN', '-'],
    default: 'UNKNOWN'
  },
  height: { type: Number, default: 0 },
  weight: { type: Number, default: 0 },
  bloodPressure: { type: String, default: '-' },
  bloodSugar: { type: Number, default: 0 },
  chronicDisease: { type: String, default: '-' },
  notes: { type: String, default: '-' },
  disabilityStatus: { type: Boolean, default: false },
  
  // --- FITUR IBU HAMIL ---
  isPregnant: { type: Boolean, default: false },
  hpl: { type: Date, default: null }, 
  pregnancyNotes: { type: String, default: '-' },

}, { timestamps: true });

// Membersihkan index unique lama agar 1 warga bisa punya banyak riwayat
const dropOldIndex = async () => {
  try {
    const Health = mongoose.model('Health');
    const indexes = await Health.collection.getIndexes();
    if (indexes.citizenId_1) {
      await Health.collection.dropIndex('citizenId_1');
      console.log('✅ BE: Index lama dihapus. Riwayat kini bersifat multi-record.');
    }
  } catch (err) {}
};

const Health = mongoose.model('Health', HealthSchema);
dropOldIndex();

export default Health;