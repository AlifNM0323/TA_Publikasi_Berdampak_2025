// // import Tesseract from 'tesseract.js';
// // import sharp from 'sharp';
// // import Citizen from './models/Citizen.js';
// // import Family from './models/Family.js';
// // import Health from './models/Health.js';
// // import TrashBank from './models/TrashBank.js';
// // import Schedule from './models/Schedule.js';
// // import Contribution from './models/Contribution.js';
// // import Expense from './models/Expense.js';
// // import Report from './models/Report.js';
// // import { GoogleGenerativeAI } from '@google/generative-ai';

// // export const resolvers = {
// //   Query: {
// //     families: async () => await Family.find().sort({ createdAt: -1 }),
// //     citizens: async () => await Citizen.find().sort({ createdAt: -1 }),
// //     citizen: async (_, { id }) => await Citizen.findById(id),
// //     getFamilyById: async (_, { id }) => await Family.findById(id),
// //     getAllHealthRecords: async () => await Health.find().sort({ createdAt: -1 }),
// //     getSchedules: async () => await Schedule.find().sort({ date: 1 }),
// //     getAllContributions: async () => await Contribution.find().populate('familyId'),
// //     getContributionsByPeriod: async (_, { month, year }) => await Contribution.find({ month, year }),
// //     getAllExpenses: async () => await Expense.find().sort({ date: -1 }),
    
// //     getKasSummary: async (_, { month, year }) => {
// //       try {
// //         const allIn = await Contribution.find();
// //         const allOut = await Expense.find();
// //         const totalFamily = await Family.countDocuments();
// //         const paidThisMonth = await Contribution.countDocuments({ month, year });
// //         const totalIn = allIn.reduce((sum, item) => sum + item.amount, 0);
// //         const totalOut = allOut.reduce((sum, item) => sum + item.amount, 0);
// //         return {
// //           totalIn, totalOut, balance: totalIn - totalOut,
// //           paidPercentage: totalFamily > 0 ? (paidThisMonth / totalFamily) * 100 : 0
// //         };
// //       } catch (e) { throw new Error(e.message); }
// //     },

// //     sampahStats: async () => {
// //       try {
// //         const families = await Family.find();
// //         const totalBerat = families.reduce((sum, f) => sum + (f.totalTabungan || 0), 0);
// //         const totalUang = families.reduce((sum, f) => sum + (f.balance || 0), 0);
// //         const totalKKAktif = families.filter(f => (f.totalTabungan || 0) > 0).length;
// //         return { totalBerat, totalKKAktif, totalUang };
// //       } catch (error) { throw new Error(error.message); }
// //     },

// //     allTrashLogs: async () => await TrashBank.find().sort({ txnDate: -1 }),

// //     getHealthStats: async () => {
// //       try {
// //         const stats = await Health.aggregate([
// //           { $group: { _id: "$healthStatus", count: { $sum: 1 } } }
// //         ]);
// //         return stats.map(s => ({ status: s._id || "UNKNOWN", count: s.count }));
// //       } catch (error) { throw new Error(error.message); }
// //     },

// //     getFamilyByQR: async (_, { qrCode }) => {
// //       const family = await Family.findOne({ qrCode });
// //       if (!family) throw new Error("QR Code tidak valid / Keluarga tidak ditemukan");
// //       return family;
// //     },

// //     getAllReports: async () => await Report.find().sort({ reportDate: -1 }),
// //     getReportsByCitizen: async (_, { citizenId }) => await Report.find({ citizenId }).sort({ reportDate: -1 })
// //   },

// //   Mutation: {
// //     mutateCitizen: async (_, { id, statusWarga, keteranganMutasi }) => {
// //       try {
// //         return await Citizen.findByIdAndUpdate(
// //           id, { $set: { statusWarga, keteranganMutasi, tanggalMutasi: new Date().toISOString() } }, { new: true }
// //         );
// //       } catch (error) { throw new Error("Gagal mutasi: " + error.message); }
// //     },

// //     addTrashDeposit: async (_, { citizenId, trashType, weight, pricePerKg }) => {
// //       try {
// //         const citizen = await Citizen.findById(citizenId);
// //         if (!citizen) throw new Error("Warga tidak ditemukan");
// //         const family = await Family.findById(citizen.familyId);
// //         if (!family) throw new Error("Data Keluarga tidak ditemukan");

// //         const moneyEarned = Math.round(weight * pricePerKg);
// //         const newBalance = (family.balance || 0) + moneyEarned;

// //         const newLog = new TrashBank({
// //           familyId: citizen.familyId, citizenId: citizen.id, depositorName: citizen.name,
// //           trashType, weight, pricePerKg, debit: moneyEarned, credit: 0, balance: newBalance,
// //           status: "SUCCESS", txnDate: new Date().toISOString()
// //         });
// //         const savedLog = await newLog.save();
// //         await Family.findByIdAndUpdate(citizen.familyId, { $inc: { totalTabungan: weight, balance: moneyEarned } });
// //         return savedLog;
// //       } catch (error) { throw new Error("BE_ERROR: " + error.message); }
// //     },

// //     withdrawFund: async (_, { familyId, amount }) => {
// //         const family = await Family.findById(familyId);
// //         if (!family) throw new Error("Keluarga tidak ditemukan");
// //         if (family.balance < amount) throw new Error("Saldo tidak cukup kawan!");
        
// //         const withdrawalEntry = new TrashBank({
// //           familyId, depositorName: family.kepalaKeluarga, trashType: 'PENCAIRAN_DANA',
// //           weight: 0, pricePerKg: 0, debit: 0, credit: amount, balance: family.balance - amount, 
// //           status: "SUCCESS", txnDate: new Date().toISOString()
// //         });
        
// //         await Family.findByIdAndUpdate(familyId, { $inc: { balance: -amount } });
// //         return await withdrawalEntry.save();
// //     },

// //     deleteTrashLog: async (_, { id }) => {
// //       await TrashBank.findByIdAndDelete(id);
// //       return "Log berhasil dihapus";
// //     },

// //     payContribution: async (_, args) => await new Contribution({ ...args, paymentDate: new Date().toISOString() }).save(),
// //     addExpense: async (_, args) => await new Expense({ ...args, date: new Date().toISOString() }).save(),
// //     deleteExpense: async (_, { id }) => { await Expense.findByIdAndDelete(id); return "Dihapus"; },

// //     addHealthRecord: async (_, args) => await new Health({ ...args, hpl: args.hpl ? new Date(args.hpl).toISOString() : null, createdAt: new Date().toISOString() }).save(),
    
// //     updateHealthRecord: async (_, { id, ...updates }) => {
// //       const dataToUpdate = { ...updates };
// //       if (updates.hpl) dataToUpdate.hpl = new Date(updates.hpl).toISOString();
// //       return await Health.findByIdAndUpdate(id, { $set: dataToUpdate }, { new: true });
// //     },
    
// //     deleteHealthRecord: async (_, { id }) => { await Health.findByIdAndDelete(id); return "Hapus sukses"; },

// //     addCitizen: async (_, args) => {
// //       const existing = await Citizen.findOne({ nik: args.nik });
// //       if (existing) throw new Error('NIK sudah terdaftar kawan!');
      
// //       let rel = args.relationship ? args.relationship.toUpperCase() : 'LAINNYA';
// //       if (rel.includes('ANAK')) {
// //         const count = await Citizen.countDocuments({ familyId: args.familyId, relationship: { $regex: /^Anak/i } });
// //         args.relationship = `Anak ${count + 1}`;
// //       }
// //       return await new Citizen(args).save();
// //     },

// //     updateCitizen: async (_, { id, ...updates }) => await Citizen.findByIdAndUpdate(id, updates, { new: true }),
// //     deleteCitizen: async (_, { id }) => { await Citizen.findByIdAndDelete(id); return "Terhapus"; },

// //     createFamily: async (_, args) => await new Family({ ...args, createdAt: new Date().toISOString() }).save(),
// //     updateFamily: async (_, { id, ...updates }) => await Family.findByIdAndUpdate(id, updates, { new: true }),
// //     deleteFamily: async (_, { id }) => {
// //       await Citizen.deleteMany({ familyId: id });
// //       await Family.findByIdAndDelete(id);
// //       return "Keluarga berhasil dihapus";
// //     },

// //     addSchedule: async (_, args) => await new Schedule({ ...args, date: new Date(args.date).toISOString() }).save(),
// //     deleteSchedule: async (_, { id }) => { await Schedule.findByIdAndDelete(id); return "Terhapus"; },

// //     updateFamilyWaste: async (_, { familyId, totalTabungan }) => await Family.findByIdAndUpdate(familyId, { totalTabungan }, { new: true }),
// //     deleteFamilyWaste: async (_, { familyId }) => { await Family.findByIdAndUpdate(familyId, { totalTabungan: 0, balance: 0 }); return "Reset Berhasil"; },

