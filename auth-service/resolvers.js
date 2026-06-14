import User from './models/User.js';
import Citizen from './models/Citizen.js'; 
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
        
        
        const citizen = await Citizen.findOne({ email: cleanEmail });
        if (!citizen) {
          throw new Error("Maaf kawan, Email anda tidak terdaftar di data RT 14. Silakan hubungi Pak RT!");
        }

        
        const existing = await User.findOne({ $or: [{ username: cleanUser }, { email: cleanEmail }] });
        if (existing) throw new Error("Gagal: Username atau Email sudah terdaftar kawan!");

       
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
      
      
      if (input === "adminrt14" && password === "pengurusrt14") {
        const adminData = { id: "admin_manual", username: "Admin RT 14", email: "admin@rt14.com", role: "rt", familyId: null };
        return {
          token: jwt.sign(adminData, 'RAHASIA_SI_RT_14', { expiresIn: '1d' }),
          user: { ...adminData, createdAt: new Date().toISOString() }
        };
      }

      
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