const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const { typeDefs, resolvers } = require('./type'); // File di atas

// Koneksi Database
mongoose.connect('mongodb://127.0.0.1:27017/db_admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error(err));

// Setup Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

// Jalankan Server
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});