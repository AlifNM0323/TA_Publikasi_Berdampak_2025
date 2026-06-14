import mongoose from 'mongoose';

const InsuranceSchema = new mongoose.Schema({
  
  citizenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Citizen',
    required: true
  },

  insuranceType: { type: String, required: true }, 
  insuranceNumber: { type: String, required: true, unique: true }, 
  activeStatus: { type: Boolean, default: true }

}, { timestamps: true });

export default mongoose.model('Insurance', InsuranceSchema);