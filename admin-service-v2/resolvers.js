import Tesseract from 'tesseract.js';
import Citizen from './models/Citizen.js';
import Family from './models/Family.js';
import Health from './models/Health.js';
import Contribution from './models/Contribution.js';
import Insurance from './models/Insurance.js';
import TrashBank from './models/TrashBank.js';

// KONFIGURASI HARGA (Bisa diubah sesuai kebijakan RT)
const PRICE_LIST = {
  'Plastik': 3000,       // Rp 3.000 / kg
  'Kertas/Kardus': 2000, // Rp 2.000 / kg
  'Logam/Besi': 5000,    // Rp 5.000 / kg
  'Kaca': 1000           // Rp 1.000 / kg
};

export const resolvers = {
  Query: {
    families: async () => await Family.find(),
    citizens: async () => await Citizen.find(),
    citizen: async (_, { id }) => await Citizen.findById(id),
    getFamilyById: async (_, { id }) => await Family.findById(id),
    
    getAllHealthRecords: async () => {
      return await Health.find().sort({ createdAt: -1 });
    },

    // --- LOGIKA STATISTIK LENGKAP ---
    sampahStats: async () => {
      try {
        const families = await Family.find();
        // Hitung total berat
        const totalBerat = families.reduce((sum, f) => sum + (f.totalTabungan || 0), 0);
        // Hitung total uang yang dipegang warga
        const totalUang = families.reduce((sum, f) => sum + (f.balance || 0), 0);
        // Hitung KK aktif
        const totalKKAktif = families.filter(f => (f.totalTabungan || 0) > 0).length;
        
        return { totalBerat, totalKKAktif, totalUang };
      } catch (error) { throw new Error(error.message); }
    },

    allTrashLogs: async () => {
      return await TrashBank.find().sort({ txnDate: -1 });
    },

    getHealthStats: async () => {
      try {
        const stats = await Health.aggregate([
          { $group: { _id: "$healthStatus", count: { $sum: 1 } } }
        ]);
        return stats.map(s => ({
          status: s._id || "UNKNOWN",
          count: s.count
        }));
      } catch (error) { throw new Error(error.message); }
    },

    // FITUR SCAN QR
    getFamilyByQR: async (_, { qrCode }) => {
      const family = await Family.findOne({ qrCode });
      if (!family) throw new Error("QR Code tidak valid / Keluarga tidak ditemukan");
      return family;
    }
  },

  Mutation: {
    // --- 1. SETOR SAMPAH (UANG MASUK / DEBIT) ---
    addSetoranSampah: async (_, { citizenId, berat, kategori }) => {
      try {
        // A. Cari Data
        const citizen = await Citizen.findById(citizenId);
        if (!citizen) throw new Error("Warga tidak ditemukan");
        
        const family = await Family.findById(citizen.familyId);
        if (!family) throw new Error("Keluarga tidak ditemukan");

        // B. Hitung Uang
        const price = PRICE_LIST[kategori] || 0;
        const moneyEarned = berat * price;
        const currentBalance = family.balance || 0;
        const newBalance = currentBalance + moneyEarned;

        // C. Simpan Ledger (DEBIT)
        const newEntry = new TrashBank({
          familyId: citizen.familyId,
          depositorName: citizen.name,
          trashType: kategori,
          weight: berat,
          pricePerKg: price,
          debit: moneyEarned,   // Uang Masuk
          credit: 0,
          balance: newBalance,  // Saldo setelah transaksi
          status: "SUCCESS"
        });
        const savedEntry = await newEntry.save();

        // D. Update Keluarga ($inc berat dan balance)
        await Family.findByIdAndUpdate(citizen.familyId, {
          $inc: { 
            totalTabungan: berat, 
            balance: moneyEarned 
          }
        });

        return { ...savedEntry._doc, id: savedEntry._id };
      } catch (error) { throw new Error(error.message); }
    },

    // --- 2. PENCAIRAN DANA (UANG KELUAR / CREDIT) ---
    withdrawFund: async (_, { familyId, amount }) => {
      try {
        const family = await Family.findById(familyId);
        if (!family) throw new Error("Keluarga tidak ditemukan");

        // Cek Saldo Cukup?
        if (family.balance < amount) {
          throw new Error(`Saldo tidak cukup! Sisa saldo: Rp ${family.balance}`);
        }

        const newBalance = family.balance - amount;

        // Simpan Ledger (CREDIT)
        const withdrawalEntry = new TrashBank({
          familyId: familyId,
          depositorName: family.kepalaKeluarga, // Yang ambil biasanya KK
          trashType: 'PENCAIRAN_DANA',
          weight: 0,
          pricePerKg: 0,
          debit: 0,
          credit: amount,       // Uang Keluar
          balance: newBalance,
          status: "SUCCESS"
        });
        const savedEntry = await withdrawalEntry.save();

        // Potong Saldo Keluarga
        await Family.findByIdAndUpdate(familyId, {
          $inc: { balance: -amount }
        });

        return { ...savedEntry._doc, id: savedEntry._id };
      } catch (error) { throw new Error(error.message); }
    },

    updateFamilyWaste: async (_, { familyId, totalTabungan }) => {
      try {
        return await Family.findByIdAndUpdate(familyId, { totalTabungan }, { new: true });
      } catch (error) { throw new Error(error.message); }
    },

    deleteFamilyWaste: async (_, { familyId }) => {
      try {
        // Reset Berat & Saldo jadi 0
        await Family.findByIdAndUpdate(familyId, { totalTabungan: 0, balance: 0 });
        return "Tabungan keluarga berhasil direset.";
      } catch (error) { throw new Error(error.message); }
    },

    // --- MUTASI LAINNYA ---
    processOCR: async (_, { imageBase64 }) => {
      try {
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const imageBuffer = Buffer.from(base64Data, 'base64');
        const { data: { text } } = await Tesseract.recognize(imageBuffer, 'ind');
        const nikMatch = text.match(/\d{12,16}/);
        return { 
          nik: nikMatch ? nikMatch[0] : "NIK tidak terbaca", 
          success: true, 
          message: "Ekstraksi berhasil." 
        };
      } catch (error) { return { success: false, message: error.message }; }
    },

    createFamily: async (_, args) => {
      try {
        const existing = await Family.findOne({ noKK: args.noKK });
        if (existing) throw new Error('Nomor KK sudah terdaftar!');
        return await new Family(args).save();
      } catch (error) { throw new Error(error.message); }
    },

    updateFamily: async (_, { id, ...updates }) => {
      try {
        const updated = await Family.findByIdAndUpdate(id, updates, { new: true });
        if (!updated) throw new Error("Keluarga tidak ditemukan");
        return updated;
      } catch (error) { throw new Error(error.message); }
    },

    addCitizen: async (_, args) => {
      try {
        const existing = await Citizen.findOne({ nik: args.nik });
        if (existing) throw new Error('NIK sudah terdaftar!');
        let finalStatus = args.relationship;
        if (args.relationship === "ANAK") {
          const count = await Citizen.countDocuments({
            familyId: args.familyId,
            relationship: { $regex: /^Anak/i }
          });
          finalStatus = `Anak ${count + 1}`;
        }
        return await new Citizen({ ...args, relationship: finalStatus }).save();
      } catch (error) { throw new Error(error.message); }
    },

    updateCitizen: async (_, { id, ...updates }) => {
      try { return await Citizen.findByIdAndUpdate(id, updates, { new: true });
      } catch (error) { throw new Error(error.message); }
    },

    addHealthRecord: async (_, args) => {
      try { return await new Health(args).save();
      } catch (error) { throw new Error(error.message); }
    },

    updateHealthRecord: async (_, { id, ...updates }) => {
      try { return await Health.findByIdAndUpdate(id, updates, { new: true });
      } catch (error) { throw new Error(error.message); }
    },

    deleteHealthRecord: async (_, { id }) => {
      try { await Health.findByIdAndDelete(id); return "Data pemeriksaan berhasil dihapus.";
      } catch (error) { throw new Error(error.message); }
    },

    deleteFamily: async (_, { id }) => {
      try {
        await Citizen.deleteMany({ familyId: id });
        await Family.findByIdAndDelete(id);
        return "Keluarga dan seluruh anggotanya berhasil dihapus.";
      } catch (error) { throw new Error(error.message); }
    },

    deleteCitizen: async (_, { id }) => {
      await Citizen.findByIdAndDelete(id);
      return "Data warga berhasil dihapus.";
    },

    payContribution: async (_, args) => {
      return await new Contribution(args).save();
    },

    addInsurance: async (_, args) => {
      return await new Insurance(args).save();
    }
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
  Health: {
    citizen: async (parent) => await Citizen.findById(parent.citizenId)
  },
  TrashBank: {
    family: async (parent) => await Family.findById(parent.familyId)
  }
};