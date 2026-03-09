// import User from './models/User.js';
// import jwt from 'jsonwebtoken';

// // Tambahkan role dan familyId ke dalam token agar aman
// const generateToken = (user) => {
//   return jwt.sign(
//     { id: user.id, role: user.role, familyId: user.familyId }, 
//     process.env.JWT_SECRET || 'RAHASIA_SI_RT_14', 
//     { expiresIn: '1d' }
//   );
// };

// export const resolvers = {
//   Query: {
//     users: async () => await User.find(),
//   },
//   Mutation: {
//     registerUser: async (_, { username, password, role, familyId }) => {
//       try {
//         const cleanUser = username.trim().toLowerCase();
        
//         // 1. Cek duplikasi
//         const existing = await User.findOne({ username: cleanUser });
//         if (existing) throw new Error("Username sudah terpakai kawan!");

//         // 2. Validasi Warga: Warga wajib punya familyId
//         if (role === 'warga' && !familyId) {
//           throw new Error("Warga wajib memiliki Family ID agar terhubung dengan data RT!");
//         }

//         const newUser = new User({ 
//           username: cleanUser, 
//           password, 
//           role, 
//           familyId: role === 'rt' ? null : familyId // RT tidak butuh familyId
//         });

//         await newUser.save();
//         return { success: true, message: `Berhasil daftar sebagai ${role}! Silakan login.` };
//       } catch (err) { 
//         throw new Error(err.message); 
//       }
//     },

//     login: async (_, { username, password }) => {
//       const input = username.trim().toLowerCase();
      
//       // A. LOGIKA LOGIN MANUAL ADMIN (Pintu Darurat)
//       if (input === "adminrt14" && password === "pengurusrt14") {
//         const adminData = { id: "admin_manual", username: "Admin RT 14", role: "rt", familyId: null };
//         return {
//           token: jwt.sign(adminData, 'RAHASIA_SI_RT_14', { expiresIn: '1d' }),
//           user: { ...adminData, createdAt: new Date().toISOString() }
//         };
//       }

//       // B. LOGIKA LOGIN DATABASE
//       const user = await User.findOne({ username: input });
      
//       if (user && (await user.matchPassword(password))) {
//         return { 
//           token: generateToken(user), 
//           user: {
//             id: user._id,
//             username: user.username,
//             role: user.role,
//             familyId: user.familyId, // Dikirim ke frontend agar bisa dipakai query data warga
//             createdAt: user.createdAt.toISOString()
//           }
//         };
//       }
      
//       throw new Error("Username atau Password salah kawan!");
//     }
//   }
// };



// import User from './models/User.js';
// import Citizen from './models/Citizen.js'; // WAJIB IMPORT INI KAWAN
// import jwt from 'jsonwebtoken';

// const generateToken = (user) => {
//   return jwt.sign(
//     { id: user.id, role: user.role, familyId: user.familyId }, 
//     process.env.JWT_SECRET || 'RAHASIA_SI_RT_14', 
//     { expiresIn: '1d' }
//   );
// };

// export const resolvers = {
//   Query: {
//     users: async () => await User.find(),
//   },
//   Mutation: {
//     registerUser: async (_, { username, email, password }) => {
//       try {
//         const cleanUser = username.trim().toLowerCase();
//         const cleanEmail = email.trim().toLowerCase();
        
//         // 1. CEK KE DATABASE WARGA (Verifikasi Email)
//         const citizen = await Citizen.findOne({ email: cleanEmail });
//         if (!citizen) {
//           throw new Error("Maaf kawan, Email anda tidak terdaftar di database RT 14. Silakan hubungi Pak RT!");
//         }

//         // 2. CEK APAKAH USERNAME/EMAIL SUDAH PUNYA AKUN
//         const existing = await User.findOne({ $or: [{ username: cleanUser }, { email: cleanEmail }] });
//         if (existing) throw new Error("Username atau Email sudah terdaftar kawan!");

//         // 3. BUAT USER BARU (Otomatis ambil familyId dari data Citizen)
//         const newUser = new User({ 
//           username: cleanUser, 
//           email: cleanEmail,
//           password, 
//           role: 'warga', 
//           familyId: citizen.familyId 
//         });

