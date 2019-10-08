import { userQuery, userMutation } from "../resolvers/userResolver";
import { UserInputError } from "apollo-server-koa";
import { instrumentQuery, chordQuery } from "../resolvers/instrumentChordResolver";
import { partitionQuery, partitionMutation } from "../resolvers/partitionResolver";

// Provide resolver functions for your schema fields
export const resolvers = {
  Query: {
    ...userQuery,
    ...instrumentQuery,
    ...chordQuery,
    ...partitionQuery
  },
  Mutation: {
    ...userMutation,
    ...partitionMutation
  }
};