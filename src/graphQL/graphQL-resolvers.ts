import { userQuery, userMutation } from "resolvers/userResolver";

// Provide resolver functions for your schema fields
export const resolvers = {
  Query: {
    ...userQuery
  },
  Mutation: {
    ...userMutation
  }
};