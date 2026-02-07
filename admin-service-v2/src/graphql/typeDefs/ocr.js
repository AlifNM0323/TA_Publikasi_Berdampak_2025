const { gql } = require('apollo-server');

const ocrTypeDefs = gql`
  type OCRResult {
    nik: String
    nama: String
    rawText: String
    status: Boolean
    message: String
  }

  extend type Mutation {
    scanKK(imageBase64: String!): OCRResult
  }
`;

module.exports = ocrTypeDefs;