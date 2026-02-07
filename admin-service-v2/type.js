export const typeDefs = `#graphql
  # --- 1. DEFINISI DATA UTAMA ---
  type Family {
    id: ID!
    kepalaKeluarga: String!
    noKK: String!
    address: String
    ownershipStatus: String
    members: [Citizen]
    payments: [Contribution]
  }

  type Citizen {
    id: ID!
    familyId: ID!
    name: String!
    nik: String!
    gender: String
    religion: String
    profession: String
    address: String
    placeOfBirth: String
    dateOfBirth: String
    relationship: String 
    family: Family
    healthData: Health
    healthHistory: [Health]
    insurances: [Insurance] 
  }

  # --- 2. DEFINISI DATA KESEHATAN & STATS ---
  type Health {
    id: ID!
    citizenId: ID!
    citizen: Citizen 
    healthStatus: String
    bloodType: String
    height: Float
    weight: Float
    chronicDisease: String
    notes: String
    disabilityStatus: Boolean
    createdAt: String
  }

  # Tipe data baru untuk grafik Pie Chart
  type HealthStats {
    status: String!
    count: Int!
  }

  type Contribution {
    id: ID!
    familyId: ID!
    type: String!
    amount: Int!
    paymentDate: String
    notes: String
  }

  type Insurance {
    id: ID!
    citizenId: ID!
    insuranceType: String!
    insuranceNumber: String!
    activeStatus: Boolean
  }

  type OCRResponse {
    nik: String
    nama: String
    rawText: String
    success: Boolean
    message: String
  }

  # --- 3. QUERY (PENGAMBILAN DATA) ---
  type Query {
    families: [Family]
    citizens: [Citizen]
    citizen(id: ID!): Citizen
    getFamilyById(id: ID!): Family
    getAllHealthRecords: [Health]
    getAllContributions: [Contribution]
    # Query baru untuk statistik grafik
    getHealthStats: [HealthStats]
  }

  # --- 4. MUTATION (PERUBAHAN DATA) ---
  type Mutation {
    createFamily(kepalaKeluarga: String!, noKK: String!, address: String, ownershipStatus: String): Family
    updateFamily(id: ID!, kepalaKeluarga: String, noKK: String, address: String, ownershipStatus: String): Family
    deleteFamily(id: ID!): String

    addCitizen(
      familyId: ID!, name: String!, nik: String!, gender: String!, 
      religion: String!, address: String!, profession: String!, 
      placeOfBirth: String!, dateOfBirth: String!, relationship: String
    ): Citizen
    updateCitizen(id: ID!, name: String, profession: String, relationship: String): Citizen
    deleteCitizen(id: ID!): String

    addHealthRecord(
      citizenId: ID!, 
      healthStatus: String, 
      bloodType: String, 
      height: Float, 
      weight: Float, 
      chronicDisease: String, 
      notes: String, 
      disabilityStatus: Boolean
    ): Health

    updateHealthRecord(
      id: ID!, 
      healthStatus: String, 
      bloodType: String, 
      notes: String
    ): Health

    deleteHealthRecord(id: ID!): String

    payContribution(familyId: ID!, type: String!, amount: Int!, notes: String): Contribution
    addInsurance(citizenId: ID!, insuranceType: String!, insuranceNumber: String!, activeStatus: Boolean): Insurance
    processOCR(imageBase64: String!): OCRResponse
  }
`;