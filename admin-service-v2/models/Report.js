import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  citizenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Citizen',
    required: true
  },
  category: { 
    type: String, 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  imageBase64: { 
    type: String, 
    default: null
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'], 
    default: 'PENDING' 
  },
  response: { 
    type: String, 
    default: '-' 
  },
  reportDate: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

export default mongoose.model('Report', ReportSchema);