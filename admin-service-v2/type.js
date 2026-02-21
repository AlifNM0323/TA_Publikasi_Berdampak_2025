export const typeDefs = `#graphql
  # --- 1. DEFINISI DATA UTAMA ---
  type Family {
    id: ID!
    kepalaKeluarga: String!
    noKK: String!
    address: String
    ownershipStatus: String
    totalTabungan: Float  # Total Berat (Kg)
    balance: Float         # Total Uang (Rp)
    qrCode: String
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
    
    # --- TAMBAHAN FIELD BARU AGAR TEMBUS KE FE ---
    phone: String      
    insurance: String  
    
    family: Family
    healthData: Health
    healthHistory: [Health]
  }

  # --- 2. DEFINISI BANK SAMPAH ---
  type TrashBank {
    id: ID!
    familyId: ID!
    depositorName: String
    trashType: String
    weight: Float
    pricePerKg: Float
    debit: Float
    credit: Float
    balance: Float
    txnDate: String
    status: String
    family: Family
  }

  type SampahStats {
    totalBerat: Float
    totalKKAktif: Int
    totalUang: Float
  }

  # --- 3. DEFINISI KESEHATAN (TERMASUK IBU HAMIL) ---
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
    
    # --- FIELD BARU UNTUK FITUR IBU HAMIL ---
    isPregnant: Boolean
    hpl: String
    pregnancyNotes: String
    
    createdAt: String
  }

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

  type OCRResponse {
    nik: String
    nama: String
    rawText: String
    success: Boolean
    message: String
  }

  # --- 4. QUERY ---
  type Query {
    families: [Family]
    citizens: [Citizen]
    citizen(id: ID!): Citizen
    getFamilyById(id: ID!): Family
    
    getAllHealthRecords: [Health]
    getAllContributions: [Contribution]
    getHealthStats: [HealthStats]

    sampahStats: SampahStats
    allTrashLogs: [TrashBank]
    
    getFamilyByQR(qrCode: String!): Family
  }

  # --- 5. MUTATION ---
  type Mutation {
    # Bank Sampah
    addSetoranSampah(citizenId: ID!, berat: Float!, kategori: String!): TrashBank
    withdrawFund(familyId: ID!, amount: Float!): TrashBank
    deleteTrashLog(id: ID!): String

    # Keluarga
    createFamily(kepalaKeluarga: String!, noKK: String!, address: String, ownershipStatus: String): Family
    updateFamily(id: ID!, kepalaKeluarga: String, noKK: String, address: String, ownershipStatus: String): Family
    deleteFamily(id: ID!): String

    # Warga / Anggota Keluarga (Update argumen phone & insurance)
    addCitizen(
      familyId: ID!, 
      name: String!, 
      nik: String!, 
      gender: String!, 
      religion: String!, 
      address: String!, 
      profession: String!, 
      placeOfBirth: String!, 
      dateOfBirth: String!, 
      relationship: String,
      phone: String,
      insurance: String
    ): Citizen
    
    updateCitizen(
      id: ID!, 
      name: String, 
      nik: String, 
      gender: String, 
      religion: String, 
      profession: String, 
      placeOfBirth: String, 
      dateOfBirth: String, 
      relationship: String,
      phone: String,
      insurance: String
    ): Citizen

    deleteCitizen(id: ID!): String

    # Kesehatan (Update argumen Ibu Hamil)
    addHealthRecord(
      citizenId: ID!, 
      healthStatus: String, 
      bloodType: String, 
      height: Float, 
      weight: Float, 
      chronicDisease: String, 
      notes: String, 
      disabilityStatus: Boolean,
      isPregnant: Boolean,
      hpl: String,
      pregnancyNotes: String
    ): Health

    updateHealthRecord(id: ID!, healthStatus: String, bloodType: String, notes: String): Health
    deleteHealthRecord(id: ID!): String

    payContribution(familyId: ID!, type: String!, amount: Int!, notes: String): Contribution
    processOCR(imageBase64: String!): OCRResponse
    
    updateFamilyWaste(familyId: ID!, totalTabungan: Float!): Family
    deleteFamilyWaste(familyId: ID!): String
  }
`;