// //     processKTP: async () => { return { success: false, message: "Gunakan fitur SCAN KK utama." }; },
// //     processKK: async () => { return { success: false, message: "Gunakan fitur SCAN KK utama." }; },

// //     // =========================================================================
// //     // TESSERACT V3: LINE-BY-LINE SCANNER (LEBIH AKURAT)
// //     // =========================================================================
// //     processScanAll: async (_, { imageBase64 }) => {
// //       try {
// //         console.log("🚀 Menjalankan Tesseract V3 (Pencarian Per Baris)...");

// //         if (imageBase64.toLowerCase().includes('application/pdf')) {
// //             return { success: false, message: "Upload harus gambar (JPG/PNG), bukan PDF.", family: null };
// //         }

// //         const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
        
// //         // Cukup perbesar dan grayscale, hindari threshold agar huruf tipis tidak hilang
// //         const processedImageBuffer = await sharp(Buffer.from(base64Data, 'base64'))
// //           .resize({ width: 2000 }) 
// //           .grayscale()
// //           .normalize()
// //           .toBuffer();

// //         const { data: { text } } = await Tesseract.recognize(processedImageBuffer, 'ind');
        
// //         // Memecah teks menjadi baris per baris untuk dianalisa
// //         const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 3);

// //         let noKKExtracted = "";
// //         let nikExtracted = "";
// //         let namaExtracted = "NAMA TIDAK TERBACA";
// //         let alamatExtracted = "ALAMAT TIDAK TERBACA";

// //         // 1. Cari Angka 16 Digit (Diperbaiki)
// //         const textForNumbers = text.replace(/O/gi, '0').replace(/[lIij]/g, '1');
// //         const numberMatches = textForNumbers.replace(/\s+/g, '').match(/\d{16}/g) || [];
        
// //         if (numberMatches.length > 0) noKKExtracted = numberMatches[0];
// //         if (numberMatches.length > 1) nikExtracted = numberMatches[1];
// //         else if (numberMatches.length === 1) nikExtracted = numberMatches[0];
        
// //         // Fallback jika tidak nemu angka sama sekali
// //         if (!noKKExtracted) noKKExtracted = `TIDAK-TERBACA-${Math.floor(Math.random()*1000)}`;
// //         if (!nikExtracted) nikExtracted = `NIK-TIDAK-TERBACA-${Math.floor(Math.random()*1000)}`;

// //         // 2. Cari Nama dan Alamat Baris per Baris
// //         for (let i = 0; i < lines.length; i++) {
// //             const line = lines[i].toUpperCase();

// //             // Logika Cari Nama
// //             if (line.includes('NAMA') || line.includes('KEPALA KELUARGA')) {
// //                 let potongNama = line.replace(/.*(?:NAMA|KELUARGA)\s*[:;]?\s*/, '').replace(/[^A-Z\s]/g, '').trim();
// //                 if (potongNama.length > 3) namaExtracted = potongNama;
// //             }

// //             // Logika Cari Alamat
// //             if (line.includes('ALAMAT') || line.includes('JL.') || line.includes('PERUM') || line.includes('BLOK')) {
// //                 let potongAlamat = line.replace(/.*(?:ALAMAT)\s*[:;]?\s*/, '').trim();
// //                 if (potongAlamat.length > 5) alamatExtracted = potongAlamat;
// //             }
// //         }

// //         // Simpan Data
// //         let family = await Family.findOne({ noKK: noKKExtracted });
// //         if (!family) {
// //           family = await new Family({
// //             noKK: noKKExtracted,
// //             kepalaKeluarga: namaExtracted,
// //             address: alamatExtracted,
// //             ownershipStatus: "OWNED",
// //             createdAt: new Date().toISOString()
// //           }).save();
// //         }

// //         const exists = await Citizen.findOne({ nik: nikExtracted });
// //         if (!exists && noKKExtracted !== nikExtracted) {
// //           await new Citizen({
// //             familyId: family._id, 
// //             name: namaExtracted, 
// //             nik: nikExtracted, 
// //             gender: "L", 
// //             religion: "Islam", 
// //             placeOfBirth: "-",
// //             dateOfBirth: "1980-01-01", 
// //             relationship: "KEPALA KELUARGA",
// //             profession: "-", 
// //             address: family.address
// //           }).save();
// //         }

// //         return { success: true, message: "Scan Gambar Berhasil (V3)!", family: family };

// //       } catch (error) {
// //         return { success: false, message: "Terjadi kesalahan OCR lokal.", family: null };
// //       }
// //     },

// //     createReport: async (_, args) => {
// //       try {
// //         const newReport = new Report({ ...args, reportDate: new Date().toISOString(), status: "PENDING" });
// //         return await newReport.save();
// //       } catch (error) { throw new Error("Gagal membuat laporan kawan: " + error.message); }
// //     },

// //     updateReportStatus: async (_, { id, status, response }) => {
// //       try {
// //         return await Report.findByIdAndUpdate(id, { $set: { status, response } }, { new: true });
// //       } catch (error) { throw new Error("Gagal update laporan: " + error.message); }
// //     },

// //     deleteReport: async (_, { id }) => {
// //       await Report.findByIdAndDelete(id);
// //       return "Laporan berhasil dihapus.";
// //     },
// //   },

// //   Family: {
// //     members: async (parent) => await Citizen.find({ familyId: parent.id }).sort({ createdAt: 1 }),
// //     payments: async (parent) => await Contribution.find({ familyId: parent.id })
// //   },
// //   Citizen: {
// //     family: async (parent) => await Family.findById(parent.familyId),
// //     healthData: async (parent) => await Health.findOne({ citizenId: parent.id }).sort({ createdAt: -1 }),
// //     healthHistory: async (parent) => await Health.find({ citizenId: parent.id }).sort({ createdAt: -1 }),
// //     reports: async (parent) => await Report.find({ citizenId: parent.id }).sort({ reportDate: -1 }), 
// //     age: (parent) => {
// //       if (!parent.dateOfBirth) return 0;
// //       const dob = new Date(parent.dateOfBirth);
// //       const diff = Date.now() - dob.getTime();
// //       return Math.abs(new Date(diff).getUTCFullYear() - 1970);
// //     }
// //   },
// //   Health: { citizen: async (parent) => await Citizen.findById(parent.citizenId) },
// //   TrashBank: { family: async (parent) => await Family.findById(parent.familyId) },
// //   Contribution: { family: async (parent) => await Family.findById(parent.familyId) },
// //   Report: { citizen: async (parent) => await Citizen.findById(parent.citizenId) } 
// // };




// import sharp from 'sharp';
// import Anthropic from '@anthropic-ai/sdk';
// import Citizen from './models/Citizen.js';
// import Family from './models/Family.js';
// import Health from './models/Health.js';
// import TrashBank from './models/TrashBank.js';
// import Schedule from './models/Schedule.js';
// import Contribution from './models/Contribution.js';
// import Expense from './models/Expense.js';
// import Report from './models/Report.js';

// // Inisialisasi Anthropic dengan Key dari .env
// const anthropic = new Anthropic({
//   apiKey: process.env.CLAUDE_API_KEY,
// });

// export const resolvers = {
//   Query: {
//     families: async () => await Family.find().sort({ createdAt: -1 }),
//     citizens: async () => await Citizen.find().sort({ createdAt: -1 }),
//     citizen: async (_, { id }) => await Citizen.findById(id),
//     getFamilyById: async (_, { id }) => await Family.findById(id),
//     getAllHealthRecords: async () => await Health.find().sort({ createdAt: -1 }),
//     getSchedules: async () => await Schedule.find().sort({ date: 1 }),
//     getAllContributions: async () => await Contribution.find().populate('familyId'),
//     getContributionsByPeriod: async (_, { month, year }) => await Contribution.find({ month, year }),
//     getAllExpenses: async () => await Expense.find().sort({ date: -1 }),
    
//     getKasSummary: async (_, { month, year }) => {
//       try {
//         const allIn = await Contribution.find();
//         const allOut = await Expense.find();
//         const totalFamily = await Family.countDocuments();
//         const paidThisMonth = await Contribution.countDocuments({ month, year });
//         const totalIn = allIn.reduce((sum, item) => sum + item.amount, 0);
//         const totalOut = allOut.reduce((sum, item) => sum + item.amount, 0);
//         return {
//           totalIn, totalOut, balance: totalIn - totalOut,
//           paidPercentage: totalFamily > 0 ? (paidThisMonth / totalFamily) * 100 : 0
//         };
//       } catch (e) { throw new Error(e.message); }
//     },

//     sampahStats: async () => {
//       try {
//         const families = await Family.find();
//         const totalBerat = families.reduce((sum, f) => sum + (f.totalTabungan || 0), 0);
//         const totalUang = families.reduce((sum, f) => sum + (f.balance || 0), 0);
//         const totalKKAktif = families.filter(f => (f.totalTabungan || 0) > 0).length;
//         return { totalBerat, totalKKAktif, totalUang };
//       } catch (error) { throw new Error(error.message); }
//     },

