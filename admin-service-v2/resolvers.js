// import Citizen from './models/Citizen.js';
// import Family from './models/Family.js';
// import Health from './models/Health.js';
// import Contribution from './models/Contribution.js';
// import TrashBank from './models/TrashBank.js';
// import Insurance from './models/Insurance.js';

// export const resolvers = {
//   // --- QUERY ---
//   Query: {
//     families: async () => await Family.find(),
//     citizens: async () => await Citizen.find(),
//     getAllHealthRecords: async () => await Health.find(),
//     getAllContributions: async () => await Contribution.find().sort({ createdAt: -1 }),
//     getAllTrashTransactions: async () => await TrashBank.find().sort({ txnDate: -1 }),

//     // Query Singular (Pakai findOne biar aman dari CastError)
//     citizen: async (_, { id }) => {
//       const data = await Citizen.findOne({ _id: id });
//       if (!data) throw new Error('Warga tidak ditemukan');
//       return data;
//     },
//     getFamilyById: async (_, { id }) => {
//       const data = await Family.findOne({ _id: id });
//       if (!data) throw new Error('Keluarga tidak ditemukan');
//       return data;
//     },
//     getInsurancesByCitizenId: async (_, { citizenId }) => {
//       return await Insurance.find({ citizenId });
//     }
//   },

//   // --- MUTATION (INI YANG TADI KOSONG, SEKARANG UDAH DIISI) ---
//   Mutation: {
//     // 1. CREATE FAMILY (Ada Log CCTV-nya)
//     createFamily: async (_, args) => {
//       console.log("🔥 REQUEST CREATE FAMILY:", args);
//       try {
//         const existing = await Family.findOne({ noKK: args.noKK });
//         if (existing) throw new Error('Nomor KK sudah terdaftar!');

//         const newFamily = new Family(args);
//         const result = await newFamily.save();
//         console.log("✅ SUKSES SIMPAN FAMILY:", result.id);
//         return result;
//       } catch (error) {
//         console.error("❌ ERROR CREATE FAMILY:", error);
//         throw new Error(error.message);
//       }
//     },

//     // 2. ADD CITIZEN
//     addCitizen: async (_, args) => {
//       const existing = await Citizen.findOne({ nik: args.nik });
//       if (existing) throw new Error('NIK sudah terdaftar!');
//       const newCitizen = new Citizen(args);
//       return await newCitizen.save();
//     },

//     // 3. UPDATE CITIZEN
//     updateCitizen: async (_, { id, ...updates }) => {
//       return await Citizen.findOneAndUpdate({ _id: id }, updates, { new: true });
//     },

//     // 4. DELETE CITIZEN (Bersih-bersih data terkait)
//     deleteCitizen: async (_, { id }) => {
//       await Citizen.findOneAndDelete({ _id: id });
//       await Health.findOneAndDelete({ citizenId: id });
//       await Insurance.deleteMany({ citizenId: id });
//       return "Data Warga dan data terkait berhasil dihapus";
//     },

//     // 5. HEALTH RECORD
//     addHealthRecord: async (_, args) => {
//       const citizenExists = await Citizen.findOne({ _id: args.citizenId });
//       if (!citizenExists) throw new Error("Warga tidak ditemukan!");
      
//       const existingHealth = await Health.findOne({ citizenId: args.citizenId });
//       if (existingHealth) throw new Error("Data kesehatan sudah ada!");

//       const newHealth = new Health(args);
//       return await newHealth.save();
//     },

//     // 6. PAY CONTRIBUTION
//     payContribution: async (_, args) => {
//       const familyExists = await Family.findOne({ _id: args.familyId });
//       if (!familyExists) throw new Error("Keluarga tidak ditemukan!");

//       const newContribution = new Contribution(args);
//       return await newContribution.save();
//     },

//     // 7. TRASH DEPOSIT
//     addTrashDeposit: async (_, args) => {
//       const citizenExists = await Citizen.findOne({ _id: args.citizenId });
//       if (!citizenExists) throw new Error("Warga tidak ditemukan!");

