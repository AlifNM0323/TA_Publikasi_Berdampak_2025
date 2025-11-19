import User from './models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d', 
  });
};

export const resolvers = {
  Query: {
    users: async () => await User.find().select('-password'),
  },

  Mutation: {
    // 1. REGISTER
    register: async (_, { username, password, role }) => {
      const userExists = await User.findOne({ username });
      if (userExists) {
        throw new Error('Username sudah terdaftar.');
      }
      
      const user = await User.create({ username, password, role: role || 'warga' });

      return {
        token: generateToken(user._id),
        user: { 
            id: user._id, 
            username: user.username, 
            role: user.role, 
            createdAt: user.createdAt 
        },
      };
    },

    // 2. LOGIN
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });

      if (user && (await user.matchPassword(password))) {
        return {
          token: generateToken(user._id),
          user: { 
            id: user._id, 
            username: user.username, 
            role: user.role, 
            createdAt: user.createdAt 
          },
        };
      } else {
        throw new Error('Username atau Password salah');
      }
    },
  },
};