//     allTrashLogs: async () => await TrashBank.find().sort({ txnDate: -1 }),

//     getHealthStats: async () => {
//       try {
//         const stats = await Health.aggregate([
//           { $group: { _id: "$healthStatus", count: { $sum: 1 } } }
//         ]);
//         return stats.map(s => ({ status: s._id || "UNKNOWN", count: s.count }));
//       } catch (error) { throw new Error(error.message); }
//     },

//     getFamilyByQR: async (_, { qrCode }) => {
//       const family = await Family.findOne({ qrCode });
//       if (!family) throw new Error("QR Code tidak valid / Keluarga tidak ditemukan");
//       return family;
//     },

//     getAllReports: async () => await Report.find().sort({ reportDate: -1 }),
//     getReportsByCitizen: async (_, { citizenId }) => await Report.find({ citizenId }).sort({ reportDate: -1 })
//   },

//   Mutation: {
//     mutateCitizen: async (_, { id, statusWarga, keteranganMutasi }) => {
//       try {
//         return await Citizen.findByIdAndUpdate(
//           id, { $set: { statusWarga, keteranganMutasi, tanggalMutasi: new Date().toISOString() } }, { new: true }
//         );
//       } catch (error) { throw new Error("Gagal mutasi: " + error.message); }
//     },

//     addTrashDeposit: async (_, { citizenId, trashType, weight, pricePerKg }) => {
//       try {
//         const citizen = await Citizen.findById(citizenId);
//         if (!citizen) throw new Error("Warga tidak ditemukan");
//         const family = await Family.findById(citizen.familyId);
//         if (!family) throw new Error("Data Keluarga tidak ditemukan");

//         const moneyEarned = Math.round(weight * pricePerKg);
//         const newBalance = (family.balance || 0) + moneyEarned;

//         const newLog = new TrashBank({
//           familyId: citizen.familyId, citizenId: citizen.id, depositorName: citizen.name,
//           trashType, weight, pricePerKg, debit: moneyEarned, credit: 0, balance: newBalance,
//           status: "SUCCESS", txnDate: new Date().toISOString()
//         });
//         const savedLog = await newLog.save();
//         await Family.findByIdAndUpdate(citizen.familyId, { $inc: { totalTabungan: weight, balance: moneyEarned } });
//         return savedLog;
//       } catch (error) { throw new Error("BE_ERROR: " + error.message); }
//     },

//     withdrawFund: async (_, { familyId, amount }) => {
//         const family = await Family.findById(familyId);
//         if (!family) throw new Error("Keluarga tidak ditemukan");
//         if (family.balance < amount) throw new Error("Saldo tidak cukup kawan!");
        
//         const withdrawalEntry = new TrashBank({
//           familyId, depositorName: family.kepalaKeluarga, trashType: 'PENCAIRAN_DANA',
//           weight: 0, pricePerKg: 0, debit: 0, credit: amount, balance: family.balance - amount, 
//           status: "SUCCESS", txnDate: new Date().toISOString()
//         });
        
//         await Family.findByIdAndUpdate(familyId, { $inc: { balance: -amount } });
//         return await withdrawalEntry.save();
//     },

//     deleteTrashLog: async (_, { id }) => {
//       await TrashBank.findByIdAndDelete(id);
//       return "Log berhasil dihapus";
//     },

//     payContribution: async (_, args) => await new Contribution({ ...args, paymentDate: new Date().toISOString() }).save(),
//     addExpense: async (_, args) => await new Expense({ ...args, date: new Date().toISOString() }).save(),
//     deleteExpense: async (_, { id }) => { await Expense.findByIdAndDelete(id); return "Dihapus"; },

//     addHealthRecord: async (_, args) => await new Health({ ...args, hpl: args.hpl ? new Date(args.hpl).toISOString() : null, createdAt: new Date().toISOString() }).save(),
    
//     updateHealthRecord: async (_, { id, ...updates }) => {
//       const dataToUpdate = { ...updates };
//       if (updates.hpl) dataToUpdate.hpl = new Date(updates.hpl).toISOString();
//       return await Health.findByIdAndUpdate(id, { $set: dataToUpdate }, { new: true });
//     },
    
//     deleteHealthRecord: async (_, { id }) => { await Health.findByIdAndDelete(id); return "Hapus sukses"; },

//     addCitizen: async (_, args) => {
//       const existing = await Citizen.findOne({ nik: args.nik });
//       if (existing) throw new Error('NIK sudah terdaftar kawan!');
      
//       let rel = args.relationship ? args.relationship.toUpperCase() : 'LAINNYA';
//       if (rel.includes('ANAK')) {
//         const count = await Citizen.countDocuments({ familyId: args.familyId, relationship: { $regex: /^Anak/i } });
//         args.relationship = `Anak ${count + 1}`;
//       }
//       return await new Citizen(args).save();
//     },

//     updateCitizen: async (_, { id, ...updates }) => await Citizen.findByIdAndUpdate(id, updates, { new: true }),
//     deleteCitizen: async (_, { id }) => { await Citizen.findByIdAndDelete(id); return "Terhapus"; },

//     createFamily: async (_, args) => await new Family({ ...args, createdAt: new Date().toISOString() }).save(),
//     updateFamily: async (_, { id, ...updates }) => await Family.findByIdAndUpdate(id, updates, { new: true }),
//     deleteFamily: async (_, { id }) => {
//       await Citizen.deleteMany({ familyId: id });
//       await Family.findByIdAndDelete(id);
//       return "Keluarga berhasil dihapus";
//     },

//     addSchedule: async (_, args) => await new Schedule({ ...args, date: new Date(args.date).toISOString() }).save(),
//     deleteSchedule: async (_, { id }) => { await Schedule.findByIdAndDelete(id); return "Terhapus"; },

//     updateFamilyWaste: async (_, { familyId, totalTabungan }) => await Family.findByIdAndUpdate(familyId, { totalTabungan }, { new: true }),
//     deleteFamilyWaste: async (_, { familyId }) => { await Family.findByIdAndUpdate(familyId, { totalTabungan: 0, balance: 0 }); return "Reset Berhasil"; },

//     processKTP: async () => { return { success: false, message: "Gunakan fitur SCAN dokumen utama." }; },
//     processKK: async () => { return { success: false, message: "Gunakan fitur SCAN dokumen utama." }; },

//     // =========================================================================
//     // AI SCANNER V5: CLAUDE VISION (SUPPORT GAMBAR & PDF)
//     // =========================================================================
//     processScanAll: async (_, { imageBase64 }) => {
//       try {
//         console.log("🚀 Memulai AI Vision Scan (Support Gambar & PDF)...");

//         // 1. Deteksi Tipe File dari Header Base64
//         const matches = imageBase64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
//         if (!matches) {
//           return { success: false, message: "Format base64 tidak valid. Pastikan ada 'data:mime/type;base64,'", family: null };
//         }

//         const mimeType = matches[1];
//         const base64Data = matches[2];

//         let claudeContent = [];

//         // 2. Format Input berdasarkan tipe file
//         if (mimeType === 'application/pdf') {
//           console.log("📄 Mengirim file PDF langsung ke Claude...");
//           claudeContent.push({
//             type: "document",
//             source: {
//               type: "base64",
//               media_type: "application/pdf",
//               data: base64Data
//             }
//           });
//         } else if (mimeType.startsWith('image/')) {
//           console.log(`🖼️ Mengoptimasi file Gambar (${mimeType}) dengan Sharp...`);
//           const optimizedBuffer = await sharp(Buffer.from(base64Data, 'base64'))
//             .resize({ width: 1200, withoutEnlargement: true })
//             .jpeg({ quality: 80 })
//             .toBuffer();

//           claudeContent.push({
//             type: "image",
//             source: {
//               type: "base64",
//               media_type: "image/jpeg",
//               data: optimizedBuffer.toString('base64')
//             }
//           });
//         } else {
//           return { success: false, message: "Harap upload file Gambar (JPG/PNG) atau PDF.", family: null };
//         }

//         // 3. Tambahkan Prompt JSON murni
//         claudeContent.push({
//           type: "text",
//           text: "Ekstrak data KK/KTP ini ke JSON: { \"noKK\": \"string\", \"nik\": \"string\", \"nama\": \"string\", \"alamat\": \"string\" }. Jika tidak ada salah satu, tulis 'TIDAK_TERBACA'. Jangan berikan teks penjelasan, hanya JSON murni."
//         });

//         // 4. Proses melalui API Anthropic
//         const msg = await anthropic.messages.create({
//           model: "claude-3-5-sonnet-20241022",
//           max_tokens: 1000,
//           messages: [
//             {
//               role: "user",
//               content: claudeContent
//             }
//           ],
//         });