//         await newUser.save();
//         return { 
//           success: true, 
//           message: `Berhasil! Akun terhubung dengan keluarga ${citizen.name}. Silakan login.` 
//         };
//       } catch (err) { 
//         throw new Error(err.message); 
//       }
//     },

//     login: async (_, { identifier, password }) => {
//       const input = identifier.trim().toLowerCase();
      
//       // A. PINTU RAHASIA ADMIN (Identifier manual)
//       if (input === "adminrt14" && password === "pengurusrt14") {
//         const adminData = { id: "admin_manual", username: "Admin RT 14", email: "admin@rt14.com", role: "rt", familyId: null };
//         return {
//           token: jwt.sign(adminData, 'RAHASIA_SI_RT_14', { expiresIn: '1d' }),
//           user: { ...adminData, createdAt: new Date().toISOString() }
//         };
//       }

//       // B. LOGIN DATABASE (Bisa cari pakai Username atau Email)
//       const user = await User.findOne({ 
//         $or: [{ username: input }, { email: input }] 
//       });
      
//       if (user && (await user.matchPassword(password))) {
//         return { 
//           token: generateToken(user), 
//           user: {
//             id: user._id,
//             username: user.username,
//             email: user.email,
//             role: user.role,
//             familyId: user.familyId, 
//             createdAt: user.createdAt.toISOString()
//           }
//         };
//       }
      
//       throw new Error("Username/Email atau Password salah kawan!");
//     }
//   }
// };




// import User from './models/User.js';
// import Citizen from './models/Citizen.js'; // Sekarang filenya sudah ada!
// import jwt from 'jsonwebtoken';

// const generateToken = (user) => {
//   return jwt.sign(
//     { id: user.id, role: user.role, familyId: user.familyId }, 
//     process.env.JWT_SECRET || 'RAHASIA_SI_RT_14', 
//     { expiresIn: '1d' }
//   );
// };

// export const resolvers = {
//   Query: {
//     users: async () => await User.find(),
//   },
//   Mutation: {
//     registerUser: async (_, { username, email, password }) => {
//       try {
//         const cleanUser = username.trim().toLowerCase();
//         const cleanEmail = email.trim().toLowerCase();
        
//         // 1. CEK KE DATABASE WARGA (Buktikan dia warga RT 14)
//         const citizen = await Citizen.findOne({ email: cleanEmail });
//         if (!citizen) {
//           throw new Error("Pendaftaran Gagal: Email kawan tidak terdaftar di data RT 14!");
//         }

//         // 2. CEK DUPLIKASI AKUN
//         const existing = await User.findOne({ $or: [{ username: cleanUser }, { email: cleanEmail }] });
//         if (existing) throw new Error("Username atau Email tersebut sudah memiliki akun!");

//         // 3. BUAT USER (Otomatis link ke FamilyId milik warga tsb)
//         const newUser = new User({ 
//           username: cleanUser, 
//           email: cleanEmail,
//           password, 
//           role: 'warga', 
//           familyId: citizen.familyId 
//         });

//         await newUser.save();
//         return { 
//           success: true, 
//           message: `Berhasil! Akun terhubung dengan warga a/n ${citizen.name}.` 
//         };
//       } catch (err) { 
//         throw new Error(err.message); 
//       }
//     },

//     login: async (_, { identifier, password }) => {
//       const input = identifier.trim().toLowerCase();
      
//       // A. LOGIN ADMIN (IDENTIFIER MANUAL)
//       if (input === "adminrt14" && password === "pengurusrt14") {
//         const adminData = { id: "admin_manual", username: "Admin RT 14", email: "admin@rt14.com", role: "rt", familyId: null };
//         return {
//           token: jwt.sign(adminData, 'RAHASIA_SI_RT_14', { expiresIn: '1d' }),
//           user: { ...adminData, createdAt: new Date().toISOString() }
//         };
//       }

//       // B. LOGIN DATABASE (CARI VIA USERNAME ATAU EMAIL)
//       const user = await User.findOne({ $or: [{ username: input }, { email: input }] });
      
//       if (user && (await user.matchPassword(password))) {
//         return { 
//           token: generateToken(user), 
//           user: {
//             id: user._id,
//             username: user.username,
//             email: user.email,
//             role: user.role,
//             familyId: user.familyId, 
//             createdAt: user.createdAt.toISOString()
//           }
//         };
//       }
      
