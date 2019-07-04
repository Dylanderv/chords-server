import { gql } from "apollo-server-koa";
// Construct a schema, using GraphQL schema language
export const typeDefs = gql`

  # Types

  type User {
    id: ID!
    username: String!
    email: String!
    createdAt: String
    updatedAt: String
  }

  input UserInput {
    username: String!
    email: String!
  }

  # Query

  type Query {
    users: [User]
  }

  # Mutation

  type Mutation {
    modifyUser(id: ID!, userInput: UserInput): User
  }

  

`;