//         // 5. Bersihkan hasil markdown dari AI
//         const rawText = msg.content[0].text;
//         const cleanedJson = rawText.replace(/```json|```/g, "").trim();
//         const extracted = JSON.parse(cleanedJson);

//         let { noKK, nik, nama, alamat } = extracted;

//         // Fallback untuk No KK dan NIK
//         if (noKK === "TIDAK_TERBACA") noKK = `SCAN-KK-${Date.now()}`;
//         if (nik === "TIDAK_TERBACA") nik = `SCAN-NIK-${Date.now()}`;

//         // 6. Simpan Database
//         let family = await Family.findOne({ noKK });
//         if (!family) {
//           family = await new Family({
//             noKK,
//             kepalaKeluarga: nama,
//             address: alamat !== "TIDAK_TERBACA" ? alamat : "Alamat hasil scan",
//             ownershipStatus: "OWNED",
//             createdAt: new Date().toISOString()
//           }).save();
//         }

//         const citizenExists = await Citizen.findOne({ nik });
//         if (!citizenExists) {
//           await new Citizen({
//             familyId: family._id,
//             name: nama,
//             nik: nik,
//             gender: "L",
//             relationship: "KEPALA KELUARGA",
//             address: family.address,
//             dateOfBirth: "1990-01-01"
//           }).save();
//         }

//         return { 
//           success: true, 
//           message: `Scan Berhasil via Claude AI (${mimeType.includes('pdf') ? 'PDF' : 'Gambar'})!`, 
//           family: family 
//         };

//       } catch (error) {
//         console.error("AI_SCAN_ERROR:", error.message);
//         return { success: false, message: "Gagal Scan: " + error.message, family: null };
//       }
//     },

//     createReport: async (_, args) => {
//       try {
//         const newReport = new Report({ ...args, reportDate: new Date().toISOString(), status: "PENDING" });
//         return await newReport.save();
//       } catch (error) { throw new Error("Gagal membuat laporan kawan: " + error.message); }
//     },

//     updateReportStatus: async (_, { id, status, response }) => {
//       try {
//         return await Report.findByIdAndUpdate(id, { $set: { status, response } }, { new: true });
//       } catch (error) { throw new Error("Gagal update laporan: " + error.message); }
//     },

//     deleteReport: async (_, { id }) => {
//       await Report.findByIdAndDelete(id);
//       return "Laporan berhasil dihapus.";
//     },
//   },

//   Family: {
//     members: async (parent) => await Citizen.find({ familyId: parent.id }).sort({ createdAt: 1 }),
//     payments: async (parent) => await Contribution.find({ familyId: parent.id })
//   },
//   Citizen: {
//     family: async (parent) => await Family.findById(parent.familyId),
//     healthData: async (parent) => await Health.findOne({ citizenId: parent.id }).sort({ createdAt: -1 }),
//     healthHistory: async (parent) => await Health.find({ citizenId: parent.id }).sort({ createdAt: -1 }),
//     reports: async (parent) => await Report.find({ citizenId: parent.id }).sort({ reportDate: -1 }), 
//     age: (parent) => {
//       if (!parent.dateOfBirth) return 0;
//       const dob = new Date(parent.dateOfBirth);
//       const diff = Date.now() - dob.getTime();
//       return Math.abs(new Date(diff).getUTCFullYear() - 1970);
//     }
//   },
//   Health: { citizen: async (parent) => await Citizen.findById(parent.citizenId) },
//   TrashBank: { family: async (parent) => await Family.findById(parent.familyId) },
//   Contribution: { family: async (parent) => await Family.findById(parent.familyId) },
//   Report: { citizen: async (parent) => await Citizen.findById(parent.citizenId) } 
// };


// import sharp from 'sharp';
// import Anthropic from '@anthropic-ai/sdk';
// import Citizen from './models/Citizen.js';
// import Family from './models/Family.js';
// import Health from './models/Health.js';
// import TrashBank from './models/TrashBank.js';
// import Schedule from './models/Schedule.js';
// import Contribution from './models/Contribution.js';
// import Expense from './models/Expense.js';
// import Report from './models/Report.js';

// // Inisialisasi Anthropic dengan Key dari .env
// const anthropic = new Anthropic({
//   apiKey: process.env.CLAUDE_API_KEY,
// });

// export const resolvers = {
//   Query: {
//     families: async () => await Family.find().sort({ createdAt: -1 }),
//     citizens: async () => await Citizen.find().sort({ createdAt: -1 }),
//     citizen: async (_, { id }) => await Citizen.findById(id),
//     getFamilyById: async (_, { id }) => await Family.findById(id),
//     getAllHealthRecords: async () => await Health.find().sort({ createdAt: -1 }),
//     getSchedules: async () => await Schedule.find().sort({ date: 1 }),
//     getAllContributions: async () => await Contribution.find().populate('familyId'),
//     getContributionsByPeriod: async (_, { month, year }) => await Contribution.find({ month, year }),
//     getAllExpenses: async () => await Expense.find().sort({ date: -1 }),
    
//     getKasSummary: async (_, { month, year }) => {
//       try {
//         const allIn = await Contribution.find();
//         const allOut = await Expense.find();
//         const totalFamily = await Family.countDocuments();
//         const paidThisMonth = await Contribution.countDocuments({ month, year });
//         const totalIn = allIn.reduce((sum, item) => sum + item.amount, 0);
//         const totalOut = allOut.reduce((sum, item) => sum + item.amount, 0);
//         return {
//           totalIn, totalOut, balance: totalIn - totalOut,
//           paidPercentage: totalFamily > 0 ? (paidThisMonth / totalFamily) * 100 : 0
//         };
//       } catch (e) { throw new Error(e.message); }
//     },

//     sampahStats: async () => {
//       try {
//         const families = await Family.find();
//         const totalBerat = families.reduce((sum, f) => sum + (f.totalTabungan || 0), 0);
//         const totalUang = families.reduce((sum, f) => sum + (f.balance || 0), 0);
//         const totalKKAktif = families.filter(f => (f.totalTabungan || 0) > 0).length;
//         return { totalBerat, totalKKAktif, totalUang };
//       } catch (error) { throw new Error(error.message); }
//     },

//     allTrashLogs: async () => await TrashBank.find().sort({ txnDate: -1 }),

//     getHealthStats: async () => {
//       try {
//         const stats = await Health.aggregate([
//           { $group: { _id: "$healthStatus", count: { $sum: 1 } } }
//         ]);
//         return stats.map(s => ({ status: s._id || "UNKNOWN", count: s.count }));
//       } catch (error) { throw new Error(error.message); }
//     },

//     getFamilyByQR: async (_, { qrCode }) => {
//       const family = await Family.findOne({ qrCode });
//       if (!family) throw new Error("QR Code tidak valid / Keluarga tidak ditemukan");
//       return family;
//     },

//     getAllReports: async () => await Report.find().sort({ reportDate: -1 }),
//     getReportsByCitizen: async (_, { citizenId }) => await Report.find({ citizenId }).sort({ reportDate: -1 })
//   },

//   Mutation: {
//     mutateCitizen: async (_, { id, statusWarga, keteranganMutasi }) => {
//       try {
//         return await Citizen.findByIdAndUpdate(
//           id, { $set: { statusWarga, keteranganMutasi, tanggalMutasi: new Date().toISOString() } }, { new: true }
//         );
//       } catch (error) { throw new Error("Gagal mutasi: " + error.message); }
//     },

//     addTrashDeposit: async (_, { citizenId, trashType, weight, pricePerKg }) => {
//       try {
//         const citizen = await Citizen.findById(citizenId);
//         if (!citizen) throw new Error("Warga tidak ditemukan");
//         const family = await Family.findById(citizen.familyId);
//         if (!family) throw new Error("Data Keluarga tidak ditemukan");

//         const moneyEarned = Math.round(weight * pricePerKg);
//         const newBalance = (family.balance || 0) + moneyEarned;

//         const newLog = new TrashBank({
//           familyId: citizen.familyId, citizenId: citizen.id, depositorName: citizen.name,
//           trashType, weight, pricePerKg, debit: moneyEarned, credit: 0, balance: newBalance,
//           status: "SUCCESS", txnDate: new Date().toISOString()
//         });
//         const savedLog = await newLog.save();
//         await Family.findByIdAndUpdate(citizen.familyId, { $inc: { totalTabungan: weight, balance: moneyEarned } });
//         return savedLog;
//       } catch (error) { throw new Error("BE_ERROR: " + error.message); }
//     },

//     withdrawFund: async (_, { familyId, amount }) => {
//         const family = await Family.findById(familyId);
//         if (!family) throw new Error("Keluarga tidak ditemukan");
//         if (family.balance < amount) throw new Error("Saldo tidak cukup kawan!");
        
