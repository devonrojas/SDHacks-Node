const { typeDef: userSchema, resolvers: userResolvers } = require('./user');
const { typeDef: itemSchema, resolvers: itemResolvers } = require('./item');
const { typeDef: vendorSchema, resolvers: vendorResolvers } = require('./vendor');

const { mergeSchemas } = require('graphql-tools');

module.exports = mergeSchemas({
  schemas: [userSchema, itemSchema, vendorSchema],
  resolvers: [userResolvers, itemResolvers, vendorResolvers]
})