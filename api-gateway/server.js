import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloGateway, IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {
    if (context.headers) {
      Object.keys(context.headers).forEach((key) => {
        if (key !== 'host' && key !== 'content-length') {
          request.http.headers.set(key, context.headers[key]);
        }
      });
    }
  }
}

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: 'auth', url: 'http://localhost:4001/graphql' }, 
      { name: 'admin', url: 'http://localhost:4000/graphql' },
    ],
    pollIntervalInMs: 5000, 
  }),
  buildService({ url }) {
    return new AuthenticatedDataSource({ url });
  },
});

const server = new ApolloServer({ 
  gateway,
  includeStacktraceInErrorResponses: true, 
});

const startGateway = async () => {
  try {
    const { url } = await startStandaloneServer(server, {
      listen: { port: 4002 },
      context: async ({ req }) => ({ headers: req.headers }),
      cors: {
        // --- KUNCI: Mengizinkan akses dari mana saja ---
        origin: "*", 
        credentials: true,
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: [
          "Content-Type", 
          "Authorization", 
          "ngrok-skip-browser-warning",
          "apollo-require-preflight"
        ],
      },
    });

    console.log(`🚀 API GATEWAY SIAP DI: ${url}`);
  } catch (error) {
    console.error("❌ Gagal menjalankan Gateway:", error.message);
  }
};

startGateway();