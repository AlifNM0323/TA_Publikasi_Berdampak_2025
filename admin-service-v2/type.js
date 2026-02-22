export const typeDefs = `#graphql
  type Family {
    id: ID!
    kepalaKeluarga: String!
    noKK: String!
    address: String
    ownershipStatus: String
    totalTabungan: Float  
    balance: Float        
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
    age: Int 
    relationship: String 
    phone: String      
    insurance: String  
    statusWarga: String
    tanggalMutasi: String
    keteranganMutasi: String
    family: Family
    healthData: Health
    healthHistory: [Health]
  }

  type TrashBank {
    id: ID!
    familyId: ID!
    citizenId: ID
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

  type Health {
    id: ID!
    citizenId: ID!
    citizen: Citizen 
    healthStatus: String
    bloodType: String
    height: Float
    weight: Float
    bloodPressure: String
    bloodSugar: Int
    chronicDisease: String
    notes: String
    disabilityStatus: Boolean
    isPregnant: Boolean
    hpl: String
    pregnancyNotes: String
    createdAt: String
  }

  type HealthStats {
    status: String!
    count: Int!
  }

  type Schedule {
    id: ID!
    title: String!
    date: String!
    location: String
    target: String
    description: String
  }

  type Contribution {
    id: ID!
    familyId: ID!
    family: Family
    type: String!
    amount: Int!
    month: String
    year: String
    paymentDate: String
    notes: String
  }

  type Expense {
    id: ID!
    title: String!
    category: String!
    amount: Int!
    date: String
    notes: String
  }

  type KasSummary {
    totalIn: Int
    totalOut: Int
    balance: Int
    paidPercentage: Float
  }

  type OCRResponse {
    nik: String
    nama: String
    rawText: String
    success: Boolean
    message: String
  }

  type Query {
    families: [Family]
    citizens: [Citizen]
    citizen(id: ID!): Citizen
    getFamilyById(id: ID!): Family
    getAllHealthRecords: [Health]
    getAllContributions: [Contribution]
    getContributionsByPeriod(month: String!, year: String!): [Contribution]
    getAllExpenses: [Expense]
    getKasSummary(month: String!, year: String!): KasSummary
    getHealthStats: [HealthStats]
    getSchedules: [Schedule]
    sampahStats: SampahStats
    allTrashLogs: [TrashBank]
    getFamilyByQR(qrCode: String!): Family
  }

  type Mutation {
    addTrashDeposit(citizenId: ID!, trashType: String!, weight: Float!, pricePerKg: Float!): TrashBank
    withdrawFund(familyId: ID!, amount: Float!): TrashBank
    deleteTrashLog(id: ID!): String
    createFamily(kepalaKeluarga: String!, noKK: String!, address: String, ownershipStatus: String): Family
    updateFamily(id: ID!, kepalaKeluarga: String, noKK: String, address: String, ownershipStatus: String): Family
    deleteFamily(id: ID!): String
    addCitizen(familyId: ID!, name: String!, nik: String!, gender: String!, religion: String!, address: String!, profession: String!, placeOfBirth: String!, dateOfBirth: String!, relationship: String, phone: String, insurance: String): Citizen
    updateCitizen(id: ID!, name: String, nik: String, gender: String, religion: String, profession: String, placeOfBirth: String, dateOfBirth: String, relationship: String, phone: String, insurance: String): Citizen
    deleteCitizen(id: ID!): String

    # --- MUTATION BARU UNTUK MUTASI ---
    mutateCitizen(id: ID!, statusWarga: String!, keteranganMutasi: String): Citizen

    addHealthRecord(citizenId: ID!, healthStatus: String, bloodType: String, height: Float, weight: Float, bloodPressure: String, bloodSugar: Int, chronicDisease: String, notes: String, disabilityStatus: Boolean, isPregnant: Boolean, hpl: String, pregnancyNotes: String): Health
    updateHealthRecord(id: ID!, healthStatus: String, bloodType: String, height: Float, weight: Float, bloodPressure: String, bloodSugar: Int, notes: String, isPregnant: Boolean, hpl: String, pregnancyNotes: String): Health
    deleteHealthRecord(id: ID!): String
    addSchedule(title: String!, date: String!, target: String, location: String, description: String): Schedule
    deleteSchedule(id: ID!): String
    payContribution(familyId: ID!, type: String!, amount: Int!, month: String!, year: String!, notes: String): Contribution
    addExpense(title: String!, category: String!, amount: Int!, notes: String): Expense
    deleteExpense(id: ID!): String
    processOCR(imageBase64: String!): OCRResponse
    updateFamilyWaste(familyId: ID!, totalTabungan: Float!): Family
    deleteFamilyWaste(familyId: ID!): String
  }
`;