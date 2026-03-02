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

  type RegisterResponse {
    success: Boolean!
    message: String!
  }

  type Query {
    users: [User]
  }

  type Mutation {
    registerUser(username: String!, password: String!, role: String!): RegisterResponse
    login(username: String!, password: String!): AuthPayload
  }
`;