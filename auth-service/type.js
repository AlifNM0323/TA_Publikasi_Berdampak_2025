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
    users: [User]
  }

  type Mutation {
    register(
      username: String!
      password: String!
      role: String
    ): AuthPayload

    login(
      username: String!
      password: String!
    ): AuthPayload
  }
`;