import UserController from "controllers/userController";
import { UserInput } from "models/userInput";

export const userQuery = {
  async users() {
    return await UserController.getUsers();
  },
}

export const userMutation = {
  async modifyUser({ id: string, userInput: UserInput }) {
    let user = await UserController.modifyUser(id, userInput);
    console.log(userInput);
    console.log(user);
    return user;
  }
}