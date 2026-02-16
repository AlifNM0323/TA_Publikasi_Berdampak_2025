export const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    role: String!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    # Query untuk melihat daftar user (tanpa password)
    users: [User]
  }

  type Mutation {
    # Mutasi untuk mendaftarkan user baru
    register(
      username: String!
      password: String!
      role: String
    ): AuthPayload

    # Mutasi untuk login Pak Ahmad Waluyo & warga
    login(
      username: String!
      password: String!
    ): AuthPayload
  }
`;