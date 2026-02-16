import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloGateway, IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';

// 1. Class untuk meneruskan Header (Penting agar Token & Header Ngrok sampai ke Microservices)
class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {
    if (context.headers) {
      // Teruskan semua header dari context Frontend ke subgraphs
      Object.keys(context.headers).forEach((key) => {
        request.http.headers.set(key, context.headers[key]);
      });
    }
  }
}

// 2. Konfigurasi Gateway
const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: 'auth', url: 'http://localhost:4001/graphql' }, 
      { name: 'admin', url: 'http://localhost:4000/graphql' },
    ],
  }),
  buildService({ url }) {
    return new AuthenticatedDataSource({ url });
  },
});

// 3. Instance Apollo Server
const server = new ApolloServer({ gateway });

// 4. Membungkus Server dalam fungsi startGateway agar bisa dipanggil
const startGateway = async () => {
  try {
    const { url } = await startStandaloneServer(server, {
      listen: { port: 4002 },
      cors: {
        origin: "*", // Izinkan sementara untuk mempermudah testing
        credentials: true,
        // Mendukung header khusus Ngrok dan Authorization
        allowedHeaders: ["Content-Type", "Authorization", "ngrok-skip-browser-warning"],
      },
      context: async ({ req }) => ({ headers: req.headers }),
    });

    console.log(`🚀 API GATEWAY siap di: ${url}`);
  } catch (error) {
    console.error("❌ Gagal menjalankan Gateway:", error.message);
  }
};

// 5. Jalankan fungsi
startGateway();