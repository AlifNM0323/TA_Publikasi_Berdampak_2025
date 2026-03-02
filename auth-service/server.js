import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { buildSubgraphSchema } from '@apollo/subgraph'; // <--- PASTIKAN INI SUBGRAPH
import { parse } from 'graphql';
import { typeDefs } from './type.js';
import { resolvers } from './resolvers.js';

dotenv.config();

const startAuth = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const server = new ApolloServer({
      schema: buildSubgraphSchema({ typeDefs: parse(typeDefs), resolvers })
    });

    const { url } = await startStandaloneServer(server, {
      listen: { port: 4002, host: '0.0.0.0' }, // <--- PORT 4002
    });
    console.log(`✅ Auth Service SiRT 14 SIAP di: ${url}`);
  } catch (err) {
    console.error("❌ Auth Gagal Start:", err.message);
  }
};
startAuth();