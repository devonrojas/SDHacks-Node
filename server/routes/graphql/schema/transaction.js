const { gql } = require("apollo-server-express");
const DB = require("../../../services").database;

const typeDef = gql`
  type Query {
    transaction(id: String!): Transaction!
    transactions(ids: [String!]): [Transaction]
  }

  type Mutation {
    addTransaction(transaction: TransactionInput!): Transaction!
    addTransactions(transactions: [TransactionInput!]): [Transaction]
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
    },
    transactions: (obj, { ids }) => {
      return new Promise((resolve, reject) => {
        if (ids) {
          DB.Transaction.find({ id: { $in: ids } }, (err, docs) => {
            if (err) {
              console.error(err);
              throw new Error("Could not find all transactions")
            } else {
              let transactions = docs.map(doc => new Transaction(doc.id, doc.studentID, doc.itemID, doc.vendorID, doc.qty, doc.timestamp));
              resolve(transactions);
            }
          })
        } else {
          DB.Transaction.find({}, (err, docs) => {
            if (err) {
              console.error(err);
              throw new Error("Could not find all transactions")
            } else {
              let transactions = docs.map(doc => new Transaction(doc.id, doc.studentID, doc.itemID, doc.vendorID, doc.qty, doc.timestamp));
              resolve(transactions);
            }
          })
        }
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
    },
    addTransactions: (obj, { transactions }) => {
      return new Promise((resolve, reject) => {
        DB.Transaction.insertMany(transactions, (err, docs) => {
          if (err) {
            console.error(err);
            throw new Error("Error adding transactions to database")
          } else {
            let trxs = docs.map(doc => new Transaction(doc.id, doc.studentID, doc.itemID, doc.vendorID, doc.qty, doc.timestamp));
            resolve(trxs);
          }
        })
      })
    }
  }
}

module.exports = { typeDef, resolvers }