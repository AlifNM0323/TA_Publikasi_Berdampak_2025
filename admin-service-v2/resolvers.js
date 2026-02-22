import Tesseract from 'tesseract.js';
import Citizen from './models/Citizen.js';
import Family from './models/Family.js';
import Health from './models/Health.js';
import TrashBank from './models/TrashBank.js';
import Schedule from './models/Schedule.js';
import Contribution from './models/Contribution.js';
import Expense from './models/Expense.js';

export const resolvers = {
  Query: {
    families: async () => await Family.find(),
    citizens: async () => await Citizen.find(), // Bisa difilter di FE berdasarkan statusWarga
    citizen: async (_, { id }) => await Citizen.findById(id),
    getFamilyById: async (_, { id }) => await Family.findById(id),
    getAllHealthRecords: async () => await Health.find().sort({ createdAt: -1 }),
    getSchedules: async () => await Schedule.find().sort({ date: 1 }),

    // --- QUERY IURAN & KAS ---
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
          totalIn,
          totalOut,
          balance: totalIn - totalOut,
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
    }
  },

  Mutation: {
    // --- MUTASI WARGA ---
    mutateCitizen: async (_, { id, statusWarga, keteranganMutasi }) => {
      try {
        const updated = await Citizen.findByIdAndUpdate(
          id,
          { 
            $set: { 
              statusWarga, 
              keteranganMutasi, 
              tanggalMutasi: new Date().toISOString() 
            } 
          },
          { new: true }
        );
        return updated;
      } catch (error) { throw new Error("Gagal mutasi: " + error.message); }
    },

    // --- ALGORITMA BANK SAMPAH PINTAR ---
    addTrashDeposit: async (_, { citizenId, trashType, weight, pricePerKg }) => {
      try {
        const citizen = await Citizen.findById(citizenId);
        if (!citizen) throw new Error("Warga tidak ditemukan");
        const family = await Family.findById(citizen.familyId);
        if (!family) throw new Error("Data Keluarga tidak ditemukan");

        const moneyEarned = Math.round(weight * pricePerKg);
        const newBalance = (family.balance || 0) + moneyEarned;

        const newLog = new TrashBank({
          familyId: citizen.familyId,
          citizenId: citizen.id,
          depositorName: citizen.name,
          trashType: trashType,
          weight: weight,
          pricePerKg: pricePerKg,
          debit: moneyEarned,
          credit: 0,
          balance: newBalance,
          status: "SUCCESS",
          txnDate: new Date().toISOString()
        });
        const savedLog = await newLog.save();

        await Family.findByIdAndUpdate(citizen.familyId, {
          $inc: { 
            totalTabungan: weight, 
            balance: moneyEarned 
          }
        });

        return savedLog;
      } catch (error) { throw new Error("BE_ERROR: " + error.message); }
    },

    withdrawFund: async (_, { familyId, amount }) => {
        const family = await Family.findById(familyId);
        if (family.balance < amount) throw new Error(`Saldo tidak cukup!`);
        
        const withdrawalEntry = new TrashBank({
          familyId, 
          depositorName: family.kepalaKeluarga, 
          trashType: 'PENCAIRAN_DANA',
          weight: 0, pricePerKg: 0, debit: 0, credit: amount, 
          balance: family.balance - amount, 
          status: "SUCCESS",
          txnDate: new Date().toISOString()
        });
        
        await Family.findByIdAndUpdate(familyId, { $inc: { balance: -amount } });
        return await withdrawalEntry.save();
    },

    deleteTrashLog: async (_, { id }) => {
      await TrashBank.findByIdAndDelete(id);
      return "Log berhasil dihapus";
    },

    payContribution: async (_, args) => {
      const newEntry = new Contribution({
        ...args,
        paymentDate: new Date().toISOString()
      });
      return await newEntry.save();
    },

    addExpense: async (_, args) => {
      const newExp = new Expense({
        ...args,
        date: new Date().toISOString()
      });
      return await newExp.save();
    },

    deleteExpense: async (_, { id }) => {
      await Expense.findByIdAndDelete(id);
      return "Pengeluaran berhasil dihapus";
    },

    addHealthRecord: async (_, args) => {
      try {
        const newRecord = new Health({
          ...args,
          hpl: args.hpl ? new Date(args.hpl) : null
        });
        return await newRecord.save();
      } catch (error) { throw new Error("Gagal simpan: " + error.message); }
    },

    updateHealthRecord: async (_, { id, ...updates }) => {
      try {
        const dataToUpdate = { ...updates };
        if (updates.hpl) dataToUpdate.hpl = new Date(updates.hpl);
        else if (updates.hpl === "") dataToUpdate.hpl = null;

        const updated = await Health.findByIdAndUpdate(id, { $set: dataToUpdate }, { new: true });
        if (!updated) throw new Error("Data riwayat tidak ditemukan!");
        return updated;
      } catch (error) { throw new Error("BE_ERROR: " + error.message); }
    },

    deleteHealthRecord: async (_, { id }) => { 
      await Health.findByIdAndDelete(id); 
      return "Hapus sukses"; 
    },

    addCitizen: async (_, args) => {
      try {
        const existing = await Citizen.findOne({ nik: args.nik });
        if (existing) throw new Error('NIK sudah terdaftar!');
        
        let rel = args.relationship ? args.relationship.toUpperCase() : 'LAINNYA';
        if (rel === 'ANAK') {
          const count = await Citizen.countDocuments({ familyId: args.familyId, relationship: { $regex: /^Anak/i } });
          args.relationship = `Anak ${count + 1}`;
        }
        return await new Citizen(args).save();
      } catch (error) { throw new Error(error.message); }
    },

    updateCitizen: async (_, { id, ...updates }) => await Citizen.findByIdAndUpdate(id, updates, { new: true }),
    deleteCitizen: async (_, { id }) => { await Citizen.findByIdAndDelete(id); return "Terhapus"; },

    createFamily: async (_, args) => await new Family(args).save(),
    updateFamily: async (_, { id, ...updates }) => await Family.findByIdAndUpdate(id, updates, { new: true }),
    deleteFamily: async (_, { id }) => {
      await Citizen.deleteMany({ familyId: id });
      await Family.findByIdAndDelete(id);
      return "Keluarga berhasil dihapus";
    },

    addSchedule: async (_, args) => {
        const newSchedule = new Schedule({ ...args, date: new Date(args.date) });
        return await newSchedule.save();
    },
    deleteSchedule: async (_, { id }) => { await Schedule.findByIdAndDelete(id); return "Terhapus"; },

    processOCR: async (_, { imageBase64 }) => {
      try {
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const { data: { text } } = await Tesseract.recognize(Buffer.from(base64Data, 'base64'), 'ind');
        const nikMatch = text.match(/\d{12,16}/);
        return { nik: nikMatch ? nikMatch[0] : "Gagal", success: true, message: "OK" };
      } catch (e) { return { success: false, message: e.message }; }
    }
  },

  Family: {
    members: async (parent) => await Citizen.find({ familyId: parent.id }).sort({ createdAt: 1 }),
    payments: async (parent) => await Contribution.find({ familyId: parent.id })
  },
  Citizen: {
    family: async (parent) => await Family.findById(parent.familyId),
    healthData: async (parent) => await Health.findOne({ citizenId: parent.id }).sort({ createdAt: -1 }),
    healthHistory: async (parent) => await Health.find({ citizenId: parent.id }).sort({ createdAt: -1 }),
    age: (parent) => {
      if (!parent.dateOfBirth) return 0;
      const dob = new Date(parent.dateOfBirth);
      return Math.abs(new Date(Date.now() - dob.getTime()).getUTCFullYear() - 1970);
    }
  },
  Health: { citizen: async (parent) => await Citizen.findById(parent.citizenId) },
  TrashBank: { family: async (parent) => await Family.findById(parent.familyId) },
  Contribution: { family: async (parent) => await Family.findById(parent.familyId) }
};