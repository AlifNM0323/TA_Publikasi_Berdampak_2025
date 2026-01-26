// File: admin-service-v2/server.js
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { parse } from 'graphql';

import SubgraphPkg from '@apollo/subgraph';
const { buildSubgraphSchema } = SubgraphPkg;

import { typeDefs } from './type.js';
import { resolvers } from './resolvers.js';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Terkoneksi: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ Gagal Konek DB: ${err.message}`);
    process.exit(1);
  }
};

const startApp = async () => {
  await connectDB();

  const server = new ApolloServer({
    
    schema: buildSubgraphSchema({ 
      typeDefs: parse(typeDefs), 
      resolvers 
    }),
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀 Server RT Admin siap di: ${url}`);
};

startApp();

