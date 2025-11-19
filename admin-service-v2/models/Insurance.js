import mongoose from 'mongoose';

const InsuranceSchema = new mongoose.Schema({
  // Relasi: Milik Warga mana?
  citizenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Citizen',
    required: true
  },

  insuranceType: { type: String, required: true }, // Map dari: insurance_type
  insuranceNumber: { type: String, required: true, unique: true }, // Map dari: insurance_number
  activeStatus: { type: Boolean, default: true } // Map dari: active_status

}, { timestamps: true });

export default mongoose.model('Insurance', InsuranceSchema);