import mongoose from 'mongoose';

const citizenSchema = new mongoose.Schema({
  familyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Family', 
    required: true 
  },
  name: { type: String, required: true },
  nik: { type: String, required: true, unique: true },
  email: { type: String, required: true }, 
  gender: String,
  address: String,
  relationship: String
}, { timestamps: true });


const Citizen = mongoose.models.Citizen || mongoose.model('Citizen', citizenSchema);
export default Citizen;