import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  citizenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Citizen',
    required: true
  },
  category: { 
    type: String, 
    required: true // Contoh: 'Infrastruktur', 'Keamanan', 'Kebersihan', 'Sosial'
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
    type: String, // Untuk menyimpan foto bukti laporan (opsional)
    default: null
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'], 
    default: 'PENDING' // Status awal selalu menunggu tindakan
  },
  response: { 
    type: String, 
    default: '-' // Tanggapan/balasan dari RT
  },
  reportDate: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

export default mongoose.model('Report', ReportSchema);