//       const depositAmount = Math.round(args.weightKg * args.pricePerKg);
//       const newTransaction = new TrashBank({
//         ...args,
//         deposit: depositAmount,
//         withdrawal: 0,
//         operator: args.operator || 'Admin Bank Sampah'
//       });
//       return await newTransaction.save();
//     },
    
//     // 8. ADD INSURANCE
//     addInsurance: async (_, args) => {
//       const citizenExists = await Citizen.findOne({ _id: args.citizenId });
//       if (!citizenExists) throw new Error("Warga tidak ditemukan!");

//       const existingPolicy = await Insurance.findOne({ insuranceNumber: args.insuranceNumber });
//       if (existingPolicy) throw new Error("Nomor polis asuransi ini sudah terdaftar!");

//       const newInsurance = new Insurance(args);
//       return await newInsurance.save();
//     }
//   },

//   // --- RELASI ---
//   Citizen: {
//     family: async (parent) => await Family.findOne({ _id: parent.familyId }),
//     healthData: async (parent) => await Health.findOne({ citizenId: parent.id }),
//     insurances: async (parent) => await Insurance.find({ citizenId: parent.id }),
//     trashTransactions: async (parent) => await TrashBank.find({ citizenId: parent.id }).sort({ txnDate: -1 }),
    
//     trashBalance: async (parent) => {
//       const transactions = await TrashBank.find({ citizenId: parent.id });
//       const totalDeposit = transactions.reduce((sum, txn) => sum + (txn.deposit || 0), 0);
//       const totalWithdrawal = transactions.reduce((sum, txn) => sum + (txn.withdrawal || 0), 0);
//       return totalDeposit - totalWithdrawal;
//     }
//   },
  
//   Family: { 
//     members: async (parent) => await Citizen.find({ familyId: parent.id }),
//     payments: async (parent) => await Contribution.find({ familyId: parent.id }).sort({ paymentDate: -1 })
//   },
  
//   Health: { citizen: async (parent) => await Citizen.findOne({ _id: parent.citizenId }) },
//   Contribution: { family: async (parent) => await Family.findOne({ _id: parent.familyId }) },
//   TrashBank: { citizen: async (parent) => await Citizen.findOne({ _id: parent.citizenId }) },
//   Insurance: { citizen: async (parent) => await Citizen.findOne({ _id: parent.citizenId }) }
// };


// File: resolvers.js
import Citizen from './models/Citizen.js';
import Family from './models/Family.js';
import Health from './models/Health.js';
import Contribution from './models/Contribution.js';
import TrashBank from './models/TrashBank.js';
import Insurance from './models/Insurance.js';

