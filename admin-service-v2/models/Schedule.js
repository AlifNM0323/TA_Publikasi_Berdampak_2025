import mongoose from 'mongoose';

const ScheduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, default: 'Posyandu RT 14' },
  target: { type: String, enum: ['BALITA', 'LANSIA', 'UMUM', 'BUMIL'], default: 'UMUM' },
  description: { type: String, default: '-' }
}, { timestamps: true });

export default mongoose.model('Schedule', ScheduleSchema);