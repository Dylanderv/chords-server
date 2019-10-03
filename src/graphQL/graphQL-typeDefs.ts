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

  type Instrument {
    id: ID!
    name: String!
    infos: String
    keys: [String]!
    suffixes: [String]!
    chords: [Chord]!
  }

  type Chord {
    id: ID!
    key: String!
    suffix: String!
    position: String!
    info: String
    instrument: Instrument!
  }

  # Query

  type Query {
    users: [User]
    user(id: ID!): User
    me: User
    instruments: [Instrument]
    instrument(id: ID!): Instrument
    chords(instrumentId: ID!): [Chord]
    chord(id: ID!): Chord
    chordFromName(instrumentId: ID!, key: String!, suffix: String!): Chord
  }

  # Mutation

  type Mutation {
    modifyUser(id: ID!, userInput: UserInput): User
    deleteUser(id: ID!): ID
    createUser(userInput: UserInput): User
  }

  

`;