//         const withdrawalEntry = new TrashBank({
//           familyId, depositorName: family.kepalaKeluarga, trashType: 'PENCAIRAN_DANA',
//           weight: 0, pricePerKg: 0, debit: 0, credit: amount, balance: family.balance - amount, 
//           status: "SUCCESS", txnDate: new Date().toISOString()
//         });
        
//         await Family.findByIdAndUpdate(familyId, { $inc: { balance: -amount } });
//         return await withdrawalEntry.save();
//     },

//     deleteTrashLog: async (_, { id }) => {
//       await TrashBank.findByIdAndDelete(id);
//       return "Log berhasil dihapus";
//     },

//     payContribution: async (_, args) => await new Contribution({ ...args, paymentDate: new Date().toISOString() }).save(),
//     addExpense: async (_, args) => await new Expense({ ...args, date: new Date().toISOString() }).save(),
//     deleteExpense: async (_, { id }) => { await Expense.findByIdAndDelete(id); return "Dihapus"; },

//     addHealthRecord: async (_, args) => await new Health({ ...args, hpl: args.hpl ? new Date(args.hpl).toISOString() : null, createdAt: new Date().toISOString() }).save(),
    
//     updateHealthRecord: async (_, { id, ...updates }) => {
//       const dataToUpdate = { ...updates };
//       if (updates.hpl) dataToUpdate.hpl = new Date(updates.hpl).toISOString();
//       return await Health.findByIdAndUpdate(id, { $set: dataToUpdate }, { new: true });
//     },
    
//     deleteHealthRecord: async (_, { id }) => { await Health.findByIdAndDelete(id); return "Hapus sukses"; },

//     addCitizen: async (_, args) => {
//       const existing = await Citizen.findOne({ nik: args.nik });
//       if (existing) throw new Error('NIK sudah terdaftar kawan!');
      
//       let rel = args.relationship ? args.relationship.toUpperCase() : 'LAINNYA';
//       if (rel.includes('ANAK')) {
//         const count = await Citizen.countDocuments({ familyId: args.familyId, relationship: { $regex: /^Anak/i } });
//         args.relationship = `Anak ${count + 1}`;
//       }
//       return await new Citizen(args).save();
//     },

//     updateCitizen: async (_, { id, ...updates }) => await Citizen.findByIdAndUpdate(id, updates, { new: true }),
//     deleteCitizen: async (_, { id }) => { await Citizen.findByIdAndDelete(id); return "Terhapus"; },

//     createFamily: async (_, args) => await new Family({ ...args, createdAt: new Date().toISOString() }).save(),
//     updateFamily: async (_, { id, ...updates }) => await Family.findByIdAndUpdate(id, updates, { new: true }),
//     deleteFamily: async (_, { id }) => {
//       await Citizen.deleteMany({ familyId: id });
//       await Family.findByIdAndDelete(id);
//       return "Keluarga berhasil dihapus";
//     },

//     addSchedule: async (_, args) => await new Schedule({ ...args, date: new Date(args.date).toISOString() }).save(),
//     deleteSchedule: async (_, { id }) => { await Schedule.findByIdAndDelete(id); return "Terhapus"; },

//     updateFamilyWaste: async (_, { familyId, totalTabungan }) => await Family.findByIdAndUpdate(familyId, { totalTabungan }, { new: true }),
//     deleteFamilyWaste: async (_, { familyId }) => { await Family.findByIdAndUpdate(familyId, { totalTabungan: 0, balance: 0 }); return "Reset Berhasil"; },

//     processKTP: async () => { return { success: false, message: "Gunakan fitur SCAN dokumen utama." }; },
//     processKK: async () => { return { success: false, message: "Gunakan fitur SCAN dokumen utama." }; },

//     // =========================================================================
//     // AI SCANNER V5: CLAUDE VISION (SUPPORT GAMBAR & PDF)
//     // =========================================================================
//     processScanAll: async (_, { imageBase64 }) => {
//       try {
//         console.log("🚀 Memulai AI Vision Scan (Support Gambar & PDF)...");

//         // 1. Deteksi Tipe File dari Header Base64
//         const matches = imageBase64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
//         if (!matches) {
//           return { success: false, message: "Format base64 tidak valid. Pastikan ada 'data:mime/type;base64,'", family: null };
//         }

//         const mimeType = matches[1];
//         const base64Data = matches[2];

//         let claudeContent = [];

//         // 2. Format Input berdasarkan tipe file
//         if (mimeType === 'application/pdf') {
//           console.log("📄 Mengirim file PDF langsung ke Claude...");
//           claudeContent.push({
//             type: "document",
//             source: {
//               type: "base64",
//               media_type: "application/pdf",
//               data: base64Data
//             }
//           });
//         } else if (mimeType.startsWith('image/')) {
//           console.log(`🖼️ Mengoptimasi file Gambar (${mimeType}) dengan Sharp...`);
//           const optimizedBuffer = await sharp(Buffer.from(base64Data, 'base64'))
//             .resize({ width: 1200, withoutEnlargement: true })
//             .jpeg({ quality: 80 })
//             .toBuffer();

//           claudeContent.push({
//             type: "image",
//             source: {
//               type: "base64",
//               media_type: "image/jpeg",
//               data: optimizedBuffer.toString('base64')
//             }
//           });
//         } else {
//           return { success: false, message: "Harap upload file Gambar (JPG/PNG) atau PDF.", family: null };
//         }

//         // 3. Tambahkan Prompt JSON murni
//         claudeContent.push({
//           type: "text",
//           text: "Ekstrak data KK/KTP ini ke JSON: { \"noKK\": \"string\", \"nik\": \"string\", \"nama\": \"string\", \"alamat\": \"string\" }. Jika tidak ada salah satu, tulis 'TIDAK_TERBACA'. Jangan berikan teks penjelasan, hanya JSON murni."
//         });

//         // 4. Proses melalui API Anthropic
//         const msg = await anthropic.messages.create({
//           model: "claude-3-5-sonnet-20241022",
//           max_tokens: 1000,
//           messages: [
//             {
//               role: "user",
//               content: claudeContent
//             }
//           ],
//         });

//         // 5. Bersihkan hasil markdown dari AI
//         const rawText = msg.content[0].text;
//         const cleanedJson = rawText.replace(/```json|```/g, "").trim();
//         const extracted = JSON.parse(cleanedJson);

//         let { noKK, nik, nama, alamat } = extracted;

//         // Fallback untuk No KK dan NIK
//         if (noKK === "TIDAK_TERBACA") noKK = `SCAN-KK-${Date.now()}`;
//         if (nik === "TIDAK_TERBACA") nik = `SCAN-NIK-${Date.now()}`;

//         // 6. Simpan Database
//         let family = await Family.findOne({ noKK });
//         if (!family) {
//           family = await new Family({
//             noKK,
//             kepalaKeluarga: nama,
//             address: alamat !== "TIDAK_TERBACA" ? alamat : "Alamat hasil scan",
//             ownershipStatus: "OWNED",
//             createdAt: new Date().toISOString()
//           }).save();
//         }

//         const citizenExists = await Citizen.findOne({ nik });
//         if (!citizenExists) {
//           await new Citizen({
//             familyId: family._id,
//             name: nama,
//             nik: nik,
//             gender: "L",
//             relationship: "KEPALA KELUARGA",
//             address: family.address,
//             dateOfBirth: "1990-01-01",
//             email: "-" // --- TAMBAHAN: Default fallback untuk Claude ---
//           }).save();
//         }

//         return { 
//           success: true, 
//           message: `Scan Berhasil via Claude AI (${mimeType.includes('pdf') ? 'PDF' : 'Gambar'})!`, 
//           family: family 
//         };

//       } catch (error) {
//         console.error("AI_SCAN_ERROR:", error.message);
//         return { success: false, message: "Gagal Scan: " + error.message, family: null };
//       }
//     },

//     createReport: async (_, args) => {
//       try {
//         const newReport = new Report({ ...args, reportDate: new Date().toISOString(), status: "PENDING" });
//         return await newReport.save();
//       } catch (error) { throw new Error("Gagal membuat laporan kawan: " + error.message); }
//     },

//     updateReportStatus: async (_, { id, status, response }) => {
//       try {
//         return await Report.findByIdAndUpdate(id, { $set: { status, response } }, { new: true });
//       } catch (error) { throw new Error("Gagal update laporan: " + error.message); }
//     },

//     deleteReport: async (_, { id }) => {
//       await Report.findByIdAndDelete(id);
//       return "Laporan berhasil dihapus.";
//     },
//   },

