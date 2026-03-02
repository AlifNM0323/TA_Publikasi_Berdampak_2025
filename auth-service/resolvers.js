import User from './models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'RAHASIA', { expiresIn: '1d' });

export const resolvers = {
  Query: {
    users: async () => await User.find(),
  },
  Mutation: {
    registerUser: async (_, { username, password, role }) => {
      try {
        const cleanUser = username.trim().toLowerCase();
        const existing = await User.findOne({ username: cleanUser });
        if (existing) throw new Error("Username sudah ada kawan!");

        const newUser = new User({ username: cleanUser, password, role });
        await newUser.save();
        return { success: true, message: "Berhasil daftar! Silakan login." };
      } catch (err) { throw new Error(err.message); }
    },
    login: async (_, { username, password }) => {
      const input = username.trim().toLowerCase();
      // Pintu Rahasia Pak RT
      if (input === "adminrt14" && password === "pengurusrt14") {
        return {
          token: generateToken("admin_manual"),
          user: { id: "admin_manual", username: "Admin RT 14", role: "rt", createdAt: new Date().toISOString() }
        };
      }
      const user = await User.findOne({ username: input });
      if (user && (await user.matchPassword(password))) {
        return { token: generateToken(user._id), user };
      }
      throw new Error("Username atau Password salah!");
    }
  }
};