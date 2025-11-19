const { gql } = require('apollo-server'); // Atau 'apollo-server-express'

const typeDefs = gql`
  # 1. Bentuk Data Citizen sesuai Model Mongoose
  type Citizen {
    id: ID!                 # _id dari MongoDB
    citizen_id: String
    family_id: String
    contribution_id: String
    name: String
    nik: String
    gender: String
    religion: String
    address: String
    profession: String
    place_of_birth: String
    date_of_birth: String   # Kita gunakan String (ISO format) untuk tanggal agar simpel
  }

  # 2. Query (Pengganti GET)
  type Query {
    citizens: [Citizen]           # Get All
    citizen(id: ID!): Citizen     # Get One by ID
  }

  # 3. Mutation (Pengganti POST, PUT, DELETE)
  type Mutation {
    addCitizen(
      citizen_id: String
      family_id: String
      contribution_id: String
      name: String
      nik: String!
      gender: String
      religion: String
      address: String
      profession: String
      place_of_birth: String
      date_of_birth: String
    ): Citizen

    updateCitizen(
      id: ID!
      name: String
      nik: String
      gender: String
      religion: String
      address: String
      profession: String
      place_of_birth: String
      date_of_birth: String
    ): Citizen

    deleteCitizen(id: ID!): String
  }
`;


const Citizen = require('./models/Citizen'); // Import model Anda

const resolvers = {
  Query: {
    // READ: Menampilkan semua citizen
    citizens: async () => {
      try {
        const data = await Citizen.find();
        return data;
      } catch (err) {
        throw new Error(err.message);
      }
    },

    // READ: Menampilkan citizen berdasarkan ID
    citizen: async (_, args) => {
      try {
        const data = await Citizen.findById(args.id);
        if (!data) throw new Error('Citizen tidak ditemukan');
        return data;
      } catch (err) {
        throw new Error(err.message);
      }
    },
  },

  Mutation: {
    // CREATE: Menambahkan citizen baru
    addCitizen: async (_, args) => {
      // Logika cek NIK dari kode Express Anda
      const existingCitizen = await Citizen.findOne({ nik: args.nik });
      if (existingCitizen) {
        throw new Error('NIK sudah terdaftar, silakan gunakan NIK yang berbeda');
      }

      const newCitizen = new Citizen({
        ...args // Mengambil semua input dari args
      });

      try {
        const res = await newCitizen.save();
        return res; // GraphQL akan otomatis memetakan _id ke id
      } catch (err) {
        throw new Error(err.message);
      }
    },

    // UPDATE: Memperbarui citizen
    updateCitizen: async (_, args) => {
      const { id, ...updates } = args; // Pisahkan ID dari data update

      try {
        const updatedCitizen = await Citizen.findByIdAndUpdate(
          id,
          updates,
          { new: true } // Return data terbaru
        );
        
        if (!updatedCitizen) throw new Error('Citizen tidak ditemukan');
        return updatedCitizen;
      } catch (err) {
        throw new Error(err.message);
      }
    },

    // DELETE: Menghapus citizen
    deleteCitizen: async (_, args) => {
      try {
        const deletedCitizen = await Citizen.findByIdAndDelete(args.id);
        if (!deletedCitizen) throw new Error('Citizen tidak ditemukan');
        return "Citizen berhasil dihapus";
      } catch (err) {
        throw new Error(err.message);
      }
    },
  },
};

module.exports = { typeDefs, resolvers };