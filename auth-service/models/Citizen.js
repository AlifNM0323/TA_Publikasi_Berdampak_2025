// import mongoose from 'mongoose';

// const citizenSchema = new mongoose.Schema({
//   familyId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Family',
//     required: true,
//   },
//   name: { type: String, required: true },
//   nik: { type: String, required: true, unique: true },
//   email: { type: String, required: true }, // Field kunci untuk verifikasi
//   gender: String,
//   address: String,
//   relationship: String
// }, { timestamps: true });

// // Hindari error overwrite model saat development
// const Citizen = mongoose.models.Citizen || mongoose.model('Citizen', citizenSchema);
// export default Citizen;


// import mongoose from 'mongoose';

// const citizenSchema = new mongoose.Schema({
//   familyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Family', required: true },
//   name: { type: String, required: true },
//   nik: { type: String, required: true, unique: true },
//   email: { type: String, required: true }, // Ini kunci verifikasinya
//   gender: String,
//   address: String,
//   relationship: String
// }, { timestamps: true });

// // Gunakan 'mongoose.models' untuk mencegah error overwrite saat nodemon restart
// const Citizen = mongoose.models.Citizen || mongoose.model('Citizen', citizenSchema);
// export default Citizen;


// import mongoose from 'mongoose';

// const citizenSchema = new mongoose.Schema({
//   familyId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Family', 
//     required: true,
//     index: true // Ditambah index agar pencarian keluarga lebih cepat
//   },
//   name: { type: String, required: true, trim: true },
//   nik: { type: String, required: true, unique: true, trim: true },
//   email: { 
//     type: String, 
//     required: true, 
//     unique: true, // Email warga di data RT juga harus unik kawan
//     trim: true,
//     lowercase: true 
//   },
//   gender: { type: String, enum: ['L', 'P'] },
//   address: String,
//   relationship: String
// }, { timestamps: true });

// const Citizen = mongoose.models.Citizen || mongoose.model('Citizen', citizenSchema);
// export default Citizen;



import mongoose from 'mongoose';

const citizenSchema = new mongoose.Schema({
  familyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Family', 
    required: true 
  },
  name: { type: String, required: true },
  nik: { type: String, required: true, unique: true },
  email: { type: String, required: true }, // KUNCI VERIFIKASI AKTIVASI
  gender: String,
  address: String,
  relationship: String
}, { timestamps: true });

// Gunakan 'mongoose.models' agar tidak error saat nodemon restart
const Citizen = mongoose.models.Citizen || mongoose.model('Citizen', citizenSchema);
export default Citizen;