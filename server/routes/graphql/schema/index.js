const { typeDef: userSchema, resolvers: userResolvers } = require('./user');
const { typeDef: itemSchema, resolvers: itemResolvers } = require('./item');
const { typeDef: vendorSchema, resolvers: vendorResolvers } = require('./vendor');
const { typeDef: transactionSchema, resolvers: transactionResolvers } = require('./transaction');

const { mergeSchemas } = require('graphql-tools');

module.exports = mergeSchemas({
  schemas: [userSchema, itemSchema, vendorSchema, transactionSchema],
  resolvers: [userResolvers, itemResolvers, vendorResolvers, transactionResolvers]
})