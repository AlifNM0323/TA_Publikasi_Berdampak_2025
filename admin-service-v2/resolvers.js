import Tesseract from 'tesseract.js';
import Citizen from './models/Citizen.js';
import Family from './models/Family.js';
import Health from './models/Health.js';
import Contribution from './models/Contribution.js';
import Insurance from './models/Insurance.js';

export const resolvers = {
  Query: {
    families: async () => await Family.find(),
    citizens: async () => await Citizen.find(),
    citizen: async (_, { id }) => await Citizen.findById(id),
    getFamilyById: async (_, { id }) => await Family.findById(id),
    
    getAllHealthRecords: async () => {
      return await Health.find().sort({ createdAt: -1 });
    },

    // --- LOGIKA STATISTIK GRAFIK (BARU) ---
    getHealthStats: async () => {
      try {
        const stats = await Health.aggregate([
          {
            $group: {
              _id: "$healthStatus", // Group berdasarkan field healthStatus
              count: { $sum: 1 }     // Hitung totalnya
            }
          }
        ]);
        
        // Map hasil MongoDB (_id) ke format GraphQL (status)
        return stats.map(s => ({
          status: s._id || "UNKNOWN",
          count: s.count
        }));
      } catch (error) { throw new Error(error.message); }
    }
  },

  Mutation: {
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
      try {
        return await Citizen.findByIdAndUpdate(id, updates, { new: true });
      } catch (error) { throw new Error(error.message); }
    },

    addHealthRecord: async (_, args) => {
      try {
        const newRecord = new Health(args);
        return await newRecord.save();
      } catch (error) { throw new Error(error.message); }
    },

    updateHealthRecord: async (_, { id, ...updates }) => {
      try {
        const updated = await Health.findByIdAndUpdate(id, updates, { new: true });
        return updated;
      } catch (error) { throw new Error(error.message); }
    },

    deleteHealthRecord: async (_, { id }) => {
      try {
        await Health.findByIdAndDelete(id);
        return "Data pemeriksaan berhasil dihapus.";
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
    }
  },

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
    citizen: async (parent) => {
      const id = parent.citizenId;
      if (id && id.name) return id; 
      return await Citizen.findById(id);
    }
  }
};