import { gql } from "apollo-server-koa";
// Construct a schema, using GraphQL schema language

export const typeDefs = gql`

  # Types

  type User {
    id: ID!
    username: String!
    email: String
    hashedPassword: String!
    createdAt: String
    updatedAt: String
    role: String
  }

  input UserInput {
    username: String!
    email: String
    password: String!
  }

  # Query

  type Query {
    users: [User]
    user(id: ID!): User
  }

  # Mutation

  type Mutation {
    modifyUser(id: ID!, userInput: UserInput): User
    deleteUser(id: ID!): ID
    createUser(userInput: UserInput): User
  }

  

`;