//   Family: {
//     members: async (parent) => await Citizen.find({ familyId: parent.id }).sort({ createdAt: 1 }),
//     payments: async (parent) => await Contribution.find({ familyId: parent.id })
//   },
//   Citizen: {
//     family: async (parent) => await Family.findById(parent.familyId),
//     healthData: async (parent) => await Health.findOne({ citizenId: parent.id }).sort({ createdAt: -1 }),
//     healthHistory: async (parent) => await Health.find({ citizenId: parent.id }).sort({ createdAt: -1 }),
//     reports: async (parent) => await Report.find({ citizenId: parent.id }).sort({ reportDate: -1 }), 
//     age: (parent) => {
//       if (!parent.dateOfBirth) return 0;
//       const dob = new Date(parent.dateOfBirth);
//       const diff = Date.now() - dob.getTime();
//       return Math.abs(new Date(diff).getUTCFullYear() - 1970);
//     }
//   },
//   Health: { citizen: async (parent) => await Citizen.findById(parent.citizenId) },
//   TrashBank: { family: async (parent) => await Family.findById(parent.familyId) },
//   Contribution: { family: async (parent) => await Family.findById(parent.familyId) },
//   Report: { citizen: async (parent) => await Citizen.findById(parent.citizenId) } 
// };


// import sharp from 'sharp';
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import Citizen from './models/Citizen.js';
// import Family from './models/Family.js';
// import Health from './models/Health.js';
// import TrashBank from './models/TrashBank.js';
// import Schedule from './models/Schedule.js';
// import Contribution from './models/Contribution.js';
// import Expense from './models/Expense.js';
// import Report from './models/Report.js';

// // Inisialisasi Anthropic dengan Key dari .env
// const anthropic = new Anthropic({
//   apiKey: process.env.CLAUDE_API_KEY,
// });

// export const resolvers = {
//   Query: {
//     families: async () => await Family.find().sort({ createdAt: -1 }),
//     citizens: async () => await Citizen.find().sort({ createdAt: -1 }),
//     citizen: async (_, { id }) => await Citizen.findById(id),
    
//     // 👇 QUERY UNTUK DASHBOARD WARGA 👇
//     getFamilyById: async (_, { id }) => {
//       try {
//         const family = await Family.findById(id);
//         if (!family) throw new Error("Data Keluarga tidak ditemukan kawan!");
//         return family;
//       } catch (error) {
//         throw new Error(error.message);
//       }
//     },

//     getAllHealthRecords: async () => await Health.find().sort({ createdAt: -1 }),
//     getSchedules: async () => await Schedule.find().sort({ date: 1 }),
//     getAllContributions: async () => await Contribution.find().populate('familyId'),
//     getContributionsByPeriod: async (_, { month, year }) => await Contribution.find({ month, year }),
//     getAllExpenses: async () => await Expense.find().sort({ date: -1 }),
    
//     getKasSummary: async (_, { month, year }) => {
//       try {
//         const allIn = await Contribution.find();
//         const allOut = await Expense.find();
//         const totalFamily = await Family.countDocuments();
//         const paidThisMonth = await Contribution.countDocuments({ month, year });
//         const totalIn = allIn.reduce((sum, item) => sum + item.amount, 0);
//         const totalOut = allOut.reduce((sum, item) => sum + item.amount, 0);
//         return {
//           totalIn, totalOut, balance: totalIn - totalOut,
//           paidPercentage: totalFamily > 0 ? (paidThisMonth / totalFamily) * 100 : 0
//         };
//       } catch (e) { throw new Error(e.message); }
//     },

//     sampahStats: async () => {
//       try {
//         const families = await Family.find();
//         const totalBerat = families.reduce((sum, f) => sum + (f.totalTabungan || 0), 0);
//         const totalUang = families.reduce((sum, f) => sum + (f.balance || 0), 0);
//         const totalKKAktif = families.filter(f => (f.totalTabungan || 0) > 0).length;
//         return { totalBerat, totalKKAktif, totalUang };
//       } catch (error) { throw new Error(error.message); }
//     },

//     allTrashLogs: async () => await TrashBank.find().sort({ txnDate: -1 }),

//     getHealthStats: async () => {
//       try {
//         const stats = await Health.aggregate([
//           { $group: { _id: "$healthStatus", count: { $sum: 1 } } }
//         ]);
//         return stats.map(s => ({ status: s._id || "UNKNOWN", count: s.count }));
//       } catch (error) { throw new Error(error.message); }
//     },

//     getFamilyByQR: async (_, { qrCode }) => {
//       const family = await Family.findOne({ qrCode });
//       if (!family) throw new Error("QR Code tidak valid / Keluarga tidak ditemukan");
//       return family;
//     },

//     getAllReports: async () => await Report.find().sort({ reportDate: -1 }),
//     getReportsByCitizen: async (_, { citizenId }) => await Report.find({ citizenId }).sort({ reportDate: -1 })
//   },

//   Mutation: {
//     mutateCitizen: async (_, { id, statusWarga, keteranganMutasi }) => {
//       try {
//         return await Citizen.findByIdAndUpdate(
//           id, { $set: { statusWarga, keteranganMutasi, tanggalMutasi: new Date().toISOString() } }, { new: true }
//         );
//       } catch (error) { throw new Error("Gagal mutasi: " + error.message); }
//     },

//     addTrashDeposit: async (_, { citizenId, trashType, weight, pricePerKg }) => {
//       try {
//         const citizen = await Citizen.findById(citizenId);
//         if (!citizen) throw new Error("Warga tidak ditemukan");
//         const family = await Family.findById(citizen.familyId);
//         if (!family) throw new Error("Data Keluarga tidak ditemukan");

//         const moneyEarned = Math.round(weight * pricePerKg);
//         const newBalance = (family.balance || 0) + moneyEarned;

//         const newLog = new TrashBank({
//           familyId: citizen.familyId, citizenId: citizen.id, depositorName: citizen.name,
//           trashType, weight, pricePerKg, debit: moneyEarned, credit: 0, balance: newBalance,
//           status: "SUCCESS", txnDate: new Date().toISOString()
//         });
//         const savedLog = await newLog.save();
//         await Family.findByIdAndUpdate(citizen.familyId, { $inc: { totalTabungan: weight, balance: moneyEarned } });
//         return savedLog;
//       } catch (error) { throw new Error("BE_ERROR: " + error.message); }
//     },

//     withdrawFund: async (_, { familyId, amount }) => {
//         const family = await Family.findById(familyId);
//         if (!family) throw new Error("Keluarga tidak ditemukan");
//         if (family.balance < amount) throw new Error("Saldo tidak cukup kawan!");
        
//         const withdrawalEntry = new TrashBank({
//           familyId, depositorName: family.kepalaKeluarga, trashType: 'PENCAIRAN_DANA',
//           weight: 0, pricePerKg: 0, debit: 0, credit: amount, balance: family.balance - amount, 
//           status: "SUCCESS", txnDate: new Date().toISOString()
//         });
        
//         await Family.findByIdAndUpdate(familyId, { $inc: { balance: -amount } });
//         return await withdrawalEntry.save();
//     },

//     deleteTrashLog: async (_, { id }) => {
//       await TrashBank.findByIdAndDelete(id);
//       return "Log berhasil dihapus";
//     },

//     payContribution: async (_, args) => await new Contribution({ ...args, paymentDate: new Date().toISOString() }).save(),
//     addExpense: async (_, args) => await new Expense({ ...args, date: new Date().toISOString() }).save(),
//     deleteExpense: async (_, { id }) => { await Expense.findByIdAndDelete(id); return "Dihapus"; },

//     addHealthRecord: async (_, args) => await new Health({ ...args, hpl: args.hpl ? new Date(args.hpl).toISOString() : null, createdAt: new Date().toISOString() }).save(),
    
//     updateHealthRecord: async (_, { id, ...updates }) => {
//       const dataToUpdate = { ...updates };
//       if (updates.hpl) dataToUpdate.hpl = new Date(updates.hpl).toISOString();
//       return await Health.findByIdAndUpdate(id, { $set: dataToUpdate }, { new: true });
//     },
    
//     deleteHealthRecord: async (_, { id }) => { await Health.findByIdAndDelete(id); return "Hapus sukses"; },

//     addCitizen: async (_, args) => {
//       const existing = await Citizen.findOne({ nik: args.nik });
//       if (existing) throw new Error('NIK sudah terdaftar kawan!');
      
//       let rel = args.relationship ? args.relationship.toUpperCase() : 'LAINNYA';
//       if (rel.includes('ANAK')) {
//         const count = await Citizen.countDocuments({ familyId: args.familyId, relationship: { $regex: /^Anak/i } });
//         args.relationship = `Anak ${count + 1}`;
//       }
//       return await new Citizen(args).save();
//     },

//     updateCitizen: async (_, { id, ...updates }) => await Citizen.findByIdAndUpdate(id, updates, { new: true }),
//     deleteCitizen: async (_, { id }) => { await Citizen.findByIdAndDelete(id); return "Terhapus"; },

