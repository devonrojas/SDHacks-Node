const { gql } = require("apollo-server-express");
const DB = require("../../../services").database;

const typeDef = gql`
  type Query {
    transaction(id: String!): Transaction
  }

  type Mutation {
    addTransaction(transaction: TransactionInput!): Transaction
  }

  type Transaction {
    id: String!
    studentID: String!
    itemID: String!
    vendorID: String!
    qty: Int!
    timestamp: String!
  }

  input TransactionInput {
    studentID: String!
    itemID: String!
    vendorID: String!
    qty: Int!
  }
`;

class Transaction {
  constructor(id, studentID, itemID, vendorID, qty, timestamp) {
    this.id = id;
    this.studentID = studentID;
    this.itemID = itemID;
    this.vendorID = vendorID;
    this.qty = qty;
    this.timestamp = timestamp;
  }
}

const resolvers = {
  Query: {
    transaction: (obj, { id }) => {
      return new Promise((resolve, reject) => {
        DB.Transaction.find({ id: id }, (err, docs) => {
          if (err) {
            console.error(err);
            throw new Error("No transaction found with id: " + id);
          } else {
            let trx = docs[0];
            let t = new Transaction(trx.id, trx.studentID, trx.itemID, trx.vendorID, trx.qty, trx.timestamp);
            resolve(t);
          }
        })
      })
    }
  },
  Mutation: {
    addTransaction: (obj, { transaction }) => {
      return new Promise((resolve, reject) => {
        DB.Transaction.create(transaction, (err, trx) => {
          if (err) {
            console.error(err);
            throw new Error("Could not add transaction");
          } else {
            let t = new Transaction(trx.id, trx.studentID, trx.itemID, trx.vendorID, trx.qty, trx.timestamp);
            resolve(t);
          }
        })
      })
    }
  }
}

module.exports = { typeDef, resolvers }