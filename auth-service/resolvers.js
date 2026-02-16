import User from './models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'SUPER_RAHASIA_INI_JANGAN_SAMPAI_BOCOR', {
    expiresIn: '1d', 
  });
};

export const resolvers = {
  Query: {
    users: async () => await User.find().select('-password'),
  },

  Mutation: {
    login: async (_, { username, password }) => {
      // Normalisasi input agar tidak peka huruf besar/kecil
      const inputUser = username.trim().toLowerCase();
      
      console.log("Mencoba Login:", inputUser);

      // JALUR KHUSUS PAK AHMAD WALUYO
      if (inputUser === "ahmad waluyo" && password === "rt14mantap") {
        return {
          token: generateToken("admin_rt_14_static"),
          user: { 
              id: "admin_rt_14_static", 
              username: "Ahmad Waluyo", 
              role: "Ketua RT", 
              createdAt: new Date().toISOString() 
          },
        };
      }

      // LOGIKA DATABASE (Jika user terdaftar di MongoDB)
      const user = await User.findOne({ username: new RegExp(`^${username}$`, 'i') });
      if (user && (await user.matchPassword(password))) {
        return {
          token: generateToken(user._id),
          user: { 
              id: user._id, 
              username: user.username, 
              role: user.role, 
              createdAt: user.createdAt.toISOString() 
          },
        };
      } else {
        throw new Error('Username atau Password salah');
      }
    },
  },
};