//     createFamily: async (_, args) => await new Family({ ...args, createdAt: new Date().toISOString() }).save(),
//     updateFamily: async (_, { id, ...updates }) => await Family.findByIdAndUpdate(id, updates, { new: true }),
//     deleteFamily: async (_, { id }) => {
//       await Citizen.deleteMany({ familyId: id });
//       await Family.findByIdAndDelete(id);
//       return "Keluarga berhasil dihapus";
//     },

//     addSchedule: async (_, args) => await new Schedule({ ...args, date: new Date(args.date).toISOString() }).save(),
//     deleteSchedule: async (_, { id }) => { await Schedule.findByIdAndDelete(id); return "Terhapus"; },

//     updateFamilyWaste: async (_, { familyId, totalTabungan }) => await Family.findByIdAndUpdate(familyId, { totalTabungan }, { new: true }),
//     deleteFamilyWaste: async (_, { familyId }) => { await Family.findByIdAndUpdate(familyId, { totalTabungan: 0, balance: 0 }); return "Reset Berhasil"; },

//     processKTP: async () => { return { success: false, message: "Gunakan fitur SCAN dokumen utama." }; },
//     processKK: async () => { return { success: false, message: "Gunakan fitur SCAN dokumen utama." }; },

//     processScanAll: async (_, { imageBase64 }) => {
//       try {
//         console.log("🚀 Memulai AI Vision Scan (Support Gambar & PDF)...");

//         const matches = imageBase64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
//         if (!matches) {
//           return { success: false, message: "Format base64 tidak valid. Pastikan ada 'data:mime/type;base64,'", family: null };
//         }

//         const mimeType = matches[1];
//         const base64Data = matches[2];

//         let claudeContent = [];

//         if (mimeType === 'application/pdf') {
//           console.log("📄 Mengirim file PDF langsung ke Claude...");
//           claudeContent.push({
//             type: "document",
//             source: {
//               type: "base64",
//               media_type: "application/pdf",
//               data: base64Data
//             }
//           });
//         } else if (mimeType.startsWith('image/')) {
//           console.log(`🖼️ Mengoptimasi file Gambar (${mimeType}) dengan Sharp...`);
//           const optimizedBuffer = await sharp(Buffer.from(base64Data, 'base64'))
//             .resize({ width: 1200, withoutEnlargement: true })
//             .jpeg({ quality: 80 })
//             .toBuffer();

//           claudeContent.push({
//             type: "image",
//             source: {
//               type: "base64",
//               media_type: "image/jpeg",
//               data: optimizedBuffer.toString('base64')
//             }
//           });
//         } else {
//           return { success: false, message: "Harap upload file Gambar (JPG/PNG) atau PDF.", family: null };
//         }

//         claudeContent.push({
//           type: "text",
//           text: "Ekstrak data KK/KTP ini ke JSON: { \"noKK\": \"string\", \"nik\": \"string\", \"nama\": \"string\", \"alamat\": \"string\" }. Jika tidak ada salah satu, tulis 'TIDAK_TERBACA'. Jangan berikan teks penjelasan, hanya JSON murni."
//         });

//         const msg = await anthropic.messages.create({
//           model: "claude-3-5-sonnet-20241022",
//           max_tokens: 1000,
//           messages: [
//             {
//               role: "user",
//               content: claudeContent
//             }
//           ],
//         });

//         const rawText = msg.content[0].text;
//         const cleanedJson = rawText.replace(/```json|```/g, "").trim();
//         const extracted = JSON.parse(cleanedJson);

//         let { noKK, nik, nama, alamat } = extracted;

//         if (noKK === "TIDAK_TERBACA") noKK = `SCAN-KK-${Date.now()}`;
//         if (nik === "TIDAK_TERBACA") nik = `SCAN-NIK-${Date.now()}`;

//         let family = await Family.findOne({ noKK });
//         if (!family) {
//           family = await new Family({
//             noKK,
//             kepalaKeluarga: nama,
//             address: alamat !== "TIDAK_TERBACA" ? alamat : "Alamat hasil scan",
//             ownershipStatus: "OWNED",
//             createdAt: new Date().toISOString()
//           }).save();
//         }

//         const citizenExists = await Citizen.findOne({ nik });
//         if (!citizenExists) {
//           await new Citizen({
//             familyId: family._id,
//             name: nama,
//             nik: nik,
//             gender: "L",
//             relationship: "KEPALA KELUARGA",
//             address: family.address,
//             dateOfBirth: "1990-01-01",
//             email: "-" 
//           }).save();
//         }

//         return { 
//           success: true, 
//           message: `Scan Berhasil via Claude AI (${mimeType.includes('pdf') ? 'PDF' : 'Gambar'})!`, 
//           family: family 
//         };

//       } catch (error) {
//         console.error("AI_SCAN_ERROR:", error.message);
//         return { success: false, message: "Gagal Scan: " + error.message, family: null };
//       }
//     },

//     createReport: async (_, args) => {
//       try {
//         const newReport = new Report({ ...args, reportDate: new Date().toISOString(), status: "PENDING" });
//         return await newReport.save();
//       } catch (error) { throw new Error("Gagal membuat laporan kawan: " + error.message); }
//     },

//     updateReportStatus: async (_, { id, status, response }) => {
//       try {
//         return await Report.findByIdAndUpdate(id, { $set: { status, response } }, { new: true });
//       } catch (error) { throw new Error("Gagal update laporan: " + error.message); }
//     },

//     deleteReport: async (_, { id }) => {
//       await Report.findByIdAndDelete(id);
//       return "Laporan berhasil dihapus.";
//     },
//   },

//   // 👇 INI YANG MEMBUAT DASHBOARD WARGA BISA MENGHITUNG ANGGOTA KELUARGA 👇
//   Family: {
//     members: async (parent) => await Citizen.find({ familyId: parent._id }).sort({ createdAt: 1 }),
//     payments: async (parent) => await Contribution.find({ familyId: parent._id })
//   },
  
//   Citizen: {
//     family: async (parent) => await Family.findById(parent.familyId),
//     healthData: async (parent) => await Health.findOne({ citizenId: parent._id }).sort({ createdAt: -1 }),
//     healthHistory: async (parent) => await Health.find({ citizenId: parent._id }).sort({ createdAt: -1 }),
//     reports: async (parent) => await Report.find({ citizenId: parent._id }).sort({ reportDate: -1 }), 
//     age: (parent) => {
//       if (!parent.dateOfBirth) return 0;
//       const dob = new Date(parent.dateOfBirth);
//       const diff = Date.now() - dob.getTime();
//       return Math.abs(new Date(diff).getUTCFullYear() - 1970);
//     }
//   },
  
//   Health: { citizen: async (parent) => await Citizen.findById(parent.citizenId) },
//   TrashBank: { family: async (parent) => await Family.findById(parent.familyId) },
//   Contribution: { family: async (parent) => await Family.findById(parent.familyId) },
//   Report: { citizen: async (parent) => await Citizen.findById(parent.citizenId) } 
// };








import sharp from 'sharp';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Citizen from './models/Citizen.js';
import Family from './models/Family.js';
import Health from './models/Health.js';
import TrashBank from './models/TrashBank.js';
import Schedule from './models/Schedule.js';
import Contribution from './models/Contribution.js';
import Expense from './models/Expense.js';
import Report from './models/Report.js';

