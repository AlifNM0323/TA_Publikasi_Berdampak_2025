// export const typeDefs = `#graphql
//   type User {
//     id: ID!
//     username: String!
//     role: String!
//     familyId: String
//     createdAt: String!
//   }

//   type AuthPayload {
//     token: String!
//     user: User!
//   }

//   type RegisterResponse {
//     success: Boolean!
//     message: String!
//   }

//   type Query {
//     users: [User]
//   }

//   type Mutation {
//     # Tambahkan familyId di parameter register
//     registerUser(username: String!, password: String!, role: String!, familyId: String): RegisterResponse
//     login(username: String!, password: String!): AuthPayload
//   }
// `;


// export const typeDefs = `#graphql
//   type User {
//     id: ID!
//     username: String!
//     email: String!
//     role: String!
//     familyId: String
//     createdAt: String!
//   }

//   type AuthPayload {
//     token: String!
//     user: User!
//   }

//   type RegisterResponse {
//     success: Boolean!
//     message: String!
//   }

//   type Query {
//     users: [User]
//   }

//   type Mutation {
//     # Cukup 3 data ini, sisanya Backend yang deteksi otomatis
//     registerUser(username: String!, email: String!, password: String!): RegisterResponse
    
//     # Login menggunakan 'identifier' agar bisa terima Email atau Username
//     login(identifier: String!, password: String!): AuthPayload
//   }
// `;


// export const typeDefs = `#graphql
//   type User {
//     id: ID!
//     username: String!
//     email: String!       # Field email untuk identitas warga
//     role: String!        # 'rt' atau 'warga'
//     familyId: String     # ID keluarga yang dideteksi otomatis
//     createdAt: String!
//   }

//   type AuthPayload {
//     token: String!
//     user: User!
//   }

//   type RegisterResponse {
//     success: Boolean!
//     message: String!
//   }

//   type Query {
//     users: [User]
//   }

//   type Mutation {
//     # 1. Registrasi Cerdas: Cukup kirim 3 data, Backend cari familyId & role
//     registerUser(username: String!, email: String!, password: String!): RegisterResponse
    
//     # 2. Login Fleksibel: 'identifier' bisa diisi Username (Admin) atau Email (Warga)
//     login(identifier: String!, password: String!): AuthPayload
//   }
// `;




// export const typeDefs = `#graphql
//   type User {
//     id: ID!
//     username: String!
//     email: String!
//     role: String!
//     familyId: String
//     createdAt: String!
//   }

//   type AuthPayload {
//     token: String!
//     user: User!
//   }

//   type RegisterResponse {
//     success: Boolean!
//     message: String!
//   }

//   type Query {
//     users: [User]
//   }

//   type Mutation {
//     # Registrasi Cerdas: Cukup kirim 3 data, BE cari sisanya
//     registerUser(username: String!, email: String!, password: String!): RegisterResponse
    
//     # Login Fleksibel: 'identifier' bisa Username atau Email
//     login(identifier: String!, password: String!): AuthPayload
//   }
// `;





// export const typeDefs = `#graphql
//   type User {
//     id: ID!
//     username: String!
//     email: String!
//     role: String!
//     familyId: ID # Menggunakan ID lebih tepat kawan
//     createdAt: String!
//   }

//   type AuthPayload {
//     token: String!
//     user: User!
//   }

//   type RegisterResponse {
//     success: Boolean!
//     message: String!
//   }

//   type Query {
//     users: [User]
//   }

//   type Mutation {
//     registerUser(username: String!, email: String!, password: String!): RegisterResponse
//     login(identifier: String!, password: String!): AuthPayload
//   }
// `;


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