export const resolvers = {
  // --- QUERY ---
  Query: {
    families: async () => await Family.find(),
    citizens: async () => await Citizen.find(),
    getAllHealthRecords: async () => await Health.find(),
    getAllContributions: async () => await Contribution.find().sort({ createdAt: -1 }),
    getAllTrashTransactions: async () => await TrashBank.find().sort({ txnDate: -1 }),

    citizen: async (_, { id }) => {
      const data = await Citizen.findById(id);
      if (!data) throw new Error('Warga tidak ditemukan');
      return data;
    },
    getFamilyById: async (_, { id }) => {
      const data = await Family.findById(id);
      if (!data) throw new Error('Keluarga tidak ditemukan');
      return data;
    },
    getInsurancesByCitizenId: async (_, { citizenId }) => {
      return await Insurance.find({ citizenId });
    }
  },

  // --- MUTATION ---
  Mutation: {
    // 1. CREATE FAMILY
    createFamily: async (_, args) => {
      try {
        const existing = await Family.findOne({ noKK: args.noKK });
        if (existing) throw new Error('Nomor KK sudah terdaftar!');
        const newFamily = new Family(args);
        return await newFamily.save();
      } catch (error) {
        throw new Error(error.message);
      }
    },

    // 2. ADD CITIZEN
    addCitizen: async (_, args) => {
      const existing = await Citizen.findOne({ nik: args.nik });
      if (existing) throw new Error('NIK sudah terdaftar!');
      const newCitizen = new Citizen(args);
      return await newCitizen.save();
    },

    // 3. UPDATE CITIZEN
    updateCitizen: async (_, { id, ...updates }) => {
      return await Citizen.findByIdAndUpdate(id, updates, { new: true });
    },

    // 4. DELETE CITIZEN (FULL CLEANUP)
    deleteCitizen: async (_, { id }) => {
      try {
        // Cek dulu apakah warganya ada?
        const target = await Citizen.findById(id);
        if (!target) {
          throw new Error("Gagal menghapus: Warga tidak ditemukan atau ID salah.");
        }

        // HAPUS SEMUA DATA TERKAIT (Biar Database Bersih)
        await Health.deleteOne({ citizenId: id });      // Hapus Data Kesehatan
        await Insurance.deleteMany({ citizenId: id });  // Hapus Data Asuransi
        await TrashBank.deleteMany({ citizenId: id });  // Hapus Data Transaksi Sampah

        // TERAKHIR: Hapus Warganya
        await Citizen.findByIdAndDelete(id);

        return `Data warga atas nama ${target.name || target.nama} berhasil dihapus permanen.`;
      } catch (error) {
        console.error("Error Delete:", error);
        throw new Error(error.message);
      }
    },

    // 5. HEALTH RECORD
    addHealthRecord: async (_, args) => {
      const citizenExists = await Citizen.findById(args.citizenId);
      if (!citizenExists) throw new Error("Warga tidak ditemukan!");
      
      const existingHealth = await Health.findOne({ citizenId: args.citizenId });
      if (existingHealth) throw new Error("Data kesehatan sudah ada!");

      const newHealth = new Health(args);
      return await newHealth.save();
    },

    // 6. PAY CONTRIBUTION
    payContribution: async (_, args) => {
      const familyExists = await Family.findById(args.familyId);
      if (!familyExists) throw new Error("Keluarga tidak ditemukan!");

      const newContribution = new Contribution(args);
      return await newContribution.save();
    },

    // 7. TRASH DEPOSIT
    addTrashDeposit: async (_, args) => {
      const citizenExists = await Citizen.findById(args.citizenId);
      if (!citizenExists) throw new Error("Warga tidak ditemukan!");

      const depositAmount = Math.round(args.weightKg * args.pricePerKg);
      const newTransaction = new TrashBank({
        ...args,
        deposit: depositAmount,
        withdrawal: 0,
        operator: args.operator || 'Admin Bank Sampah'
      });
      return await newTransaction.save();
    },
    
    // 8. ADD INSURANCE
    addInsurance: async (_, args) => {
      const citizenExists = await Citizen.findById(args.citizenId);
      if (!citizenExists) throw new Error("Warga tidak ditemukan!");

      const existingPolicy = await Insurance.findOne({ insuranceNumber: args.insuranceNumber });
      if (existingPolicy) throw new Error("Nomor polis asuransi ini sudah terdaftar!");

      const newInsurance = new Insurance(args);
      return await newInsurance.save();
    }
  },

  // --- FIELD RESOLVERS (RELASI) ---
  Citizen: {
    family: async (parent) => await Family.findById(parent.familyId),
    healthData: async (parent) => await Health.findOne({ citizenId: parent.id }),
    insurances: async (parent) => await Insurance.find({ citizenId: parent.id }),
    trashTransactions: async (parent) => await TrashBank.find({ citizenId: parent.id }).sort({ txnDate: -1 }),
    
    trashBalance: async (parent) => {
      const transactions = await TrashBank.find({ citizenId: parent.id });
      const totalDeposit = transactions.reduce((sum, txn) => sum + (txn.deposit || 0), 0);
      const totalWithdrawal = transactions.reduce((sum, txn) => sum + (txn.withdrawal || 0), 0);
      return totalDeposit - totalWithdrawal;
    }
  },
  
  Family: { 
    members: async (parent) => await Citizen.find({ familyId: parent.id }),
    payments: async (parent) => await Contribution.find({ familyId: parent.id }).sort({ paymentDate: -1 })
  },
  
  Health: { citizen: async (parent) => await Citizen.findById(parent.citizenId) },
  Contribution: { family: async (parent) => await Family.findById(parent.familyId) },
  TrashBank: { citizen: async (parent) => await Citizen.findById(parent.citizenId) },
  Insurance: { citizen: async (parent) => await Citizen.findById(parent.citizenId) }
};