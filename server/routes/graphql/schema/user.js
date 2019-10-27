const { generateToken } = require('../../../helpers');
const DB = require('../../../services/').database;
const { gql } = require('apollo-server-express');
const rp = require('request-promise');

const typeDef = gql`
  type Query {
    user(id: String!): User!
    users(ids: [String]): [User]
    getUserCO2(categories: [CategoryInput]): CO2Data
    login(username: String!, password: String!): AuthUser
  }

  type Mutation {
    createUser(user: UserInput!): AuthUser
  }

  input CategoryInput {
    type: String!
    dollarsSpent: Float!
  }

  type User {
    id: String!
    displayName: String!
    email: String!
    username: String!
  }

  type CO2Data {
    totalDollarsSpent: Float!
    totalCO2Emissions: Float!
    breakdown: [CO2Category]
  }

  type CO2Category {
    type: String!
    dollarsSpent: Float!
    CO2Emissions: Float!
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
        DB.User.find({ id: id }, (err, docs) => {
          if (err) {
            console.error(err);
            throw new Error("No user found for id: " + id);
          } else {
            console.log("hello");
            resolve(docs[0])
          }
        })
      })
    },
    users: (obj, { ids }) => {
      return new Promise((resolve, reject) => {
        if (ids) {
          DB.User.find({ id: { $in: ids } }, (err, docs) => {
            if (err) {
              console.error(err);
              throw new Error("Could not find all users");
            } else {
              resolve(docs);
            }
          })
        } else {
          DB.User.find({}, (err, docs) => {
            if (err) {
              console.error(err);
              throw new Error("Could not find all users");
            } else {
              resolve(docs);
            }
          })
        }
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
    },
    getUserCO2: (obj, { categories }) => {
      let data = {
        categories: categories.map(category => {
          let c = {};
          c[category.type] = {
            dollarsSpent: category.dollarsSpent
          };
          return c;
        })
      };
      return rp("https://fathomless-cove-08684.herokuapp.com/api/calculateCO2", {
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        },
        body: data,
        json: true
      })
        .then(res => {
          let co2 = {
            totalCO2Emissions: res["totalCO2Emissions"],
            totalDollarsSpent: res["totalDollarsSpent"],
            breakdown: []
          }

          res.breakdown.forEach(item => {
            let key = Object.keys(item)[0];
            let data = item[key];
            co2["breakdown"].push({
              category: key,
              dollarsSpent: data["dollarsSpent"],
              CO2Emissions: data["CO2Emissions"]
            })
          })
          return co2;
        });
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
            resolve(new AuthUser(u, token));
          }
        })
      })
    }
  }
}

module.exports = { typeDef, resolvers };