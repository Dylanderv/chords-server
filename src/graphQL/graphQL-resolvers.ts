import { userQuery, userMutation } from "../resolvers/userResolver";
import { UserInputError } from "apollo-server-koa";

// Provide resolver functions for your schema fields
export const resolvers = {
  Query: {
    ...userQuery
  },
  Mutation: {
    ...userMutation
  }
};