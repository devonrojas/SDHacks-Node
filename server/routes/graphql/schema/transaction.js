const { gql } = require("apollo-server-express");
const DB = require("../../../services").database;

const typeDef = gql`
  type Query {
    transaction(id: String!): Transaction!
    transactions(ids: [String]): [Transaction]
  }

  type Mutation {
    addTransaction(transaction: TransactionInput!): Transaction!
    addTransactions(transactions: [TransactionInput!]): [Transaction]
  }

  type Transaction {
    id: String!
    studentID: String!
    items: [ExtendedItem]
    vendorID: String!
    timestamp: String!
  }

  input TransactionInput {
    studentID: String!
    items: [ShortItemInput!]
    vendorID: String!
  }

  type ShortItem {
    id: String!
    qty: Int!
  }

  input ShortItemInput {
    id: String!,
    qty: Int!
  }

  type ExtendedItem {
    id: String!,
    description: String!
    category: String!
    price: Float!
    qty: Int
  }
`;

class Transaction {
  constructor(transaction, items) {
    this.transaction = transaction;
    this.items = items;
  }
}

class ShortItem {
  constructor(id, qty) {
    this.id = id;
    this.qty = qty;
  }
}

class ExtendedItem {
  constructor(id, description, category, price, qty) {
    this.id = id;
    this.description = description;
    this.category = category;
    this.price = price;
    this.qty = qty;
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
            resolve(docs[0]);
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
              resolve(docs);
            }
          })
        } else {
          DB.Transaction.find({}, (err, docs) => {
            if (err) {
              console.error(err);
              throw new Error("Could not find all transactions")
            } else {
              resolve(docs);
            }
          })
        }
      })
    }
  },
  Transaction: {
    items: (transaction) => {
      return new Promise((resolve, reject) => {
        DB.Item.find({ id: { $in: transaction.items.map(item => item.id) } }, (err, docs) => {
          if (err) {
            console.error(err);
            throw new Error("Unexpected error")
          } else {
            let items = transaction.items.map((item, index) => {
              return {
                id: item.id,
                qty: item.qty,
                description: docs[index].description,
                category: docs[index].category,
                price: docs[index].price
              }
            })
            resolve(items);
          }
        })
      })
    }
  },
  ExtendedItem: {
    qty: (item) => {
      return +item.qty;
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
            let items = trx.items.map(item => new ShortItem(item.id, item.qty));
            let t = new Transaction(trx.id, trx.studentID, items, trx.vendorID, trx.qty, trx.timestamp);
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
            let trxs = docs.map(doc => {
              let items = doc.items.map(item => new ShortItem(item.id, item.qty));
              return new Transaction(doc.id, doc.studentID, items, doc.vendorID, doc.qty, doc.timestamp)
            });
            resolve(trxs);
          }
        })
      })
    }
  }
}

module.exports = { typeDef, resolvers }