import Tesseract from 'tesseract.js';
import Citizen from './models/Citizen.js';
import Family from './models/Family.js';
import Health from './models/Health.js';
import Contribution from './models/Contribution.js';
import Insurance from './models/Insurance.js';
import TrashBank from './models/TrashBank.js';

const PRICE_LIST = {
  'Plastik': 3000,
  'Kertas/Kardus': 2000,
  'Logam/Besi': 5000,
  'Kaca': 1000
};

export const resolvers = {
  Query: {
    families: async () => await Family.find(),
    citizens: async () => await Citizen.find(),
    citizen: async (_, { id }) => await Citizen.findById(id),
    getFamilyById: async (_, { id }) => await Family.findById(id),
    getAllHealthRecords: async () => await Health.find().sort({ createdAt: -1 }),

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
    // --- SEMUA LOGIKA LOGIN SUDAH DIPINDAH KE AUTH_SERVICE ---
    
    // --- BANK SAMPAH ---
    addSetoranSampah: async (_, { citizenId, berat, kategori }) => {
      try {
        const citizen = await Citizen.findById(citizenId);
        if (!citizen) throw new Error("Warga tidak ditemukan");
        const family = await Family.findById(citizen.familyId);
        if (!family) throw new Error("Keluarga tidak ditemukan");

        const price = PRICE_LIST[kategori] || 0;
        const moneyEarned = berat * price;
        const newBalance = (family.balance || 0) + moneyEarned;

        const newEntry = new TrashBank({
          familyId: citizen.familyId, depositorName: citizen.name, trashType: kategori,
          weight: berat, pricePerKg: price, debit: moneyEarned, credit: 0, balance: newBalance, status: "SUCCESS"
        });
        const savedEntry = await newEntry.save();

        await Family.findByIdAndUpdate(citizen.familyId, {
          $inc: { totalTabungan: berat, balance: moneyEarned }
        });

        return { ...savedEntry._doc, id: savedEntry._id };
      } catch (error) { throw new Error(error.message); }
    },

    withdrawFund: async (_, { familyId, amount }) => {
      try {
        const family = await Family.findById(familyId);
        if (!family) throw new Error("Keluarga tidak ditemukan");
        if (family.balance < amount) throw new Error(`Saldo tidak cukup! Sisa: ${family.balance}`);

        const newBalance = family.balance - amount;
        const withdrawalEntry = new TrashBank({
          familyId: familyId, depositorName: family.kepalaKeluarga, trashType: 'PENCAIRAN_DANA',
          weight: 0, pricePerKg: 0, debit: 0, credit: amount, balance: newBalance, status: "SUCCESS"
        });
        const savedEntry = await withdrawalEntry.save();

        await Family.findByIdAndUpdate(familyId, { $inc: { balance: -amount } });
        return { ...savedEntry._doc, id: savedEntry._id };
      } catch (error) { throw new Error(error.message); }
    },

    deleteTrashLog: async (_, { id }) => {
      try {
        const log = await TrashBank.findById(id);
        if (!log) throw new Error("Riwayat transaksi tidak ditemukan");

        if (log.debit > 0) {
          await Family.findByIdAndUpdate(log.familyId, {
            $inc: { totalTabungan: -log.weight, balance: -log.debit }
          });
        } 
        else if (log.credit > 0) {
          await Family.findByIdAndUpdate(log.familyId, {
            $inc: { balance: log.credit }
          });
        }

        await TrashBank.findByIdAndDelete(id);
        return "Riwayat transaksi berhasil dihapus dan saldo diperbarui.";
      } catch (error) { throw new Error(error.message); }
    },

    // --- KELUARGA ---
    createFamily: async (_, args) => {
      try {
        const existing = await Family.findOne({ noKK: args.noKK });
        if (existing) throw new Error('Nomor KK sudah terdaftar!');
        return await new Family(args).save();
      } catch (error) { throw new Error(error.message); }
    },

    updateFamily: async (_, { id, ...updates }) => {
      try {
        return await Family.findByIdAndUpdate(id, updates, { new: true });
      } catch (error) { throw new Error(error.message); }
    },

    deleteFamily: async (_, { id }) => {
      try {
        await Citizen.deleteMany({ familyId: id });
        await Family.findByIdAndDelete(id);
        return "Keluarga berhasil dihapus";
      } catch (error) { throw new Error(error.message); }
    },

    // --- WARGA / CITIZEN ---
    addCitizen: async (_, args) => {
      try {
        const existing = await Citizen.findOne({ nik: args.nik });
        if (existing) throw new Error('NIK sudah terdaftar!');
        
        let finalStatus = args.relationship;
        if (args.relationship === "ANAK") {
          const count = await Citizen.countDocuments({ familyId: args.familyId, relationship: { $regex: /^Anak/i } });
          finalStatus = `Anak ${count + 1}`;
        }
        return await new Citizen({ ...args, relationship: finalStatus }).save();
      } catch (error) { throw new Error(error.message); }
    },

    updateCitizen: async (_, { id, ...updates }) => {
      try {
        const updated = await Citizen.findByIdAndUpdate(id, updates, { new: true });
        if (!updated) throw new Error("Warga tidak ditemukan");
        return updated;
      } catch (error) { throw new Error("Gagal update warga: " + error.message); }
    },

    deleteCitizen: async (_, { id }) => {
      try {
        await Citizen.findByIdAndDelete(id);
        return "Data warga berhasil dihapus.";
      } catch (error) { throw new Error(error.message); }
    },

    // --- LAINNYA ---
    updateFamilyWaste: async (_, { familyId, totalTabungan }) => {
      return await Family.findByIdAndUpdate(familyId, { totalTabungan }, { new: true });
    },
    deleteFamilyWaste: async (_, { familyId }) => {
      await Family.findByIdAndUpdate(familyId, { totalTabungan: 0, balance: 0 });
      return "Reset Berhasil";
    },

    processOCR: async (_, { imageBase64 }) => {
      try {
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const imageBuffer = Buffer.from(base64Data, 'base64');
        const { data: { text } } = await Tesseract.recognize(imageBuffer, 'ind');
        const nikMatch = text.match(/\d{12,16}/);
        return { nik: nikMatch ? nikMatch[0] : "Gagal", success: true, message: "OK" };
      } catch (e) { return { success: false, message: e.message }; }
    },

    addHealthRecord: async (_, args) => new Health(args).save(),
    updateHealthRecord: async (_, { id, ...upd }) => Health.findByIdAndUpdate(id, upd, { new: true }),
    deleteHealthRecord: async (_, { id }) => { await Health.findByIdAndDelete(id); return "Hapus sukses"; },
    
    payContribution: async (_, args) => new Contribution(args).save(),
    addInsurance: async (_, args) => new Insurance(args).save()
  },

  // --- FIELD RESOLVERS ---
  Family: {
    members: async (parent) => await Citizen.find({ familyId: parent.id }),
    payments: async (parent) => await Contribution.find({ familyId: parent.id })
  },
  Citizen: {
    family: async (parent) => await Family.findById(parent.familyId),
    healthData: async (parent) => await Health.findOne({ citizenId: parent.id }).sort({ createdAt: -1 }),
    healthHistory: async (parent) => await Health.find({ citizenId: parent.id }).sort({ createdAt: -1 }),
    insurances: async (parent) => await Insurance.find({ citizenId: parent.id })
  },
  Health: { citizen: async (p) => await Citizen.findById(p.citizenId) },
  TrashBank: { family: async (p) => await Family.findById(p.familyId) }
};