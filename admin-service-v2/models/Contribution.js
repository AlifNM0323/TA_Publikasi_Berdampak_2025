import mongoose from 'mongoose';

const contributionSchema = new mongoose.Schema({
  familyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Family', required: true },
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  month: String,
  year: String,
  paymentDate: { type: String },
  notes: String
});

// UBAH BAGIAN INI:
export default mongoose.model('Contribution', contributionSchema);