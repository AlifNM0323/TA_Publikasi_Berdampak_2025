import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { typeDefs } from './type.js';
import { resolvers } from './resolvers.js';

dotenv.config();

// Koneksi Database
const connectDB = async () => {
  try {
    // Hanya mengandalkan variabel ENV yang di-set Docker
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Terkoneksi: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ Gagal Konek DB: ${err.message}`);
    process.exit(1);
  }
};

// Jalankan Server
const startApp = async () => {
  await connectDB();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀 Server RT Admin siap di: ${url}`);
};

startApp();