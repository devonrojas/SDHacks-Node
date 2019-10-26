const { gql } = require("apollo-server-express");
const DB = require('../../../services').database;

const typeDef = gql`
  type Query {
    item(id: String!): Item!
    items(ids: [String]): [Item]
  }

  type Mutation {
    addItem(item: ItemInput!): Item
  }

  input ItemInput {
    description: String!
    category: String!
    price: Int!
  }

  type Item {
    id: String!
    description: String!
    category: String!
    price: Int!
  }
`;

class Item {
  constructor(id, description, category, price) {
    this.id = id;
    this.description = description;
    this.category = category;
    this.price = price;
  }
}

const resolvers = {
  Query: {
    item: (obj, { id }) => {
      return new Promise((resolve, reject) => {
        DB.Item.find({ id: id }, (err, docs) => {
          if (err) {
            console.error(err);
            throw new Error("No item found for id:" + id);
          } else {
            let item = docs[0];
            let i = new Item(item.id, item.description, item.category, item.price)
            resolve(i);
          }
        })
      })
    },
    items: (obj, { ids }) => {
      return new Promise((resolve, reject) => {
        if (ids) {
          DB.Item.find({ id: { $in: ids } }, (err, docs) => {
            if (err) {
              console.error(err);
              throw new Error("Could not find all items")
            } else {
              let items = docs.map(doc => new Item(doc.id, doc.description, doc.category, doc.price));
              resolve(items);
            }
          })
        } else {
          DB.Item.find({}, (err, docs) => {
            if (err) {
              console.error(err);
              throw new Error("Could not retrieve items")
            } else {
              let items = docs.map(doc => new Item(doc.id, doc.description, doc.category, doc.price));
              resolve(items);
            }
          })
        }
      })
    }
  },
  Mutation: {
    addItem: (obj, { item }) => {
      return new Promise((resolve, reject) => {
        DB.Item.create(item, (err, item) => {
          if (err) {
            console.error(err);
            throw new Error("Could not add item")
          } else {
            let i = new Item(item.id, item.description, item.category, item.price);
            resolve(i);
          }
        })
      })
    }
  }
}

module.exports = { typeDef, resolvers }