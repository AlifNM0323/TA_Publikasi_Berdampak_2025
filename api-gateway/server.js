import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const startGateway = async () => {
  const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
      subgraphs: [
        { name: 'auth', url: 'http://localhost:4002/graphql' }, 
        { name: 'admin', url: 'http://localhost:4001/graphql' },
      ],
    }),
  });

  const app = express();
  const server = new ApolloServer({ gateway });

  await server.start();

  // FIX: Limit ditingkatkan ke 50MB agar Scan KK berhasil
  app.use(
    '/graphql',
    cors(),
    express.json({ limit: '50mb' }),
    expressMiddleware(server)
  );

  app.listen(4000, '0.0.0.0', () => {
    console.log(`🚀 API GATEWAY AKTIF di http://localhost:4000/graphql`);
  });
};

startGateway();