//       throw new Error("Username/Email atau Password salah kawan!");
//     }
//   }
// };






// import User from './models/User.js';
// import Citizen from './models/Citizen.js'; 
// import jwt from 'jsonwebtoken';

// export const resolvers = {
//   Query: {
//     users: async () => await User.find(),
//   },
//   Mutation: {
//     registerUser: async (_, { username, email, password }) => {
//       try {
//         const cleanUser = username.trim().toLowerCase();
//         const cleanEmail = email.trim().toLowerCase();
        
//         // 1. CEK KE DATABASE WARGA (Buktikan dia warga RT 14)
//         const citizen = await Citizen.findOne({ email: cleanEmail });
//         if (!citizen) {
//           throw new Error("Email anda tidak terdaftar di data RT 14. Silakan hubungi Pak RT!");
//         }

//         // 2. CEK DUPLIKASI
//         const existing = await User.findOne({ $or: [{ username: cleanUser }, { email: cleanEmail }] });
//         if (existing) throw new Error("Username atau Email sudah memiliki akun!");

//         // 3. SIMPAN (Otomatis ambil familyId dari database warga)
//         const newUser = new User({ 
//           username: cleanUser, 
//           email: cleanEmail,
//           password, 
//           role: 'warga', 
//           familyId: citizen.familyId 
//         });

//         await newUser.save();
//         return { success: true, message: `Berhasil! Akun terhubung dengan warga a/n ${citizen.name}.` };
//       } catch (err) { throw new Error(err.message); }
//     },

//     login: async (_, { identifier, password }) => {
//       const input = identifier.trim().toLowerCase();
      
//       // A. PINTU RAHASIA ADMIN (IDENTIFIER MANUAL)
//       if (input === "adminrt14" && password === "pengurusrt14") {
//         const adminData = { id: "admin_manual", username: "Admin RT 14", email: "admin@rt14.com", role: "rt", familyId: null };
//         return {
//           token: jwt.sign(adminData, 'RAHASIA_SI_RT_14', { expiresIn: '1d' }),
//           user: { ...adminData, createdAt: new Date().toISOString() }
//         };
//       }

//       // B. LOGIN DATABASE (Cari via Username atau Email)
//       const user = await User.findOne({ $or: [{ username: input }, { email: input }] });
      
//       if (user && (await user.matchPassword(password))) {
//         return { 
//           token: jwt.sign({ id: user.id, role: user.role }, 'RAHASIA_SI_RT_14', { expiresIn: '1d' }), 
//           user: {
//             id: user._id,
//             username: user.username,
//             email: user.email,
//             role: user.role,
//             familyId: user.familyId, 
//             createdAt: user.createdAt.toISOString()
//           }
//         };
//       }
//       throw new Error("Username/Email atau Password salah kawan!");
//     }
//   }
// };





// import User from './models/User.js';
// import Citizen from './models/Citizen.js'; 
// import jwt from 'jsonwebtoken';

// // Helper agar rapi kawan
// const SECRET_KEY = process.env.JWT_SECRET || 'RAHASIA_SI_RT_14';

// const generateToken = (user) => {
//   return jwt.sign(
//     { 
//       id: user.id || user._id, 
//       role: user.role, 
//       familyId: user.familyId // Sangat penting untuk otorisasi di service lain
//     }, 
//     SECRET_KEY, 
//     { expiresIn: '1d' }
//   );
// };

// export const resolvers = {
//   Query: {
//     users: async () => await User.find(),
//   },
//   Mutation: {
//     registerUser: async (_, { username, email, password }) => {
//       try {
//         const cleanUser = username.trim().toLowerCase();
//         const cleanEmail = email.trim().toLowerCase();
        
//         // 1. Verifikasi apakah dia warga RT 14 yang sah
//         const citizen = await Citizen.findOne({ email: cleanEmail });
//         if (!citizen) {
//           throw new Error("Maaf kawan, Email anda tidak terdaftar di data warga RT 14!");
//         }

//         // 2. Cek apakah sudah punya akun login
//         const existing = await User.findOne({ $or: [{ username: cleanUser }, { email: cleanEmail }] });
//         if (existing) throw new Error("Gagal: Username atau Email sudah terdaftar kawan!");

