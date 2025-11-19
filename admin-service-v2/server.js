import express from 'express';
import { ApolloServer } from 'apollo-server-express';

// Definisikan skema GraphQL
const typeDefs = `
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello, Apollo Server!',
  },
};

// Inisialisasi Express app
const app = express();

// Inisialisasi Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

// Mulai Apollo Server di port 4000
server.start().then(() => {
  server.applyMiddleware({ app, path: '/graphql' });

  // Menjalankan Express di port 3000
  app.listen(3000, () => {
    console.log('Server Express berjalan di http://localhost:3000');
  });

  // Menjalankan Apollo Server di port 4000
  app.listen(4000, () => {
    console.log('Apollo Server berjalan di http://localhost:4000/graphql');
  });
});