// ✅ INISIALISASI GEMINI AI (Ganti Anthropic yang bikin error tadi)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const resolvers = {
  Query: {
    families: async () => await Family.find().sort({ createdAt: -1 }),
    citizens: async () => await Citizen.find().sort({ createdAt: -1 }),
    citizen: async (_, { id }) => await Citizen.findById(id),
    
    getFamilyById: async (_, { id }) => {
      try {
        const family = await Family.findById(id);
        if (!family) throw new Error("Data Keluarga tidak ditemukan kawan!");
        return family;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    getAllHealthRecords: async () => await Health.find().sort({ createdAt: -1 }),
    getSchedules: async () => await Schedule.find().sort({ date: 1 }),
    getAllContributions: async () => await Contribution.find().populate('familyId'),
    getContributionsByPeriod: async (_, { month, year }) => await Contribution.find({ month, year }),
    getAllExpenses: async () => await Expense.find().sort({ date: -1 }),
    
    getKasSummary: async (_, { month, year }) => {
      try {
        const allIn = await Contribution.find();
        const allOut = await Expense.find();
        const totalFamily = await Family.countDocuments();
        const paidThisMonth = await Contribution.countDocuments({ month, year });
        const totalIn = allIn.reduce((sum, item) => sum + item.amount, 0);
        const totalOut = allOut.reduce((sum, item) => sum + item.amount, 0);
        return {
          totalIn, totalOut, balance: totalIn - totalOut,
          paidPercentage: totalFamily > 0 ? (paidThisMonth / totalFamily) * 100 : 0
        };
      } catch (e) { throw new Error(e.message); }
    },

    sampahStats: async () => {
      try {
        const families = await Family.find();
        const totalBerat = families.reduce((sum, f) => sum + (f.totalTabungan || 0), 0);
        const totalUang = families.reduce((sum, f) => sum + (f.balance || 0), 0);
        const totalKKAktif = families.filter(f => (f.totalTabungan || 0) > 0).length;
        return { totalBerat, totalKKAktif, totalUang };
      } catch (error) { throw new Error(error.message); }
    },

    allTrashLogs: async () => await TrashBank.find().sort({ txnDate: -1 }),

    getHealthStats: async () => {
      try {
        const stats = await Health.aggregate([
          { $group: { _id: "$healthStatus", count: { $sum: 1 } } }
        ]);
        return stats.map(s => ({ status: s._id || "UNKNOWN", count: s.count }));
      } catch (error) { throw new Error(error.message); }
    },

    getFamilyByQR: async (_, { qrCode }) => {
      const family = await Family.findOne({ qrCode });
      if (!family) throw new Error("QR Code tidak valid / Keluarga tidak ditemukan");
      return family;
    },

    getAllReports: async () => await Report.find().sort({ reportDate: -1 }),
    getReportsByCitizen: async (_, { citizenId }) => await Report.find({ citizenId }).sort({ reportDate: -1 })
  },

  Mutation: {
    mutateCitizen: async (_, { id, statusWarga, keteranganMutasi }) => {
      try {
        return await Citizen.findByIdAndUpdate(
          id, { $set: { statusWarga, keteranganMutasi, tanggalMutasi: new Date().toISOString() } }, { new: true }
        );
      } catch (error) { throw new Error("Gagal mutasi: " + error.message); }
    },

    addTrashDeposit: async (_, { citizenId, trashType, weight, pricePerKg }) => {
      try {
        const citizen = await Citizen.findById(citizenId);
        const moneyEarned = Math.round(weight * pricePerKg);
        const family = await Family.findById(citizen.familyId);
        const newBalance = (family.balance || 0) + moneyEarned;

        const newLog = new TrashBank({
          familyId: citizen.familyId, citizenId: citizen.id, depositorName: citizen.name,
          trashType, weight, pricePerKg, debit: moneyEarned, credit: 0, balance: newBalance,
          status: "SUCCESS", txnDate: new Date().toISOString()
        });
        await newLog.save();
        await Family.findByIdAndUpdate(citizen.familyId, { $inc: { totalTabungan: weight, balance: moneyEarned } });
        return newLog;
      } catch (error) { throw new Error("BE_ERROR: " + error.message); }
    },

    withdrawFund: async (_, { familyId, amount }) => {
        const family = await Family.findById(familyId);
        if (family.balance < amount) throw new Error("Saldo tidak cukup kawan!");
        const withdrawalEntry = new TrashBank({
          familyId, depositorName: family.kepalaKeluarga, trashType: 'PENCAIRAN_DANA',
          weight: 0, pricePerKg: 0, debit: 0, credit: amount, balance: family.balance - amount, 
          status: "SUCCESS", txnDate: new Date().toISOString()
        });
        await Family.findByIdAndUpdate(familyId, { $inc: { balance: -amount } });
        return await withdrawalEntry.save();
    },

    deleteTrashLog: async (_, { id }) => {
      await TrashBank.findByIdAndDelete(id);
      return "Log berhasil dihapus";
    },

    payContribution: async (_, args) => await new Contribution({ ...args, paymentDate: new Date().toISOString() }).save(),
    addExpense: async (_, args) => await new Expense({ ...args, date: new Date().toISOString() }).save(),

    addHealthRecord: async (_, args) => await new Health({ ...args, createdAt: new Date().toISOString() }).save(),
    
    updateHealthRecord: async (_, { id, ...updates }) => await Health.findByIdAndUpdate(id, { $set: updates }, { new: true }),
    
    deleteHealthRecord: async (_, { id }) => { await Health.findByIdAndDelete(id); return "Hapus sukses"; },

    addCitizen: async (_, args) => await new Citizen(args).save(),
    updateCitizen: async (_, { id, ...updates }) => await Citizen.findByIdAndUpdate(id, updates, { new: true }),
    deleteCitizen: async (_, { id }) => { await Citizen.findByIdAndDelete(id); return "Terhapus"; },

    createFamily: async (_, args) => await new Family({ ...args, createdAt: new Date().toISOString() }).save(),
    updateFamily: async (_, { id, ...updates }) => await Family.findByIdAndUpdate(id, updates, { new: true }),
    deleteFamily: async (_, { id }) => {
      await Citizen.deleteMany({ familyId: id });
      await Family.findByIdAndDelete(id);
      return "Keluarga berhasil dihapus";
    },

    addSchedule: async (_, args) => await new Schedule({ ...args, date: new Date(args.date).toISOString() }).save(),
    deleteSchedule: async (_, { id }) => { await Schedule.findByIdAndDelete(id); return "Terhapus"; },

    updateFamilyWaste: async (_, { familyId, totalTabungan }) => await Family.findByIdAndUpdate(familyId, { totalTabungan }, { new: true }),

    // =========================================================================
    // ✅ AI SCANNER: MENGGUNAKAN GOOGLE GEMINI (Bukan Claude)
    // =========================================================================
    processScanAll: async (_, { imageBase64 }) => {
      try {
        console.log("🚀 Memulai AI Vision Scan via Gemini...");

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // Membersihkan header base64
        const base64Data = imageBase64.split(",")[1];

        const prompt = "Ekstrak data KK/KTP ini ke JSON: { \"noKK\": \"string\", \"nik\": \"string\", \"nama\": \"string\", \"alamat\": \"string\" }. Jika tidak ada salah satu, tulis 'TIDAK_TERBACA'. Berikan JSON murni tanpa penjelasan.";

        const result = await model.generateContent([
          prompt,
          { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
        ]);

        const response = await result.response;
        const rawText = response.text();
        const cleanedJson = rawText.replace(/```json|```/g, "").trim();
        const extracted = JSON.parse(cleanedJson);

        let { noKK, nik, nama, alamat } = extracted;
        if (noKK === "TIDAK_TERBACA") noKK = `SCAN-KK-${Date.now()}`;
        if (nik === "TIDAK_TERBACA") nik = `SCAN-NIK-${Date.now()}`;

        let family = await Family.findOne({ noKK });
        if (!family) {
          family = await new Family({
            noKK, kepalaKeluarga: nama,
            address: alamat !== "TIDAK_TERBACA" ? alamat : "Hasil Scan",
            ownershipStatus: "OWNED", createdAt: new Date().toISOString()
          }).save();
        }

        const citizenExists = await Citizen.findOne({ nik });
        if (!citizenExists) {
          await new Citizen({
            familyId: family._id, name: nama, nik: nik,
            gender: "L", relationship: "KEPALA KELUARGA",
            address: family.address, dateOfBirth: "1990-01-01", email: "-"
          }).save();
        }

        return { success: true, message: "Scan Berhasil via Gemini AI", family };

      } catch (error) {
        console.error("AI_SCAN_ERROR:", error.message);
        return { success: false, message: "Gagal Scan: " + error.message, family: null };
      }
    },

    createReport: async (_, args) => await new Report({ ...args, reportDate: new Date().toISOString(), status: "PENDING" }).save(),
    updateReportStatus: async (_, { id, status, response }) => await Report.findByIdAndUpdate(id, { $set: { status, response } }, { new: true }),
    deleteReport: async (_, { id }) => { await Report.findByIdAndDelete(id); return "Laporan berhasil dihapus."; },
  },

  // 👇 RESOLVERS UNTUK RELASI DATA 👇
  Family: {
    members: async (parent) => await Citizen.find({ familyId: parent._id }).sort({ createdAt: 1 }),
    payments: async (parent) => await Contribution.find({ familyId: parent._id })
  },
  
  Citizen: {
    family: async (parent) => await Family.findById(parent.familyId),
    healthData: async (parent) => await Health.findOne({ citizenId: parent._id }).sort({ createdAt: -1 }),
    healthHistory: async (parent) => await Health.find({ citizenId: parent._id }).sort({ createdAt: -1 }),
    reports: async (parent) => await Report.find({ citizenId: parent._id }).sort({ reportDate: -1 }), 
    age: (parent) => {
      if (!parent.dateOfBirth) return 0;
      const dob = new Date(parent.dateOfBirth);
      return Math.abs(new Date(Date.now() - dob.getTime()).getUTCFullYear() - 1970);
    }
  },
  
  Health: { citizen: async (parent) => await Citizen.findById(parent.citizenId) },
  TrashBank: { family: async (parent) => await Family.findById(parent.familyId) },
  Contribution: { family: async (parent) => await Family.findById(parent.familyId) },
  Report: { citizen: async (parent) => await Citizen.findById(parent.citizenId) } 
};