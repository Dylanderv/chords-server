import UserController from "controllers/userController";
import { UserInput } from "models/userInput";
import { user } from "controllers";
import { ApolloError } from "apollo-server-koa";

export const userQuery = {
  async users(_, args, ctx) {
    if (ctx.isAuthenticated() && ctx.state.user && ctx.state.user.role === 'ADMIN') {
      return await UserController.getUsers();
    } else {
      throw new ApolloError('Unauthorized', "403");
    }
  },
  async user(_, id: string, ctx) {
    if (ctx.isAuthenticated() && ctx.state.user && (ctx.state.user.role === 'ADMIN' || ctx.state.user.id === id)) {
      return await UserController.getUser(id);
    } else {
      throw new ApolloError('Unauthorized', "403");
    }
  }
}

export const userMutation = {
  async modifyUser(_, input: { id: string, userInput: UserInput }) {
    try {
      return await UserController.modifyUser(input.id, input.userInput);
    } catch (err) {
      throw err;
    }
  },
  async deleteUser(_, id: string) {
    try {
      return await UserController.deleteUser(id);
    } catch (err) {
      throw err;
    }
  },
  async createUser(_, input: {userInput: UserInput}) {
    try {
      return await UserController.createUser(input.userInput);
    } catch (err) {
      throw err;
    }
  }
}
