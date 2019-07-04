import { Repository, getManager } from "typeorm";
import { User } from "models/user";
import { UserInput } from "models/userInput";

export default class UserController {
  public static async getUsers(): Promise<User[]> {
    const userRepository: Repository<User> = getManager().getRepository(User);
    return await userRepository.find();
  }

  public static async modifyUser(id: string, userInput: UserInput) {
    const userRepository: Repository<User> = getManager().getRepository(User);
    let user: User = await userRepository.findOne(id)
    user.username = userInput.username;
    user.email = userInput.email;
    console.log(id);
    console.log(userInput);
    console.log('------------------')
    return await userRepository.save(user);
  }
}
