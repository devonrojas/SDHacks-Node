const { gql } = require('apollo-server-express');
const DB = require('../../../services').database;

const typeDef = gql`
  type Query {
    vendor(id: String!): Vendor
  }

  type Mutation {
    addVendor(vendor: VendorInput!): Vendor
  }

  input VendorInput {
    name: String!
    category: String!
  }

  type Vendor {
    id: String!
    name: String!
    category: String!
  }
`;

class Vendor {
  constructor(id, name, category) {
    this.id = id;
    this.name = name;
    this.category = category;
  }
}

const resolvers = {
  Query: {
    vendor: (obj, { id }) => {
      return new Promise((resolve, reject) => {
        DB.Vendor.find({ id: id }, (err, docs) => {
          if (err) {
            console.error(err);
            throw new Error("No vendor found for id: " + id);
          } else {
            resolve(docs[0]);
          }
        })
      })
    }
  },
  Mutation: {
    addVendor: (obj, { vendor }) => {
      return new Promise((resolve, reject) => {
        DB.Vendor.create(vendor, (err, vendor) => {
          if (err) {
            console.error(err);
            throw new Error("Could not add vendor")
          } else {
            let v = new Vendor(vendor.id, vendor.name, vendor.category);
            resolve(v);
          }
        })
      })
    }
  }
}

module.exports = { typeDef, resolvers }