export const typeDefs = `#graphql
  # --- DEFINISI DATA ---
  
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
    family: Family
    healthData: Health
    trashTransactions: [TrashBank]
    trashBalance: Float
    # Relasi Baru: List Asuransi yang dimiliki warga
    insurances: [Insurance] 
  }

  type Health {
    id: ID!
    citizenId: ID!
    bloodType: String
    height: Float
    weight: Float
    chronicDisease: String
    disabilityStatus: Boolean
    lastCheckupDate: String
    citizen: Citizen
  }

  type Contribution {
    id: ID!
    familyId: ID!
    type: String!
    amount: Int!
    paymentDate: String
    notes: String
    family: Family
  }

  type TrashBank {
    id: ID!
    citizenId: ID!
    txnDate: String
    trashType: String!
    weightKg: Float!
    pricePerKg: Float!
    deposit: Int
    withdrawal: Int
    operator: String
    citizen: Citizen
  }

  # --- TIPE BARU: ASURANSI ---
  type Insurance {
    id: ID!
    citizenId: ID!
    insuranceType: String!
    insuranceNumber: String!
    activeStatus: Boolean
    # Relasi: Lihat pemilik asuransi
    citizen: Citizen
  }

  # --- QUERY ---
  type Query {
    # ... Queries lama biarkan sama ...
    families: [Family]
    citizens: [Citizen]
    getAllHealthRecords: [Health]
    getAllContributions: [Contribution]
    getAllTrashTransactions: [TrashBank]
    
    # Query Baru
    getInsurancesByCitizenId(citizenId: ID!): [Insurance]
  }

  # --- MUTATION ---
  type Mutation {
    # ... Mutation lama biarkan sama ...
    createFamily(kepalaKeluarga: String!, noKK: String!, address: String, ownershipStatus: String): Family
    addCitizen(familyId: ID!, name: String!, nik: String!, gender: String, religion: String, address: String, profession: String, placeOfBirth: String, dateOfBirth: String): Citizen
    updateCitizen(id: ID!, name: String, profession: String): Citizen
    deleteCitizen(id: ID!): String
    addHealthRecord(citizenId: ID!, bloodType: String, height: Float, weight: Float, chronicDisease: String, disabilityStatus: Boolean, lastCheckupDate: String): Health
    payContribution(familyId: ID!, type: String!, amount: Int!, notes: String): Contribution
    addTrashDeposit(citizenId: ID!, trashType: String!, weightKg: Float!, pricePerKg: Float!, operator: String): TrashBank

    # Insurance (BARU)
    addInsurance(
      citizenId: ID!
      insuranceType: String!
      insuranceNumber: String!
      activeStatus: Boolean
    ): Insurance
  }
`;