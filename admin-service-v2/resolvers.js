import Citizen from './models/Citizen.js';
import Family from './models/Family.js';
import Health from './models/Health.js';
import Contribution from './models/Contribution.js';
import TrashBank from './models/TrashBank.js';
import Insurance from './models/Insurance.js'; // <-- IMPORT BARU

export const resolvers = {
  Query: {
    // ... Queries lama biarkan sama ...
    families: async () => await Family.find(),
    citizens: async () => await Citizen.find(),
    getAllHealthRecords: async () => await Health.find(),
    getAllContributions: async () => await Contribution.find().sort({ createdAt: -1 }),
    getAllTrashTransactions: async () => await TrashBank.find().sort({ txnDate: -1 }),

    // Query Baru
    getInsurancesByCitizenId: async (_, { citizenId }) => {
      return await Insurance.find({ citizenId });
    }
  },

  Mutation: {
    // ... Mutation lama biarkan sama (Create/Update/Delete) ...
    createFamily: async (_, args) => { /* ... */ },
    addCitizen: async (_, args) => { /* ... */ },
    updateCitizen: async (_, { id, ...updates }) => { /* ... */ },
    deleteCitizen: async (_, { id }) => { 
      await Citizen.findByIdAndDelete(id);
      await Health.findOneAndDelete({ citizenId: id });
      await Insurance.deleteMany({ citizenId: id }); // Hapus semua asuransi warga ini
      return "Data Warga dihapus";
    },
    addHealthRecord: async (_, args) => { /* ... */ },
    payContribution: async (_, args) => { /* ... */ },
    addTrashDeposit: async (_, args) => { /* ... */ },
    
    // --- MUTATION BARU: TAMBAH ASURANSI ---
    addInsurance: async (_, args) => {
      // Cek Warga Ada Gak?
      const citizenExists = await Citizen.findOne({ _id: args.citizenId });
      if (!citizenExists) throw new Error("Warga tidak ditemukan!");

      // Cek Asuransi Sudah Ada? (Berdasarkan nomor polis)
      const existingPolicy = await Insurance.findOne({ insuranceNumber: args.insuranceNumber });
      if (existingPolicy) throw new Error("Nomor polis asuransi ini sudah terdaftar!");

      const newInsurance = new Insurance(args);
      return await newInsurance.save();
    }
  },

  // --- RELASI (MAGIC) ---
  Citizen: {
    family: async (parent) => await Family.findOne({ _id: parent.familyId }),
    healthData: async (parent) => await Health.findOne({ citizenId: parent.id }),
    trashTransactions: async (parent) => await TrashBank.find({ citizenId: parent.id }),
    trashBalance: async (parent) => { /* Logic perhitungan saldo */ },
    // Relasi Baru: Citizen -> Insurance
    insurances: async (parent) => await Insurance.find({ citizenId: parent.id }) 
  },
  
  Family: { 
    members: async (parent) => await Citizen.find({ familyId: parent.id }),
    payments: async (parent) => await Contribution.find({ familyId: parent.id })
  },
  
  Health: { citizen: async (parent) => await Citizen.findOne({ _id: parent.citizenId }) },
  Contribution: { family: async (parent) => await Family.findOne({ _id: parent.familyId }) },
  TrashBank: { citizen: async (parent) => await Citizen.findOne({ _id: parent.citizenId }) },

  // Relasi Baru: Insurance -> Citizen
  Insurance: {
    citizen: async (parent) => await Citizen.findOne({ _id: parent.citizenId })
  }
};