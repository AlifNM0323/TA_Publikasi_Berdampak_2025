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
    trim: true // Menghapus spasi berlebih di awal/akhir nama
  },
  nik: {
    type: String,
    required: true,
    unique: true, // Mencegah NIK ganda di database
    trim: true
  },
  gender: {
    type: String,
    enum: ['L', 'P'], // Pastikan Pian mengirim 'L' atau 'P' dari Frontend
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
    type: Date, // Mongoose otomatis mengubah string "YYYY-MM-DD" dari FE menjadi Date object
    required: true 
  },
  relationship: { 
    type: String, 
    default: "LAINNYA" // Akan diisi "Anak 1", "Istri", dll oleh Resolver
  }, 
}, { 
  timestamps: true // Otomatis mencatat createdAt dan updatedAt
}); 

export default mongoose.model('Citizen', citizenSchema);