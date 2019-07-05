import UserController from "controllers/userController";
import { UserInput } from "models/userInput";
import { user } from "controllers";

export const userQuery = {
  async users() {
    return await UserController.getUsers();
  },
  async user(_, id: string) {
    return await UserController.getUser(id);
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
