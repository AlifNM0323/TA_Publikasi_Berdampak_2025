// File: api-gateway/server.js
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway';
import dotenv from 'dotenv';

dotenv.config();

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
       { name: 'auth', url: 'http://localhost:4001/' },
       { name: 'admin', url: 'http://localhost:4000/' },
    ],
  }),
});

const server = new ApolloServer({ gateway });

const startGateway = async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: parseInt(process.env.PORT) || 4002 },
  });
  console.log(`🚀 API GATEWAY siap di: ${url}`);
};

startGateway();