const { generateToken } = require('../../../helpers');
const DB = require('../../../services/').database;
const { gql } = require('apollo-server-express');

const typeDef = gql`
type User {
  id: String!
  displayName: String!
  email: String!
  username: String!
}

type AuthUser {
  user: User
  token: String!
}

input UserInput {
  id: String!
  username: String!
  displayName: String!
  email: String!
  password: String!
}

type Query {
  user(id: String!): User!
  login(username: String!, password: String!): AuthUser
}

type Mutation {
  createUser(user: UserInput): AuthUser
}
`;

class User {
  constructor({ id, displayName, email, username }) {
    this.displayName = displayName;
    this.email = email;
    this.id = id;
    this.username = username;
  }
}

class AuthUser {
  constructor(user, token) {
    this.user = user;
    this.token = token;
  }
}

const resolvers = {
  Query: {
    user(obj, { id }) {
      return new Promise((resolve, reject) => {
        DB.User.find({ id: +id }, (err, docs) => {
          if (err) {
            console.error(err);
            throw new Error("No user found for id: " + id);
          } else {
            let user = docs[0]
            resolve(new User({ id: user.id, displayName: user.displayName, email: user.email, username: user.username }));
          }
        })
      })
    },
    login(obj, { username, password }) {
      return new Promise((resolve, reject) => {
        DB.User.find({ username: username }, (err, docs) => {
          if (err) {
            console.error(err);
            throw new Error("No user found for username: " + username);
          } else {
            let user = Object.assign(new DB.User(), docs[0]);
            console.log(user);
            let valid = user.checkPassword(password);
            if (!valid) {
              throw new Error("Invalid username or password");
            } else {
              let u = new User({ username: user.username, id: user.id, displayName: user.displayName, email: user.email });
              let token = generateToken(user.username);
              resolve(new AuthUser(u, token));
            }
          }
        })
      })
    }
  },
  Mutation: {
    createUser: (obj, { user }) => {
      return new Promise((resolve, reject) => {
        DB.User.create(user, (err, user) => {
          if (err) {
            console.error(err);
            throw new Error("Error creating user")
          } else {
            let u = new User({ username: user.username, id: user.id, displayName: user.displayName, email: user.email });
            let token = generateToken(user.username);
            resolve(new AuthUser({ u, token }));
          }
        })
      })
    }
  }
}

module.exports = { typeDef, resolvers };