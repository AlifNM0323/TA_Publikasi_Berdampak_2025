import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: String },
  notes: String
});

// PASTIKAN PAKAI EXPORT DEFAULT:
export default mongoose.model('Expense', expenseSchema);