// File: api-gateway/server.js
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway';
import dotenv from 'dotenv';

dotenv.config();

// 1. Konfigurasi Gateway (Gabungin Auth & Admin)
const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: 'auth', url: 'http://localhost:4001/' },
      { name: 'admin', url: 'http://localhost:4000/' },
    ],
  }),
});

// 2. Instance Server
const server = new ApolloServer({
  gateway,
});

// 3. Jalankan Server
const startGateway = async () => {
  try {
    const { url } = await startStandaloneServer(server, {
      listen: { 
        port: parseInt(process.env.PORT) || 4002 
      },
      
      // --- CORS CONFIGURATION (PENTING BUAT FRONTEND) ---
      cors: {
        origin: [
          "http://localhost:3000",       // Frontend React Default
          "http://127.0.0.1:3000",       // Frontend IP
          "https://studio.apollographql.com" // Apollo Sandbox
        ],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: ["GET", "POST", "OPTIONS"],
      },

      // --- CONTEXT (PENTING BUAT TOKEN) ---
      // Meneruskan headers (termasuk token) dari Frontend ke Service di bawahnya
      context: async ({ req }) => ({ headers: req.headers }),
    });

    console.log(`🚀 API GATEWAY siap di: ${url}`);
    console.log(`(Routing ke Admin:4000, Auth:4001)`);
    
  } catch (error) {
    console.error("❌ Gagal menjalankan Gateway:", error);
  }
};

startGateway();