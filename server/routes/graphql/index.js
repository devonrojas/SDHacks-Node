const { ApolloServer } = require('apollo-server-express');
const schema = require('./schema');

const server = new ApolloServer({ schema: schema });

module.exports = server;