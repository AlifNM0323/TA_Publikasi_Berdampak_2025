import mongoose from 'mongoose';

const HealthSchema = new mongoose.Schema({
  citizenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Citizen',
    required: true
  },
  healthStatus: {
    type: String,
    enum: ['SEHAT', 'PANTAUAN', 'DARURAT'],
    default: 'SEHAT'
  },
  bloodType: {
    type: String,
    enum: ['A', 'B', 'AB', 'O', 'UNKNOWN'],
    default: 'UNKNOWN'
  },
  height: { type: Number, default: 0 },
  weight: { type: Number, default: 0 },
  chronicDisease: { type: String, default: '-' },
  notes: { type: String, default: '-' },
  disabilityStatus: { type: Boolean, default: false },
  checkupDate: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

export default mongoose.model('Health', HealthSchema);