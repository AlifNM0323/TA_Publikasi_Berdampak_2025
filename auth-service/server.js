import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { typeDefs } from './type.js';     
import { resolvers } from './resolvers.js'; 
import User from './models/User.js'; // <-- Sudah diperbaiki!

dotenv.config();

const connectDB = async () => {
  try {
    // Pastikan MONGO_URI sudah di-set di .env file
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ Auth DB Connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error(`❌ Auth DB Error: ${err.message}`);
    process.exit(1);
  }
};

const startApp = async () => {
  await connectDB();

  const server = new ApolloServer({ typeDefs, resolvers });

  const { url } = await startStandaloneServer(server, {
    listen: { port: parseInt(process.env.PORT) || 4001 },
  });

  console.log(`🚀 AUTH SERVICE siap di: ${url}`);
};

startApp();