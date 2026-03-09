// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

// const userSchema = new mongoose.Schema({
//   username: { 
//     type: String, 
//     required: true, 
//     unique: true, 
//     trim: true 
//   },
//   password: { 
//     type: String, 
//     required: true 
//   },
//   role: { 
//     type: String, 
//     enum: ['rt', 'warga'], // rt = Admin, warga = User Biasa
//     default: 'warga' 
//   },
//   // KUNCI UTAMA: Untuk menghubungkan akun login dengan data keluarga di RT
//   familyId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Family',
//     default: null
//   },
//   createdAt: { 
//     type: Date, 
//     default: Date.now 
//   }
// });

// // Otomatis enkripsi password sebelum simpan
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// // Fungsi cek password saat Login
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// export default mongoose.model('User', userSchema);


// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

// const userSchema = new mongoose.Schema({
//   username: { 
//     type: String, 
//     required: true, 
//     unique: true, 
//     trim: true 
//   },
//   // TAMBAHAN: Email sebagai kunci verifikasi warga
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true
//   },
//   password: { 
//     type: String, 
//     required: true 
//   },
//   role: { 
//     type: String, 
//     enum: ['rt', 'warga'], 
//     default: 'warga' 
//   },
//   // Menghubungkan akun login dengan data keluarga hasil deteksi email
//   familyId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Family',
//     default: null
//   },
//   createdAt: { 
//     type: Date, 
//     default: Date.now 
//   }
// });

// // Enkripsi password otomatis
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// // Verifikasi password saat login
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// export default mongoose.model('User', userSchema);



import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
    lowercase: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  // INI BAGIAN PALING PENTING UNTUK PEMBAGIAN DASHBOARD
  role: { 
    type: String, 
    enum: ['rt', 'warga'], // Hanya menerima 2 nilai ini
    default: 'warga' 
  },
  familyId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family',
    required: false // Admin RT manual (adminrt14) tidak punya familyId
  }
}, { timestamps: true });

// Middleware: Enkripsi password sebelum disimpan ke database
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method: Mengecek kecocokan password saat login
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;