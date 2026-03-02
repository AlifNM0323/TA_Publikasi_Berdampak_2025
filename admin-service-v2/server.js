import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { parse } from 'graphql';
import SubgraphPkg from '@apollo/subgraph';
const { buildSubgraphSchema } = SubgraphPkg;

import { typeDefs } from './type.js';
import { resolvers } from './resolvers.js';

dotenv.config();

const startApp = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`✅ Admin DB Terhubung kawan!`);

  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs: parse(typeDefs), resolvers }),
  });

  await server.start();

  app.use(
    '/graphql',
    cors(),
    express.json({ limit: '50mb' }), 
    expressMiddleware(server)
  );

  // --- PERUBAHAN DI SINI: GUNAKAN PORT 4001 ---
  await new Promise((resolve) => httpServer.listen({ port: 4001, host: '0.0.0.0' }, resolve));
  console.log(`🚀 Admin Service V2 Siap di: http://localhost:4001/graphql`);
};

startApp();