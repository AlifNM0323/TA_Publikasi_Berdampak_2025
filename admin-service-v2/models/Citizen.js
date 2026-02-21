import mongoose from 'mongoose';

const citizenSchema = new mongoose.Schema({
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family',
    required: true,
  },
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  nik: {
    type: String,
    required: true,
    unique: true, 
    trim: true
  },
  gender: {
    type: String,
    enum: ['L', 'P'], 
    required: true,
  },
  religion: { 
    type: String, 
    required: true 
  },
  address: { 
    type: String, 
    required: true 
  },
  profession: { 
    type: String, 
    required: true 
  },
  placeOfBirth: { 
    type: String, 
    required: true 
  },
  dateOfBirth: { 
    type: Date, 
    required: true 
  },
  relationship: { 
    type: String, 
    default: "LAINNYA" 
  },
  phone: { 
    type: String, 
    default: "" 
  },
  insurance: { 
    type: String, 
    // Disesuaikan dengan pilihan di Frontend Datawarga.js
    enum: ['BPJS Mandiri', 'BPJS dari Pekerjaan', 'KIS', 'Asuransi Swasta', 'Asuransi Swasta Lainnya', 'Tidak Ada'],
    default: 'Tidak Ada'
  },
}, { 
  timestamps: true 
}); 

export default mongoose.model('Citizen', citizenSchema);