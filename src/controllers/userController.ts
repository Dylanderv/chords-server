import { Repository, getManager } from "typeorm";
import { User } from "../models/user";
import { UserInput } from "../models/userInput";
import { UserInputError, ApolloError } from "apollo-server-koa";
import * as bcrypt from 'bcrypt';
import { userInfo } from "os";
import { validate } from "class-validator";

export default class UserController {
  public static async getUsers(): Promise<User[]> {
    const userRepository: Repository<User> = getManager().getRepository(User);
    return await userRepository.find();
  }

  public static async getUser(id: string) {
    const userRepository: Repository<User> = getManager().getRepository(User);
    try {
      return await userRepository.findOneOrFail(id);
    } catch (err) {
      throw new ApolloError("User ID not found", "404");
    }
  }

  public static async modifyUser(id: string, userInput: UserInput) {
    const userRepository: Repository<User> = getManager().getRepository(User);
    let user: User;
    try {
      user = await UserController.getUser(id);
    } catch (err) {
      throw err;
    }
    let userToSave = Object.assign(user, userInput);
    return await userRepository.save(userToSave);
  }

  public static async deleteUser(id: string) {
    const userRepository: Repository<User> = getManager().getRepository(User);
    let user: User;
    try {
      user = await UserController.getUser(id);
    } catch (err) {
      throw err;
    }
    try {
      let res = await userRepository.delete(id);
    } catch (err) {
      console.log("Delete User Error")
      throw err;
    }
  }

  public static async createUser(userInput: UserInput) {
    const userRepository: Repository<User> = getManager().getRepository(User);
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(userInput.password, salt);
    let user: User = new User();
    user.username = userInput.username;
    user.email = userInput.email;
    user.hashedPassword = hash;
    user.role = 'USER';
    const error = await validate(user);
    if (error.length > 0) {
      throw new UserInputError('Validation failed', error);
    } else if (userInput.password.length === 0) {
      throw new UserInputError('Password cannot be empty');
    } else {
      return await userRepository.save(user);  
    }
  }
}
