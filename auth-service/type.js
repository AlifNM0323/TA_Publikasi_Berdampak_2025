
export const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
    familyId: String
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type RegisterResponse {
    success: Boolean!
    message: String!
  }

  type Query {
    users: [User]
  }

  type Mutation {
    # Registrasi Warga: BE akan cek email ke database Citizen secara otomatis
    registerUser(username: String!, email: String!, password: String!): RegisterResponse
    
    # Login Fleksibel: 'identifier' bisa diisi Email (Warga) atau Username (Admin)
    login(identifier: String!, password: String!): AuthPayload
  }
`;