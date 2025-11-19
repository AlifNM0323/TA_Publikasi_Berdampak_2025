import mongoose from 'mongoose';

const FamilySchema = new mongoose.Schema({
  // Pastikan namanya SAMA PERSIS dengan yang ada di args GraphQL
  kepalaKeluarga: { 
    type: String, 
    required: true 
  },
  
  noKK: { 
    type: String, 
    required: true, 
    unique: true 
  },
  
  address: {
    type: String,
    required: true
  },
  
  ownershipStatus: {
    type: String,
    default: 'OWNED'
  }
}, { timestamps: true });

export default mongoose.model('Family', FamilySchema);