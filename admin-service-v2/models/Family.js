import mongoose from 'mongoose';

const FamilySchema = new mongoose.Schema({
  kepalaKeluarga: { type: String, required: true },
  noKK: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  ownershipStatus: {
    type: String,
    enum: ['OWNED', 'RENT', 'OFFICIAL'], // Sinkron dengan pilihan di FE
    default: 'OWNED'
  }
}, { timestamps: true });

export default mongoose.model('Family', FamilySchema);