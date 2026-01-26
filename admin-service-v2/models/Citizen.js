import mongoose from 'mongoose';

const citizenSchema = new mongoose.Schema({

  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family',
    required: true,
  },
  
 
  
  name: { type: String, required: true },
  
  nik: {
    type: String,
    required: true,
    unique: true, 
  },
  
  gender: {
    type: String,
    enum: ['L', 'P'],
    required: true,
  },
  
  religion: { type: String, required: true },
  address: { type: String, required: true },
  profession: { type: String, required: true },
  placeOfBirth: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },

}, { timestamps: true }); 

export default mongoose.model('Citizen', citizenSchema);