//         // 3. Buat User baru & hubungkan dengan FamilyId milik Citizen tersebut
//         const newUser = new User({ 
//           username: cleanUser, 
//           email: cleanEmail,
//           password, // Pastikan di model User kawan sudah ada pre-save hook untuk hashing!
//           role: 'warga', 
//           familyId: citizen.familyId 
//         });

//         await newUser.save();
//         return { success: true, message: `Aktivasi Berhasil! Akun terhubung dengan warga a/n ${citizen.name}.` };
//       } catch (err) { 
//         throw new Error(err.message); 
//       }
//     },

//     login: async (_, { identifier, password }) => {
//       const input = identifier.trim().toLowerCase();
      
//       // A. Login Admin Manual (Pintu Darurat)
//       if (input === "adminrt14" && password === "pengurusrt14") {
//         const adminData = { id: "admin_manual", username: "Admin RT 14", email: "admin@rt14.com", role: "rt", familyId: null };
//         return {
//           token: generateToken(adminData),
//           user: { ...adminData, createdAt: new Date().toISOString() }
//         };
//       }

//       // B. Login Database
//       const user = await User.findOne({ $or: [{ username: input }, { email: input }] });
      
//       if (user && (await user.matchPassword(password))) {
//         return { 
//           token: generateToken(user), 
//           user: {
//             id: user._id,
//             username: user.username,
//             email: user.email,
//             role: user.role,
//             familyId: user.familyId, 
//             createdAt: user.createdAt.toISOString()
//           }
//         };
//       }
//       throw new Error("Username/Email atau Password salah kawan!");
//     }
//   }
// };




import User from './models/User.js';
import Citizen from './models/Citizen.js'; // SEKARANG SUDAH BISA DI-IMPORT
import jwt from 'jsonwebtoken';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id || user._id, role: user.role, familyId: user.familyId }, 
    process.env.JWT_SECRET || 'RAHASIA_SI_RT_14', 
    { expiresIn: '1d' }
  );
};

export const resolvers = {
  Query: {
    users: async () => await User.find(),
  },
  Mutation: {
    registerUser: async (_, { username, email, password }) => {
      try {
        const cleanUser = username.trim().toLowerCase();
        const cleanEmail = email.trim().toLowerCase();
        
        // 1. VERIFIKASI: Apakah email ini ada di data warga RT 14?
        const citizen = await Citizen.findOne({ email: cleanEmail });
        if (!citizen) {
          throw new Error("Maaf kawan, Email anda tidak terdaftar di data RT 14. Silakan hubungi Pak RT!");
        }

        // 2. CEK DUPLIKASI: Apakah email/username sudah buat akun login?
        const existing = await User.findOne({ $or: [{ username: cleanUser }, { email: cleanEmail }] });
        if (existing) throw new Error("Gagal: Username atau Email sudah terdaftar kawan!");

        // 3. SIMPAN: Buat akun User & hubungkan ke FamilyId milik warga tersebut
        const newUser = new User({ 
          username: cleanUser, 
          email: cleanEmail,
          password, 
          role: 'warga', 
          familyId: citizen.familyId 
        });

        await newUser.save();
        return { 
          success: true, 
          message: `Berhasil! Akun terhubung dengan warga a/n ${citizen.name}.` 
        };
      } catch (err) { 
        throw new Error(err.message); 
      }
    },

    login: async (_, { identifier, password }) => {
      const input = identifier.trim().toLowerCase();
      
      // A. PINTU DARURAT ADMIN RT (Manual)
      if (input === "adminrt14" && password === "pengurusrt14") {
        const adminData = { id: "admin_manual", username: "Admin RT 14", email: "admin@rt14.com", role: "rt", familyId: null };
        return {
          token: jwt.sign(adminData, 'RAHASIA_SI_RT_14', { expiresIn: '1d' }),
          user: { ...adminData, createdAt: new Date().toISOString() }
        };
      }

      // B. LOGIN DATABASE (Cari via Username atau Email)
      const user = await User.findOne({ $or: [{ username: input }, { email: input }] });
      
      if (user && (await user.matchPassword(password))) {
        return { 
          token: generateToken(user), 
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            familyId: user.familyId, 
            createdAt: user.createdAt.toISOString()
          }
        };
      }
      throw new Error("Username/Email atau Password salah kawan!");
    }
  }
};